# 💈 Sistema de Agendamento para Barbearia

Este é um sistema completo de agendamento de cortes de cabelo e serviços de barbearia, desenvolvido como projeto final da disciplina de Usabilidade e Desenvolvimento Web e uma parceria com uma barbearia local.

Permite que clientes visualizem horários disponíveis e agendem atendimentos com barbeiros de forma prática e rápida. Barbeiros podem definir seus horários disponíveis e gerenciar agendamentos.

## ✨ Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Perfis distintos: cliente e barbeiro
- Barbeiro define horários disponíveis (com intervalos de 30 min)
- Cliente visualiza horários livres e realiza agendamentos
- Sistema evita agendamentos duplicados
- Consulta de agendamentos por cliente ou barbeiro
- Interface web conectada com o back-end via API REST

## 🛠️ Tecnologias Utilizadas

**Back-end:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Token) para autenticação

**Front-end:**
- HTML5, CSS3 e JavaScript (puro)

## 🚀 Como Rodar o Projeto Localmente

### ✅ Pré-requisitos

- Node.js instalado
- MongoDB local ou conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### ⚙️ Passos:

```bash
# 1. Clone o repositório
git clone https://github.com/Luan-Bernardo/A3-Agendamento-Barbearia.git
cd A3-Agendamento-Barbearia/backend
```

```bash
# 2. Instale as dependências
npm install
```

```env
# 3. Crie um arquivo .env com as seguintes variáveis
PORT=5000
MONGODB_URI=coloque_sua_string_do_mongodb_aqui
JWT_SECRET=sua_chave_secreta_segura
```

```bash
# 4. Inicie o servidor
npm start
```

A API estará disponível em: [http://localhost:5000](http://localhost:5000)

## 📬 Endpoints da API (Principais Rotas)

### 🔐 Autenticação

- `POST /api/auth/register` → Cadastro de usuário
- `POST /api/auth/login` → Login com retorno do token JWT

### 📅 Agendamentos

- `POST /api/agendamentos/` → Criar novo agendamento
- `GET /api/agendamentos/` → Listar agendamentos por cliente ou barbeiro
- `GET /api/agendamentos/horarios?barbeiroId=...&data=...` → Ver horários livres

### ⏱️ Horários Disponíveis

- `POST /api/horarios/definir` → Barbeiro define horários disponíveis
- `GET /api/horarios/disponiveis?barbeiroId=...&data=...` → Listar horários disponíveis

## 💡 Melhorias Futuras

- Interface responsiva com design mobile-first
- Cancelamento e reagendamento de horários
- Confirmação de agendamento via e-mail ou WhatsApp (com EmailJS, Nodemailer ou Twilio)
- Dashboard com gráficos de atendimentos e estatísticas
- Integração com agenda do Google ou calendário nativo do celular

## 👤 Autores

- Luan Bernardo Alves - **824134204**
- Artur Rosa Correia - **824135943**
- Gustavo Silveira Benicio - **824134160**
- Luiz Washington de Jesus Muraro - **824148694**
- Lucas Felipe Monteiro Suarez - **824138683**


## 📄 Licença

Este projeto está sob a licença MIT.  
Sinta-se à vontade para usar, estudar, contribuir e compartilhar! 🚀
