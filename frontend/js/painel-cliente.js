document.addEventListener('DOMContentLoaded', () => {
  // Verifica se há dados do usuário no localStorage
  const usuarioRaw = localStorage.getItem('usuario');
  if (!usuarioRaw) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
    return;
  }

  const usuario = JSON.parse(usuarioRaw);

  // Restringe o acesso apenas para clientes
  if (usuario.tipo !== 'cliente') {
    alert('Acesso permitido apenas para clientes.');
    window.location.href = 'login.html';
    return;
  }

  const clienteId = usuario._id || usuario.id || usuario.userId;
  const container = document.getElementById('containerAgendamentos');
  const mensagemBoasVindas = document.getElementById('mensagemBoasVindas');

  // Saudação personalizada
  mensagemBoasVindas.textContent = `Bem-vindo de volta, ${escapeHTML(usuario.nome)}!`;

  // Requisição dos agendamentos do cliente
  fetch(`http://localhost:5000/api/agendamentos?clienteId=${clienteId}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      return res.json();
    })
    .then(agendamentos => {
      container.innerHTML = '';

      if (!agendamentos || agendamentos.length === 0) {
        container.innerHTML = `<p>Você ainda não tem agendamentos.</p>`;
        return;
      }

      const agora = new Date();

      // Filtra apenas agendamentos futuros
      const agendamentosFuturos = agendamentos.filter(ag => {
        const dataHoraAgendamento = new Date(`${ag.data}T${ag.hora}`);
        return dataHoraAgendamento > agora;
      });

      if (agendamentosFuturos.length === 0) {
        container.innerHTML = `<p>Você não tem agendamentos futuros.</p>`;
        return;
      }

      // Ordena pelos mais próximos
      agendamentosFuturos.sort((a, b) => {
        const dataHoraA = new Date(`${a.data}T${a.hora}`);
        const dataHoraB = new Date(`${b.data}T${b.hora}`);
        return dataHoraA - dataHoraB;
      });

      // Mostra os dois primeiros agendamentos futuros
      const proximosDois = agendamentosFuturos.slice(0, 2);

      proximosDois.forEach(ag => {
        const div = document.createElement('div');
        div.classList.add('card-agendamento');

        div.innerHTML = `
          <p><strong>Data:</strong> ${formatarData(ag.data)}</p>
          <p><strong>Horário:</strong> ${escapeHTML(ag.hora)}</p>
          <p><strong>Serviço:</strong> ${escapeHTML(ag.servico)}</p>
          <p><strong>Barbeiro:</strong> ${escapeHTML(ag.barbeiroId?.nome || 'Não informado')}</p>
        `;

        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Erro ao buscar agendamentos:', err);
      container.innerHTML = `<p>Erro ao carregar agendamentos.</p>`;
    });
});

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[tag]));
}
