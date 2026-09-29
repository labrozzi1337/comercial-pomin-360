# CRM Pomin

CRM comercial e operacional do Grupo Pomin. Uma instalação atende **várias empresas nossas**
(Solutta, Auditto…), cada uma com seus **projetos** (IRPF, Monittore, Alerta Fiscal…), e o cadastro
de pessoas, empresas e grupos é **compartilhado** entre todas — cada CPF/CNPJ existe uma única vez.

Fluxo que o sistema cobre, de ponta a ponta:

```
Lead → Oportunidade → Proposta → Aceite → Contrato → Assinatura → Homologação → Entrega → Cobrança → Pagamento
```

- **Modelo de dados** (camada global + vínculo por workspace): [RELACIONAMENTO_ENTIDADES.md](RELACIONAMENTO_ENTIDADES.md)
- **Padrões de engenharia** do projeto: [soul/](soul/) — `arch.md` e `constitution.md`

## Vocabulário (importa para ler o código)

| Termo no código | O que é |
|---|---|
| `workspace` | **Nossa** empresa (Solutta, Auditto). Nunca um cliente. |
| `project` | Produto/campanha dentro de um workspace (IRPF 2026, Monittore). |
| `empresa` | PJ do CRM — cliente ou prospect. |
| `entity` | PF (pessoa). |
| `business_group` | Grupo empresarial. **Toda empresa pertence a exatamente um** (isolada = grupo próprio). |
| `client` | "Sombra": a PJ/PF virou cliente **daquele** workspace. |
| `case` | Entrega/declaração em andamento. |

## Stack

- **Frontend** — Vite 8 + React 18 + React Router 7 + TypeScript + Tailwind + shadcn/ui + TanStack Query.
- **Backend** — Next.js 14 Route Handlers, exclusivamente nos endpoints `/v1/*` e `/api/health`.
- **Origem única** — em desenvolvimento o Vite faz proxy para o Next; em produção o Nginx faz o
  mesmo. Browser, links públicos, OAuth, iframes e webhooks continuam sob o mesmo domínio.
- **packages/shared** — enums de domínio, contratos Zod, herança de marca e templates de mensagem.
  Fonte única entre browser e servidor.
- **Banco** — Supabase Postgres, schema dedicado `pomincrm`, RLS em tudo.

`apps/_api-fastify-legado/` é o Fastify anterior à migração. Não roda, não faz parte do build —
está lá só como referência histórica.

## Como a autorização funciona

Modelo híbrido: **a RLS do Postgres é o guarda principal**, porque o browser fala direto com o
PostgREST. Os endpoints `/v1/*` existem só para o que não pode passar pelo cliente (segredo de
terceiro ou bypass de RLS) e revalidam o JWT.

```
Browser ──► Supabase PostgREST (RLS, JWT do usuário)      leitura e CRUD do dia a dia
   │
   └──────► /v1/* (Next route handlers) ──► Supabase       OCR, pagamento, e-mail, aceite público,
                                            (service_role)  webhook, criação de usuário
```

Três níveis de papel, e o acesso exige atribuição **explícita** em cada um:

| Nível | Onde | Efeito |
|---|---|---|
| Global | `user_roles` | `super_admin`/`admin` veem tudo e acessam `/admin`. `gerente`/`operacional`, não. |
| Workspace | `workspace_members.role` | `admin`/`gerente` configuram o workspace. **Sem linha aqui, o usuário não vê o workspace.** |
| Projeto | `project_members` | **Sem papel no projeto, o projeto não aparece** — nem seus clientes, propostas, entregas e cobranças. Só admin global escapa. |

Exclusão de empresas, projetos, clientes e grupos é **admin global**. Gerente administra, não apaga.
Quem cria um projeto recebe papel de `gestor` nele por trigger — senão o projeto sumiria da lista
no instante seguinte.

## Rodar local

Pré-requisitos: **Node 20.19+** e **npm** (workspaces). A versão recomendada está em `.nvmrc`.

```bash
npm install                 # na raiz, instala os workspaces
cp .env.example .env        # e preencha (ver abaixo)
npm run dev                 # http://localhost:8080
```

O `npm run dev` sobe o frontend Vite em `http://localhost:8080` e o backend Next na porta interna
`3333`. As chamadas relativas para `/v1` e `/api` passam pelo proxy do Vite; não há CORS nem uma
segunda origem visível para o navegador.

```bash
npm run typecheck    # tsc --noEmit em todos os workspaces
npm run build        # build de produção
npm start            # serve o build na 8080
```

### Variáveis de ambiente

O Vite lê o `.env` da raiz e expõe apenas chaves `VITE_*`. O script local entrega as demais chaves
ao Next sem colocá-las no bundle. `apps/web/.env.local` pode sobrescrever variáveis apenas para o
backend local. Ver [.env.example](.env.example).

| Grupo | Variáveis | Sem isso |
|---|---|---|
| Supabase público | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | o frontend não inicia |
| Supabase servidor | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | endpoints não funcionam |
| E-mail | `SENDGRID_SECRET`, `MAIL_FROM`, `MAIL_FROM_NAME` | envio desligado (a tela avisa) |
| Pagamento | `MB_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET` | gerar pagamento desligado |
| OCR | `GEMINI_API_KEY` | extração de documento desligada |
| Conversão de contrato | `PDF_CONVERTER_URL` | DOCX funciona, mas a geração de PDF fica indisponível |
| Arquivos | `B2_*` (Backblaze) | upload e logo desligados |
| Links | `APP_BASE_URL` | links públicos caem na origem da requisição |

## Banco de dados

