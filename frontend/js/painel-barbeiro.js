document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o barbeiro está logado
  const usuarioRaw = localStorage.getItem('usuario');
  if (!usuarioRaw) {
    alert('Você precisa estar logado como barbeiro.');
    window.location.href = 'login.html';
    return;
  }

  const usuario = JSON.parse(usuarioRaw);

  // Restringe o acesso apenas para barbeiros
  if (usuario.tipo !== 'barbeiro') {
    alert('Acesso permitido apenas para barbeiros.');
    window.location.href = 'login.html';
    return;
  }

  const barbeiroId = usuario._id || usuario.id || usuario.userId;

  // Em caso de erro no ID, remove localStorage
  if (!barbeiroId) {
    alert('Erro: ID do barbeiro não encontrado. Faça login novamente.');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
    return;
  }

  const mensagemBoasVindas = document.getElementById('mensagemBoasVindas');
  const seletorData = document.getElementById('seletorData');
  const dataAtualSpan = document.getElementById('dataAtual');
  const tbody = document.getElementById('tbodyAgendamentos');

  // Define data atual como padrão
  const hoje = new Date().toISOString().split('T')[0];
  seletorData.value = hoje;
  dataAtualSpan.textContent = hoje;

  // Saudação personalizada
  mensagemBoasVindas.textContent = `Olá, ${usuario.nome}!`;

  // Função para carregar agendamentos da data selecionada
  window.carregarAgendamentos = () => {
    const dataSelecionada = seletorData.value;
    dataAtualSpan.textContent = dataSelecionada;
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="carregando">Carregando agendamentos...</td>
      </tr>
    `;

    const url = `http://localhost:5000/api/agendamentos?barbeiroId=${barbeiroId}&data=${dataSelecionada}`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(agendamentos => {
        tbody.innerHTML = '';

        if (!agendamentos || agendamentos.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="4">Nenhum agendamento para esta data.</td>
            </tr>
          `;
          return;
        }

        // Ordena os agendamentos por horário
        agendamentos.sort((a, b) => a.hora.localeCompare(b.hora));

        agendamentos.forEach(ag => {
          const nomeCliente = ag.clienteId?.nome || 'Cliente não encontrado';
          const telefone = ag.clienteId?.telefone || 'Telefone não disponível';
          const nomeCurto = nomeCliente.split(' ').slice(0, 2).join(' ');

          const linha = `
            <tr>
              <td>${nomeCurto}</td>
              <td>${telefone}</td>
              <td>${ag.hora}</td>
              <td>${ag.servico}</td>
            </tr>
          `;
          tbody.innerHTML += linha;
        });
      })
      .catch(err => {
        console.error('Erro ao carregar agendamentos:', err);
        tbody.innerHTML = `
          <tr>
            <td colspan="4">Erro ao carregar agendamentos: ${err.message}</td>
          </tr>
        `;
      });
  };

  // Atualiza agendamentos ao mudar a data
  seletorData.addEventListener('change', carregarAgendamentos);

  // Carrega os agendamentos na inicialização
  carregarAgendamentos();
});

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[tag]));
}
