const Agendamento = require('../models/Agendamento');
const HorarioDisponivel = require('../models/HorarioDisponivel');

const AgendamentoController = {
  // Criar novo agendamento
  async criarAgendamento(req, res) {
    try {
      const { clienteId, barbeiroId, data, hora, servico } = req.body;

      if (!clienteId || !barbeiroId || !data || !hora || !servico) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
      }

      // Verifica se o horário está disponível
      const horarioDisponivel = await HorarioDisponivel.findOne({
        barbeiroId,
        data,
        hora,
        disponivel: true
      });

      if (!horarioDisponivel) {
        return res.status(400).json({ mensagem: 'Horário indisponível.' });
      }

      // Cria o agendamento
      const novoAgendamento = await Agendamento.create({
        clienteId,
        barbeiroId,
        data,
        hora,
        servico
      });

      // Marca o horário como indisponível
      horarioDisponivel.disponivel = false;
      await horarioDisponivel.save();

      return res.status(201).json({ mensagem: 'Agendamento realizado com sucesso.', agendamento: novoAgendamento });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return res.status(500).json({ mensagem: 'Erro ao criar agendamento.' });
    }
  },

  // Listar horários disponíveis para um barbeiro e data
  async listarHorariosDisponiveis(req, res) {
    try {
      const { barbeiroId, data } = req.query;

      if (!barbeiroId || !data) {
        return res.status(400).json({ mensagem: 'Barbeiro e data são obrigatórios.' });
      }

      const horarios = await HorarioDisponivel.find({
        barbeiroId,
        data,
        disponivel: true
      }).sort({ hora: 1 });

      return res.status(200).json(horarios);
    } catch (error) {
      console.error('Erro ao listar horários:', error);
      return res.status(500).json({ mensagem: 'Erro ao listar horários.' });
    }
  },

  // Listar agendamentos por barbeiro, cliente ou data
  async listarAgendamentos(req, res) {
    try {
      const { barbeiroId, clienteId, data } = req.query;

      const filtro = {};
      if (barbeiroId) filtro.barbeiroId = barbeiroId;
      if (clienteId) filtro.clienteId = clienteId;
      if (data) filtro.data = data;

      const agendamentos = await Agendamento.find(filtro)
        .populate('clienteId', 'nome telefone')
        .populate('barbeiroId', 'nome'); 

      return res.status(200).json(agendamentos);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.' });
    }
  }
};

module.exports = AgendamentoController;
