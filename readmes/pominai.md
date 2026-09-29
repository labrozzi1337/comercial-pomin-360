# Pominai

**Orquestrador de IA enterprise** — plataforma para criar, configurar e operar agentes de inteligência artificial em escala, com governança, controle de acesso, conhecimento por agente e widgets incorporáveis em sites internos.

---

## ✨ Visão geral

Pominai é o ponto central onde times constroem agentes de IA reutilizáveis. Cada agente tem modelo, instruções, temperatura, conhecimento (arquivos) e personalidade próprios, e pode ser conversado, treinado, compartilhado entre usuários ou incorporado como widget em outros sites.

**Capacidades atuais**

- 🔐 **Autenticação** — login por email/senha e Microsoft SSO (Supabase Auth), com auto-vinculação a `auth.users` global compartilhado entre projetos
- 👥 **Gestão de usuários** — RBAC `admin`/`user`, status `active`/`blocked`, alteração de senha pelo admin, criação que vincula usuário já existente em outros projetos
- 🤖 **Agentes de IA** — CRUD com modelo, system prompt, temperatura, voice mode, status de treinamento e compartilhamento (viewer/editor)
- 🧠 **Multi-provider** — agentes podem rodar em **Anthropic Claude** (Opus 4.7, Sonnet 4.6, Haiku 4.5), **OpenAI** (GPT-4o, GPT-4o mini, GPT-4 Turbo) ou **Google Gemini** (2.0 Flash, 1.5 Pro/Flash)
- 📎 **Conhecimento (RAG-lite)** — upload de `.txt/.md/.csv/.json/.log` por agente (até 1MB). Cada arquivo é resumido por Claude Haiku (~400 palavras) e o resumo é injetado no system prompt, mantendo o custo por chamada baixo
- 💬 **Chat logs** — toda conversa é persistida (admin vê tudo via `/admin/chat-logs`, usuário vê só as próprias)
- 🎙️ **Voice Mode** — conversa por voz em tempo real (WSS) com qualquer agente: STT/TTS via provider configurável por ambiente, VAD no cliente, mesma conversa/contexto do chat textual, sem persistir áudio
- 🪟 **Embed/Incorporar** — gera HTML de iframe que pode ser colado em `*.auditto.com.br`, `*.solutta.com` ou `*.grupopomin.com.br`. Validação dupla: CSP `frame-ancestors` no servidor + `Origin` checado na edge function
- 📊 **Dashboard** — KPIs, atividade por dia, top agentes e conversas recentes na home
- 🎨 **UI premium** — dark/light, command palette (⌘K), animação "pensando", ambient backgrounds

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui |
| Estado / fetch | TanStack Query · Zod |
| Backend | Supabase (Postgres · Auth · RLS · Edge Functions / Deno) |
| LLM providers | Anthropic Claude · OpenAI GPT · Google Gemini |
| Container | Docker · Nginx (produção) |

---

## 🚀 Setup local

### Pré-requisitos

- Node.js 20+
- npm
- Projeto Supabase configurado (URL + anon key)
- Pelo menos **uma** chave de provider de LLM (Anthropic, OpenAI ou Gemini) configurada como secret no Supabase

### Instalação

```sh
git clone git@github.com:Auditto/pominai.git
cd pominai
cp .env.example .env
# Edite .env — veja a seção "Variáveis de ambiente" abaixo
npm install
npm run dev
```

Dev server: `http://localhost:7442`

### Docker

```sh
docker compose up --build
```

---

## 🧪 Como testar (passo a passo)

Esta seção é um roteiro completo pra um dev validar todas as features em ambiente local.

### 0. Pré-requisitos uma vez por máquina

