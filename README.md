<div align="center">

# 🚀 TaskFlow PRO

**Sistema Moderno de Gestão de Tarefas & Painel de Produtividade Pessoal**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falexandreasouza-crypto%2Ftaskflow&env=JWT_SECRET,DATABASE_URL)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite / Postgres](https://img.shields.io/badge/Database-SQLite%20%7C%20Postgres-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

Uma aplicação completa e moderna desenvolvida para organizar a rotina, acompanhar metas semanais e gerenciar atividades com alta performance, design escuro futurista (Glassmorphism), Kanban interativo e suporte completo a **Deploy Serverless na Vercel**.

[Deploy no Vercel](#-deploy-no-vercel) • [Variáveis de Ambiente](#-variáveis-de-ambiente) • [Funcionalidades](#-funcionalidades-principais) • [Como Executar Localmente](#-como-executar-o-projeto-localmente) • [Endpoints da API](#-documentação-da-api)

</div>

---

## ⚡ Deploy no Vercel

O projeto já está configurado com `vercel.json` e rotas Serverless para deploy instantâneo:

### Passo a Passo no Painel da Vercel:

1. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"** > **"Import Git Repository"**.
2. Selecione o repositório **`alexandreasouza-crypto/taskflow`**.
3. Em **Environment Variables**, adicione as seguintes variáveis:
   - `JWT_SECRET`: uma chave secreta segura (ex: `super_chave_secreta_taskflow_2026`).
   - `DATABASE_URL`: URL do seu banco de dados (PostgreSQL, Supabase, Neon, Turso ou SQLite).
4. Clique em **Deploy**.
5. Pronto! A Vercel construirá o frontend estático e as funções serverless da API automaticamente.

---

## 🔐 Variáveis de Ambiente

Configure as variáveis no seu painel da Vercel ou no arquivo `.env` local:

| Variável | Obrigatória? | Padrão Local | Descrição |
|---|:---:|---|---|
| `JWT_SECRET` | **Sim** | `supersecret_key...` | Chave criptográfica usada para assinar e verificar tokens JWT. |
| `DATABASE_URL` | **Sim** | `"file:./dev.db"` | String de conexão com o banco de dados (SQLite local ou PostgreSQL em produção). |
| `VITE_API_URL` | Não | `"/api"` | URL base das chamadas da API no frontend (na Vercel o padrão `/api` roteia para as funções serverless). |
| `PORT` | Não | `5000` | Porta para execução local do servidor Express. |

---

## 🌟 Funcionalidades Principais

### 🧭 1. Barra Lateral de Navegação (Sidebar com Ícones)
- **Início (`Home`)**: Visão geral inteligente com saudações em tempo real e gráficos de produtividade.
- **Minhas Tarefas (`ListTodo`)**: Alternância fluida entre o **Quadro Kanban** e o **Modo Lista Detalhada**.
- **Categorias & Tags (`Tag`)**: Gestão de marcadores e paletas de cores customizadas.
- **Configurações (`Settings`)**: Perfil do usuário e resumo da workspace.
- **Avatar & Perfil**: Painel do usuário e botão de logout seguro.

### 📊 2. Painel de Controle & Métricas Semanais
- **Saudação Dinâmica**: *"Bom dia"*, *"Boa tarde"* ou *"Boa noite"* baseado no horário local do usuário com exibição da data atual por extenso.
- **Card Grande de Desempenho (7 Dias)**: Total de tarefas completadas na semana acompanhado de um **mini-gráfico de barras diário** (*Dom a Sáb*), com destaque dinâmico para o dia de **Hoje**.
- **Contadores de Alerta**:
  - 🚨 **Atrasadas**: Detecção imediata de tarefas vencidas com alerta em vermelho pulsante.
  - ⚡ **Feitas Hoje**: Contador de celebração de metas diárias.
  - 📈 **Taxa de Produtividade**: Barra de progresso percentual geral.
  - 🎯 **Foco por Categorias**: Proporção visual das tarefas por área da vida (*Trabalho, Casa, Estudo*, etc.).

### ⏰ 3. Lista de Tarefas Próximas a Vencer
- Seção no painel inicial exibindo prazos ordenados por urgência com etiquetas dinâmicas:
  - 🚨 *Atrasada*
  - ⚡ *Vence Hoje*
  - ⏳ *Vence Amanhã*
  - 📅 *Em X dias*
- **Conclusão em 1 Clique**: Checkbox interativo para finalizar a tarefa diretamente no painel.

### 📋 4. Quadro Kanban Interativo (Drag & Drop) & Modo Lista
- **Movimentação Fluida**: Arraste tarefas entre as colunas **A Fazer (Pendente)**, **Em Andamento** e **Concluído**.
- **➕ Criação de Colunas Customizadas**: Adicione novas colunas sob demanda (ex: *Em Revisão*, *Aguardando Cliente*, *Bloqueado*).
- **Modo Lista**: Tabela com filtros combinados (busca textual, categorias, tags e prioridades).

### 🏷️ 5. Categorias & Tags Dinâmicas
- Crie categorias e tags com cores personalizadas da paleta.
- Contadores automáticos de tarefas vinculadas a cada marcador.

### ➕ 6. Botão Flutuante (FAB)
- Botão flutuante no canto inferior direito (`+`) com efeito glow para criação rápida de tarefas a qualquer momento.

---

## 🏗️ Arquitetura & Tecnologias

| Camada | Tecnologia | Descrição |
|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript | Interface reativa, rápida e totalmente tipada. |
| **Estilização** | Tailwind CSS + Lucide Icons | Design moderno em modo escuro com efeitos Glassmorphism. |
| **Backend** | Node.js + Express + TypeScript | API RESTful com rotas prontas para Serverless Function na Vercel. |
| **Autenticação** | JWT (JSON Web Token) + bcryptjs | Criptografia segura de senhas e proteção de rotas. |
| **ORM & Banco** | Prisma ORM + SQLite / PostgreSQL | Modelagem relacional rápida com suporte a múltiplos provedores. |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)

### 1. Clonar o Repositório
```bash
git clone https://github.com/alexandreasouza-crypto/taskflow.git
cd taskflow
```

---

### 2. Configurar e Executar o Backend
Em um terminal:
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```
> O servidor backend iniciará em: **`http://localhost:5000`**

---

### 3. Configurar e Executar o Frontend
Em outro terminal:
```bash
cd client
npm install
npm run dev
```
> A aplicação estará disponível em: **`http://localhost:3000`**

---

## 📁 Estrutura do Projeto

```
taskflow/
├── api/
│   └── index.ts                # Entrypoint Serverless Function para a Vercel
├── client/                     # Aplicação Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Sidebar, DashboardMetrics, KanbanBoard, UpcomingTasks, etc.
│   │   ├── context/            # AuthContext (Sessão e JWT)
│   │   ├── pages/              # DashboardPage, AuthPage
│   │   ├── services/           # api.ts (Cliente HTTP com VITE_API_URL)
│   │   ├── types/              # Definições de tipos TypeScript
│   │   └── App.tsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # API Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma       # Modelagem relacional
│   ├── src/
│   │   ├── app.ts              # Instância Express desacoplada
│   │   ├── controllers/        # auth, task, category, tag, dashboard
│   │   ├── middleware/         # authMiddleware (JWT protection)
│   │   ├── routes/             # Rotas RESTful
│   │   └── index.ts            # Entrypoint local (app.listen)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                # Documentação global de variáveis de ambiente
├── .gitignore
├── package.json                # Scripts globais (build, vercel-build, dev)
├── vercel.json                 # Configuração oficial da Vercel (rewrites e builds)
└── README.md
```

---

## 📡 Documentação da API

### Autenticação (`/api/auth`)
- `POST /api/auth/register` - Cria uma nova conta com categorias padrão
- `POST /api/auth/login` - Autentica o usuário e retorna o token JWT
- `GET /api/auth/me` - Retorna os dados do usuário autenticado

### Métricas do Painel (`/api/dashboard`)
- `GET /api/dashboard/stats` - Retorna contadores de produtividade, histórico dos últimos 7 dias e tarefas próximas a vencer

### Tarefas (`/api/tasks`)
- `GET /api/tasks` - Lista tarefas do usuário com suporte a filtros
- `POST /api/tasks` - Cria uma nova tarefa com prioridade, categoria e tags
- `PUT /api/tasks/:id` - Atualiza dados da tarefa
- `PATCH /api/tasks/:id/move` - Altera o status e ordem no Kanban
- `DELETE /api/tasks/:id` - Exclui uma tarefa

### Categorias & Tags (`/api/categories` & `/api/tags`)
- `GET /api/categories` & `GET /api/tags` - Lista marcadores do usuário
- `POST /api/categories` & `POST /api/tags` - Cria nova categoria ou tag com cor
- `DELETE /api/categories/:id` & `DELETE /api/tags/:id` - Exclui marcador

---

## 📄 Licença

Distribuído sob a licença MIT.

<div align="center">
Desenvolvido com foco em alta performance e experiência do usuário ✨
</div>
