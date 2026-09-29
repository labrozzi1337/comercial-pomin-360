# PominBank

Cobranças, faturas e assinaturas do Grupo Pomin, integradas à **Iugu**.

Segue o molde dos demais apps `pomin*`: **front em Vite** (SPA, `web/`) e **back em
Next.js** (API routes, raiz). Visual e tokens de cor idênticos ao **pominstart**.

| Camada | Stack | Porta |
|---|---|---|
| Frontend | Vite + React + Tailwind + shadcn/ui | `7571` |
| Backend | Next.js 14 (App Router, API routes) | `7471` |
| Banco | Supabase `thxmihjinfljekyfpywm`, schema `pominbank` | — |
| Gateway | Iugu (`https://api.iugu.com/v1`) | — |

---

## Como rodar

```bash
npm install          # instala raiz + web (postinstall)
npm run dev:all      # sobe API (7471) e front (7571) juntos
```

Só a API: `npm run dev:api` · Só o front: `npm run dev:web`.

Em dev, o Vite faz proxy de `/api` para `http://localhost:7471`; em produção o
nginx do container `pominbank-web` faz o mesmo para `pominbank-api:7471`.

```bash
docker compose up -d --build
```

---

## Configuração

Tudo vive no `.env` da raiz (o `web/` lê as `VITE_*` em build time).

### Supabase
Já preenchido com o projeto `thxmihjinfljekyfpywm` — o mesmo do `pomind` e do
`pomindrive`. O backend usa **service role** com `db.schema = pominbank`; o front
usa a anon key **só para autenticar**.

### Iugu — o que você precisa preencher

| Variável | Onde achar |
|---|---|
| `IUGU_API_TOKEN` | Alia → Configurações → API/Integrações → Tokens de API |
| `IUGU_ACCOUNT_ID` | Alia → Configurações → Geral (opcional; habilita saldo/extrato) |
| `IUGU_WEBHOOK_URL` | URL pública deste app + `/api/webhooks/iugu?token=<IUGU_WEBHOOK_TOKEN>` |

`IUGU_WEBHOOK_TOKEN` já vem gerado. Ele é o segredo que protege o endpoint de
gatilhos — a Iugu não autentica as chamadas, então a conferência é desse token.

Com o token preenchido, entre em **Integração Iugu** no app e clique em
**Cadastrar gatilhos**: o app registra na Iugu todos os eventos que trata,
apontando para a sua URL. O botão é idempotente.

---

## Banco (schema `pominbank`)

