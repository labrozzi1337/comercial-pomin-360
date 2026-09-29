# Reports CFO

> Plataforma de gestão de performance financeira com IA que conecta os números da empresa às pessoas responsáveis por eles.
> Todo desvio relevante evolui de número → explicação → responsável → plano de ação → impacto financeiro mensurável.

Fontes normativas do projeto: [`soul/constitution.md`](soul/constitution.md) (inegociável) e [`soul/arch.md`](soul/arch.md).
Desvios do `arch.md` estão documentados em [`docs/adr/`](docs/adr/). Resumo de arquitetura em [`docs/architecture/overview.md`](docs/architecture/overview.md).

## Visão geral

- **Dados → Indicadores → Desvios → Explicações → Responsáveis → Planos de ação → Impacto esperado → Impacto realizado → Acompanhamento do CFO.**
- Dois papéis: **CFO** (tudo da própria organização) e **Gestor** (apenas suas áreas). Uma organização por instância.
- 12 áreas financeiras com dashboards próprios (Controladoria, Contas a Pagar/Receber, Tesouraria, FP&A, Faturamento, Fiscal, Contabilidade, Crédito e Cobrança, Compras, Custos, Comercial).
- Relatório do gestor por **conversa guiada**: o sistema já conhece os números e pergunta o que explica cada desvio, se é pontual ou recorrente, causa, impacto e ação. Cada resposta vira dado estruturado. Perguntas e anexos no meio do fluxo vão para a IA (com as ferramentas de leitura); respostas seguem o guia. Score de qualidade determinístico (0–100).
- Ao concluir as etapas, o gestor **gera o documento final** (`POST /reports/{id}/document`): narrativa em Markdown (IA, com fallback determinístico), nota gravada e **propostas** de atualização de planos/metas e novas tarefas — cada uma confirmada pelo gestor. O documento pode ser editado à mão (`PATCH /reports/{id}` com `narrative`) ou revisado pela IA (`POST /reports/{id}/document/revisions`, devolve rascunho).
- Gestor acompanha suas tarefas compromissadas (planos de ação) em um **kanban** com arrastar-e-soltar em `/action-plans`.
- **Metas**: o CFO atribui a uma **área** inteira (sem responsável) ou a uma **pessoa**; o gestor **sugere** e a meta só passa a valer depois da aprovação do CFO (`POST /goals/{id}/review`) — enquanto pendente, fica fora de dashboards e do progresso. Cada meta aceita um **checklist de dois níveis** (item e etapas), com data por item; concluir todas as etapas conclui o item, e o progresso da meta passa a vir do checklist quando não há indicador vinculado.
- O chat e a geração do relatório enxergam **apenas a área daquele relatório** e o gestor responsável — um gestor com várias áreas nunca vê metas ou tarefas de outra área ali (`activeGoalsForArea`, `listActionPlans` com `areaId`, e as ferramentas de leitura presas ao `scope.areaId`).
- **Indicadores pelo relatório**: a conversa do período abre perguntando o **realizado de cada indicador da área** que ainda não tem valor (com budget e período anterior como referência). O valor gravado guarda quem informou e **em qual relatório** (`indicator_values.report_id`), e o envio trava enquanto houver indicador sem atualização. A página `/indicators` é um grid de cards (realizado, meta, variação, status) e cada card abre um **histórico paginado** (`GET /indicators/{id}/entries`) com valor, meta, variação, quem registrou, o relatório de origem e a justificativa daquele período — mesma visão para o CFO e para o responsável; quem não responde pela área recebe 404.
- **Envio com validações**: além de resumo e desvios justificados, o envio trava se houver **tarefa atrasada sem justificativa** na área (`action_plans.justification`); no quadro, mover para *Bloqueado* exige o motivo. No envio, o relatório recebe **sinalizações executivas** (`reports.flags`: desvio crítico, recorrente, nota baixa, tarefas atrasadas, evolução/queda vs. anterior, entregue por substituto) que o CFO vê na lista, além de um **ranking de gestores** por nota média e pontualidade.
- O documento inclui **comparativo com o período anterior** (`previousReportId`): desvios novos, persistentes e resolvidos, e a nota anterior.
- **Cobertura e ausências** (`coverages`): o gestor marca férias/afastamento indicando substituto por área (ou todas), com período ou sem fim; o CFO delega por qualquer titular em *Usuários*. Durante a cobertura, `resolve_access` inclui as áreas cobertas para o substituto; relatórios que ele cria saem **em nome do** titular (`reports.on_behalf_of_user_id`), contam como entrega do titular (sem "atrasado") e ganham o selo *coberto*. Encerrar devolve tudo ao titular na próxima request.
- **Notificações** (`GET /notifications`): derivadas do estado atual — prazo do ciclo, relatório atrasado, tarefas atrasadas/bloqueadas, metas aguardando aprovação ou avaliadas, feedbacks não lidos e coberturas — no sino da barra superior; somem sozinhas quando o assunto é resolvido.
- **Ditado por voz** no chat via Web Speech API do navegador (pt-BR), sem dependência nem custo; o botão só aparece onde há suporte.
- A **nota** é calculada na geração do documento e aparece no painel lateral, com o detalhe por critério. As atualizações de tarefas e metas derivadas do relatório são aplicadas no **envio** (`POST /reports/{id}/submit`), que devolve o resumo do que mudou — ver adendo no [ADR 0005](docs/adr/0005-ia-tools-estreitas-e-generative-ui-tipada.md).
- **Atalhos de demonstração** (só no dev server; `POST /reports/{id}/demo` responde 404 quando `NODE_ENV=production`): *Simular* preenche a conversa com respostas construídas a partir dos números reais do relatório até liberar a geração; *Reiniciar* apaga seções, resumo, documento, nota e mensagens — planos de ação originados no relatório são **cancelados**, nunca excluídos (o `REVOKE DELETE` protege o histórico).
- **Esteira de desenvolvimento** (menu *Desenvolvimento*, só CFO): quadro que leva uma demanda do próprio Reports CFO de *Demandas → Análise → Produto → Desenvolvimento → Teste → Aceite → Produção*, no mesmo fluxo da esteira do pomindev, mas com um único sistema (este). Cartão com tipo/prioridade/responsável, plano técnico gerado pela IA (`POST /dev/items/{id}/plan`, com fallback para edição à mão), branch/PR registrados e histórico de cada passo. Cancelar não apaga (`REVOKE DELETE`), e o Aceite trava enquanto o cartão não tiver plano ou PR.
- **Claude local na esteira** (só no dev server; em produção os dois endpoints respondem 404): no cartão, *Gerar plano com IA* (`POST /dev/items/{id}/plan`) roda o **Claude Code desta máquina** em modo leitura (`--restricted`: sem shell, sem edição) e grava o plano técnico; *Desenvolver com IA* (`POST /dev/items/{id}/develop`) exige o plano, deixa o Claude escrever o código **na cópia local** com as ferramentas limitadas a edição de arquivo e aos comandos do próprio repositório, guarda o resumo da execução no cartão e o move para *Teste*. Ele não faz commit nem push: quem revisa o diff e publica é você. Os dois botões respondem na hora (202) e **já movem o cartão** para a coluna do trabalho — *Produto* ou *Desenvolvimento* —, onde ele fica com o rótulo *Produtizando com IA… / Desenvolvendo com IA…* e um spinner, visível no quadro sem abrir nada; o trabalho corre no servidor e a tela se atualiza sozinha.
- **Automático até o Aceite** (`POST /dev/items/{id}/auto`, ou a caixa *Fazer agora* ao criar a demanda): o mesmo `auto_advance` da esteira do pomindev — a IA encadeia plano → código → **teste automático** e **para no Aceite**, que segue sendo decisão de gente. O teste automático roda `pnpm lint`, `typecheck` e `test` de verdade e manda o resultado com o diff para o Claude julgar (`VEREDITO: APROVADO/REPROVADO`); reprovado, o cartão volta para Desenvolvimento com o laudo e a IA tem **uma** rodada de correção antes de parar e chamar você (`awaiting_human`). A corrida acontece no servidor, um passo por transação, então o quadro mostra o cartão trocando de coluna ao vivo. Credencial: `CLAUDE_CODE_OAUTH_TOKEN` no `.env` (ou a sessão já logada do Claude Code); `DEV_CLAUDE_BIN` aponta o binário quando o `nvm` o esconde do PATH do servidor.
- **Sem internet, quem trabalha é o modelo local** (Ollama, na própria máquina): a esteira escolhe sozinha — Claude Code quando há rede, modelo local quando não há (`DEV_AI_PROVIDER=auto|claude|ollama`, modelo em `DEV_OLLAMA_MODEL`, padrão `llama3.2:3b`). O modelo local não tem ferramentas: o contexto vai pronto no prompt (mapa do repositório e os arquivos que o plano cita) e o código volta em blocos, gravados só dentro da árvore. O assistente do produto tem a mesma rede de proteção: se a chamada à Anthropic falhar **por conexão**, a rodada é refeita no Ollama (`REPORTS_CFO_OLLAMA_MODEL`) e a resposta sai marcada como vinda do modelo local — erro de credencial ou de limite continua sendo erro. Modelo pequeno inventa número com naturalidade: use o modo local para demonstrar o fluxo, não para decidir.
- **IA auditável**: LLM nunca acessa o banco; só ferramentas estreitas com a autorização do usuário. Mutations viram propostas que o usuário confirma. Generative UI tipada (registry fechado).
- Importação CSV/XLSX controlada: upload → validação → preview → mapeamento → confirmação idempotente.

