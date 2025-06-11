// Define a data mínima como a data atual
document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data").setAttribute("min", hoje);
});

// Função para salvar os horários disponíveis para o barbeiro
async function salvarHorarios() {
  const data = document.getElementById("data").value;
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;

  // Validação de campos
  if (!data || !inicio || !fim) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Verifica se o usuário logado é barbeiro
  if (!usuario || usuario.tipo !== "barbeiro") {
    alert("Apenas barbeiros podem definir horários.");
    return;
  }

  const barbeiroId = usuario.id || usuario._id;

  try {
    // Requisição para salvar os horários
    const resposta = await fetch("http://localhost:5000/api/horarios/definir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ barbeiroId, data, inicio, fim })
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Horários salvos com sucesso!");
      document.getElementById("data").value = "";
      document.getElementById("inicio").value = "";
      document.getElementById("fim").value = "";
    } else {
      alert("Erro ao salvar horários: " + (resultado.message || "Tente novamente."));
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Erro ao salvar horários.");
  }
}

// Torna a função global para funcionar com o atributo onclick
window.salvarHorarios = salvarHorarios;