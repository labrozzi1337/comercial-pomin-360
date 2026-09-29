# Pomin Call

Painel de operação multicanal para WhatsApp via **Evolution API**, com autenticação **Supabase**, assistente **Ditto** (Gemini), tickets **Movidesk**, fluxos visuais estilo n8n, SLA, fila de atendimento, campanhas em massa e relatórios. Multi-empresa (carteiras).

---

## 🧱 Stack

Dois serviços rodando em portas separadas, orquestrados por um único `npm run dev`:

| Camada | Tecnologia | Porta dev |
|---|---|---|
| **Backend** (raiz) | Next.js 14 (API + `/auth/callback`) + TypeScript estrito | **7443** |
| **Frontend alternativo** (`web/`) | Vite + React 18 + React Router v6 + TanStack Query + TypeScript + Tailwind + shadcn | **7543** |
| **Auth + DB** | Supabase (Auth + Postgres + RLS) | — |
| **WhatsApp** | Evolution API (proxy server-side, key não vaza pro browser) | — |
| **IA** | Google Gemini (Ditto, triagem, fallback fora do expediente) | — |
| **Tickets** | Movidesk (multi-empresa por carteira) | — |
| **Validação** | Zod em fronteiras (forms + API bodies) | — |
| **Estado servidor** | TanStack Query (web/) · SWR (Next.js legado) | — |
| **Notificações** | sonner | — |
| **Deploy** | Docker Compose (nginx + Next standalone) | — |

O frontend Vite faz proxy de `/api/*` e `/auth/*` para o Next.js em dev. Em produção, nginx no container `pomincall-web` faz o mesmo via rede Docker.

---

## 🚀 Rodar local — um comando

```bash
git clone <repo> && cd pomincall

# 1) Instala raiz E web/ (postinstall encadeia)
npm install

# 2) Configura envs
cp .env.example .env             # backend (server-side, secrets)
cp web/.env.example web/.env     # frontend (VITE_*, públicas)

# 3) Aplica schema no Supabase (SQL Editor, na ordem — ver seção "Banco")
#    20260521170000_pomincall_init_users.sql
#    20260521170100_pomincall_legacy_schema.sql
#    20260521170200_pomincall_rls.sql
#    20260521170300_pomincall_drop_gemini_key.sql

# 4) Sobe os dois serviços em paralelo
npm run dev
```

Abre **http://localhost:7443** (Next.js). **Não há login default** — o primeiro admin entra via **SSO Microsoft** (ver "Primeiro ADMIN" abaixo). Configure `WEBHOOK_SECRET` e `ADMIN_EMAILS` no `.env` antes de subir.

> **Frontend `web/` (Vite) está congelado** — só o Login foi portado e a migração está em pausa (WIP do SSO). O frontend oficial é o **Next.js** (porta 7443). O `web/` fica fora do build/deploy padrão; para mexer nele use `npm run dev:web` (porta 7543).

---

## 📜 Scripts

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências da raiz **e** de `web/` (via `postinstall`) |
| `npm run dev` | Sobe backend Next.js (7443) **e** frontend Vite (7543) em paralelo via `concurrently` |
| `npm run dev:api` | Só backend Next.js (7443) |
| `npm run dev:web` | Só frontend Vite (7543) |
| `npm run build` | Build de produção dos dois |
| `npm run build:api` · `npm run build:web` | Build individual |
| `npm run start` | Start produção do backend (porta 7443) |
| `cd web && npm run preview` | Preview do build Vite |
| `npm run lint` | ESLint do backend |

---

## 🏗 Estrutura