## Arquitetura e monorepo

```
apps/web        React 19 + Vite 7 + TypeScript strict + Tailwind v4 + shadcn-style UI + React Router 7 + TanStack Query 5
apps/api        Next.js 15 (route handlers /api/v1) — toda a lógica de negócio, autorização e IA
packages/contracts   Zod: request/response/Generative UI/tools (fonte única de tipos)
packages/db          Drizzle schema (schema PostgreSQL reports_cfo), migrations, seed
packages/shared      money (decimal.js), variância, períodos, score, catálogo de áreas
infra/               Docker (PostgreSQL 16, nginx), init de roles
docs/                ADRs, arquitetura, OpenAPI gerado
```

Fluxo por request: `Bearer JWT → verifyToken → memberships (banco) → transação com contexto RLS → serviço → PostgreSQL`.
O token carrega apenas o `sub`; papel e áreas são recarregados do banco a cada request (ADR 0003/0004).

## Pré-requisitos

- Node.js ≥ 22, pnpm ≥ 10 (`corepack enable`)
- Docker Desktop (PostgreSQL local)

## Primeiro boot

```bash
cp .env.example .env            # ajuste REPORTS_CFO_JWT_SECRET (openssl rand -base64 48)
pnpm install
docker compose up -d            # PostgreSQL 16 + roles reports_cfo_owner / reports_cfo_app
pnpm db:migrate                 # aplica packages/db/drizzle/* como owner
pnpm db:seed                    # Acme Finance Demo (dados 100% fictícios)
pnpm dev                        # web em http://localhost:5173, api em http://localhost:3001
```

