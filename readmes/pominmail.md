# PominMail — E-mail & Agenda do Grupo Pomin

Cliente de **e-mail** (envio/recebimento) + **agenda/calendário** interno do Grupo Pomin.
Baseado no layout e nos componentes do **pominstart** (Vite + React 18 + TypeScript +
Tailwind + shadcn/ui), usando as configurações de Supabase do **pominai**.

## Status

- **Fase 1 — Mockup (atual):** UI completa e navegável com dados **mock** em
  `localStorage`. Autenticação também é mock — entre com **qualquer e-mail/senha**
  ou clique no atalho da conta demo na tela de login
  (`demo@pominmail.com` / `pominmail`).
- **Fase 2 — Postmark:** integração real de envio e recebimento de e-mail via
  Postmark (edge functions) + persistência no schema dedicado `pominmail`.

## Rodando

```bash
cp .env.example .env   # já vem preenchido com o Supabase do pominai
npm install
npm run dev            # http://localhost:7454
```

Build de produção (nginx estático, igual aos apps irmãos):

```bash
docker compose up -d --build   # publica em :7454
```

## Estrutura

| Área | Arquivo |
|------|---------|
| Rotas | [src/App.tsx](src/App.tsx) |
| Shell / layout | [src/components/layout/](src/components/layout/) |
| E-mail (lista + leitura) | [src/pages/MailPage.tsx](src/pages/MailPage.tsx) |
| Compositor | [src/components/mail/ComposeDialog.tsx](src/components/mail/ComposeDialog.tsx) |
| Agenda | [src/pages/CalendarPage.tsx](src/pages/CalendarPage.tsx) |
| Visão geral | [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx) |
| Domínios (admin) | [src/pages/DomainsPage.tsx](src/pages/DomainsPage.tsx) |
| Caixas de e-mail (admin) | [src/pages/MailboxesPage.tsx](src/pages/MailboxesPage.tsx) |
| Dados mock (mail + agenda) | [src/lib/mailStore.ts](src/lib/mailStore.ts) |
| Domínios + checagem DNS | [src/lib/domainStore.ts](src/lib/domainStore.ts), [src/lib/dns.ts](src/lib/dns.ts) |
| Caixas, aliases e roteamento | [src/lib/mailboxStore.ts](src/lib/mailboxStore.ts) |
| Ponte IMAP/SMTP (serviço) | [bridge/](bridge/), cliente em [src/lib/mailBridge.ts](src/lib/mailBridge.ts) |
| Auth mock | [src/lib/pominmailStore.ts](src/lib/pominmailStore.ts) |

## Domínios

`/domains` (menu *Administração*, só admin) concentra os domínios de envio — vários domínios,
começando por **auditto.com.br**. Para cada um a tela mostra os registros que o Postmark exige
(SPF, DKIM, Return-Path, DMARC e, opcionalmente, o MX de recebimento) com botão de copiar, e o
**Verificar DNS** consulta o DNS público ao vivo por DNS-over-HTTPS (Google/Cloudflare) — a
checagem é real já na Fase 1. Guia de configuração: [docs/POSTMARK.md](docs/POSTMARK.md).

## Caixas de e-mail

`/mailboxes` (menu *Administração*, só admin) é onde os endereços são criados. Cada caixa tem
tipo (pessoal, compartilhada, funcional), aliases, encaminhamento com cópia, cota, assinatura,
resposta automática de ausência e a lista de pessoas com acesso — cada uma com convite e senha
provisória para o primeiro login. Para migrar em volume: **criar em lote** (colar lista ou
importar CSV), **seleção múltipla** (suspender/reativar/remover/exportar) e **exportar CSV**.

O **catch-all por domínio** e o **testar roteamento** respondem a pergunta que o recebimento faz
a cada mensagem: este endereço cai em qual caixa? A mesma regra está em SQL na função
`pominmail.resolve_recipient(text)`, que as edge functions de inbound usam na Fase 2.

## Caixas reais (Hostinger) — ponte IMAP/SMTP

As caixas hospedadas na **Hostinger** são usadas dentro do PominMail sem ninguém precisar
entrar no webmail: a Hostinger continua recebendo e guardando, e o app entra como cliente
IMAP/SMTP. Como navegador não fala IMAP, existe o serviço [bridge/](bridge/) — Node, sobe
junto no `docker compose`, guarda a senha da caixa **cifrada** (AES-256-GCM) e expõe ao app
só JSON. Ligar uma caixa: *Administração → Caixas de e-mail → aba Conexão*.

Passo a passo e limites da fase atual: [docs/HOSTINGER.md](docs/HOSTINGER.md).

## Backend (Fase 2)

Schema **dedicado** `pominmail`, isolado no Supabase compartilhado do pominai
(ref `dwbmfcvvlbjejyyodtol`) — nunca toca em `public.*` nem nos schemas dos apps
irmãos:

- Migrations: [20260806120000_pominmail_init.sql](supabase/migrations/20260806120000_pominmail_init.sql)
  e [20260815120000_pominmail_domains.sql](supabase/migrations/20260815120000_pominmail_domains.sql)
- Tabelas: `pominmail.users`, `accounts`, `labels`, `messages`, `attachments`, `events`, `domains`
- RLS por usuário + trigger de perfil em `auth.users` + RPC admin.
- **Importante:** exponha `pominmail` em *Project Settings → API → Exposed schemas*
  para o PostgREST enxergar o schema.
- Postmark: `POMINMAIL_POSTMARK_*` (server-side; secrets no Supabase). Ver `.env.example`.
