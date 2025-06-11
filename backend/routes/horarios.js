const express = require('express');
const router = express.Router();
const HorarioDisponivelController = require('../controllers/HorarioDisponivelController');

// Rota para o barbeiro definir seus horários disponíveis
router.post('/definir', HorarioDisponivelController.criarHorarios);

// Rota para listar os horários disponíveis de um barbeiro em uma data
router.get('/disponiveis', HorarioDisponivelController.listarHorariosDisponiveis);

module.exports = router;


