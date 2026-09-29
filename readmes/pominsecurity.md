# PomInSecurity

Plataforma interna de **segurança e observabilidade** do Grupo Pomin. Reúne, num só painel:

- **Pentest automatizado** — recebe a URL de produção + o repositório GitHub de um projeto, roda checagens **estáticas + dinâmicas**, e usa o Claude para gerar um **relatório** no layout corporativo (OWASP Top 10 + Twelve-Factor), exportável em PDF.
- **Monitoramento / observabilidade** — coletores (agentes) reportam saúde de **servidores, domínios e robôs**; o sistema calcula estado (operacional/degradado/fora do ar), abre **incidentes automáticos com SLA**, dispara **alertas** e publica uma **status page** pública.
- **Visão geral (dashboard)** — tela inicial com contagem de servidores monitorados, OK/degradados/fora do ar, uptime, agentes online, incidentes ativos e uso médio de recursos.
- **Auditoria / Logs** — trilha **imutável** que registra quem alterou o quê, quando, de onde e o antes/depois (LGPD/ISO 27001, forensics).
- **Gestão de usuários** com **papéis granulares** e permissões por capacidade.
- **Boia de SAC** — botão salva-vidas no header que abre chamados no **pominsac** (SAC central do grupo).

Para padrões de stack e convenções do grupo, veja `../soul/arch.md`.

---

## Arquitetura

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Frontend (SPA) — Vite + React + TS + Tailwind (design system Pomin)            │
│  Dashboard · Pentests · Relatório · Monitoramento · Incidentes · Auditoria ·   │
│  Usuários · Status page · Boia SAC                                             │
└───────────┬───────────────────────────────────────────────┬───────────────────┘
            │ JWT (anon key)                                 │ POST /scan (JWT)
            ▼                                                ▼
┌────────────────────────────────┐             ┌──────────────────────────────────┐
│ Supabase (schema pominsecurity)│             │ Worker (Node + Express)          │
│  • Postgres + RLS por papel    │◄─service_role─┤  • dinâmico: headers/TLS/CORS…  │
│  • Auth (multi-projeto)        │             │  • estático: repo via GitHub API │
│  • Edge functions (admin/ingest)│            │  • Claude (tool-use) → relatório │
│  • Triggers de auditoria       │             │  • persiste scan (status done)   │
└────────────────────────────────┘             └──────────────────────────────────┘
            ▲
            │ ingest de métricas (edge function)