```
pomincall/
├── web/                              # FRONTEND Vite SPA alternativo — porta 7543
│   ├── src/
│   │   ├── App.tsx                   # React Router + QueryClient + ThemeProvider
│   │   ├── main.tsx
│   │   ├── index.css                 # design tokens HSL
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx    # + AdminRoute
│   │   │   └── ThemeProvider.tsx
│   │   ├── integrations/supabase/client.ts   # VITE_SUPABASE_*
│   │   ├── lib/
│   │   │   ├── pomincallStore.ts     # login/logout/getCurrentUser/isAdmin
│   │   │   └── utils.ts              # cn()
│   │   └── pages/
│   │       ├── Login.tsx             # design pominai (gradiente violeta + glass card)
│   │       ├── Home.tsx              # placeholder com links pras telas a portar
│   │       └── NotFound.tsx
│   ├── public/logo-branco-pomin-call.png
│   ├── nginx.conf, Dockerfile, vite.config.ts, tailwind.config.ts
│   ├── tsconfig*.json, postcss.config.js
│   └── .env.example                  # VITE_SUPABASE_URL / KEY / API_PROXY_TARGET
│
├── src/                              # BACKEND + UI Next.js — porta 7443
│   ├── app/
│   │   ├── (app)/                    # Telas Next.js originais (ainda servem como UI principal)
│   │   │   ├── dashboard, messages, contacts, groups, instances
│   │   │   ├── tickets, queue, campaigns, reports
│   │   │   ├── flows, flows/[id]/canvas
│   │   │   ├── instances/[name]/config
│   │   │   ├── webhooks, logs, users, tags, settings
│   │   │   ├── movidesk                # CRUD empresas + setores
│   │   │   └── profile                 # self-service do usuário
│   │   ├── (auth)/login              # Design pominai (gradiente violeta + glass card)
│   │   ├── auth/callback/route.ts    # OAuth Azure callback
│   │   └── api/                      # REST endpoints (proxyados pelo Vite em dev)
│   │       ├── cron/tick             # Sweep SLA + broadcast
│   │       ├── campaigns, queue, canned-responses
│   │       ├── reports/{tickets,agents}
│   │       ├── flows, flows/[id]/trigger, flows/webhook/[slug]
│   │       ├── instances/[name]/config
│   │       ├── movidesk/{companies,sectors}
│   │       ├── evolution/proxy       # proxy admin (key não vaza)
│   │       ├── profile               # GET/PATCH do próprio perfil
│   │       ├── users, users/[id]/(instances|revoke)
│   │       └── ... (auth, chats, contacts, instances, logs, ...)
│   ├── components/
│   │   ├── ui/                       # shadcn
│   │   ├── movidesk/, canned-responses, manual-flow-trigger
│   │   ├── carteira-picker, movidesk-widget, chat-controls
│   │   └── sidebar, topbar, ditto-bubble, ditto-chat
│   ├── lib/
│   │   ├── sla-engine, broadcast-engine, queue-engine
│   │   ├── business-hours, flow-engine, flow-schemas
│   │   ├── csv, evolution, gemini, persona, ticket-engine
│   │   ├── api-helpers.ts            # requireSession/requireAdmin
│   │   └── supabase/{client,server,service,types,server-helpers,session-context}
│   └── middleware.ts
│
├── supabase/
│   └── migrations/
│       ├── 20260521170000_pomincall_init_users.sql      # pomincall_users + RLS + trigger
│       ├── 20260521170100_pomincall_legacy_schema.sql   # todas as tabelas _pomincall_* + view
│       ├── 20260521170200_pomincall_rls.sql             # RLS nas tabelas _pomincall_*
│       ├── 20260521170300_pomincall_drop_gemini_key.sql # remove geminiApiKey do DB
│       └── 20260521170400_pomincall_profile_sync.sql    # espelha pomincall_users -> _pomincall_Profile
│
├── docker-compose.yml                # pomincall-api (7443) + pomincall-web (7543)
├── Dockerfile                        # Next.js standalone
├── web/Dockerfile                    # Vite build → nginx serve
└── package.json                      # concurrently + postinstall pra web/
```

---

## ⚙️ Pré-requisitos

- **Node.js 20+** / **npm 10+**
- Projeto **Supabase** (URL + chaves) com as 4 migrations aplicadas (na ordem)
- **Evolution API** acessível
- **Gemini API key** (recomendado, p/ IA + triagem)
- **Movidesk** tokens por empresa (multi-tenant) — opcional
- **Cron externo** apontando p/ `/api/cron/tick` (60s) — opcional em dev

---

## 🔐 Variáveis de ambiente

