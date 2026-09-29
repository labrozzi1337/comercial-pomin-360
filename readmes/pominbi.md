# PominBI

**Plataforma de Business Intelligence do Grupo Pomin.** O PominBI transforma qualquer fonte de
dados — bancos relacionais ou APIs REST — em **dashboards profissionais em minutos**, sem exigir
conhecimento técnico avançado. Ele lê a estrutura dos dados, classifica os campos, **sugere
automaticamente os gráficos** mais adequados e ainda traz dashboards prontos (templates) para
cenários comuns como acompanhamento de tickets.

> Pense num "Power BI simplificado" interno do grupo: conecta, descobre, monta e compartilha.
> Faz parte do ecossistema Auditto/Pomin e segue os mesmos padrões do **PominAI** (layout, tema,
> autenticação, permissões) e a `soul/constitution.md`.

---

## O que ele resolve

- **Conectar é trivial.** Cadastre um banco (PostgreSQL hoje; MySQL/SQL Server na fase 2) ou uma
  API REST e teste a conexão na hora.
- **Descoberta automática.** Ao sincronizar a estrutura, cada campo é classificado (Texto, Número,
  Moeda, Percentual, Boolean, Data, DataHora) e o sistema **sugere os gráficos** que fazem sentido.
- **Dashboards sob medida.** Um construtor visual (drag & drop + redimensionamento) para montar
  painéis com KPIs, tabelas, pizza/rosca, barras, linha, área e combinações.
- **Templates prontos.** Dashboards pré-configurados que ligam direto em fontes do grupo:
  - **Tickets (PominSAC)** — operação de chamados com SLA, status, categorias e produtividade.
  - **Movidesk** — BI consolidado das 4 contas Movidesk (Solutta, Auditto, Alerta Fiscal,
    Monittore) com sincronização incremental e filtros por colaborador, urgência, categoria,
    serviço e time.
  - **Solutta Fiscal** — fechamento "Fiscal x Atendimento" lido direto no CRM do Auditto
    (MySQL): confronta o **prazo** de cada empresa com a **evidência de liberação** no
    `controle_log` e traz as **ocorrências** com data de registro, tudo separado por
    Categoria/Classificação.
- **Governança.** Autenticação (email/senha + Microsoft SSO), papéis (admin/usuário), RLS em todas
  as tabelas e credenciais de integração **cifradas em repouso** — nunca no bundle do cliente.

---

## Módulos

| Módulo | O que faz |
|---|---|
| **Integrações** | Cadastro/teste de bancos e APIs; sincronização de estrutura; painel Movidesk. |
| **Descoberta** | Classificação de campos + sugestão de gráficos com pré-visualização real. |
| **Dashboards** | Lista, criação, duplicação e o **builder** visual (react-grid-layout). |
| **Templates** | Modelos prontos (Tickets, Movidesk; Financeiro/Vendas/RH/Projetos como roadmap). |
| **Usuários** | Administração de contas, papéis, bloqueio e troca de senha (auth compartilhado). |
| **Suporte (SAC)** | Botão de chamado no header, integrado ao PominSAC (ver `soul/skill/suporte.md`). |

---

## Stack

- **Front-end:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Recharts
- **Builder:** `react-grid-layout` (drag & drop + resize)
- **Back-end:** Supabase (Postgres + Auth + Edge Functions Deno), **compartilhado** entre os
  projetos do grupo. Isolamento por **prefixo de tabela** `pominbi_*`.
- **API própria:** Next.js (pasta `api/`) para o que precisa sair da Supabase — hoje o CRM
  MySQL do Auditto. Roda no mesmo host do front, servida sob `/api`.

---

## Como rodar

> Requer **Node 20.19+** (o Vite 7 não roda no Node 18). O build em Docker usa `node:20-alpine`.

```bash
npm install
cp .env.example .env   # preencha as variáveis
npm run dev            # http://localhost:7445
```

### Variáveis de ambiente (`.env`)

| Variável | Onde | Descrição |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | cliente | URL do Supabase compartilhado |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | cliente | Anon key (pública por design) |
| `VITE_POMINSAC_ATTACHMENT_TOKEN` | cliente | Token do anexo do SAC (screenshot) |
| `POMINBI_ENCRYPTION_KEY` | **servidor** | Chave AES p/ cifrar credenciais de integração |
| `SOLUTTA_/AUDITTO_/ALERTA_FISCAL_/MONITTORE_APP_SECRET_KEY` | **servidor** | Tokens Movidesk (por conta) |
| `AUDITTO_DB_HOST/PORT/USER/PASSWORD/CRM/CONTAS` | **servidor** | MySQL do Auditto, lido pelo backend Next (dashboard Solutta Fiscal) |

As variáveis de servidor também devem ser secrets nas Edge Functions:

```bash
supabase secrets set POMINBI_ENCRYPTION_KEY=… \
  SOLUTTA_APP_SECRET_KEY=… AUDITTO_APP_SECRET_KEY=… \
  ALERTA_FISCAL_APP_SECRET_KEY=… MONITTORE_APP_SECRET_KEY=…
```

---

## Banco de dados (migrations `pominbi_*`)

Idempotentes, RLS ativa, helpers `SECURITY DEFINER`. Aplicar em ordem (SQL Editor ou pipeline):

1. `pominbi_init` — usuários, auth trigger e **backfill** dos usuários existentes.
2. `pominbi_integrations` — integrações (credenciais cifradas) e campos descobertos.
3. `pominbi_dashboards` — dashboards, widgets e compartilhamento.
4. `pominbi_tickets_rpc` — RPCs `SECURITY DEFINER` que agregam `pominsac_tickets`.
5. `pominbi_auth_lookup` — helpers de admin (lookup em `auth.users`).
6. `pominbi_movidesk` (+ `_filters`) — tabela e RPCs do dashboard Movidesk.
7. `pominbi_sac_system` — seed do sistema `pominbi` em `pominsac_systems` (habilita o SAC).
8. `pominbi_db_targets` — **legado**. Guardava a conexão do CRM do Auditto enquanto o dashboard
   Solutta Fiscal rodava em Edge Function; hoje a credencial vem do `.env` do servidor. A tabela
   segue aplicada, sem uso.

Edge Functions: `supabase functions deploy` (db-test/introspect/query, integration-save,
admin-create-user/update-password, movidesk-sync).

### Dashboard Solutta Fiscal

Lê o CRM do Auditto ao vivo — não guarda nada no Supabase. Quem consulta é o
**backend Next** (`api/`), não uma Edge Function: ele roda no mesmo host do
front, alcança o MySQL do Auditto direto e lê as credenciais do `.env` do
servidor. A rota é `POST /api/solutta-fiscal`, com três ações: `periods`
(competências), `snapshot` (a competência inteira) e `history` (série enxuta de
até 24 competências, para o comparativo anual/YoY). A agregação roda no cliente
(`src/lib/soluttaFiscal.ts`), então os filtros respondem sem ida ao servidor.

Regras do modelo:

- **Prazo** = `controle.data`, a data definida para o fechamento da empresa.
- **Liberação** = primeiro registro em `controle_log` que entra numa natureza de
  liberação. As descrições mudam de mês para mês, então os marcos
  (fiscal → atendimento → contábil) são classificados por palavra-chave, e
  alcançar um marco implica os anteriores.
- **Categoria/Classificação** = `controleClassificacao` (`Unidade|Responsável`).

Configuração — no `.env` do servidor (o serviço `api` do compose lê via
`env_file`), nunca no bundle do cliente:

```bash
AUDITTO_DB_HOST=…      # host "adega" do db.inc.php
AUDITTO_DB_PORT=50480  # atenção: 50480, não 40480
AUDITTO_DB_USER=…
AUDITTO_DB_PASSWORD=…  # entre aspas: a senha tem '#', que abriria comentário
AUDITTO_DB_CRM=crm
AUDITTO_DB_CONTAS=contas
```

Autenticação: a rota exige sessão válida do Supabase **e** perfil ativo em
`pominbi_users` — a mesma regra que a Edge Function aplicava. Basta a anon key;
o backend não usa service role.

## Arquitetura (resumo)

```
Vite SPA  ──auth/CRUD──▶  Supabase (Postgres, prefixo pominbi_*)
   │   │                      ▲
   │   │  invoke()            │ RPC SECURITY DEFINER (agregados)
   │   ▼                      │
   │  Edge Functions (Deno) ──▶ Postgres externo / API Movidesk / pominsac_tickets
   │
   └──fetch /api──▶  Next (api/, mesmo host)  ──▶  CRM MySQL do Auditto
```

- Bancos externos e a API Movidesk **não** são acessados pelo browser — passam por Edge Functions
  que cifram credenciais e usam queries parametrizadas.
- O CRM do Auditto é a exceção: fica atrás do backend Next, que roda na mesma rede do servidor e
  autentica o chamador pela sessão do Supabase antes de consultar.
- Dados sensíveis de outros projetos (ex.: `pominsac_tickets`) são lidos **só como agregados** via
  RPC `SECURITY DEFINER`, respeitando a RLS.

---

## Permissões

- **Admin:** cria/edita/exclui integrações e dashboards, sincroniza fontes, gerencia usuários.
- **Usuário:** visualiza dashboards, aplica filtros, exporta (export na fase 2).

## Roadmap

Export PDF/Excel/CSV/PNG · compartilhamento/versionamento · conectores MySQL/SQL Server ·
descoberta de campos de API · consultas em linguagem natural (IA → query → gráfico → dashboard).

## Como testar

```bash
npm run lint
npm run build
npm run dev
```
