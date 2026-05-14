# PRD — Aplicativo de Acompanhamento de Hábitos

## 1. Visão Geral

Aplicativo web que permite aos usuários criar hábitos pessoais, marcá-los como concluídos diariamente e visualizar suas sequências de dias consecutivos (streaks). O objetivo é ajudar na formação de rotinas consistentes por meio de registro simples e feedback visual imediato.

## 2. Principais Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Gerenciar hábitos** | Criar, editar e excluir hábitos (cada hábito tem um nome e cor/ícone opcionais) |
| **Registro diário** | Marcar um hábito como "concluído" no dia atual; desmarcar se necessário |
| **Streaks** | Cálculo automático de dias consecutivos concluídos para cada hábito |
| **Visão geral** | Dashboard listando todos os hábitos com status de hoje e streak atual |
| **Histórico** | Visualização de registros passados (calendário ou timeline) |

## 3. Fluxo Básico do Usuário

1. Usuário acessa o app e vê o dashboard vazio
2. Usuário cria um hábito (ex.: "Beber 2L de água")
3. No dashboard, o hábito aparece com um botão "Concluir hoje"
4. Usuário clica no botão — o hábito é marcado como feito e o streak é atualizado
5. No dia seguinte, se o usuário não marcar, o streak é zerado
6. Usuário pode consultar o histórico para ver dias anteriores

## 4. Modelo de Dados (MongoDB)

### Coleção `habits`

```json
{
  "_id": "ObjectId",
  "name": "Beber 2L de água",
  "emoji": "💧",
  "createdAt": "2026-05-14T00:00:00Z",
  "userId": "ObjectId" // referência ao usuário
}
```

### Coleção `logs`

```json
{
  "_id": "ObjectId",
  "habitId": "ObjectId", // referência ao hábito
  "date": "2026-05-14",  // string no formato YYYY-MM-DD
  "completed": true
}
```

### Coleção `users` (gerenciada pelo NextAuth ou similar)

```json
{
  "_id": "ObjectId",
  "name": "João",
  "email": "joao@email.com"
}
```

## 5. Stack Técnica

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js (App Router) + React + Tailwind CSS |
| **Backend** | Next.js API Routes ou Server Actions |
| **Banco de dados** | MongoDB (Mongoose ou Prisma como ODM/ORM) |
| **Autenticação** | NextAuth.js (provedor email ou Google) |
| **Deploy** | Vercel (frontend + API) + MongoDB Atlas |

### Estrutura de diretórios sugerida

```
app/
├── api/
│   ├── habits/       # CRUD de hábitos
│   └── logs/         # Registros diários
├── dashboard/        # Página principal
├── habits/           # Gerenciamento de hábitos
├── layout.tsx
└── page.tsx
```