### Backend (`.env` na raiz)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role (server-side, **nunca** no client) |
| `EVOLUTION_API_URL` | ✅ | Base URL da Evolution |
| `EVOLUTION_API_KEY` | ✅ | API key global da Evolution (server-side) |
| `WEBHOOK_SECRET` | ✅ | Trava o webhook público `/api/webhook`. Sem ele o endpoint recusa tudo (503). Gere com `openssl rand -hex 32` |
| `GEMINI_API_KEY` | ⚠️ | Habilita IA / triagem / out-of-office. **Zero Trust: só env, nunca no banco** |
| `CRON_SECRET` | ✅ | Header `X-Cron-Secret` p/ `/api/cron/tick` |
| `NEXTAUTH_SECRET` | ✅ | Sessões Supabase SSR |
| `MOVIDESK_API_KEY` / `MOVIDESK_BASE_URL` | opcional | Fallback global Movidesk |
| `ALLOWED_EMAIL_DOMAINS` | opcional | Restringe domínios autorizados no SSO |
| `ADMIN_EMAILS` | opcional | Lista de e-mails ADMIN bootstrap (promove via callback) |
| `POMINAI_FUNCTIONS_URL` / `POMINAI_KEY` | ⚠️ | Edge Functions PominAI (listar agentes / chat server-side) |
| `NEXT_PUBLIC_POMINAI_SUPABASE_URL` / `NEXT_PUBLIC_POMINAI_ANON_KEY` | ⚠️ | Client Supabase PominAI (build args + `.env`) |

### Frontend (`web/.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Mesma URL do backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Mesma anon key |
| `VITE_API_PROXY_TARGET` | opcional | Alvo do proxy dev (default `http://localhost:7443`) |

> ⚠️ Nunca comite `.env` / `.env.local`. Tudo que começa com `VITE_` vai pro bundle do browser — é **público**.

---

## 🗄 Banco (Supabase)

### Convenção (alinhada ao `soul/arch.md`)

Mesmo banco compartilhado entre projetos (`pominai`, `pomincall`, etc.). **Prefixo por projeto** evita colisão:

- Tabela de perfil: `pomincall_users` (snake_case, `id` UUID próprio + `auth_id` FK pra `auth.users`)
- Enums: `pomincall_role` (`admin`/`user`), `pomincall_status` (`active`/`blocked`), `pomincall_sector` (`financeiro`/`contabil`/`suporte`/`outro`)
- Helpers SECURITY DEFINER: `pomincall_is_admin(uuid)`, `pomincall_get_user_id(uuid)`, `pomincall_find_auth_user_by_email(text)`
- Trigger `pomincall_on_auth_user_created` em `AFTER INSERT ON auth.users` → cria perfil automaticamente lendo `raw_user_meta_data` (`name`/`role`/`sector`)

Outras tabelas legadas seguem o padrão antigo (`_pomincall_*` PascalCase com colunas camelCase) — funcional, será migrado incrementalmente.

```
pomincall_users               # perfil (novo padrão)
_pomincall_Settings           _pomincall_Instance         _pomincall_UserInstance
_pomincall_Contact            _pomincall_ContactTag       _pomincall_Tag
_pomincall_Ticket             _pomincall_Flow
_pomincall_Log
_pomincall_CannedResponse
_pomincall_Campaign           _pomincall_CampaignRecipient
_pomincall_QueueEntry
_pomincall_MovideskCompany    _pomincall_MovideskSector   _pomincall_MovideskCompanyPublic (view)
```

Colunas extras notáveis:
- `_pomincall_Settings`: `slaFirstResponseMinutes`, `slaResolutionMinutes`, `businessHoursEnabled/Timezone/Schedule`, `outOfOfficePrompt`, `queueDistributionMode`.
- `_pomincall_Ticket`: `assignedToId` (= `auth.users.id`), `firstResponseAt`, `resolvedAt`, `closedAt`, `slaFirstResponseDueAt`, `slaResolutionDueAt`, `slaFirstResponseBreached`, `slaResolutionBreached`, `movideskCompanyId/SectorId/TicketId`.
- `_pomincall_Contact`: `movideskCompanyId` (carteira).
- `_pomincall_Flow`: `nodes` (jsonb), `edges` (jsonb), `viewport` (jsonb), `version`.

### Aplicar o schema

No **SQL Editor do Supabase**, rode **na ordem**:

1. [`20260521170000_pomincall_init_users.sql`](supabase/migrations/20260521170000_pomincall_init_users.sql) — enums, `pomincall_users`, RLS, helpers, trigger
2. [`20260521170100_pomincall_legacy_schema.sql`](supabase/migrations/20260521170100_pomincall_legacy_schema.sql) — todas as tabelas `_pomincall_*`, enums legados, índices, FKs e a view `_pomincall_MovideskCompanyPublic`
3. [`20260521170200_pomincall_rls.sql`](supabase/migrations/20260521170200_pomincall_rls.sql) — liga RLS + policy admin nas tabelas `_pomincall_*`
4. [`20260521170300_pomincall_drop_gemini_key.sql`](supabase/migrations/20260521170300_pomincall_drop_gemini_key.sql) — remove a coluna `geminiApiKey` (Zero Trust)
5. [`20260521170400_pomincall_profile_sync.sql`](supabase/migrations/20260521170400_pomincall_profile_sync.sql) — espelha `pomincall_users` em `_pomincall_Profile` (evita erro de FK ao atribuir tickets/fila a usuários novos)

