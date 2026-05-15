# Habit Tracker

> 🌐 **App em produção:** [https://app-opencode.vercel.app](https://app-opencode.vercel.app)

Aplicativo web para criar hábitos, marcar como concluídos diariamente e acompanhar streaks ao longo do tempo.

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS
- **Backend:** Next.js Route Handlers (API)
- **Banco:** MongoDB Atlas + Mongoose
- **Auth:** NextAuth.js com GitHub OAuth

## Funcionalidades

- Criar, editar e excluir hábitos (com emoji)
- Marcar hábito como concluído no dia
- Cálculo automático de streak (dias consecutivos)
- Calendário visual dos últimos 30 dias
- Login via GitHub

## Como rodar localmente

### 1. Clone e instale

```bash
git clone https://github.com/juliocesarfg2004/todolist-habitos.git
cd todolist-habitos
npm install
```

### 2. Configure as variáveis de ambiente

Copie o `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Descrição |
|---|---|
| `MONGODB_URI` | String de conexão do MongoDB Atlas |
| `NEXTAUTH_SECRET` | Chave aleatória (gere com `openssl rand -base64 32` ou `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `NEXTAUTH_URL` | `http://localhost:3000` (dev) |
| `GITHUB_ID` | Client ID do OAuth App no GitHub |
| `GITHUB_SECRET` | Client Secret do OAuth App no GitHub |

### 3. MongoDB Atlas

1. Crie uma conta gratuita em [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crie um cluster M0 (gratuito)
3. Em **Network Access**, libere `0.0.0.0/0`
4. Em **Database Access**, crie um usuário com senha
5. Clique em **Connect** → **Drivers** → copie a string de conexão
6. Cole no `MONGODB_URI` do `.env.local`

### 4. GitHub OAuth

1. Acesse `github.com/settings/developers` → **OAuth Apps** → **New OAuth App**
2. Preencha com **duas URLs** (uma para dev, outra para produção após o deploy):

   | Campo | Desenvolvimento | Produção |
   |---|---|---|
   | Homepage URL | `http://localhost:3000` | `https://seu-app.vercel.app` |
   | Callback URL | `http://localhost:3000/api/auth/callback/github` | `https://seu-app.vercel.app/api/auth/callback/github` |

3. Copie o **Client ID** e **Client Secret** para o `.env.local`

### 5. Rode

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura do projeto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route handler
│   │   ├── habits/               # CRUD hábitos (GET, POST, PUT, DELETE)
│   │   └── logs/                 # GET logs, POST toggle conclusão
│   ├── dashboard/                # Página principal
│   ├── habits/[id]/              # Detalhes do hábito
│   └── login/                    # Página de login
├── components/
│   ├── header.tsx                # Topo com email e sair
│   ├── habit-card.tsx            # Card + drawer lateral com calendário
│   └── create-habit-modal.tsx    # Modal de criação
├── lib/
│   ├── auth.ts                   # Configuração NextAuth
│   ├── mongoose.ts               # Conexão MongoDB
│   ├── streak.ts                 # Cálculo de streak
│   └── mongodb-adapter.ts        # Adapter NextAuth para MongoDB
└── models/
    ├── Habit.ts                  # Schema Mongoose
    └── Log.ts                    # Schema com índice unique habitId+date
```

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New Project** → importe `todolist-habitos`
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`
4. **Atenção:** ao adicionar secrets com o Vercel CLI, use `printf` em vez de `echo` para evitar quebra de linha no final do valor:
   ```bash
   printf "seu-client-id" | npx vercel env add GITHUB_ID production
   ```
5. Após o deploy, volte no **GitHub OAuth App** e atualize as URLs para produção
6. Deploy automático a cada push no `main`

## Troubleshooting

### Erro "redirect_uri não está associado a este aplicativo" no login GitHub

**Causa:** O Client ID no `.env.local` não corresponde ao OAuth App que tem a callback URL registrada, ou a URL tem uma quebra de linha (`%0A`) no final.

**Solução:**
1. Verifique qual OAuth App tem o Client ID que está no seu `.env.local`
2. Confirme se a **Authorization callback URL** está exata: `https://seu-app.vercel.app/api/auth/callback/github`
3. Se usou `echo` no Vercel CLI, remova a env var e recrie com `printf`

### Erro 404 ao acessar o app

**Causa:** Servidor antigo rodando em porta diferente, ou deploy incompleto.

**Solução:** Mate processos antigos com `taskkill /PID <PID> /F` e rode `npm run dev` novamente.
