# Pomin SAC

Central interna do **Grupo Pomin** para registrar, priorizar e acompanhar **chamados de melhorias, correções e novas funcionalidades** dos sistemas do grupo (Pomin AI, Pomin Call, Pomin D, Pomin Start, Pomiro, Auditto, Solutta, Alerta Fiscal, etc).

> Construído sobre o mesmo padrão do `pominstart` — mesmo tema visual, mesmo shell, mesmo modelo de auth/RLS. Toda artefato no Supabase usa o prefixo **`pominsac_`** para coexistir no Supabase compartilhado entre projetos do grupo (vide `soul/arch.md`).

---

## 1. Visão geral

- **Stack**: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Supabase (Postgres + Auth + Edge Functions).
- **Tema**: dark-first, fonte `Oxanium`, paleta `hub-blue` (mesmo do Pomin Hub / pominstart).
- **Multi-projeto**: compartilha `auth.users` com os outros sistemas do grupo. Edição de usuário/senha aqui afeta o login em todos.
- **Porta dev/runtime**: `7449` (mantemos inventário de porta por projeto — vide `vite.config.ts` / `Dockerfile` / `nginx.conf` / `docker-compose.yml`).

---

## 2. Como rodar (dev)

1. Copie o env:
   ```bash
   cp .env.example .env
   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY
   ```
2. Instale deps:
   ```bash
   npm install
   ```
3. Rode:
   ```bash
   npm run dev
   ```
4. Abra `http://localhost:7449`.

> Login inicial: use um email que já esteja em `auth.users` do grupo, listado em `pominsac_users` como `role = 'admin'` (o seed da migration cuida disso para `robson@solutta.com`, `admin@admin.com` e `robson.pontes@auditto.com.br` quando já existirem em `auth.users`).

---

## 3. Estrutura

```
pominsac/
├── src/
│   ├── components/
│   │   ├── layout/          # AppLayout + AppSidebar (Pomin Hub style)
│   │   ├── ui/              # shadcn primitives (copy-paste, Pomin Hub theme)
│   │   ├── AdminRoute.tsx
│   │   ├── StaffRoute.tsx   # admin OU agent
│   │   ├── ProtectedRoute.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/AuthContext.tsx
│   ├── hooks/               # use-mobile, use-toast, useConfirm
│   ├── integrations/supabase/
│   ├── lib/
│   │   ├── pominsacStore.ts # toda comunicação com Supabase
│   │   ├── ticketHelpers.ts # classes Tailwind e formatadores
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tickets.tsx        # listagem + filtros
│   │   ├── NewTicket.tsx
│   │   ├── TicketDetail.tsx   # comments + events + propriedades
│   │   ├── Systems.tsx        # CRUD do catálogo (staff)
│   │   ├── Users.tsx          # CRUD de perfis (admin)
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 20260523120000_pominsac_init.sql
│   └── functions/
│       ├── pominsac-admin-create-user/index.ts
│       └── pominsac-admin-update-password/index.ts
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── tailwind.config.ts
└── vite.config.ts
```

---

## 4. Modelo de dados

Todas as tabelas/funções/triggers vivem em `public` com prefixo `pominsac_*`:

| Artefato                             | Propósito                                                          |
|--------------------------------------|--------------------------------------------------------------------|
| `pominsac_role` (enum)               | `admin`, `agent`, `requester`                                      |
| `pominsac_user_status` (enum)        | `active`, `blocked`                                                |
| `pominsac_system_status` (enum)      | `active`, `archived`                                               |
| `pominsac_ticket_type` (enum)        | `bug`, `feature`, `improvement`, `task`, `question`                |
| `pominsac_ticket_priority` (enum)    | `low`, `medium`, `high`, `urgent`                                  |
| `pominsac_ticket_status` (enum)      | `open`, `in_analysis`, `in_progress`, `waiting_user`, `resolved`, `closed`, `cancelled` |
| `pominsac_users`                     | Perfis locais; FK pra `auth.users(id)` (NUNCA mexemos lá direto)   |
| `pominsac_systems`                   | Catálogo dos sistemas do grupo (com seed para os principais)       |
| `pominsac_tickets`                   | Chamados — numeração humana via `pominsac_tickets_number_seq`      |
| `pominsac_ticket_comments`           | Conversas no ticket (`is_internal` esconde do solicitante)         |
| `pominsac_ticket_events`             | Audit log (criação, mudança de status/priority/assignee)           |

### Permissões (RLS)

- **Admin / Agent**: enxergam e gerenciam todos os tickets, comentários e eventos.
- **Requester**: só vê os próprios tickets, só vê comentários **não internos**, só pode atualizar enquanto o status é `open` ou `waiting_user`.
- `pominsac_systems`: leitura aberta a todo autenticado; mutação só admin.
- `pominsac_users`: admin gerencia; demais só veem o próprio perfil (agente vê todos para listar assignee).

### Helpers `SECURITY DEFINER`

- `pominsac_is_admin(uuid)`, `pominsac_is_agent_or_admin(uuid)`, `pominsac_get_user_id(uuid)`
- `pominsac_find_auth_user_by_email(text)` (service_role only)
- `pominsac_list_users_with_auth()` (RPC que junta `auth.users.last_sign_in_at`)
- `pominsac_list_tickets()` (RPC enriquecida — sistema, requester, assignee)
- `pominsac_dashboard_stats()` (RPC agregada)