Todas são idempotentes (`IF NOT EXISTS` / `OR REPLACE`), então reaplicar é seguro.

> ⚠️ **Não use `supabase db push`** em banco compartilhado multi-projeto — o CLI tenta sincronizar todas as migrations dos outros projetos e quebra. Aplicação manual via Dashboard.

### Primeiro ADMIN (sem senha no repo)

Não há mais seed de credencial fixa. O primeiro admin nasce via **SSO Microsoft**:

1. Coloque o seu e-mail em `ADMIN_EMAILS` no `.env` (ex.: `ADMIN_EMAILS="voce@suaempresa.com.br"`).
2. Garanta que o domínio está em `ALLOWED_EMAIL_DOMAINS` (ou no default).
3. Faça login em `/login` com **Entrar com Microsoft**.

No callback ([src/app/auth/callback/route.ts](src/app/auth/callback/route.ts)), a trigger cria o perfil e, como o e-mail está em `ADMIN_EMAILS`, ele é promovido a `role=admin` automaticamente. Demais usuários entram como `user` e são promovidos por um admin pela tela de usuários.

---

## 🐳 Deploy Docker

[`docker-compose.yml`](docker-compose.yml) orquestra os dois containers:

| Container | Imagem | Porta | Função |
|---|---|---|---|
| `pomincall-api` | Build do `Dockerfile` raiz (Next.js standalone) | 7443 | API + UI principal + auth callback |
| `pomincall-web` | Build de `web/Dockerfile` (nginx + dist Vite) | 7543 | SPA alternativo + proxy `/api` `/auth` → `pomincall-api:7443` |

```bash
docker compose up -d --build
```

Em produção, todas as envs vêm de secrets — nunca commitadas. O `nginx.conf` do `web/` faz cache agressivo de assets com hash e SPA fallback (`try_files $uri /index.html`).

### Cron externo (recomendado em produção)

```cron
*/1 * * * * curl -s -X POST -H "X-Cron-Secret: $CRON_SECRET" https://SEU_HOST/api/cron/tick
```

Em Supabase: pode usar `pg_cron` + `pg_net.http_post`. Em container ao lado: `ofelia`. Sem cron, SLA breach e broadcast agendado não disparam automaticamente (UI calcula SLA visualmente; broadcast pode ser disparado manualmente em `/campaigns`).

---

## 🔌 SSO Microsoft (Azure AD)

1. **Azure Portal → App Registration** → Redirect URI: `https://SEU_SUPABASE.supabase.co/auth/v1/callback`
2. **Permissões delegadas**: `openid`, `profile`, `email`
3. **Supabase Dashboard → Authentication → Providers → Azure** → cola Client ID + Client Secret + Tenant ID.
4. **Authentication → URL Configuration → Redirect URLs**, adicione:
   - `http://localhost:7443/**` (dev)
   - `https://SEU_DOMINIO/**` (prod)

Botão "Entrar com Microsoft" já está no `/login`. Após o callback, [src/app/auth/callback/route.ts](src/app/auth/callback/route.ts):
- Valida domínio do email (`ALLOWED_EMAIL_DOMAINS` ou default `solutta.com.br,auditto.com.br,grupopomin.com.br,alertafiscal.com.br`)
- Se domínio bloqueado: signOut + delete do auth user + delete do perfil + redirect com erro
- Se email está em `ADMIN_EMAILS`: promove a `role=admin` e `status=active` no `pomincall_users`

---

## ✨ Features

### Comunicação
- **Mensagens unificadas** por instância WhatsApp (`/messages`).
- **Toolbar do chat** compacta: IA auto · Respostas rápidas · Disparo manual de fluxo · Carteira (empresa Movidesk) · Info do cliente.
- **Respostas rápidas (canned)**: CRUD de templates pessoais ou compartilhados por instância.
- **Disparo manual de fluxo**: executa qualquer fluxo cadastrado contra o cliente atual.
- **Hidratação de nomes**: chats sem `pushName` (criados via API/n8n) recebem nome real do contato salvo no DB.