1. **Banco**: as migrations precisam estar aplicadas. Como o Supabase é compartilhado entre projetos, **NÃO use `supabase db push`** — o CLI vai detectar centenas de migrations de outros projetos e bloquear. Aplique manualmente via SQL Editor do Dashboard, na ordem:

   ```
   supabase/migrations/20260520120000_pominai_init.sql
   supabase/migrations/20260520140000_pominai_agents.sql
   supabase/migrations/20260520160000_pominai_agent_sharing.sql
   supabase/migrations/20260520180000_pominai_auth_lookup.sql
   supabase/migrations/20260520200000_pominai_chat_logs.sql
   supabase/migrations/20260520220000_pominai_agent_knowledge.sql
   supabase/migrations/20260521120000_pominai_agent_embed.sql
   ```

   Diagnóstico rápido (rode no SQL Editor) pra ver o que falta:

   ```sql
   SELECT
     to_regclass('public.pominai_users')                            AS init,
     to_regclass('public.pominai_agents')                           AS agents,
     to_regclass('public.pominai_agent_permissions')                AS sharing,
     to_regprocedure('public.pominai_find_auth_user_by_email(text)') AS auth_lookup,
     to_regclass('public.pominai_chat_conversations')               AS chat_logs,
     to_regclass('public.pominai_agent_knowledge')                  AS knowledge,
     to_regprocedure('public.pominai_get_embed_agent(uuid)')        AS embed;
   ```

   Cada coluna `NULL` indica a migration correspondente que ainda não foi aplicada.

2. **Edge functions** (em **Project Settings → Edge Functions → Deploy**):
   - `pominai-admin-create-user`
   - `pominai-admin-update-password`
   - `pominai-agent-chat`
   - `pominai-agent-knowledge-process`
   - `pominai-agent-embed-chat`
   - `pominai-voice-session` (broker WSS do Voice Mode)

3. **Secrets** (Dashboard → **Project Settings → Edge Functions → Secrets**):
   - `POMINAI_ANTHROPIC_API_KEY` (`sk-ant-...`) — pelo menos uma é obrigatória
   - `POMINAI_OPENAI_API_KEY` (`sk-...`) — opcional, só se for usar GPT (também usada para embeddings do cache semântico e como provider default de STT/TTS do Voice Mode)
   - `POMINAI_GEMINI_API_KEY` (`AIza...`) — opcional, só se for usar Gemini

### 1. Login e bootstrap de admin

```sh
npm run dev
# abra http://localhost:7442
```

- O primeiro usuário admin é criado automaticamente por `seedAdminUser()` no carregamento da tela de login (`felipe.martinez@grupopomin.com.br` / `123mudar@`). Use esse para entrar pela primeira vez.
- Pra Microsoft SSO funcionar, configure no Supabase Dashboard → **Authentication → Providers → Azure** com Client ID, Secret e Tenant do app registrado no Azure Portal. Adicione `http://localhost:7442/home` em **Redirect URLs**.

### 2. Gestão de usuários (admin)

- Vá em **Administração → Usuários**.
- Crie um usuário novo com email que ainda não exista em nenhum projeto → cria do zero.
- Crie um usuário com email que **já existe em outros projetos do mesmo Supabase** → o toast diz "Vinculado!" (sem mexer no `auth.users` global).
- Teste **Alterar senha** pelo menu de ações → a senha muda globalmente (o aviso de tela já explica).
- Confira as colunas **Criado em** e **Último acesso**.

### 3. Criar e configurar um agente

- Vá em **Agentes → Criar**.
- Em **Editar agente** (`/agents/:id/edit`):
  - **Model**: escolha um do Anthropic, OpenAI ou Gemini. Garanta que a key correspondente está nos secrets.
  - **Conhecimento**: clique em **Adicionar**, suba um `.md` ou `.txt` (até 1MB). Veja a contagem aproximada de tokens. Use o switch pra ativar/desativar.
  - **Instructions**: defina o system prompt.
  - **Salvar** → agente pronto pra usar.

### 4. Chat com agente

- No detalhe (lado direito = Playground) ou em `/agents/:id` (full screen).
- Envie 3–4 mensagens em sequência. Confirme que cada turno preserva contexto (mesma `conversation_id`).
- Verifique no DevTools → Network → `pominai-agent-chat` que a request retorna `reply` + `conversation_id` + `usage`.
- Se subiu arquivo de conhecimento, faça uma pergunta cuja resposta dependa dele e confirme que o agente respeita.