Logins do seed (senha `SEED_PASSWORD`, padrão `Demo@2026`):

| Papel  | E-mail             | Áreas                                     |
|--------|--------------------|-------------------------------------------|
| CFO    | cfo@acme.demo      | todas                                     |
| Gestor | rafael@acme.demo   | Controladoria, Custos, Contabilidade      |
| Gestor | marina@acme.demo   | Tesouraria, Contas a Pagar                |
| Gestor | caio@acme.demo     | Contas a Receber, Crédito e Cobrança      |
| Gestor | julia@acme.demo    | FP&A, Faturamento, Fiscal                 |
| Gestor | bruno@acme.demo    | Compras, Comercial                        |

## Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` / `pnpm dev:web` / `pnpm dev:api` | Sobe web (Vite, proxy `/api` → 3001) e api (Next) |
| `pnpm lint` · `pnpm typecheck` · `pnpm test` | Lint (0 warnings), tsc em todos os pacotes, testes unitários (Vitest) |
| `pnpm test:integration` | Testes de integração e segurança contra o banco `reports_cfo_test` (RLS real) |
| `pnpm test:e2e` | Playwright (requer `pnpm dev` rodando e seed aplicado) |
| `pnpm db:generate` | Gera migration SQL a partir de `packages/db/src/schema.ts` (drizzle-kit) |
| `pnpm db:migrate` · `pnpm db:seed` · `pnpm db:reset` | Migrations, seed de desenvolvimento, reset do schema (nunca em produção) |
| `pnpm --filter @reports-cfo/api openapi` | Regenera `docs/api/openapi.json` a partir dos contratos Zod |
| `pnpm build` | Build de web (Vite) e api (Next standalone) |

## Variáveis de ambiente

Veja [`.env.example`](.env.example). Regras:

- **Backend**: `DATABASE_URL` (role `reports_cfo_app`, `NOBYPASSRLS`), `DATABASE_OWNER_URL` (só migrations/seed), `REPORTS_CFO_JWT_SECRET` (≥ 32 bytes), `REPORTS_CFO_AI_PROVIDER`, `REPORTS_CFO_ANTHROPIC_API_KEY`, `REPORTS_CFO_AI_MODEL` (padrão `claude-opus-5`).
- **Frontend**: apenas `VITE_*` (público). Nenhuma secret jamais vai para `VITE_*`.
- Sem chave de IA, o assistente responde `503 AI_UNAVAILABLE`; o chat guiado do relatório continua funcional (guia determinístico).

## Autenticação e RBAC

