# 💰 Aplicação de Controle de Custos

Aplicação full-stack para controle de custos com backend em Node.js + MongoDB e frontend em React.

## 📋 Funcionalidades

- **Autenticação**: Sistema completo de login e registro de usuários
- **Dashboard**: Visualização completa de gastos com estatísticas e gráficos
- **Categorias**: CRUD completo para gerenciar categorias de despesas
- **Despesas**: CRUD completo para cadastrar e gerenciar despesas
- **Perfil**: Edição de dados pessoais e configuração de renda mensal
- **Relacionamento**: Despesas vinculadas a categorias e usuários
- **Interface Moderna**: Design responsivo e intuitivo com animações
- **Estatísticas**: Visualização do total de despesas, saldo e percentual utilizado
- **Filtros**: Visualização por período (semana, mês, ano)

## 🛠️ Tecnologias

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (criptografia de senhas)
- CORS

### Frontend
- React
- React Router DOM
- Axios
- Context API (gerenciamento de estado)
- CSS3 (Design moderno com gradientes e animações)

## 📦 Instalação

### Pré-requisitos
- Node.js instalado
- MongoDB rodando (localmente ou URI de conexão)

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env` (ou use os valores padrão):
```
MONGODB_URI=mongodb://localhost:27017/controle-custos
PORT=5000
JWT_SECRET=seu-secret-key-aqui-mude-em-producao
```

**Importante**: Em produção, use uma chave JWT_SECRET forte e segura!

4. Inicie o servidor:
```bash
npm start
# ou para desenvolvimento com auto-reload:
npm run dev
```

O backend estará rodando em `http://localhost:5000`

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registra novo usuário
- `POST /api/auth/login` - Faz login
- `GET /api/auth/me` - Obtém perfil do usuário autenticado
- `PUT /api/auth/profile` - Atualiza perfil do usuário

### Categorias (Requer autenticação)

- `GET /api/categories` - Lista todas as categorias do usuário
- `GET /api/categories/:id` - Busca categoria por ID
- `POST /api/categories` - Cria nova categoria
- `PUT /api/categories/:id` - Atualiza categoria
- `DELETE /api/categories/:id` - Deleta categoria

### Despesas (Requer autenticação)

- `GET /api/expenses` - Lista todas as despesas do usuário (com categoria populada)
- `GET /api/expenses/:id` - Busca despesa por ID
- `POST /api/expenses` - Cria nova despesa
- `PUT /api/expenses/:id` - Atualiza despesa
- `DELETE /api/expenses/:id` - Deleta despesa

## 🗂️ Estrutura do Projeto

```
.
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── expenseRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseList.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── CategoryForm.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Expenses.js
│   │   │   └── Profile.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🎨 Features da Interface

- Design moderno com gradientes e animações suaves
- Cards animados com hover effects
- Seleção de cores para categorias
- Layout totalmente responsivo
- Dashboard com estatísticas em tempo real
- Visualização por período (semana, mês, ano)
- Barra de progresso de uso da renda
- Top categorias mais utilizadas
- Formulários intuitivos com validação
- Navegação fluida entre páginas

## 📝 Exemplo de Uso

1. **Registre-se** criando uma conta com email e senha
2. **Configure sua renda mensal** no perfil
3. **Crie categorias** (ex: Alimentação, Transporte, Lazer)
4. **Adicione despesas** vinculadas às categorias
5. **Visualize o dashboard** com estatísticas e gráficos
6. **Gerencie suas despesas** com edição e exclusão
7. **Acompanhe seu saldo** e percentual de uso da renda

## 🔧 Desenvolvimento

Para desenvolvimento, use `npm run dev` no backend para ter auto-reload e `npm start` no frontend que já possui hot-reload.

