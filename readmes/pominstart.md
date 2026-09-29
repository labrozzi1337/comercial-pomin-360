# pominstart — Starter Template

Template **frontend pronto pra forkar** para começar um novo SaaS/painel interno em minutos. Já vem com login (Supabase Auth), dashboard com gráficos, tabelas com filtros, formulários validados, mostruário completo de UI, command palette, tema dark/light e build de produção via Docker + nginx.

A única dependência de banco é o **Supabase Auth** (usuário + login). Toda a parte de domínio foi removida — o resto dos dados é mock pra você ver os componentes funcionando.

> Use como ponto de partida: dê fork, troque o nome, conecte seu Supabase, troque os mocks por queries reais e siga construindo.

---

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Rodar em desenvolvimento (porta 7000)](#rodar-em-desenvolvimento-porta-7000)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rodar com Docker em produção (porta 7000)](#rodar-com-docker-em-produção-porta-7000)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rotas](#rotas)
- [Autenticação (Supabase Auth)](#autenticação-supabase-auth)
- [Componentes e exemplos inclusos](#componentes-e-exemplos-inclusos)
- [Customização](#customização)
- [Scripts](#scripts)
- [Próximos passos depois do fork](#próximos-passos-depois-do-fork)

---

## Stack

- **Build**: Vite 5 + TypeScript estrito
- **UI**: React 18 + Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (50+ componentes copiados em `src/components/ui`)
- **Roteamento**: React Router v6 (com `ProtectedRoute`)
- **Estado de servidor**: TanStack Query
- **Formulários**: React Hook Form + Zod
- **Charts**: Recharts (line, bar, area, pie, radar, radial, scatter)
- **Tema**: next-themes (dark / light / system)
- **Auth**: Supabase Auth (email/senha — sem provider externo configurado)
- **Toasts**: sonner
- **Command Palette**: cmdk (atalho `Ctrl/Cmd + K`)
- **Deploy**: Docker multi-stage + nginx (porta **7000**)

---

## Pré-requisitos

- Node.js **20+** e npm
- Docker / Docker Compose (apenas pra produção)
- Um projeto **Supabase** (free tier é suficiente) — você só precisa da URL e da chave anon

---

## Rodar em desenvolvimento (porta 7000)

```sh
# 1. copie o .env de exemplo e preencha com suas credenciais Supabase
cp .env.example .env
# (edite .env apontando para o seu projeto Supabase)

# 2. instale dependências
npm install

# 3. suba o dev server (porta 7000, HMR ativo)
npm run dev
```

Abra <http://localhost:7000>

A primeira tela é o login. Se ainda não tiver usuário, clique em **"Criar conta ↗"** ou crie um direto no painel do Supabase (Authentication → Users → Add user).

---

## Variáveis de ambiente

Crie `.env` na raiz do projeto (copie de [.env.example](.env.example)):

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase (ex: `https://abc123.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave **anon/publishable** do Supabase (vai pro bundle, é pública) |

> Variáveis com prefixo `VITE_` são **públicas** — entram no bundle JS. **Nunca** coloque `service_role_key` aqui.

Onde achar isso no Supabase: Dashboard → Settings → API → `Project URL` e `anon public` key.

> Mudou o `.env`? Reinicie o dev server (e rebuild o container se estiver em prod).

---

## Rodar com Docker em produção (porta 7000)

A imagem é **multi-stage**:
- **Stage 1** (`node:20-alpine`): roda `npm ci` e `npm run build`, gera `dist/`
- **Stage 2** (`nginx:1.27-alpine`): serve `dist/` na porta **7000**

```sh
# build + sobe em background (lê .env automaticamente)
docker compose up --build -d

# acompanhar logs
docker compose logs -f

# parar e remover
docker compose down
```

Abra <http://localhost:7000>

O container chama `starter-app`, tem `restart: unless-stopped` e healthcheck em `http://127.0.0.1:7000/` a cada 30s.

### O que o nginx faz ([nginx.conf](nginx.conf))

- **SPA fallback** — qualquer rota desconhecida cai em `index.html` para o React Router resolver
- **Cache agressivo** em `/assets/*` (1 ano, immutable — arquivos têm hash no nome)
- **Zero cache** em `index.html`
- **Cache moderado** (30d) em fontes, imagens e ícones
- **Gzip** em texto, JS, CSS, JSON, SVG, wasm
- **Headers de segurança**: `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'`

---

## Estrutura de pastas

```
src/
├── pages/
│   ├── Login.tsx              # tela de login (email/senha)
│   ├── Dashboard.tsx          # KPIs + 4 charts + tabela de atividade
│   ├── Charts.tsx             # galeria de charts Recharts
│   ├── Tables.tsx             # tabela com busca, filtros, sort e paginação
│   ├── Forms.tsx              # form com react-hook-form + zod
│   ├── UIShowcase.tsx         # mostruário de componentes shadcn/ui
│   ├── Profile.tsx            # editar nome + trocar senha
│   ├── AdminUsers.tsx         # CRUD de usuários (admin only)
│   └── NotFound.tsx           # 404
│
├── components/
│   ├── ui/                    # shadcn/ui (50+ componentes)
│   ├── layout/
│   │   ├── AppLayout.tsx      # shell autenticado: sidebar + topbar + main
│   │   └── AppSidebar.tsx     # menu lateral colapsável (mostra "Admin" se role=admin)
│   ├── CommandPalette.tsx     # ⌘K — busca de páginas e ações
│   ├── ProtectedRoute.tsx     # guard pra rotas autenticadas
│   ├── AdminRoute.tsx         # guard pra rotas admin-only
│   ├── ErrorBoundary.tsx      # fallback global de erros
│   └── ThemeToggle.tsx        # botão dark/light/system
│
├── contexts/
│   └── AuthContext.tsx        # estado de auth + validação do perfil pominstart_users
│
├── lib/
│   ├── pominstartStore.ts     # backend layer (login + CRUD de usuários)
│   └── utils.ts               # cn helper
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # createClient com persistência em localStorage
│       └── types.ts           # placeholder para tipos gerados (rode `supabase gen types`)
│
├── hooks/                     # use-mobile, use-toast, useConfirm
├── App.tsx                    # rotas + providers
├── main.tsx                   # entrypoint (ThemeProvider, StrictMode)
└── index.css                  # design system (Tailwind layers + tokens HSL)

supabase/
├── migrations/                # SQL versionado
│   └── 20260522120000_pominstart_init.sql   # tabela pominstart_users + RLS + RPCs + trigger
├── functions/
│   ├── pominstart-admin-create-user/        # cria/vincula usuário (admin only)
│   └── pominstart-admin-update-password/    # troca senha de outro usuário (admin only)
└── config.toml                # config do Supabase CLI

Dockerfile                     # multi-stage (node build → nginx serve)
docker-compose.yml             # 1 serviço (porta 7000:7000)
nginx.conf                     # SPA fallback + cache + gzip + security headers
vite.config.ts                 # porta 7000 (dev e preview), alias @ → src
.env.example                   # variáveis necessárias (Supabase)
```

---

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | **Login** (email + senha) |
| `/dashboard` | Autenticado | KPIs + charts + atividade recente |
| `/charts` | Autenticado | Galeria com 7 tipos de gráficos (Recharts) |
| `/tables` | Autenticado | Tabela completa com filtros e paginação |
| `/forms` | Autenticado | Formulário validado (react-hook-form + zod) |
| `/components` | Autenticado | Mostruário de componentes shadcn/ui |
| `/profile` | Autenticado | Editar perfil e trocar senha |
| `/admin/users` | Admin | CRUD de usuários (criar / editar / bloquear / excluir / trocar senha) |
| `*` | — | Página 404 |

Tudo dentro de `/dashboard`+ usa o `AppLayout` (sidebar colapsável + topbar com command palette + theme toggle).

---

## Autenticação e gestão de usuários

Arquitetura (clonada do projeto `pominai`) para rodar bem num **Supabase compartilhado entre vários projetos**:

```
                ┌────────────────────┐
                │   auth.users       │  ← compartilhado entre projetos
                │   (Supabase Auth)  │
                └──────────┬─────────┘
                           │ auth_id FK
                ┌──────────▼─────────┐
                │ pominstart_users   │  ← perfil deste projeto: name, role, status
                │ (RLS + trigger)    │
                └────────────────────┘
```

**Por que não usar só `auth.users`?** Porque você pode bloquear um usuário aqui (`status=blocked`) sem impedir o login dele em outros projetos, e cada projeto define seu próprio admin (`role=admin`).

### Fluxo de login

1. Usuário digita email/senha em `/`
2. Frontend chama `supabase.auth.signInWithPassword`
3. Após sucesso, frontend busca o perfil em `pominstart_users` por `auth_id`
4. Se **não existe** perfil → desloga + "Conta sem perfil, peça liberação"
5. Se `status='blocked'` → desloga + "Usuário bloqueado"
6. Se OK → entra com `role` (admin/user) no contexto

### Fluxo de cadastro

**Não há auto-registro.** Só admins criam usuários, em `/admin/users`. O fluxo:

1. Admin preenche nome/email/senha/role/status
2. Edge function `pominstart-admin-create-user`:
   - Procura `auth.users` por email (RPC `pominstart_find_auth_user_by_email`)
   - Se existe (outro projeto já criou) → reusa o `auth_id`, mantém a senha original, só cria perfil
   - Se não existe → cria via `auth.admin.createUser` com `email_confirm: true`
3. Upsert em `pominstart_users` com role/status escolhidos

### Setup do banco — **rodar 1x por projeto Supabase**

1. Abra o **SQL Editor** do Supabase
2. Cole o conteúdo de [supabase/migrations/20260522120000_pominstart_init.sql](supabase/migrations/20260522120000_pominstart_init.sql)
3. Rode

Isso cria:
- Tipos `pominstart_role` (admin/user) e `pominstart_status` (active/blocked)
- Tabela `pominstart_users` com RLS
- Helpers `pominstart_is_admin`, `pominstart_get_user_id`, `pominstart_find_auth_user_by_email`, `pominstart_list_users_with_auth`
- Trigger `pominstart_on_auth_user_created` que cria perfil automaticamente para novos `auth.users`
- Seed: vincula `robson@solutta.com` e `admin@admin.com` como admin (se existirem em `auth.users`)

### Deploy das edge functions

Pra `/admin/users` funcionar (criar usuários, trocar senha de terceiros), as 2 edge functions precisam estar no ar:

```sh
# instale o CLI (uma vez): npm install -g supabase

# link com seu projeto
supabase link --project-ref <seu-project-ref>

# deploy
supabase functions deploy pominstart-admin-create-user
supabase functions deploy pominstart-admin-update-password
```

Ambas usam `SUPABASE_SERVICE_ROLE_KEY` que é injetada automaticamente pelo Supabase nas Edge Functions — **não precisa configurar nada extra**.

### Trocar de provider de auth

O `AuthContext` em [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) e o store em [src/lib/pominstartStore.ts](src/lib/pominstartStore.ts) concentram tudo. Quer SSO Microsoft ou Google? Adicione um `loginWith*` no store seguindo o padrão do `login` por senha.

### ⚠️ Cuidados no Supabase compartilhado

- **NUNCA** dê `DELETE FROM auth.users` — outros projetos têm FKs cruzadas.
- `deleteUser()` do store apaga só `pominstart_users` (o usuário continua existindo nos outros projetos).
- Trocar senha em `/admin/users` muda a senha do auth global → **vale para todos os projetos**. A UI exibe esse aviso.

---

## Componentes e exemplos inclusos

| Página | O que demonstra |
|---|---|
| **Dashboard** | 4 stat cards animados, AreaChart com gradient, PieChart donut, BarChart, tabela de atividade com Badges |
| **Charts** | LineChart, stacked BarChart, stacked AreaChart, donut PieChart, RadarChart, RadialBarChart, ScatterChart — todos responsivos e com tooltip estilizado |
| **Tables** | Busca por texto, 2 filtros (Select), ordenação por coluna (asc/desc), paginação client-side |
| **Forms** | Form completo com `react-hook-form` + `zod` (Input, Textarea, Select, Switch) + inputs avulsos (Slider, RadioGroup, Checkbox) |
| **UI Showcase** | Buttons (6 variants), Badges, Avatars, Alerts, Progress, Tabs, Accordion, Skeleton, Tooltip, HoverCard, Popover + Calendar, Dialog, DropdownMenu, Toast (sonner) |
| **Profile** | Edição de nome (`pominstart_users`) + troca de senha (Supabase Auth) + dados da conta |
| **AdminUsers** | CRUD completo: listar (com `last_sign_in_at` via RPC), buscar, criar, editar, bloquear/ativar, trocar senha, excluir |

### Atalhos & detalhes

- **`Ctrl/Cmd + K`** → abre o Command Palette com busca de páginas + alternar tema + logout
- **Sidebar colapsável** — clique no botão do topo pra colapsar/expandir
- **Dark / Light / System** — pelo botão da topbar, pelo command palette, ou via `next-themes`
- **Persistência da sessão** — refresh não desloga (sessão fica em `localStorage`)

---

## Customização

### Trocar nome / logo / cores

| O que | Onde |
|---|---|
| Nome no `<title>` | [index.html](index.html) — `<title>` e meta tags OG |
| Nome no sidebar | [src/components/layout/AppSidebar.tsx](src/components/layout/AppSidebar.tsx) — `Starter<span>Kit</span>` |
| Nome no login | [src/pages/Login.tsx](src/pages/Login.tsx) |
| Logo / ícone | Hoje é um `<Sparkles />` do lucide. Troque pelo seu SVG/PNG. |
| Cores (light + dark) | [src/index.css](src/index.css) — CSS variables HSL no `:root` e `.dark` (são consumidas pelo Tailwind via `hsl(var(--primary))`) |
| Fontes | [index.html](index.html) (link do Google Fonts) + [tailwind.config.ts](tailwind.config.ts) (`fontFamily.sans`) + [src/index.css](src/index.css) (`body { font-family }`) |
| Favicon | `public/favicon.ico` |

### Adicionar uma nova rota/página

1. Crie `src/pages/MinhaPagina.tsx` envolvendo o conteúdo no `<AppLayout>`
2. Adicione a rota em [src/App.tsx](src/App.tsx) dentro de `<ProtectedRoute>`
3. Adicione o item de menu em [src/components/layout/AppSidebar.tsx](src/components/layout/AppSidebar.tsx) (array `mainItems`)
4. (Opcional) Adicione no Command Palette em [src/components/CommandPalette.tsx](src/components/CommandPalette.tsx)

### Adicionar uma tabela customizada no Supabase

```sql
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  body text,
  created_at timestamptz default now()
);
alter table public.posts enable row level security;
create policy "own posts" on public.posts for all using (auth.uid() = user_id);
```

Gere os tipos TypeScript:
```sh
npx supabase gen types typescript --project-id <seu-project-ref> > src/integrations/supabase/types.ts
```

---

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Dev server Vite em [http://localhost:7000](http://localhost:7000) com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run build:dev` | Build em modo desenvolvimento (sem minificar) |
| `npm run preview` | Serve o `dist/` localmente na porta 7000 |
| `npm run lint` | ESLint em todo o projeto |

---

## Próximos passos depois do fork

1. **Renomeie** o projeto em `package.json` (`name`), no SQL/funções (`s/pominstart_/seuprojeto_/g`), e nos textos visíveis (sidebar, login, `index.html`)
2. **Conecte** seu Supabase (`.env`)
3. **Rode o SQL** em `supabase/migrations/*_pominstart_init.sql` no SQL Editor (cria a tabela + RLS + trigger + seed)
4. **Deploy** das 2 edge functions (`supabase functions deploy ...`)
5. **Crie o primeiro admin** — ou pela UI do Supabase (Authentication → Users) seguido de `UPDATE pominstart_users SET role='admin' WHERE email='...'`, ou edite o seed inline na migration antes de rodar
6. **Ajuste cores** em `src/index.css` para a identidade do seu produto
7. **Substitua** o ícone `<Sparkles />` pelo seu logo
8. **Construa** suas páginas — copie/adapte `Tables.tsx` ou `Forms.tsx` como base
9. **Apague** os exemplos quando não precisar mais deles
10. **Configure CI** (GitHub Actions, etc.) — não vem nenhum por padrão

Bom código! 🚀

---

## Licença

MIT — use, modifique e distribua à vontade. Sem garantias.
