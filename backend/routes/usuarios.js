const express = require("express");
const router = express.Router();
const {
  cadastrarUsuario,
  loginUsuario,
  listarBarbeiros,
  buscarPerfil,
  atualizarPerfil
} = require("../controllers/UsuarioController");

const autenticar = require("../middleware/autenticar");

// Rotas públicas
router.post("/cadastro", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/barbeiros", listarBarbeiros);

// Rotas protegidas (usuário precisa estar autenticado)
router.get("/perfil", autenticar, buscarPerfil);
router.put("/perfil", autenticar, atualizarPerfil);

module.exports = router;