┌───────────┴───────────────────┐
│ Agentes/coletores nos hosts    │  CPU/mem/disco, heartbeat, robôs (supervisor), SSL/DNS
└───────────────────────────────┘
```

O banco e o Auth são **compartilhados entre vários apps do grupo**; todo o PomInSecurity vive isolado no schema dedicado **`pominsecurity`** — nunca toca `public`/`auth` global.

---

## Papéis e permissões

Cinco papéis, gateados por **capacidades** ([`pominsecurityStore.ts`](src/lib/pominsecurityStore.ts)). O frontend reflete; a **RLS no banco e o worker são a barreira real**.

| Papel | Pentests | Monitoramento | Incidentes | Usuários | Auditoria |
|---|---|---|---|---|---|
| **Admin** | rodar / excluir | gerenciar | gerenciar | gerenciar | ver |
| **Operador** | rodar | gerenciar | gerenciar | — | — |
| **Auditor** | ver / exportar | ver | ver | — | **ver** |
| **Viewer** | ver | só visão geral | — | — | — |
| **user** (legado) | ver | só visão geral | — | — | — |

Helpers SQL: `is_admin()`, `is_operator()` (admin+operador), `is_member()` (qualquer ativo), `is_auditor()` (admin+auditor). Usuários **não** são criados por signup global — um admin cadastra (o `auth_id` é vinculado no 1º login).

---

## Estrutura

```
pominsecurity/                 # Frontend na raiz (Vite + React + TS + Tailwind)
├── src/
│   ├── pages/
│   │   ├── Login.tsx           # e-mail/senha + SSO Microsoft (Azure)
│   │   ├── Dashboard.tsx       # visão geral (tela inicial "/")
│   │   ├── Scans.tsx           # pentests (lista + novo scan) — "/pentests"
│   │   ├── Report.tsx          # relatório do scan + "Salvar PDF"
│   │   ├── Preview.tsx         # layout do relatório com dados de exemplo
│   │   ├── MonitoringDashboard.tsx   # KPIs + saúde dos componentes
│   │   ├── MonitoringConfig.tsx      # cadastro de agentes/hosts/domínios/robôs
│   │   ├── Incidents.tsx       # incidentes + SLA + timeline
│   │   ├── AuditLog.tsx        # trilha de auditoria (filtros, diff, export)
│   │   ├── AdminUsers.tsx      # gestão de usuários e papéis
│   │   └── StatusPage.tsx      # status page pública ("/status")
│   ├── components/
│   │   ├── layout/             # AppLayout, AppSidebar, SearchModal (⌘K)
│   │   ├── sac/                # boia de chamados (cliente do pominsac)
│   │   └── ui/                 # primitivos (dialog, etc.)
│   ├── report/                 # ReportDocument.tsx + report.css (PDF) + sample.ts
│   ├── lib/                    # pominsecurityStore, monitoringStore, useRole, utils
│   └── integrations/supabase/  # client.ts + pominsacClient.ts
│
├── worker/                     # Node + TS — motor do scan (Express)
│   └── src/
│       ├── index.ts            # POST /scan (admin|operador), GET /health
│       ├── pipeline.ts         # orquestra dinâmico + estático + LLM + persistência
│       ├── dynamic.ts          # checks não-intrusivos na URL de produção
│       ├── github.ts           # download/varredura do repo
│       ├── analyze.ts          # Claude (tool-use) → SecurityReport
│       ├── scan-local.ts/local.ts # pentest de pasta local (CLI, via service_role)
│       ├── supabase.ts         # service_role + authorizeRoles()
│       └── report-schema.ts    # contrato do relatório (zod)
│
├── supabase/
│   ├── migrations/             # schema pominsecurity (ver "Modelo de dados")
│   └── functions/              # edge functions (service_role)
│       ├── pominsecurity-admin-create-user
│       ├── pominsecurity-admin-update-password
│       └── pominsecurity-agent-ingest      # ingest de métricas dos agentes
└── docker-compose.yml
```

---

## Módulos

### 1. Pentest automatizado
- **Estático:** baixa o repo via tarball da GitHub API (PAT read-only p/ repos privados), detecta a stack, varre segredos (`sk-ant-`, JWT, `AKIA…`, chaves privadas), sinaliza dependências legadas e coleta os arquivos mais relevantes como contexto.
- **Dinâmico:** requisições **GET/OPTIONS não-intrusivas** na URL — headers de segurança (HSTS, CSP, X-Frame-Options…), TLS, reflexão de CORS, flags de cookie, exposição de arquivos sensíveis (`/.env`, `/.git/config`…).
- **Relatório:** o Claude classifica as 10 categorias OWASP + os 12 fatores e monta um plano de hardening priorizado, **ancorado na evidência**. Nota 0–100 + veredito. Também roda em **pasta local** via CLI (`npm run scan:local`, usado pela skill `/pentest`).

### 2. Monitoramento / observabilidade
- Agentes nos hosts enviam métricas (CPU/mem/disco), **heartbeat** e estado de robôs (supervisor) via a edge function `pominsecurity-agent-ingest`.
- Entidades monitoradas: **servidores** (compute instances, com thresholds de CPU/mem/disco), **domínios** (SSL/DNS/latência) e **robôs** (programas supervisionados).
- Calcula estado **operacional / degradado / fora do ar**, gera **alertas** (CPU/mem/disco/latência/SSL/heartbeat/robot fatal…) com deduplicação e abre **incidentes automáticos**.

### 3. Incidentes & SLA
- Incidentes manuais ou **automáticos**; status `investigating → identified → monitoring → resolved`; severidade `minor/major/critical/maintenance`.
- **SLA** de resposta/resolução com prazo e marcação de "estourado"; reconhecimento (ack) e **timeline** de updates. Incidentes públicos aparecem na status page.

### 4. Status page pública (`/status`)
Banner de status geral + componentes + uptime + incidentes públicos, servida por RPCs **públicas** (sem login).

### 5. Dashboard (tela inicial)
Contagem de servidores monitorados, OK/degradados/fora do ar, uptime (30d), agentes online, incidentes ativos e uso médio de CPU/mem/disco — com fallback gracioso por papel.

### 6. Auditoria / Logs (`/admin/audit`, admin + auditor)
- Tabela `audit_logs` **append-only** (trigger de imutabilidade bloqueia UPDATE/DELETE).
- **Captura automática** por triggers nas tabelas de governança (usuários, config de monitoramento, thresholds, domínios, robôs, agentes enable/disable, incidentes): grava **quem, ação, recurso, antes/depois (com diff), IP, user-agent, status** — com **máscara** de token/senha/hash/chaves.
- Eventos de app via RPC `audit_log_event` (LOGIN/LOGOUT já capturados).
- UI com filtros (usuário, ação, recurso, datas, busca), diff expansível e **export CSV/JSON**.

### 7. Boia de SAC
Botão `LifeBuoy` no header abre um modal de chamados conectado ao **pominsac** (projeto Supabase central, modo externo via RPCs `pominsac_external_*` + token). Requer as `VITE_POMINSAC_*` e o slug `pominsecurity` seedado em `pominsac_systems`.

### 8. Usuários
Tela `/admin/users` (admin): criar/editar/bloquear/excluir e trocar senha — sem SQL. Operações sensíveis passam por edge functions com `service_role`.

### 9. Tokens de acesso à API (`/api-tokens`)
Qualquer membro ativo gera um **token pessoal** (`psk_...`) com prazo de validade (1, 2, 7, 30 dias ou um valor livre até 90), exibido **uma única vez** na criação. O token carrega o **e-mail do usuário cifrado** (AES via `pgcrypto`) + assinatura HMAC; só o **hash** do token completo fica no banco (`api_tokens`). A edge function `pominsecurity-credentials-api` usa esse token (header `x-api-key` ou `Authorization: Bearer`) para listar/revelar credenciais do Cofre **fora da sessão do Supabase Auth**. Geração, uso, revogação e falhas de validação geram evento em `audit_logs`.

---

## Modelo de dados (schema `pominsecurity`)

As migrations em `supabase/migrations/` são aplicadas **em ordem**:

| Migration | O que adiciona |
|---|---|
| `…init` | schema, `scans`, enum de status, helpers |
| `…users` | `users` (papéis + status), `is_admin`/`is_member`, trigger de vínculo, bootstrap do master |
| `…scans_local_source` / `…scans_score` | origem local do scan + nota 0–100 |
| `…monitoring_config` | `monitor_settings`, `monitor_agents`, `status_components`, `compute_instances`, `domains`, `robots` + RLS |
| `…monitoring_timeseries` | métricas (time-series), `incidents`, `incident_updates`, `alerts` |
| `…monitoring_ingest` / `…component_metrics` | ingest de métricas + agregação por componente |
| `…supervisor` / `…robot_state_tuning` | estado de robôs |
| `…auto_incident_sla` / `…incident_damper_cache` | incidentes automáticos + SLA + damper |
| `…domain_ssl` | checagens de SSL/domínio |
| `…scans_admin_delete` | exclusão de scan (admin) |
| `…user_roles_granular` | papéis `viewer/operator/auditor` + `is_operator()` + RLS de escrita p/ operador |
| `…audit_log` | `audit_logs` imutável + triggers de captura + `is_auditor()` + RPC de evento |
| `…credentials_vault` | `credentials`/`credential_grants` (Cofre cifrado no Vault) + RPCs |
| `…api_tokens` | `api_tokens` (tokens pessoais de acesso à API) + RPCs de geração/revogação/validação + acesso a credenciais via API |

---

## Setup

### 1. Supabase
1. Aplique **todas** as migrations de `supabase/migrations/` em ordem (SQL Editor ou `supabase db push`).
2. Exponha o schema ao PostgREST: **Settings → API → Exposed schemas** → adicione `pominsecurity`.
3. Deploy das edge functions:
   ```bash
   supabase functions deploy pominsecurity-admin-create-user
   supabase functions deploy pominsecurity-admin-update-password
   supabase functions deploy pominsecurity-agent-ingest
   supabase functions deploy pominsecurity-credentials-api
   supabase functions deploy pominsecurity-tv-monitor-public
   ```
4. (SSO opcional) habilite o provider **Azure** em Authentication → Providers. Usuários Microsoft também precisam estar cadastrados por e-mail.
5. (Boia SAC) seed no projeto **pominsac**: `insert into public.pominsac_systems (slug, name) values ('pominsecurity', 'PomInSecurity');`

### 2. Worker
```bash
cd worker
cp .env.example .env   # SUPABASE_URL, SUPABASE_ANON_KEY, POMINSECURITY_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
npm install
npm run dev            # :7461
```

### 3. Frontend (raiz)
```bash
cp .env.example .env   # VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_POMINSECURITY_WORKER_URL
                       # + VITE_POMINSAC_SUPABASE_URL / _ANON_KEY / _ATTACHMENT_TOKEN (boia SAC)