### 5. Chat logs (admin-only)

- Vá em **Administração → Chat logs**.
- Cada conversa aparece na lista lateral com agente, usuário e preview.
- Aba **Chat** mostra o transcript completo; aba **Details** mostra source, mensagens, datas, conversation ID.
- Teste exclusão via menu de ações.

### 6. Compartilhamento de agente

- No detalhe do agente, abra o diálogo de share.
- Adicione outro usuário como **viewer** → ele só conversa (não edita).
- Adicione como **editor** → ele edita config e conhecimento.
- Faça login como o outro usuário e confirme as permissões.

### 7. Embed (incorporar)

- No agente, seção **Incorporar (Embed)**, ative o switch → token é gerado.
- Copie o HTML do iframe.
- Pra testar de verdade, hospede um HTML simples num subdomínio permitido (`*.auditto.com.br`, `*.solutta.com`, `*.grupopomin.com.br`) e cole o iframe lá. Em ambiente local, você pode editar `/etc/hosts` pra apontar `teste.auditto.com.br` pra `127.0.0.1` e abrir um servidor estático nessa origem.
- Tente abrir de um domínio NÃO autorizado → o nginx deve bloquear via CSP `frame-ancestors` e a edge function rejeita com `403`.
- Acesse `http://localhost:7442/embed/<token>` direto (sem iframe) → também deve funcionar (mas a página em si mostra um aviso se detectar referrer não autorizado).
- Teste **Regerar token** → confirme que o HTML antigo para de funcionar.

### 8. Dashboard

- Volte pra **Início**. KPIs (conversas, mensagens, últimos 7 dias, usuários únicos) devem refletir o que você fez.
- Barras "Conversas por dia" mostram a atividade da última semana.
- Top 5 agentes lista os mais usados.
- Lista "Conversas recentes" mostra as últimas 5 com link pra Chat logs (admin).

### 9. Testes automatizados

```sh
npm run test       # Vitest
npm run lint       # ESLint
npm run build      # Build de produção (valida tipos)
npx tsc --noEmit   # Type-check sem emitir
```

---

## 🗄️ Banco de dados (Supabase)

Todas as tabelas, enums e funções carregam o prefixo `pominai_` para coexistir com projetos irmãos no mesmo Supabase.

**Migrations** (em `supabase/migrations/`)

| Arquivo | Conteúdo |
|---|---|
| `20260520120000_pominai_init.sql` | Schema base — `pominai_users`, helpers RLS, trigger `pominai_handle_new_user` |
| `20260520140000_pominai_agents.sql` | `pominai_agents` + enum `pominai_agent_status` |
| `20260520160000_pominai_agent_sharing.sql` | `pominai_agent_permissions` + helpers `pominai_can_view_agent`/`can_edit_agent` |
| `20260520180000_pominai_auth_lookup.sql` | RPCs `pominai_find_auth_user_by_email` e `pominai_list_users_with_auth` |
| `20260520200000_pominai_chat_logs.sql` | `pominai_chat_conversations` + `pominai_chat_messages` |
| `20260520220000_pominai_agent_knowledge.sql` | `pominai_agent_knowledge` (arquivos resumidos) |
| `20260521120000_pominai_agent_embed.sql` | Colunas embed em `pominai_agents` + RPC `pominai_get_embed_agent` |
| `20260816120000_pominai_semantic_cache.sql` | `pominai_semantic_cache` (pgvector) + RPCs `pominai_match_semantic_cache`/`pominai_touch_semantic_cache`/`pominai_cleanup_semantic_cache` + invalidação automática |
| `20260816130000_pominai_semantic_cache_ttl.sql` | Coluna `category` em `pominai_semantic_cache` + tabela `pominai_semantic_cache_ttl` (TTL por categoria) + RPC `pominai_purge_semantic_cache` (purge por categoria/agente/global) |
| `20260817120000_pominai_voice_sessions.sql` | Coluna `input_mode` em `pominai_chat_messages` (`text`/`voice`) + tabela `pominai_voice_sessions` (log de sessões do Voice Mode — sem áudio) |

