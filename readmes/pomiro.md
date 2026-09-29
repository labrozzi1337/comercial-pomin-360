# PoMiro

Editor colaborativo de mapas mentais e quadros visuais — inspirado no Miro, voltado para uso interno da Auditto. Permite construir diagramas, fluxogramas e brainstorms livres num canvas infinito, com persistência em nuvem e compartilhamento entre membros da equipe.

## O que dá pra fazer

- **Canvas infinito** com pan, zoom e mini-mapa.
- **Nós de mapa mental** em árvore com níveis ilimitados, cores por ramo e edição inline.
- **Formas geométricas** (retângulo, círculo, losango) redimensionáveis e com aspecto preservado.
- **Texto livre** com controle de fonte, peso e alinhamento.
- **Comentários** com autor e data, e **rabiscos à mão livre** sobre o canvas.
- **Conexões inteligentes** (smoothstep) entre qualquer nó, reconectáveis.
- **Geração assistida por IA**: descreva um tema e a edge function `generate-board` monta o board inicial.
- **Compartilhamento por board**: permissões granulares (`view` / `edit` / `owner`) por usuário.
- **Exportação**: PNG, JPEG, PDF, CSV (lista de nós) e JSON (backup completo).
- **Histórico**: undo/redo até 50 passos.
- **Autenticação**: login com email/senha e Microsoft SSO via Supabase Auth.
- **Painel admin**: gestão de usuários (criar/bloquear/promover) por administradores.

## Stack técnica

- **Frontend**: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, `@xyflow/react` (ReactFlow) para o canvas, React Router, TanStack Query.
- **Backend**: Supabase (Postgres + RLS, Auth, Edge Functions em Deno).
- **Edge Functions**: `pomiro-admin-create-user` (criação de usuários por admin), `generate-board` (geração via IA).
- **Testes**: Vitest + Testing Library; Playwright para E2E.
- **CI**: GitHub Actions roda lint, testes e build em cada push/PR.

## Repositórios

| Remote   | URL |
|----------|-----|
| **GitHub** (destino) | https://github.com/Auditto/Pomiro.git |
| **GitLab** (legado)  | https://gitlab.auditto.com.br/data-rpa/pomiro.git |

## Pré-requisitos

- Node.js 20+
- npm
- Conta Supabase configurada (login e Microsoft SSO)

## Configuração local

```sh
git clone https://github.com/Auditto/Pomiro.git
cd Pomiro
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env
npm install
npm run dev
```

O servidor de desenvolvimento sobe em `http://localhost:7438`.

### Docker

```sh
cp .env.example .env
# Edite .env com as credenciais do Supabase
docker compose up --build
```

## Migração GitLab → GitHub

Com acesso ao repositório privado `Auditto/Pomiro` no GitHub:

```sh
chmod +x scripts/migrate-to-github.sh
./scripts/migrate-to-github.sh
```

O script busca `gitlab` e `github`, mescla históricos divergentes e faz push para `main` no GitHub.

## CI (GitHub Actions)

O workflow em `.github/workflows/ci.yml` executa lint, testes e build em cada push/PR na branch `main`.

Configure estes secrets no repositório GitHub (**Settings → Secrets and variables → Actions**):

| Secret | Descrição |
|--------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave anon/public do Supabase |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

## Stack

- Vite, React, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase (auth, banco, edge functions)
