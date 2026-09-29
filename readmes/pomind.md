# PoMind

Plataforma de inteligência operacional do Grupo Pomin. Conecta máquinas, processos e times em um único painel para monitorar produtividade em tempo real e transformar dados em decisão.

Em uma frase: dashboard que classifica o que cada usuário está fazendo no computador (produtivo, improdutivo, neutro, ocioso, bloqueado, intervalo) com base em eventos coletados pelo agente desktop, e consolida isso por usuário, time e empresa.

## Stack

- **Frontend**: Vite + React 18 + TypeScript estrito + Tailwind CSS + shadcn/ui
- **Roteamento**: React Router v6
- **Estado de servidor**: TanStack Query
- **Backend**: Supabase (Postgres + Auth + Edge Functions Deno)
- **Auth**: SSO Microsoft (Azure AD) via Supabase Auth — sem email/senha
- **API de atividades**: serviço externo proxyado em `/api` (ver `vite.config.ts`)
- **Deploy**: Docker (multi-stage) + nginx servindo a SPA estática

## Pré-requisitos

- Node.js 20+ e npm
- Docker e Docker Compose (apenas para rodar/buildar em modo produção)
- Acesso à organização Microsoft Entra ID do Grupo Pomin (para login)

## Rodar localmente (dev)

O dev server do Vite sobe na porta **7444** com HMR.

```sh
# 1. copie o arquivo de exemplo e preencha com suas credenciais
cp .env.example .env

# 2. instalar dependências (primeira vez ou após mudar package.json)
npm install

# 3. subir o dev server
npm run dev
```

Acesse: <http://localhost:7444>

A primeira tela é o login. Use sua conta corporativa Microsoft.

> **Observação sobre SSO em dev**: o redirect do OAuth está configurado para `https://pomind.auditto.com.br/dashboard`. Em desenvolvimento local, após autenticar você é redirecionado pro domínio de produção. Para testar o fluxo end-to-end localmente, ajuste `SSO_REDIRECT_URL` em `src/contexts/AuthContext.tsx` temporariamente.

### Scripts npm

