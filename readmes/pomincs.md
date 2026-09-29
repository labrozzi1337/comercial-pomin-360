# Pomin CS — Customer Success

Plataforma de Customer Success do Grupo Pomin: clientes, contratos, pesquisas NPS/CSAT,
jornada, tarefas, tickets e receita recorrente. Mesmo layout, tema e padrões de
arquitetura/segurança do **pominai** (Vite + React + TS + Supabase).

## Stack

- **Vite + React 18 + TypeScript**, Tailwind + shadcn/ui (copiados do pominai)
- **Supabase** (Auth + Postgres + RLS) — compartilha o projeto `dwbmfcvvlbjejyyodtol`
- Tabelas, enums e funções com prefixo `pomincs_` (coexistem com os demais apps)

## Rodar

```bash
npm install
npm run dev     # http://localhost:7443
npm run build   # produção
npm run lint
```

O `.env` reaproveita as credenciais Supabase do pominai (mesma `anon key` pública).

## Login

Acesso é **link-only**: um usuário só entra se tiver uma linha pré-provisionada em
`pomincs_users` com o mesmo e-mail da conta `auth.users`. O trigger
`pomincs_handle_new_user` apenas vincula (não cria) perfis — sem auto-cadastro.
Admin inicial: `robson.pontes@auditto.com.br` (senha da conta Supabase existente).

## Segurança (soul/security.md)

- RLS habilitada em **todas** as tabelas `pomincs_*`.
- Trigger de signup **link-only blindado**; guard anti-escalonamento em `pomincs_users`
  (usuário não altera o próprio `role`/`status`/`email`).
- Nenhuma função `SECURITY DEFINER` executável por `anon`; `search_path` fixo.
- Leitura/escrita das tabelas de negócio liberada só para **membros ativos**
  (`pomincs_is_member`), nunca `USING(true)`.
- Advisor de segurança: **0 ERROR**, 0 exposição a `anon` para o schema `pomincs`.

## Módulos — todos funcionais (dados reais do Supabase)

| # | Módulo | Detalhe |
|---|--------|---------|
| 1 | Dashboard | KPIs reais + snapshot documentado (`pomincs_metricas`) |
| 2 | Clientes | 694, filtros core/status, distribuição, export CSV |
| 3 | Contatos | 1.878, busca |
| 4 | Contratos | 694, MRR/TCV por status (bate o doc) |
| 5 | Pesquisas | Enviar (wizard 6 etapas), Painel NPS (53 · 639/206/124), Painel CSAT (4,81) |
| 6 | Jornada | Jornada do Cliente (esteira), Clientes por Etapa, Gestão de Jornadas |
| 7 | Tarefas | Board Kanban (drag & drop), Acompanhamento, Gráficos, Cobertura |
| 8 | E-mails | Caixa (conectar conta), Disparados, Templates |
| 9 | Agenda | Calendário semanal com eventos |
| 10 | Financeiro | Métricas + distribuição por status (base vazia = "Nenhum registro") |
| 11 | Tickets | 104, resumo por status |
| 12 | Tracking | Gráficos, Mapeamentos, Script (copiável), Logs |
| 13 | Playbooks | Playbooks, Categorias, Execuções |
| 14 | Gerencial | Permissões (CRUD usuários, admin), Config, Equipes, Integrações |
| 15 | Logs de Integração | Histórico de sincronizações com filtro |
| 16 | Importações | Upload + histórico de importações |

## Dados

**Clientes, contatos e contratos são REAIS**, importados das exportações CustomerX em
`public/import/*.xlsx` (2026-07-05): 694 clientes (356 ativos / 42 finalizados /
290 cancelados / 6 sem contrato, core Alerta e Auditto), 1.878 contatos e
694 contratos — todos vinculados por código, com CNPJ, cidade/UF, ARR, LTV,
NPS/CSAT por cliente, vigência, vendedor e motivo de cancelamento.
MRR ativo real: R$ 812.348,72.

Os módulos demonstrativos (tickets, tarefas, agenda, e-mails, tracking, playbooks,
respostas de pesquisa) usam seed vinculado aos clientes reais; as métricas de
cabeçalho do Dashboard vêm de `pomincs_metricas` (NPS 53, CSAT 4,81, etc.).

## Performance

Rotas com code-splitting (`lazy` + `Suspense`) e vendors separados
(`vendor-react`, `vendor-supabase`) — recharts só carrega nas páginas com gráfico.

## Login

E-mail/senha ou **Entrar com Microsoft** (OAuth azure). Acesso é link-only:
o e-mail precisa estar pré-cadastrado em `pomincs_users` por um admin.

## Estrutura

```
src/
  components/
    layout/         AppLayout, AppSidebar (16 módulos c/ submenus)
    ui/             shadcn (herdado do pominai)
    ui-kit/         PageContainer, StatCard, ModuleStub
  integrations/supabase/  client + types (pomincs_*)
  lib/            pomincsStore (auth + data access), format
  pages/          Dashboard, Clientes, Contatos, Contratos, Tickets, Login, stubs
supabase/migrations/  DDL versionada
```