### Campanhas (`/campaigns`)
- Disparo em massa com agendamento.
- Segmentação por etiquetas, lista manual (JIDs) ou broadcast global da instância.
- Status: SCHEDULED → RUNNING → COMPLETED/FAILED/CANCELLED.
- Disparo manual de batch (sem cron) ou automático via cron tick.

### Tickets (`/tickets`)
- Triagem automática via IA (Gemini) — abre ticket quando `isTicket=true`.
- **Movidesk multi-empresa**: 4 carteiras (SOLUTTA, AUDITTO, ALERTA FISCAL, MONITTORE).
- **SLA**: prazos de 1ª resposta + resolução, badge colorida (verde/amarelo/vermelho), breach automatizado via cron.
- **Atribuição**: dropdown de agente direto na lista.
- **Widget de chat Movidesk** carregado **somente** nessa página (não polui demais telas).
- Detalhe do ticket: prazos SLA, agente atribuído, status timestamps.

### Fila de atendimento (`/queue`)
- WAITING → PICKED → RELEASED.
- Prioridade configurável + ordem por entrada.
- Botão "Pegar" assume o próximo na fila e redireciona pro chat do cliente.

### Fluxos (`/flows` + `/flows/[id]/canvas`)
- **Canvas n8n-style** com React Flow.
- Nós: `filter_text`, `filter_sender`, `ai_reply`, `send_text`, `http_request`, `log`, **`webhook_in`**, **`webhook_out`**, **`condition`** (branching true/false).
- Webhook In: endpoint público `/api/flows/webhook/<path>` p/ integrações n8n.
- Webhook Out: posta evento + vars p/ URL externa.
- Disparo manual a partir da tela de mensagens (operador escolhe fluxo).
- Compatibilidade com fluxos lineares antigos (sem edges).

### Relatórios (`/reports`)
- Exportação CSV (UTF-8 BOM, Excel-friendly).
- **Tickets**: filtros por instância, período e agente.
- **Agentes**: sumário por agente — total, resolvidos, fechados, breaches, médias.

### Config por instância (`/instances/[name]/config`)
Tudo abaixo é configurado **por instância** (cada número WhatsApp tem o seu):
- **Persona IA**: prompt do bot dessa instância.
- **Horário de atendimento (Business Hours)**: agenda semanal por dia + timezone IANA + prompt de "Out-of-Office" com placeholder `{{next_opening}}`.
- **SLA**: 1ª resposta e resolução em minutos.

Também escopados por instância: **tags** (`/tags`), **fluxos** (`/flows`), **respostas rápidas** (canned), **contatos**.

### Movidesk admin (`/movidesk`)
- CRUD de **empresas** (carteiras) com token API, URL base, defaults (`type`, `status`, `baseStatus`, `urgency`, `category`).
- CRUD de **setores** por empresa: nome + email destino + tag (`financeiro`/`contabil`/`suporte`/`outro`).
- Email de setor é a **única fonte** de roteamento — não há mais fallback global.

### Perfil do usuário (`/profile`)
- Self-service: nome, **email Movidesk padrão** (vira `createdBy` no ticket), prompt IA pessoal (sobrescreve o da instância).
- Admin também edita o email Movidesk de qualquer usuário em `/users`.

### Carteiras (multi-empresa Movidesk)
- Cada contato pode ter uma **carteira** (= empresa Movidesk).
- Ao abrir ticket, a empresa vem pré-selecionada da carteira do contato.
- Botão "Carteira" na toolbar do chat.

### Cron tick (`/api/cron/tick`)
- Endpoint chamado por cron externo (header `X-Cron-Secret`).
- Responsabilidades: marca breaches SLA + processa campanhas agendadas (batch).

### Login
- Design **estilo pominai**: fundo `#05030F` com gradiente violeta, partículas animadas, isometric SVG e card de login glassmorphism.
- SSO Microsoft (Azure AD) via Supabase Auth.
- Disponível tanto em `web/` (`src/pages/Login.tsx`) quanto no legado Next.js (`src/app/(auth)/login/_form.tsx`).

---

## 🌿 Branches e commits

- `main` → produção (PR obrigatório)
- `develop` → integração
- `feat/*`, `fix/*`, `hotfix/*`, `chore/*`

Conventional Commits em português:

```
feat: adiciona canvas de fluxos node-based
fix: corrige hidratação de nomes em chats criados via API
chore: limpa código morto do chat headless
```

