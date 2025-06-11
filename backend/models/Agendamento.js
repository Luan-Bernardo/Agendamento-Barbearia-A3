const mongoose = require('mongoose');

// Schema de agendamento de serviço entre cliente e barbeiro
const AgendamentoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  barbeiroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  data: {
    type: String, 
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  servico: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Agendamento', AgendamentoSchema);


