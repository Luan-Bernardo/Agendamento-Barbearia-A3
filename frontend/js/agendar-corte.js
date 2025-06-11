document.addEventListener('DOMContentLoaded', () => {
  const barbeiroSelect = document.getElementById('barbeiro');
  const dataInput = document.getElementById('data');
  const horarioSelect = document.getElementById('horario');
  const servicoSelect = document.getElementById('servico');
  const form = document.getElementById('formAgendamento');

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Verifica se está logado como cliente
  if (!usuario || usuario.tipo !== 'cliente') {
    alert("Você precisa estar logado como cliente.");
    window.location.href = "login.html";
    return;
  }

  const clienteId = usuario.id;

  // Define a data mínima como hoje para evitar datas passadas
  dataInput.min = new Date().toISOString().split('T')[0];

  // Carrega barbeiros disponíveis
  fetch('http://localhost:5000/api/usuarios/barbeiros')
    .then(res => res.json())
    .then(barbeiros => {
      barbeiros.forEach(barbeiro => {
        const option = document.createElement('option');
        option.value = barbeiro._id;
        option.textContent = barbeiro.nome;
        barbeiroSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar barbeiros:', err);
      alert('Erro ao carregar barbeiros.');
    });

  // Atualiza horários disponíveis com base no barbeiro e na data
  function atualizarHorarios() {
    const barbeiroId = barbeiroSelect.value;
    const data = dataInput.value;

    horarioSelect.innerHTML = '<option value="">Escolha o horário</option>';

    if (!barbeiroId || !data) return;

    const url = `http://localhost:5000/api/agendamentos/horarios?barbeiroId=${barbeiroId}&data=${data}`;

    fetch(url)
      .then(res => res.json())
      .then(horarios => {
        if (!Array.isArray(horarios) || horarios.length === 0) {
          const option = document.createElement('option');
          option.textContent = 'Nenhum horário disponível';
          option.disabled = true;
          horarioSelect.appendChild(option);
          return;
        }

        horarios.forEach(h => {
          const option = document.createElement('option');
          option.value = h.hora || h;
          option.textContent = h.hora || h;
          horarioSelect.appendChild(option);
        });
      })
      .catch(err => {
        console.error('Erro ao carregar horários disponíveis:', err);
        alert('Erro ao carregar horários.');
      });
  }

  // Eventos para atualizar horários ao mudar barbeiro ou data
  barbeiroSelect.addEventListener('change', atualizarHorarios);
  dataInput.addEventListener('change', atualizarHorarios);

  // Submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const agendamento = {
      clienteId,
      barbeiroId: barbeiroSelect.value,
      data: dataInput.value,
      hora: horarioSelect.value,
      servico: servicoSelect.value
    };

    // Validações básicas de campos
    if (!agendamento.barbeiroId || !agendamento.data || !agendamento.hora || !agendamento.servico) {
      alert('Preencha todos os campos.');
      return;
    }

    // Valida se a data não é anterior a hoje
    const hoje = new Date().toISOString().split('T')[0];
    if (agendamento.data < hoje) {
      alert('Não é possível agendar para datas anteriores.');
      return;
    }

    if (!confirm("Confirmar agendamento com esses dados?")) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    fetch('http://localhost:5000/api/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendamento)
    })
      .then(res => res.json())
      .then(data => {
        if (data.agendamento) {
          alert('Agendamento realizado com sucesso!');
          form.reset();
          horarioSelect.innerHTML = '<option value="">Escolha o horário</option>';
        } else {
          alert(data.mensagem || 'Erro ao agendar.');
        }
      })
      .catch(err => {
        console.error('Erro ao enviar agendamento:', err);
        alert('Erro ao enviar agendamento.');
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
});