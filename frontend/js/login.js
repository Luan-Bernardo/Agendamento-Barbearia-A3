document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  // Evento de envio do formulário de login
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    // Verifica se todos os campos foram preenchidos
    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (res.ok && data.usuario && data.token) {
        // Armazena dados do usuário e token no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token); 

        // Redireciona conforme o tipo de usuário
        if (data.usuario.tipo === "cliente") {
          window.location.href = "painel-cliente.html";
        } else if (data.usuario.tipo === "barbeiro") {
          window.location.href = "painel-barbeiro.html";
        } else {
          alert("Tipo de usuário desconhecido.");
        }
      } else {
        alert(data.msg || "E-mail ou senha inválidos.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na requisição.");
    }
  });
});



