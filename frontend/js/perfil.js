// Função responsável por atualizar os dados do perfil do usuário
async function atualizarPerfil() {
  const telefone = document.getElementById("telefone").value;
  const senhaAtual = document.getElementById("senhaAtual").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  const token = localStorage.getItem("token"); 

  if (!token) {
    alert("Usuário não autenticado.");
    return;
  }

  // Validação do telefone (se preenchido)
  const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
  if (telefone && !telefoneRegex.test(telefone)) {
    alert("Número de telefone inválido.");
    return;
  }

  // Verifica se as senhas novas coincidem
  if (novaSenha !== confirmarSenha) {
    alert("As novas senhas não coincidem.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/usuarios/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        telefone,
        senhaAtual,
        novaSenha
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.msg || "Erro ao atualizar perfil.");
    } else {
      alert("Perfil atualizado com sucesso!");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar perfil.");
  }
}

