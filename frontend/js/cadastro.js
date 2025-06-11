document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");

  // Evento de envio do formulário de cadastro
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value.trim();

    // Verifica se todos os campos foram preenchidos
    if (!nome || !telefone || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    // Validação do formato do telefone 
    const telefoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      alert("Telefone inválido. Ex: (11) 91234-5678");
      return;
    }

    // Validação simples de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("E-mail inválido.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/usuarios/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          email,
          senha,
          tipo: "cliente"
        })
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(data.msg || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na requisição.");
    }
  });
});
