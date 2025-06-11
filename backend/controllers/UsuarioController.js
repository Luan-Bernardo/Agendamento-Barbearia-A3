const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Cadastrar novo usuário
exports.cadastrarUsuario = async (req, res) => {
  const { nome, telefone, email, senha, tipo } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "E-mail já cadastrado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      telefone,
      email,
      senha: senhaCriptografada,
      tipo
    });

    await novoUsuario.save();

    res.status(201).json({ msg: "Usuário cadastrado com sucesso!", usuario: novoUsuario });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao cadastrar usuário.", error: error.message });
  }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "E-mail não encontrado." });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
      return res.status(400).json({ msg: "Senha incorreta." });
    }

    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      msg: "Login bem-sucedido",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (error) {
    res.status(500).json({ msg: "Erro no login.", error: error.message });
  }
};

// Listar os barbeiros
exports.listarBarbeiros = async (req, res) => {
  try {
    const barbeiros = await Usuario.find({ tipo: "barbeiro" }).select("nome _id");
    res.status(200).json(barbeiros);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar barbeiros.", error: error.message });
  }
};

// Buscar dados do perfil do usuário autenticado
exports.buscarPerfil = async (req, res) => {
  const { id } = req.user; 

  try {
    const usuario = await Usuario.findById(id).select("-senha");
    if (!usuario) return res.status(404).json({ msg: "Usuário não encontrado." });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar perfil.", error: error.message });
  }
};

// Atualizar telefone e senha
exports.atualizarPerfil = async (req, res) => {
  const { telefone, senhaAtual, novaSenha } = req.body;
  const userId = req.user.id;

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuário não encontrado." });
    }

    const senhaConfere = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaConfere) {
      return res.status(400).json({ msg: "Senha atual incorreta." });
    }

    usuario.telefone = telefone || usuario.telefone;

    if (novaSenha) {
      usuario.senha = await bcrypt.hash(novaSenha, 10);
    }

    await usuario.save();

    res.json({ msg: "Perfil atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao atualizar perfil.", error: error.message });
  }
};