### Triggers

- `pominsac_log_ticket_change` — registra `created`, `status_changed`, `priority_changed`, `assigned_changed` em `pominsac_ticket_events`, e carimba `resolved_at` / `closed_at`.
- `pominsac_on_auth_user_created` — quando um auth user novo entra (inclusive de outros projetos do grupo), cria automaticamente um perfil `requester` em `pominsac_users` (com `ON CONFLICT (email) DO NOTHING`).

### Como aplicar

A migration é idempotente (`IF NOT EXISTS`, `do $$ ... exception when duplicate_object`, `on conflict ... do nothing`).

Para o Supabase compartilhado entre projetos (vide `soul/arch.md §3.5`), **não use `supabase db push`**. Cole no SQL Editor do Dashboard e rode:

```
supabase/migrations/20260523120000_pominsac_init.sql
```

---

## 5. Edge Functions

| Função                                | Quem chama                          | O que faz                                                                                              |
|---------------------------------------|-------------------------------------|---------------------------------------------------------------------------------------------------------|
| `pominsac-admin-create-user`          | Frontend (`createUser` em store)    | Valida admin via JWT, procura `auth.users` por email (reaproveita se existe), upsert em `pominsac_users` |
| `pominsac-admin-update-password`      | Frontend (`updateUserPassword`)     | Troca senha via `admin.updateUserById` — atenção: afeta login em todos os sistemas do grupo            |
| `pominsac-external-sac`               | Apps com Supabase próprio (ex.: Pomind-Creator) | Ponte de chamados sem sessão local: `create_ticket`/`list_tickets`/`list_comments`/`add_comment`/`cancel_ticket` via token compartilhado + `service_role`, mesmo modelo do `pominsac-attachment-upload` |

Deploy:

```bash
supabase functions deploy pominsac-admin-create-user
supabase functions deploy pominsac-admin-update-password
supabase functions deploy pominsac-external-sac
```

Secrets necessárias por função: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (já são padrão Supabase). Não há secrets exclusivas de provider LLM neste projeto. `pominsac-external-sac` exige também `POMINSAC_EXTERNAL_TOKEN` (`supabase secrets set POMINSAC_EXTERNAL_TOKEN=<segredo-forte>`).

---

## 6. Como testar (passo a passo)

1. **Login** com um usuário admin (após o seed da migration).
2. Em **Sistemas**, verifique que o catálogo veio populado (Pomin AI, Pomin Call, etc). Crie/edite/arquive.
3. Em **Usuários**, crie um requester (use um email novo) e um agente.
4. Saia, entre como o requester. Vá em **Novo chamado**, abra um ticket e confirme que ele só vê o próprio.
5. Volte como admin, entre no ticket e:
   - Mude `status` → deve gerar evento no histórico e carimbar `resolved_at` se for `resolved`.
   - Mude `prioridade` → evento.
   - Atribua um agente → evento.
   - Adicione comentário público e um nota interna — confirme que o requester só vê o público quando logar como ele.
6. No **Dashboard**, conferir contadores e a lista de recentes.

---

## 7. CI/CD

Mesma espinha dos outros projetos do grupo.

### CI

`.github/workflows/ci.yml` — lint e build em push/PR para `main`.

Secrets opcionais no CI: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### CD (deploy EC2)

Após o CI em `main`, o job **Deploy EC2** roda `git pull` + `docker compose up --build -d`.

Deploy manual: **Actions → Deploy (manual) → Run workflow**

#### Configuração no GitHub

Defina em **Settings → Secrets and variables → Actions**.

| Nome | Escopo | Exemplo (pominsac) |
|---|---|---|
| `DEPLOY_PROJECT_NAME` | Repositório | `pominsac` |
| `DEPLOY_APP_PORT` | Repositório | `7449` |
| `DEPLOY_SSH_HOST` | Org ou repo | `35.174.181.218` |
| `DEPLOY_SSH_USER` | Org ou repo | `ubuntu` |
| `DEPLOY_BASE_DIR` | Org ou repo | `/srv/www` |
| `DEPLOY_SSH_PRIVATE_KEY` | Org (secret) | chave privada SSH |

#### Pré-requisitos no servidor

1. Clone em `/srv/www/pominsac` com `git pull` funcionando
2. `.env` com `VITE_SUPABASE_*` (não versionar)
3. Usuário SSH com acesso ao Docker

Build args: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Variáveis sensíveis (Service Role) só nas Edge Functions Secrets do Supabase.

```
docker compose up --build -d
```

---

## 8. Arquitetura

Para padrões de stack e convenções, veja o arquivo de governança do grupo:

```
<repo-base>/soul/arch.md         # padrões de stack/banco/edge functions
<repo-base>/soul/constitution.md # regras invioláveis de engenharia
<repo-base>/soul/design.md       # design system Pomin Hub (usado aqui)
```

---

## 9. Inventário de portas (Grupo Pomin — porção observável a partir deste projeto)

| Projeto      | Porta |
|--------------|-------|
| pominstart   | 7000  |
| **pominsac** | **7449** |

Quando adicionar um projeto novo no servidor compartilhado, escolha uma porta única e registre aqui (e no README do projeto).