| Script | O que faz |
|---|---|
| `npm run dev` | Dev server Vite em [http://localhost:7444](http://localhost:7444) com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run build:dev` | Build em modo desenvolvimento (sem minificar) |
| `npm run preview` | Serve o conteúdo de `dist/` localmente para testar o build |
| `npm run lint` | Roda ESLint em todo o projeto |

## Variáveis de ambiente

Crie um `.env` na raiz do projeto (copiando o [.env.example](.env.example)) com:

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase (ex: `https://abc123.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave **anon/publishable** do Supabase (vai no bundle, é pública) |

Importante:
- Vite injeta essas variáveis **em tempo de build**. Mudou o `.env`? Reinicie o dev server e refaça o build do container.
- Ambas têm prefixo `VITE_` porque são **públicas** (entram no bundle JS). **Nunca** coloque `service_role_key` aqui — só em secrets do Supabase Edge Functions ou env do container.
- O `.env` está no `.gitignore`. O `.env.example` é versionado pra servir de template.
- Em produção via Docker, os valores são repassados como build args (veja `docker-compose.yml` → `build.args`).

Padrão de secrets documentado em [soul/arch.md](soul/arch.md) §5.1.

## Rodar com Docker (modo produção)

A imagem é **multi-stage**: o stage 1 (Node 20 Alpine) roda `npm ci` e `npm run build`; o stage 2 (nginx 1.27 Alpine) serve `dist/` na porta **7444**.

Garanta que o `.env` está na raiz com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` — o `docker compose` repassa esses valores como build args automaticamente.

```sh
# build + sobe em background (lê .env automaticamente)
docker compose up --build -d

# acompanhar logs
docker compose logs -f

# parar e remover container
docker compose down
```

Acesse: <http://localhost:7444>

O container se chama `pomind-app` e tem `restart: unless-stopped`. Healthcheck embutido bate em `http://127.0.0.1:7444/` a cada 30s.

### O que o nginx faz

Configurado em [nginx.conf](nginx.conf):

- **SPA fallback**: qualquer rota desconhecida cai em `index.html` para o React Router resolver
- **Cache agressivo** em `/assets/*` (1 ano, immutable — arquivos têm hash no nome)
- **Zero cache** em `index.html` (sempre busca a versão mais nova)
- **Cache moderado** (30d) em fontes, imagens e ícones na raiz
- **Gzip** em texto, JS, CSS, JSON, SVG, wasm
- **Headers de segurança**: `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'self'`

## Estrutura de pastas

```
src/
├── pages/                    # uma página por rota (Login, Dashboard, Atividades, Empresas...)
├── components/
│   ├── ui/                   # shadcn/ui (copy-paste)
│   ├── layout/               # AppLayout, AppSidebar
│   ├── ProtectedRoute.tsx    # guard de rotas autenticadas
│   └── AdminRoute.tsx        # guard de rotas de admin
├── contexts/
│   └── AuthContext.tsx       # estado de auth + SSO Microsoft + sessionStorage
├── services/                 # acesso a dados (Supabase + API externa)
├── hooks/                    # hooks customizados
├── integrations/
│   └── supabase/             # client + types gerados
├── lib/                      # utilitários puros
├── assets/                   # logo, imagens
├── App.tsx                   # rotas + providers
├── main.tsx                  # entrypoint
└── index.css                 # design system (tokens HSL, Tailwind layers)

supabase/
├── functions/                # edge functions Deno
│   ├── pomind-sso-login      # libera usuário após autenticação SSO
│   ├── pomind-proxy          # proxy para API externa de atividades
│   └── pomind-report-cache   # cache de relatórios pesados
└── migrations/               # SQL versionado por timestamp

soul/
├── arch.md                   # padrões de stack e arquitetura
└── constitution.md           # princípios e decisões fundamentais
```

## Rotas

| Rota | Tipo | Página |
|---|---|---|
| `/` | Pública | **Login** (SSO Microsoft) |
| `/about-pomind` | Pública | Sobre o produto |
| `/about-grupo-pomin` | Pública | Sobre o Grupo Pomin |
| `/dashboard` | Autenticada | Dashboard principal |
| `/atividades` | Autenticada | Lista de atividades por usuário/dia |
| `/empresas` | Autenticada | Gestão de empresas |
| `/classificacao` | Autenticada | Regras de classificação de processos |
| `/times` | Autenticada | Gestão de times |
| `/usuarios-api` | Autenticada | Usuários da API |
| `/admin` | Admin | Painel administrativo |
| `/relatorio` | Admin | Relatórios consolidados |

## Login

Apenas SSO Microsoft (Azure Entra ID). Fluxo:

1. Usuário clica em "Entrar com Microsoft" em `/`
2. Supabase Auth redireciona pra Microsoft
3. Microsoft autentica e devolve o token
4. Edge function `pomind-sso-login` valida o usuário no banco (`users_pomind`)
5. Se autorizado, sessão é persistida em `sessionStorage` e o usuário cai em `/dashboard`
6. Se não autorizado, login falha — admin precisa liberar via `/admin`

Roles:
- `admin_sistema`: acesso total
- `admin_empresa`: acesso restrito à(s) empresa(s) vinculada(s)
- Usuário comum: visualização da própria empresa

## Arquitetura e convenções

Os padrões de stack, convenções de banco, edge functions, segurança e UI estão documentados em:

- [soul/arch.md](soul/arch.md) — arquitetura de referência (paleta de cores, layout, login, RLS, deploy)
- [soul/constitution.md](soul/constitution.md) — princípios e decisões fundamentais

A tela de login e o sistema de cores seguem o padrão **pominai** (referência canônica do design system), documentado na seção 7 do `arch.md`.

## CI / CD

Produção: <https://pomind.auditto.com.br>

### CI

`.github/workflows/ci.yml` — lint e build em push/PR para `main`.

Secrets opcionais no CI: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### CD (deploy EC2)

Após o CI em `main`, o job **Deploy EC2** roda `git pull` + `docker compose up --build -d`.

Deploy manual: **Actions → Deploy (manual) → Run workflow**

#### Configuração no GitHub

Defina em **Settings → Secrets and variables → Actions**.

| Nome | Escopo | Exemplo (pomind-creator) |
|---|---|---|
| `DEPLOY_PROJECT_NAME` | Repositório | `pomind-creator` |
| `DEPLOY_APP_PORT` | Repositório | `7444` |
| `DEPLOY_SSH_HOST` | Org ou repo | `35.174.181.218` |
| `DEPLOY_SSH_USER` | Org ou repo | `ubuntu` |
| `DEPLOY_BASE_DIR` | Org ou repo | `/srv/www` |
| `DEPLOY_SSH_PRIVATE_KEY` | Org (secret) | chave privada SSH |

A porta **7444** do container é publicada na mesma porta do host, atrás de um reverse proxy (nginx do servidor) que mapeia o domínio público.

#### Pré-requisitos no servidor

1. Clone em `/srv/www/pomind-creator` com `git pull` funcionando
2. `.env` com `VITE_SUPABASE_*` (não versionar)
3. Usuário SSH com acesso ao Docker

## Contribuindo

1. Crie uma branch a partir de `main` (`feat/...`, `fix/...`, `chore/...`)
2. Faça o trabalho seguindo as convenções de [soul/arch.md](soul/arch.md)
3. Rode `npm run lint` antes de commitar
4. Abra PR para `main` com descrição do que mudou e como testar

## Suporte

Problemas, dúvidas ou pedidos: abra issue ou fale com o time de plataforma.