> ⚠️ **Não use `supabase db push`**. O banco é compartilhado entre vários projetos e o CLI detecta migrations órfãs. Aplique via SQL Editor.

---

## ⚡ Edge Functions

Localização: `supabase/functions/`

| Função | Auth | Descrição |
|---|---|---|
| `pominai-admin-create-user` | JWT (admin) | Cria ou vincula usuário ao perfil do projeto. Não toca `auth.users` global se já existir. |
| `pominai-admin-update-password` | JWT (admin) | Altera senha global do usuário via Service Role |
| `pominai-admin-purge-semantic-cache` | JWT (admin) | Invalida entradas do cache semântico por categoria, agente ou globalmente |
| `pominai-agent-chat` | JWT (validado no handler; `verify_jwt=false` no gateway para CORS cross-origin) | Roteia chat pro provider correto (Claude/GPT/Gemini), injeta conhecimento, persiste logs, cache semântico de respostas (1ª pergunta de conversas novas, com TTL por categoria e modo shadow) |
| `pominai-agent-knowledge-process` | JWT (editor do agente) | Resume um arquivo via Claude Haiku e grava em `pominai_agent_knowledge` |
| `pominai-agent-embed-chat` | **Anônimo** | Chat público pro widget de embed. Valida `Origin` + `embed_token` antes de chamar o LLM |
| `pominai-voice-session` | JWT (validado no handler via `?token=`; `verify_jwt=false` no gateway — WebSocket do browser não manda header `Authorization`) | Broker WSS do Voice Mode: STT/TTS via `VoiceProvider` (`voiceProvider.ts`, configurável por `VOICE_PROVIDER`), encaminha cada transcrição pro `pominai-agent-chat` (mesma conversa, `input_mode: "voice"`) e loga sessão em `pominai_voice_sessions` |

### Deploy

Via Dashboard (Edge Functions → **Deploy a new function**) ou CLI:

```sh
supabase functions deploy pominai-agent-chat
supabase functions deploy pominai-admin-create-user
supabase functions deploy pominai-admin-update-password
supabase functions deploy pominai-admin-purge-semantic-cache
supabase functions deploy pominai-agent-knowledge-process
supabase functions deploy pominai-agent-embed-chat
supabase functions deploy pominai-voice-session
```

---

## 🔐 Variáveis de ambiente

| Variável | Onde | Descrição |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` | URL pública do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` | Anon key (vai pro bundle) |
| `VITE_SUPABASE_PROJECT_ID` | `.env` | ID do projeto |
| `POMINAI_ANTHROPIC_API_KEY` | Supabase Secrets | Chave Anthropic (`sk-ant-...`) |
| `POMINAI_OPENAI_API_KEY` | Supabase Secrets | Chave OpenAI (`sk-...`) — opcional; reaproveitada p/ embeddings do cache semântico |
| `POMINAI_GEMINI_API_KEY` | Supabase Secrets | Chave Google Gemini (`AIza...`) — opcional |
| `SEMANTIC_CACHE_ENABLED` | Supabase Secrets | Liga/desliga o cache semântico de respostas (default `true`) |
| `SEMANTIC_CACHE_THRESHOLD` | Supabase Secrets | Similaridade de cosseno mínima (0–1) pra reaproveitar resposta cacheada (default `0.92`) |
| `SEMANTIC_CACHE_TTL_DAYS` | Supabase Secrets | Override global do TTL (dias) — opcional; sem ele, o TTL vem de `pominai_semantic_cache_ttl` por categoria do agente |
| `SEMANTIC_CACHE_SHADOW` | Supabase Secrets | Modo shadow: loga "would-be HIT" mas sempre chama o LLM — pra calibrar o threshold sem risco (default `false`) |

