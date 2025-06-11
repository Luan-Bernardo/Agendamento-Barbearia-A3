const mongoose = require('mongoose');

// Schema para armazenar horários disponíveis de cada barbeiro
const HorarioDisponivelSchema = new mongoose.Schema({
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
  disponivel: {
    type: Boolean,
    default: true
  }
});

// Evita duplicidade do mesmo horário para o mesmo barbeiro
HorarioDisponivelSchema.index({ barbeiroId: 1, data: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('HorarioDisponivel', HorarioDisponivelSchema);