- Provider local (ADR 0004): senha com `crypto.scrypt` (stdlib), JWT HS256 via `jose`, TTL curto, rate limit no login.
- Interface `IdentityProvider` isola a autenticação para futura troca por Supabase Auth ou OIDC (Entra ID / Google).
- Autorização em três camadas: `roles` por rota → checagens explícitas de escopo nos serviços → **RLS no PostgreSQL** com `set_config` transacional (`app.user_id`, `app.organization_id`, `app.role`, `app.area_ids`). Matriz em [`docs/architecture/permissions.md`](docs/architecture/permissions.md).
- IDOR responde `404` (sem enumeração). Body sempre `strictObject` (mass assignment bloqueado).

## Banco de dados

- PostgreSQL 16 em Docker; schema `reports_cfo`; `NUMERIC(18,2)` para dinheiro; `TIMESTAMPTZ`; `DATE` para períodos; status explícito (sem soft delete).
- Duas roles: `reports_cfo_owner` (migrations) e `reports_cfo_app` (aplicação, mínimo privilégio, sem `DELETE` em tabelas financeiras/auditáveis).
- Migrations em `packages/db/drizzle/` (geradas + `0001_rls_and_security.sql` com funções de contexto e 48 policies). Modelo em [`docs/architecture/domain-model.md`](docs/architecture/domain-model.md).

## IA, tools e Generative UI

- `apps/api/src/modules/ai/`: gateway (loop de tools, máx. 6 iterações), adapters de provider (Anthropic; `disabled`), registry de tools com schema Zod → JSON Schema, auditoria em `ai_tool_executions` e `ai_usage` (tokens, latência, custo estimado).
- Tools de leitura chamam os mesmos serviços da API com o `AccessContext` do usuário. Tools `propose*` nunca executam: devolvem propostas tipadas; a UI confirma via REST.
- Respostas validadas por `aiStructuredReplySchema`; o frontend renderiza apenas os 11 componentes do registry (`features/genui/renderer.tsx`). Nenhum HTML/JSX vindo da LLM.
- Conteúdo de tools/importações entra no prompt como `<data>` (dado, nunca instrução).

## Testes

- **Unitários** (`pnpm test`): money, variância, períodos, score, snapshot de indicador, guia determinístico, parsers de import.
- **Integração/segurança** (`pnpm test:integration`, banco isolado `reports_cfo_test`): JWT inválido/expirado/forjado, RBAC, IDOR entre gestores, cross-tenant, mass assignment, SQL injection, RLS direto no banco, ciclo completo de relatório com score, importação CSV idempotente, gateway de IA com provider fake (tool negada, denied, propostas).
- **E2E** (`pnpm test:e2e`): login CFO/gestor, visão executiva, bloqueio de rotas.

Rodar a integração localmente: `docker compose up -d && MIGRATE_DATABASE_URL=$DATABASE_TEST_OWNER_URL pnpm db:migrate && pnpm test:integration`.

## CI/CD e deploy

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml): install → lint → typecheck → unit → PostgreSQL (compose) → migrate → integração/segurança → `pnpm audit` → build web → build api. Falha bloqueia merge.
- Produção por instância: `docker compose -f docker-compose.prod.yml --env-file .env up -d --build` (postgres, job `migrate`, `api` standalone, `web` nginx com CSP e proxy `/api`).

## Estrutura de pastas (resumo)

```
apps/api/src/app/api/v1/**/route.ts   rotas finas (schema + handler)
apps/api/src/lib/                      http/handler, auth, db/RLS, audit, logger, env
apps/api/src/modules/<domínio>/        serviços (organization, indicators, dashboards, reports, action-plans, goals, feedbacks, ai, data, audit)
apps/web/src/pages/                    uma página por rota (lazy)
apps/web/src/features/                 dashboard, ai (chat, propostas), genui (registry)
apps/web/src/components/               layout (shell, sidebar, ⌘K), ui (shadcn-style), charts, kpi-card
```

## Troubleshooting

- `permission denied for database`: a role owner precisa de `CREATE` no database (feito pelo init script; em bancos existentes rode `GRANT CREATE ON DATABASE reports_cfo TO reports_cfo_owner`).
- Migrations não rodam em produção pelo `api`: use o serviço `migrate` (imagem `tools`).
- `503 AI_UNAVAILABLE`: configure `REPORTS_CFO_ANTHROPIC_API_KEY` no servidor. Nunca no frontend.
- Porta 5433 ocupada: altere `POSTGRES_PORT` e as URLs no `.env`.
- Reset total do ambiente local: `pnpm db:reset && pnpm db:migrate && pnpm db:seed`.