> ⚠️ **Importante**: `VITE_*` é embutido no bundle JS e fica público. Chaves de provider de LLM vivem **só no servidor** (edge functions). **Nunca** prefixe uma chave de LLM com `VITE_`.

---

## 📁 Estrutura

```
src/
├── components/
│   ├── CommandPalette.tsx        # busca global ⌘K
│   ├── ProtectedRoute.tsx        # guards de rota (ProtectedRoute + AdminRoute)
│   ├── ThemeProvider.tsx
│   ├── ThinkingIndicator.tsx
│   ├── agents/ShareAgentDialog.tsx
│   ├── layout/                   # AppLayout, AppSidebar
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── pominaiStore.ts           # auth, users, agents, chat, knowledge, embed
│   └── embedAllowedDomains.ts    # lista única dos domínios permitidos
├── pages/
│   ├── Login.tsx                 # email/senha + Microsoft SSO
│   ├── Home.tsx                  # dashboard de utilização
│   ├── Agents.tsx                # lista
│   ├── AgentChat.tsx             # chat full-screen
│   ├── AgentDetail.tsx           # editor + playground + knowledge + embed
│   ├── ChatLogs.tsx              # logs (admin)
│   ├── AdminUsers.tsx            # CRUD de usuários (admin)
│   └── EmbedAgent.tsx            # widget público /embed/:token
└── integrations/
    └── supabase/                 # client + types gerados

supabase/
├── migrations/                   # schema (todos com prefixo pominai_)
└── functions/
    ├── pominai-admin-create-user/
    ├── pominai-admin-update-password/
    ├── pominai-agent-chat/
    ├── pominai-agent-knowledge-process/
    └── pominai-agent-embed-chat/
```

---

## 🛠️ Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (porta 7442) |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npx tsc --noEmit` | Type-check estrito sem emitir |

---

## 🤝 CI / CD

### CI

`.github/workflows/ci.yml` — lint, testes e build em push/PR para `main`.

Secrets opcionais no CI: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### CD (deploy EC2)

Após o CI em `main`, o job **Deploy to EC2** roda `git pull` + `docker compose up --build -d`.

O job **Deploy Edge Functions** publica todas as funções em `supabase/functions/` no projeto Supabase (`pominai-agent-chat`, voz, anexos, etc.).

O workflow reutilizável é `.github/workflows/reusable-deploy-docker-compose.yml`. Outros projetos no mesmo servidor podem referenciá-lo com `workflow_call` ou copiar o YAML.

Deploy manual: **Actions → Deploy (manual) → Run workflow**

#### Configuração no GitHub

Defina em **Settings → Secrets and variables → Actions**.

| Nome | Escopo | Exemplo (pominai) |
|---|---|---|
| `DEPLOY_PROJECT_NAME` | Repositório | `pominai` |
| `DEPLOY_APP_PORT` | Repositório | `7442` |
| `DEPLOY_SSH_HOST` | Org ou repo | `35.174.181.218` |
| `DEPLOY_SSH_USER` | Org ou repo | `ubuntu` |
| `DEPLOY_BASE_DIR` | Org ou repo | `/srv/www` |
| `DEPLOY_SSH_PRIVATE_KEY` | Org (secret) | chave privada SSH |
| `SUPABASE_ACCESS_TOKEN` | Repositório | token em [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) — obrigatório pra publicar edge functions |

#### Sequência de portas no servidor

| Projeto | Porta |
|---|---|
| pomiro | 7438 |
| pomin-cost | 7439 |
| pomintrack | 7440 |
| compramin | 7441 |
| pominai | 7442 |

#### Pré-requisitos no servidor

1. Clone em `/srv/www/<projeto>` com `git pull` funcionando
2. `.env` com `VITE_SUPABASE_*` (não versionar)
3. Usuário SSH com acesso ao Docker
4. Nginx do container já vem com CSP `frame-ancestors` por rota (ver `nginx.conf`)
