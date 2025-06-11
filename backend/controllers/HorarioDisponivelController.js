const HorarioDisponivel = require('../models/HorarioDisponivel');

const HorarioDisponivelController = {
  // Criação de múltiplos horários disponíveis de 30 em 30 minutos
  async criarHorarios(req, res) {
    const { barbeiroId, data, inicio, fim } = req.body;

    try {
      const [hIni, mIni] = inicio.split(':').map(Number);
      const [hFim, mFim] = fim.split(':').map(Number);

      const start = new Date(`${data}T${inicio}`);
      const end = new Date(`${data}T${fim}`);

      const horarios = [];

      // Geração dos horários com intervalos de 30 minutos
      while (start < end) {
        const hora = start.toTimeString().slice(0, 5); // 'HH:MM'

        horarios.push({
          barbeiroId,
          data,
          hora,
          disponivel: true
        });

        start.setMinutes(start.getMinutes() + 30);
      }

      await HorarioDisponivel.insertMany(horarios);

      res.status(201).json({ message: 'Horários salvos com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao salvar horários.' });
    }
  },

  // Listagem dos horários disponíveis de um barbeiro em uma data específica
  async listarHorariosDisponiveis(req, res) {
    try {
      const { barbeiroId, data } = req.query;

      if (!barbeiroId || !data) {
        return res.status(400).json({ mensagem: 'Barbeiro e data são obrigatórios' });
      }

      const horarios = await HorarioDisponivel.find({
        barbeiroId,
        data,
        disponivel: true
      }).sort({ hora: 1 });

      res.status(200).json(horarios);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar horários' });
    }
  }
};

module.exports = HorarioDisponivelController;