---

## 🤝 CI / CD

### CI

`.github/workflows/ci.yml` — lint e build em push/PR para `main`.

Secrets opcionais no CI: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POMINAI_SUPABASE_URL`, `NEXT_PUBLIC_POMINAI_ANON_KEY`

### CD (deploy EC2)

Após o CI em `main`, o job **Deploy EC2** roda `git pull` + `docker compose up --build -d`.

Deploy manual: **Actions → Deploy (manual) → Run workflow**

#### Configuração no GitHub

Defina em **Settings → Secrets and variables → Actions**.

| Nome | Escopo | Exemplo (CallMin) |
|---|---|---|
| `DEPLOY_PROJECT_NAME` | Repositório | `CallMin` |
| `DEPLOY_APP_PORT` | Repositório | `7443` |
| `DEPLOY_SSH_HOST` | Org ou repo | `35.174.181.218` |
| `DEPLOY_SSH_USER` | Org ou repo | `ubuntu` |
| `DEPLOY_BASE_DIR` | Org ou repo | `/srv/www` |
| `DEPLOY_SSH_PRIVATE_KEY` | Org (secret) | chave privada SSH |

#### Pré-requisitos no servidor

1. Clone em `/srv/www/CallMin` com `git pull` funcionando
2. `.env` com `NEXT_PUBLIC_SUPABASE_*` e demais vars (ver `.env.example`)
3. Usuário SSH com acesso ao Docker

---

## 🔒 Segurança

- **RLS sempre ativo** no Supabase. `service_role` apenas server-side (Next.js).
- Tudo `VITE_*` vai pro bundle do browser — só anon/publishable key entra aí.
- Toda entrada externa validada com Zod.
- PII mascarada em logs.
- `CRON_SECRET` obrigatório em `/api/cron/tick`.
- Evolution API key fica **só no backend** — o frontend Vite nunca a vê; chamadas ao Evolution passam por `/api/evolution/proxy`.

---

## 🩺 Troubleshooting

**Login redireciona p/ outro domínio (ex: hub.empresa.com)**
Site URL / Redirect URLs do Supabase desalinhado. Adicione `http://localhost:7443/**` em Auth → URL Configuration.

**`next: not found` ao rodar `npm run dev`**
Faltou `npm install`. O `postinstall` da raiz também instala `web/`.

**Erro de proxy ECONNREFUSED em dev**
Backend não subiu. Confira se `npm run dev:api` consegue subir isolado (porta 7443 livre).

**`pomincall_users` não existe**
Aplique [supabase/migrations/20260521170000_pomincall_init_users.sql](supabase/migrations/20260521170000_pomincall_init_users.sql) no SQL Editor antes de logar.

**Login retorna "Sua conta ainda não está liberada"**
O auth user existe em `auth.users` mas não tem perfil em `pomincall_users` (trigger pulou ou foi criado antes da migration). Insira manualmente ou rode `_seed_admin.sql`.

**Chat aparece com número em vez do nome do contato**
O contato não tem `name` no DB OU o JID retornado pela Evolution não casa com o registrado. Edite o contato em `/messages → Info`.

**Cron tick retorna 401**
Header `X-Cron-Secret` não bate com env `CRON_SECRET`.

**Ditto não responde**
`GEMINI_API_KEY` ausente. Configure em env ou em `/settings → IA`.

**Widget Movidesk não aparece em `/tickets`**
Verifique `mdChatClient` em [src/app/(app)/tickets/page.tsx](src/app/(app)/tickets/page.tsx) e cheque se o domínio está liberado nas configurações do Movidesk.

---

## 🛣 Roadmap de migração para o stack pominai

O frontend Vite (`web/`) ainda está parcial — só `/` (Login) e `/home` (placeholder) estão portados. As demais telas continuam funcionando via Next.js. Pra portar uma rota:

1. Copie `src/app/(app)/<rota>/page.tsx` + `_client.tsx` para `web/src/pages/<Pagina>.tsx`
2. Substitua `next/navigation` → `react-router-dom` (`useNavigate`, `useLocation`, `useParams`)
3. Substitua `next/link` → `<Link to>` do React Router
4. Substitua fetch SSR (`getServerProfile`) → `useQuery` do TanStack chamando `/api/profile`
5. Adicione `<Route>` em [web/src/App.tsx](web/src/App.tsx)

---

**Auditto © 2026 — Pomin Call**
