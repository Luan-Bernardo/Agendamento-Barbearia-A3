const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');

// Rota para criar um novo agendamento
router.post('/', AgendamentoController.criarAgendamento);

// Rota para buscar horários disponíveis
router.get('/horarios', AgendamentoController.listarHorariosDisponiveis);

// Listar agendamentos por barbeiro ou cliente
router.get('/', AgendamentoController.listarAgendamentos);

module.exports = router;
