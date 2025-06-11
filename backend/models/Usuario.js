const mongoose = require("mongoose");

// Schema de usuário para clientes e barbeiros
const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ["cliente", "barbeiro"],
    required: true
  }
}, {
  timestamps: true // Cria automaticamente createdAt e updatedAt
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