- Schema dedicado `pomincrm`. Migrations SQL numeradas em [supabase/migrations/](supabase/migrations/).
- **Expor o schema**: Supabase → Settings → API → *Exposed schemas* → adicionar `pomincrm`.
  Sem isso o PostgREST não responde e o front sobe vazio.
- Projeto: `thxmihjinfljekyfpywm` — o Supabase **GrupoPomin**, compartilhado com `pomincost`,
  `pomind`, `pominbank`, `pomindrive`, `pominmkt` e `pominsecurity`. Ao mexer em configuração de
  projeto (schemas expostos, auth), **acrescente**, nunca substitua: derrubar a lista quebra os outros.
- Migrado em 15/08/2026 do projeto anterior `dmsseysapwkitvvlcdop`, onde o schema se chamava
  `crm_pomin`. As migrations em `supabase/migrations/` e `supabase/manual/` são o registro histórico
  daquele projeto e ainda dizem `crm_pomin` — não valem como bootstrap deste banco.
- **Migration só com aprovação explícita antes de aplicar** — regra do projeto, sem exceção.
- `audit_logs` é imutável: nem admin apaga. Um trigger genérico registra INSERT/UPDATE/DELETE de
  toda tabela do schema, com diff campo a campo — a auditoria não depende de instrumentar à mão.

## Integrações

| Serviço | Para que | Onde |
|---|---|---|
| Auditto → OpenCNPJ | enriquecer CNPJ (matriz, filiais, sócios). Fallback em cascata | `src/server/cnpj-*.ts` |
| Gemini | OCR de documento no cadastro e na importação | `src/server/gemini.ts` |
| SendGrid | proposta, cobrança e aviso de pagamento | `src/server/mail*.ts` |
| Mercado Pago | link de pagamento: PIX+débito, cartão, boleto | `src/server/mercadopago.ts` |
| Backblaze B2 | arquivos e logos (bucket privado, URL assinada) | `src/server/b2.ts` |

### Contratos

O aceite de uma proposta cria, de forma idempotente, um contrato em rascunho com todos os dados
já conhecidos. Campos obrigatórios ausentes ficam destacados no assistente e bloqueiam o avanço.
O pipeline segue `Rascunho → Em revisão → Aprovado → Enviado → Assinado → Homologado`; o contrato
assinado e os documentos gerados usam o cadastro e o armazenamento B2 já existentes no CRM.

A edição fica em **Comercial → Contratos** e as opções do módulo em **Configurações → Contratos**.
O template DOCX está em `apps/web/public/templates/`. A conversão para PDF usa o serviço Gotenberg
incluído no `docker-compose.yml`; no ambiente local ele pode ser iniciado com
`docker compose up pdf-converter`.

### Pagamento (Mercado Pago)

Usa **link de pagamento** (preference do Checkout Pro), não checkout transparente: o cliente paga
na tela do MP e nunca tocamos em dado de cartão. Cada meio libera só o que promete, via
`excluded_payment_types` — a cobrança nasce com o meio escolhido, e abrir a lista inteira faria o
cliente pagar por um meio que o financeiro não esperava.

O status **nunca** vem do corpo do webhook: ele traz só o id, e o pagamento é reconsultado na API
com o nosso token. Um POST forjado não marca cobrança como paga.

**Em localhost o webhook não chega** — o MP não alcança `localhost`, e o código detecta isso e omite
a `notification_url` (a tela avisa). Para testar a cadeia completa, exponha um túnel
(`npx cloudflared tunnel --url http://localhost:8080`) e aponte `APP_BASE_URL` para ele. Sem túnel,
use a baixa manual ("Pago" na lista de cobranças), que libera a entrega pelo mesmo trigger.

Em produção: `APP_BASE_URL` no domínio real, webhook cadastrado no painel do MP em
`<APP_BASE_URL>/v1/webhooks/mercadopago` com o evento *Pagamentos*, e `MP_WEBHOOK_SECRET` com o
segredo de lá. Teste sempre em **janela anônima**: logado na conta que recebe, o MP esconde os meios
de pagamento (ninguém paga a si mesmo).

## Deploy

```bash
docker compose up --build -d
```

O Compose sobe três serviços: `web` (Nginx + arquivos do Vite, porta `WEB_PORT`, padrão 8080),
`api` (Next, privado na rede Docker, porta 3333) e `pdf-converter` (Gotenberg). O Nginx encaminha
`/v1/*` e `/api/health` ao Next.
O Supabase é gerenciado e não sobe no compose. As `VITE_*` entram como build args; segredos entram
somente no processo Next em runtime pelo `env_file`.

## Estrutura

```
apps/web/
  index.html                  shell do Vite
  vite.config.ts              aliases e proxy local /v1 + /api → Next
  nginx.conf                  SPA + proxy de produção na mesma origem
  app/
    v1/                       backend Next: cnpj, ocr, arquivos, propostas, cobranças,
                              webhooks, administração
    api/health/               health check do backend
  src/
    main.tsx                  bootstrap React/Vite
    App.tsx                   mapa completo de rotas React Router
    screens/                  implementação de cada tela
    components/{layout,ui,cadastro,workspace,commercial,wizard,settings}
    contexts/                 Auth, Roles, Workspace, Project
    lib/                      acesso a dados por domínio (cadastro, comercial, propostas…)
    server/                   só servidor: integrações, env (Zod), auth do JWT
packages/shared/src/          enums, contratos, branding, templates de mensagem
supabase/migrations/          SQL numerado (37 migrations)
docs/                         mapas de paridade com os sistemas anteriores
soul/                         arch.md e constitution.md — como se escreve código aqui
```

Convenção que sustenta o resto: **`src/App.tsx` só roteia, `src/screens/` implementa e `app/` contém
somente o backend Next.** Assim nenhuma tela depende do framework do servidor.