npm install
npm run dev            # :7460
```

---

## Rotas (frontend)

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Dashboard (visão geral) | qualquer ativo |
| `/pentests` · `/scan/:id` | Pentests + relatório | qualquer ativo (rodar: admin/operador) |
| `/preview` | Layout do relatório (exemplo) | público |
| `/admin/monitoring` | Monitoramento | admin/operador/auditor |
| `/admin/monitoring/config` | Configurar monitoramento | admin/operador |
| `/admin/incidents` | Incidentes | admin/operador (auditor: leitura) |
| `/admin/audit` | Auditoria / Logs | admin/auditor |
| `/admin/users` | Usuários | admin |
| `/api-tokens` | Tokens de acesso à API | qualquer ativo |
| `/status` | Status page pública | público |
| `/monitor/:token` | Monitor TV (exibição pública por token, sem login) | público |
| `/login` | Login | público |

Atalho **⌘K / Ctrl+K** abre a paleta de comandos (busca/navegação por capacidade).

---

## Inventário de portas
| Serviço | Porta |
|---|---|
| frontend (SPA) | 7460 |
| worker (API) | 7461 |

---

## Segurança
- Nenhum secret de servidor no bundle (`VITE_*` é público por design). `service_role` e a chave Anthropic vivem **só no worker/edge functions**.
- O GitHub token trafega só na chamada `POST /scan` e **não é persistido**.
- **RLS por papel**: leitura de scans/monitoramento p/ membros ativos; escrita de monitoramento/incidentes p/ `is_operator()`; gestão de usuários p/ admin; escrita de scans só via worker (`service_role`).
- **Worker** valida o JWT e exige `admin`/`operador` (`authorizeRoles`) antes de enfileirar um scan.
- **Auditoria** imutável (append-only) com máscara de dados sensíveis.
- Edge functions `pominsecurity-admin-*` checam `is_admin()` antes de tocar `auth.users`.

> Execute pentests apenas em alvos que você está **autorizado** a testar. As checagens dinâmicas são de leitura/não-intrusivas por design.

---

## Como testar
1. `http://localhost:7460/preview` — renderiza o layout do relatório sem precisar de scan; valide o **Salvar PDF**.
2. Login com um usuário de `pominsecurity.users` (o master `robson@solutta.com` é criado no 1º acesso à tela de login).
3. **Novo scan** (admin/operador) → nome, URL, repo (`owner/repo`) e token read-only se privado. A lista faz polling; ao concluir, abra o card e exporte o PDF.
4. Faça uma alteração de config/usuário e confira o registro em **Auditoria**.

### Verificação de build
- `worker`: `npm run typecheck` ✓ · build ✓ · `GET /health` ✓ · `POST /scan` sem auth → 401 ✓
- `frontend`: `npm run build` (tsc + vite) ✓
