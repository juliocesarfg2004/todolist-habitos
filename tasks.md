# Tasks — Habit Tracker

## Fase 1 — Setup e Configuração

- [ ] **1.1** Inicializar projeto Next.js com App Router, TypeScript e Tailwind CSS
- [ ] **1.2** Configurar MongoDB (Mongoose) — conexão e models de `Habit` e `Log`
- [ ] **1.3** Configurar NextAuth.js com provider de email (ou Google) e adapter MongoDB
- [ ] **1.4** Criar layout base responsivo (mobile-first) com header, navbar inferior e container centralizado

## Fase 2 — Autenticação

- [ ] **2.1** Criar páginas de login e registro (NextAuth)
- [ ] **2.2** Proteger rotas do dashboard — redirecionar usuários não autenticados para /login
- [ ] **2.3** Exibir nome/email do usuário logado no header

## Fase 3 — Banco de Dados e API (Hábitos)

- [ ] **3.1** Criar API route `GET /api/habits` — listar hábitos do usuário logado
- [ ] **3.2** Criar API route `POST /api/habits` — criar novo hábito
- [ ] **3.3** Criar API route `PUT /api/habits/[id]` — editar nome/emoji do hábito
- [ ] **3.4** Criar API route `DELETE /api/habits/[id]` — excluir hábito

## Fase 4 — Banco de Dados e API (Logs)

- [ ] **4.1** Criar API route `POST /api/logs` — marcar/desmarcar hábito como concluído em uma data
- [ ] **4.2** Criar API route `GET /api/logs?habitId=X&date=YYYY-MM-DD` — buscar logs de um hábito em um período
- [ ] **4.3** Implementar lógica de cálculo de streak (dias consecutivos) no backend

## Fase 5 — Interface do Dashboard

- [ ] **5.1** Criar página `/dashboard` — listar todos os hábitos do usuário com nome, emoji e streak atual
- [ ] **5.2** Adicionar botão toggle "Concluir hoje" em cada card de hábito — chamar `POST /api/logs`
- [ ] **5.3** Exibir streak visualmente (ex.: "🔥 5 dias") ao lado de cada hábito
- [ ] **5.4** Adaptar layout para mobile-first — cards em coluna única no celular, grid 2 colunas no desktop

## Fase 6 — CRUD de Hábitos (Frontend)

- [ ] **6.1** Criar modal/página para criar novo hábito (formulário com nome e emoji)
- [ ] **6.2** Adicionar botão de editar em cada card — abre modal pré-preenchido
- [ ] **6.3** Adicionar botão de excluir com confirmação
- [ ] **6.4** Feedback visual (toast/loading) para todas as operações CRUD

## Fase 7 — Histórico

- [ ] **7.1** Criar página `/habits/[id]` — detalhes de um hábito específico
- [ ] **7.2** Exibir calendário simplificado ou timeline dos últimos 30 dias (verde = concluído, cinza = não concluído)
- [ ] **7.3** Mostrar streak máximo histórico do hábito

## Fase 8 — Polimento e Deploy

- [ ] **8.1** Adicionar empty state no dashboard quando não houver hábitos
- [ ] **8.2** Adicionar loading skeletons em todas as páginas
- [ ] **8.3** Testar fluxo completo em mobile (viewport 375px) e desktop
- [ ] **8.4** Fazer deploy na Vercel + MongoDB Atlas
