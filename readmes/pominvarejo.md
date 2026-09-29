# PominVarejo — retaguarda de varejo

Retaguarda das lojas do Grupo Pomin: cadastro de **produto** (com tabela de preços,
tributação e níveis mercadológicos), **fornecedor** e **cliente**; **leitura das vendas
dos PDVs** (começando pela Zanthus) com armazenamento interno; **pedidos de compra**;
**entrada de notas**; e uma seção de **relatórios** em cima de tudo isso.

- **Front:** Vite + React + TypeScript + Tailwind (SPA) — porta **7572**
- **Back:** Next.js 14 (App Router, só `/api`) — porta **7472**
- **Banco/Auth:** Supabase — projeto `meovdvtdjjhmowoeurdg`, schema dedicado **`pominvarejo`**
- **Layout:** padrão PominStart (sidebar retrátil, breadcrumb, tema claro/escuro)

---

## Como roda

```bash
cp .env.example .env      # preencha as chaves do Supabase
npm install               # instala o back e, via postinstall, o front em web/
npm run dev:all           # sobe API (7472) e SPA (7572) juntos
```

Só a API: `npm run dev:api` · Só o front: `npm run dev:web`
Health check: <http://localhost:7472/api/health>

Em dev o Vite faz proxy de `/api` para o Next, então o front chama caminho relativo e
não existe CORS no meio.

---

## Arquitetura em uma frase

O SPA **nunca lê tabela direto**: usa o Supabase só para autenticar e manda o
`access_token` no `Authorization` para o Next, que valida a sessão, carrega o perfil em
`pominvarejo.users` e acessa o banco com **service role**. Por isso o RLS fica **ligado e sem
policies** — nem anon nem authenticated enxergam nada.

```
navegador ──JWT──► Next /api ──service role──► Postgres (schema pominvarejo)
    │                                              │
    └── Supabase Auth (só login)                   └── RLS on, zero policies
```

### Papéis

| Papel | Pode |
|---|---|
| `admin` | tudo, incluindo estabelecimentos, usuários, configurações e auditoria |
| `gerente` | cadastro mestre (produto/fornecedor/cliente/classificações) + movimento |
| `operador` | movimento: compras, entrada de notas, importação de PDV |
| `viewer` | somente leitura |

Conta nova nasce `viewer` + `pending` — um admin libera em **Usuários**. O papel nunca vem
de metadata do token.

---

## Modelo de dados (schema `pominvarejo`)

Inspirado no ERP websac (`produto`/`produtoestab`, `cupom`/`itcupom`, NF de entrada),
porém normalizado, em português e com UUID como PK. O `codigo` inteiro é a **chave de
negócio** — é o número que aparece na tela e o que vem dos PDVs.

**Cadastros**
`estabelecimentos` · `fornecedores` · `clientes` · `produtos` (+ `produto_precos`,
`produto_tributacao`, `produto_codigos`) · `tabelas_preco`
· classificações: `departamentos` › `grupos` › `subgrupos`, mais `categorias` (árvore),
`marcas`, `familias`, `unidades`, `ncms`

**PDV**
`pdvs` (terminais) · `pdv_importacoes` (trilha de cada leitura) · `vendas` + `venda_itens`
+ `venda_pagamentos`

**Compras**
`pedidos_compra` + `pedido_compra_itens` · `notas_entrada` + `nota_entrada_itens`

**Apoio**
`users` · `configuracoes` · `audit_log`

### Decisões que valem saber

- **Produto não tem coluna `ativo`** — o descontinuado é `fora_linha = true`, como no websac.
- **Preço mora fora do produto**: `produto_precos` é `(produto, tabela de preço, loja)`;
  loja nula vale para a rede inteira. O `preco_venda` no produto é referência.
- **Tributação é por UF de destino**, com a linha `'*'` como regra geral — só se cria linha
  por estado quando aquele estado tem tratamento próprio.
- **Total é sempre calculado no servidor** (venda, pedido, nota). A tela só mostra a prévia
  enquanto o usuário digita; o que grava é a conta do backend.
- **Item cancelado no cupom continua no cupom**, mas não entra em nenhum total.
- **Nota lançada trava**: ao passar para `status='lancada'`, um trigger soma a quantidade no
  estoque do produto e atualiza o custo de reposição pelo **custo final** (produto líquido +
  IPI + ICMS-ST + rateio de frete/seguro/despesas ÷ quantidade). Depois disso os itens não
  mudam mais.
- **Cupom não entra duas vezes**: a unique `(loja, pdv, cupom, data)` é o que faz a
  reimportação do mesmo período ser idempotente — o cupom repetido vira "duplicada", não erro.
- **Agregação é SQL, não Node**: os relatórios são funções `pominvarejo.rel_*` (`SECURITY
  INVOKER`, sem `EXECUTE` para anon/authenticated). Puxar milhões de linhas de venda para
  o backend só para somar não faria sentido.

Migrations em [`supabase/migrations/`](supabase/migrations/), aplicadas via Management API.

> Depois de rodar a migration, `pominvarejo` precisa estar nos **Exposed schemas** do projeto
> (Settings → API). Sem isso o PostgREST não enxerga as tabelas.

---

## Leitura de PDV

O pipeline de importação está inteiro pronto e é **agnóstico de fabricante**: cada driver
traduz o formato nativo para o formato canônico (`VendaPdvSchema`) e o resto do sistema não
sabe de qual marca a venda veio.

```
driver (zanthus | vr | rms | …) ──► VendaPdvSchema ──► importarVendas() ──► vendas/itens/pagamentos
```

Ao gravar, cada item é amarrado ao produto **pelo código interno ou pelo EAN** (inclusive os
códigos de embalagem); produto que ainda não existe no cadastro entra como item solto, com
descrição e código — não trava a importação.

**Estado hoje (V1):** a chamada ao webservice da Zanthus fica para a fase de integrações
([`src/lib/pdv/zanthus.ts`](src/lib/pdv/zanthus.ts) tem o driver com o roteiro do que falta).
Até lá, a tela **Importações** aceita **carga por arquivo** — um JSON no formato canônico
que percorre exatamente o mesmo caminho, então tudo o que vem depois já está exercitado.

---

## Estrutura

```
├── src/                  # backend Next.js (só /api)
│   ├── app/api/…         # rotas finas: cada uma aponta para o registro de entidades
│   └── lib/
│       ├── crud.ts       # fábrica de CRUD (list/create/read/update/delete)
│       ├── child-crud.ts # CRUD de recurso filho (preços/tributação do produto)
│       ├── entities.ts   # registro central: tabela, validação, filtros, permissão
│       ├── vendas.ts     # contrato e cálculo do cupom
│       ├── compras.ts    # contrato e cálculo de pedido e nota
│       └── pdv/          # pipeline de importação + drivers
├── web/                  # SPA Vite
│   └── src/
│       ├── components/CrudInline.tsx   # a máquina por trás de todo cadastro
│       ├── components/ItensEditor.tsx  # grade de itens de documento
│       └── pages/…
└── supabase/migrations/  # schema, seed e funções de relatório
```

O CRUD dos cadastros é **declarativo**: uma entrada em `entities.ts` no backend e uma lista
de colunas/campos na página do front. Adicionar um cadastro novo não pede rota escrita à mão.

---

## Deploy

`docker compose up --build -d` sobe os dois containers (API 7472, nginx do front 7572, que
faz proxy de `/api` para a API). O push na `main` dispara o deploy por SSH — mesmo modelo dos
outros apps do grupo. O `.env` vive no servidor, nunca no repositório.
