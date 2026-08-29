<div align="center">

# 🚀 TaskFlow PRO

**Sistema Moderno de Gestão de Tarefas & Painel de Produtividade Pessoal**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

Uma aplicação completa e moderna desenvolvida para organizar a rotina, acompanhar metas semanais e gerenciar atividades com alta performance, design escuro futurista (Glassmorphism), Kanban interativo e banco de dados SQLite local.

[Funcionalidades](#-funcionalidades-principais) • [Arquitetura](#-arquitetura--tecnologias) • [Como Executar](#-como-executar-o-projeto) • [Estrutura](#-estrutura-do-projeto) • [Endpoints da API](#-documentação-da-api)

</div>

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
| **Backend** | Node.js + Express + TypeScript | API RESTful modular com validação de schemas Zod. |
| **Autenticação** | JWT (JSON Web Token) + bcryptjs | Criptografia segura de senhas e proteção de rotas. |
| **ORM & Banco** | Prisma ORM + SQLite | Banco de dados local autocontido e sem necessidade de setup de servidores externos. |

---

## 🚀 Como Executar o Projeto

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
├── client/                     # Aplicação Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Sidebar, DashboardMetrics, KanbanBoard, UpcomingTasks, etc.
│   │   ├── context/            # AuthContext (Sessão e JWT)
│   │   ├── pages/              # DashboardPage, AuthPage
│   │   ├── services/           # api.ts (Cliente HTTP tipado)
│   │   ├── types/              # Definições de tipos TypeScript
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # API Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma       # Modelagem relacional SQLite
│   ├── src/
│   │   ├── controllers/        # auth, task, category, tag, dashboard
│   │   ├── middleware/         # authMiddleware (JWT protection)
│   │   ├── routes/             # Rotas RESTful
│   │   └── index.ts            # Entrypoint do Express
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                # Root package com scripts combinados
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

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

<div align="center">
Desenvolvido com foco em alta performance e experiência do usuário ✨
</div>