Migration em [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — **já aplicada**.

```
users            perfis (espelham auth.users) — admin | finance | viewer
customers        clientes, espelho dos customers da Iugu
plans            planos de recorrência
subscriptions    assinaturas
invoices         faturas + invoice_items
webhook_events   log bruto de todo gatilho recebido, com status de processamento
settings         linha única de configuração (sobrepõe o .env)
audit_log        trilha de quem fez o quê
```

RLS **ligado e sem policies**: nada é lido direto do front. Todo acesso passa
pelo backend com service role. O schema está exposto no PostgREST junto dos
demais (`pomincost`, `pomind`, `pomindrive`, …) — nenhum foi removido.

### Primeiro acesso
O trigger `handle_new_user` cria o perfil no cadastro. O **primeiro** usuário do
schema nasce `admin`/`active` (bootstrap); os seguintes entram `viewer`/`pending`
e precisam ser liberados em **Usuários**.

---

## API

Toda rota (menos `/api/health` e o webhook) exige `Authorization: Bearer <access_token do Supabase>`.

| Método | Rota | Perfil |
|---|---|---|
| `GET` | `/api/health` | público |
| `GET/PATCH` | `/api/profile` | autenticado |
| `GET` | `/api/dashboard` | autenticado |
| `GET` | `/api/reports` | autenticado |
| `GET/POST` | `/api/customers` · `/api/customers/[id]` (`GET/PATCH/DELETE`) | leitura / escrita |
| `POST/DELETE` | `/api/customers/[id]/payment-methods/[pmId]` (padrão / remover) | escrita |
| `GET/POST` | `/api/plans` · `/api/plans/[id]` (`PATCH/DELETE`) | leitura / escrita |
| `GET/POST` | `/api/subscriptions` · `/api/subscriptions/[id]` (`GET/PATCH/DELETE`) | leitura / escrita |
| `POST` | `/api/subscriptions/[id]/{suspend,activate,sync}` | escrita |
| `GET/POST` | `/api/invoices` · `/api/invoices/[id]` | leitura / escrita |
| `POST` | `/api/invoices/[id]/{cancel,refund,duplicate,capture,sync}` | escrita |
| `POST` | `/api/sync` | escrita |
| `GET/POST` | `/api/iugu` (diagnóstico / cadastrar gatilhos) | autenticado / admin |
| `GET` | `/api/webhooks/events` · `POST /api/webhooks/events/[id]/reprocess` | admin |
| `POST` | `/api/webhooks/iugu?token=…` | Iugu (token) |
| `GET/PATCH` | `/api/settings` | autenticado / admin |
| `GET` | `/api/audit` | admin |
| `GET/POST` | `/api/admin/users` · `PATCH/DELETE /api/admin/users/[id]` | admin |
| `PATCH` | `/api/profile` · `POST /api/profile/password` | autenticado |

**Perfis:** `admin` (tudo) · `finance` (opera cobrança) · `viewer` (só leitura).

Listas aceitam `page`/`perPage`. Faturas, clientes e auditoria aceitam
`export=csv` — o CSV leva o filtro inteiro (teto de 5.000 linhas), não só a
página aberta, e sai com `;` + BOM para o Excel pt-BR abrir certo.

## Telas

| Tela | O que faz |
|---|---|
| Dashboard | KPIs do mês, recebimentos por mês, próximos vencimentos |
| Faturas | Lista com filtros de situação/período/busca, emissão, detalhe com itens, 2ª via, cancelamento, estorno |
| Assinaturas | Recorrências, suspender/reativar, trocar de plano, cancelar |
| Clientes | CRUD + ficha do cliente (totais, cartões salvos, faturas, assinaturas) |
| Planos | CRUD, ativar/desativar |
| Relatórios | Aging do contas a receber, inadimplência, ticket médio, ranking de clientes, mix de meios |
| Integração Iugu | Diagnóstico da conexão, saldo, gatilhos, importação, reprocesso de eventos |
| Auditoria | Trilha filtrável por área/usuário/período, com exportação |
| Usuários | Criar, definir perfil, ativar/bloquear, excluir |
| Configurações | Padrões de cobrança que valem para toda fatura nova |

O botão de perfil no cabeçalho abre **Meu perfil** (trocar nome e senha).

---

## Como o webhook funciona

A Iugu chama em `application/x-www-form-urlencoded`
(`event=invoice.status_changed&data[id]=…&data[status]=paid`). O endpoint:

1. confere o `?token=` em tempo constante (401 se não bater);
2. grava o evento cru em `webhook_events`;
3. **busca o objeto completo na API da Iugu** — o payload do gatilho é resumido e
   não serve como fonte da verdade;
4. espelha no banco (fatura, assinatura ou cliente) e marca o evento como
   processado.

Se o passo 3 ou 4 falhar, responde **200 mesmo assim** com o erro salvo no
evento: assim a Iugu não fica reenfileirando, e você reprocessa pela tela
**Integração Iugu**.

O token da Iugu nunca sai do servidor — o SPA só conversa com `/api`.

---

## Armadilha do Next que já mordeu aqui

O App Router substitui o `fetch` global por um com **Data Cache** próprio, que
persiste em `.next/cache` e sobrevive a restart. Como o supabase-js usa esse
`fetch`, uma consulta sempre igual (a do dashboard, por exemplo) passa a devolver
para sempre a resposta da primeira vez — na prática, **saldo velho na tela**, sem
erro nenhum. `dynamic = "force-dynamic"` não resolve: ele controla a rota, não o
cache do fetch.

Por isso os dois clients em [`src/lib/supabase/service.ts`](src/lib/supabase/service.ts)
passam um `fetch` com `cache: "no-store"`. Se um dia aparecer dado desatualizado
em alguma tela, é o primeiro lugar para olhar.
