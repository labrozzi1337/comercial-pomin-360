# PominDrive

Armazenamento de arquivos em nuvem no estilo **SharePoint**, sobre o **Backblaze B2**
(barato). Segue o mesmo modelo dos demais apps do Grupo Pomin (ex.: `pominchat`):

- **Frontend**: SPA em **Vite + React** (`/web`)
- **Backend**: API em **Next.js** (App Router) (`/src`)
- **Auth + banco**: **Supabase** (schema dedicado `pomindrive`)
- **Storage**: **Backblaze B2** via API S3-compatível (URLs pré-assinadas)

## Funcionalidades

- 🔐 **Login** e **cadastro** de usuários (Supabase Auth)
- 📊 **Dashboard** com uso de armazenamento, nº de arquivos e links ativos
- 🗂️ **Pastas e arquivos** com navegação em árvore + breadcrumb
- ⬆️ **Upload** de qualquer tipo de arquivo (direto pro B2, com barra de progresso e drag & drop)
- ⬇️ **Download** de arquivos (URL pré-assinada) e de **pastas inteiras em `.zip`**
- 🔗 **Links públicos** para compartilhar **pasta** ou **arquivo**
  - senha opcional, expiração opcional, permitir/negar download
  - página pública navegável (`/s/:token`)
- ✏️ **Renomear**, **mover** (com seleção de destino) e **excluir** pastas/arquivos
- 🗑️ **Lixeira restaurável** (soft-delete): restaurar item/subárvore, excluir de vez ou esvaziar
- 👁️ **Pré-visualização inline** de imagens, PDF, vídeo, áudio e texto (sem baixar)
- 🛡️ **Administração de usuários** (admin): papel, bloqueio e cota por usuário
- 🔎 **Busca** global por nome
- 🌗 Tema claro/escuro
- 📦 **Cota** por usuário (default 5 GB, configurável)

## Arquitetura

```
Browser ──(Bearer JWT Supabase)──► Next.js API (/api) ──► Supabase (schema pomindrive)
   │                                     │
   │  upload/download direto             └──► Backblaze B2 (URLs pré-assinadas / zip)
   └──────────────────────────────────────────► Backblaze B2 (PUT presigned)
```

- O SPA **só** usa o Supabase para autenticação. **Todo** acesso a dados passa pela API,
  que valida o `Authorization: Bearer <access_token>` e usa a **service role** (RLS deny-all).
- **Upload**: o front pede uma URL pré-assinada (`/api/files/upload-url`), envia o arquivo
  **direto pro B2** (PUT) e depois confirma o registro (`POST /api/files`). Arquivos grandes
  não passam pelo servidor.
- **Download** de arquivo: a API devolve uma URL pré-assinada do B2 (download direto).
- **Zip** de pasta: a API baixa os objetos do B2 e faz *streaming* de um `.zip` (archiver).

## Pré-requisitos

- Node.js 20+
- Um projeto **Supabase**
- Um bucket **Backblaze B2** + Application Key

## 1) Supabase

1. Rode a migration `supabase/migrations/0001_init.sql` no SQL Editor (ou via CLI).
   Ela cria o schema `pomindrive`, tabelas, trigger de perfil e RLS.
2. **Importante**: em **Project Settings → API → Data API → Exposed schemas**, adicione
   `pomindrive` (senão o PostgREST não enxerga as tabelas).
3. (Opcional) Em **Authentication → Providers → Email**, desative "Confirm email" para
   permitir login imediato após o cadastro. Se deixar ligado, o usuário precisa confirmar
   o e-mail antes de entrar.
4. Pegue as chaves em **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL`
   - anon key → `*_PUBLISHABLE_KEY`
   - service role key → `SUPABASE_SERVICE_ROLE_KEY`

Para virar **admin**, rode no SQL editor:
```sql
update pomindrive.users set role = 'admin' where email = 'voce@empresa.com';
```

## 2) Backblaze B2

1. Crie um **Bucket** (Private).
2. **Application Keys → Add a New Application Key** com acesso ao bucket.
3. Anote `keyID`, `applicationKey` e o **Endpoint** do bucket
   (ex.: `s3.us-west-004.backblazeb2.com`) → preencha `B2_*` no `.env`.
4. **CORS**: libere `PUT`/`GET` a partir da origem do frontend para o upload/download
   direto funcionar no browser. Ex. de regra (B2 → Bucket Settings → CORS Rules):
   ```json
   [{
     "corsRuleName": "pomindrive",
     "allowedOrigins": ["http://localhost:7570", "https://pomindrive.SEUDOMINIO.com.br"],
     "allowedOperations": ["s3_put", "s3_get", "s3_head"],
     "allowedHeaders": ["*"],
     "exposeHeaders": ["ETag"],
     "maxAgeSeconds": 3600
   }]
   ```

## 3) Variáveis de ambiente

- Backend: copie `.env.example` → `.env` e preencha.
- Frontend: copie `web/.env.example` → `web/.env` e preencha (só `VITE_*`).

## 4) Desenvolvimento

```bash
# instala deps do backend + frontend (o postinstall instala o /web)
npm install

# sobe API (7470) e SPA (7570) juntos
npm run dev:all
```

- Frontend: http://localhost:7570
- API: http://localhost:7470/api/health

O Vite faz *proxy* de `/api` para a porta 7470 em dev.

## 5) Produção (Docker)

Preencha o `.env` (backend) e exporte também as `VITE_*` (build do front). Depois:

```bash
docker compose up -d --build
```

- `pomindrive-web` (nginx, porta **7570**) serve o SPA e faz proxy de `/api` para a API.
- `pomindrive-api` (Next standalone, porta **7470**).

Ajuste o `NEXT_PUBLIC_APP_URL` para a URL pública (usada nos links de compartilhamento).

## Referência de API

Todas as rotas autenticadas exigem `Authorization: Bearer <supabase_access_token>`.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Perfil + uso/cota |
| PATCH | `/api/profile` | Atualiza nome |
| GET | `/api/folders?parentId=&q=` | Conteúdo da pasta (ou raiz) / busca |
| POST | `/api/folders` | Cria pasta |
| GET | `/api/folders/tree` | Todas as pastas (para mover) |
| PATCH | `/api/folders/:id` | Renomeia / move pasta |
| DELETE | `/api/folders/:id` | Manda pasta pra lixeira (`?permanent=1` apaga de vez) |
| GET | `/api/folders/:id/zip` | Baixa pasta como `.zip` (stream) |
| POST | `/api/files/upload-url` | URL pré-assinada de upload (checa cota) |
| POST | `/api/files` | Confirma upload (cria registro) |
| PATCH | `/api/files/:id` | Renomeia / move arquivo |
| DELETE | `/api/files/:id` | Manda arquivo pra lixeira (`?permanent=1` apaga de vez) |
| GET | `/api/files/:id/download` | URL pré-assinada de download (`?inline=1` p/ preview) |
| GET | `/api/trash` | Lista itens na lixeira (raízes) |
| POST | `/api/trash/restore` | Restaura item/subárvore |
| DELETE | `/api/trash` | Esvazia a lixeira |
| GET | `/api/ai/models` | Modelos de extração (meus + compartilhados) |
| POST | `/api/ai/models` | Cadastra modelo (compila o schema do texto) |
| PATCH | `/api/ai/models/:id` | Edita modelo / schema |
| DELETE | `/api/ai/models/:id` | Exclui modelo (o token para de valer) |
| POST | `/api/ai/models/:id/schema` | Regera o JSON Schema (`preview:true` só devolve) |
| POST | `/api/ai/models/:id/token` | Gera token novo (invalida o antigo) |
| POST | `/api/ai/extract/:modelo` | Extrai JSON (sessão **ou** token do modelo); `:modelo` = slug do nome ou id |
| POST | `/api/ai/extract` | Igual, sem o nome na URL (o token já identifica o modelo) |
| POST | `/api/ai/suggest-fields` | Lê um documento de exemplo e sugere campos + JSON de entrega |
| GET | `/api/ai/models/:id/history` | Histórico de alteração do modelo (quem, quando, de/para) |
| GET | `/api/sites` | Sites que o usuário enxerga |
| POST | `/api/sites` | Cria site (já com página inicial) |
| GET | `/api/sites/:site` | Site + páginas + bibliotecas (`:site` = slug ou id) |
| PATCH | `/api/sites/:site` | Nome, descrição, visibilidade (visibilidade só o dono) |
| DELETE | `/api/sites/:site` | Exclusão lógica do site |
| GET/POST | `/api/sites/:site/pages` | Lista / cria página (HTML sanitizado) |
| GET/PATCH/DELETE | `/api/sites/:site/pages/:page` | Página (`:page` = slug ou id) |
| GET/POST/DELETE | `/api/sites/:site/libraries` | Bibliotecas do site |
| GET/POST/DELETE | `/api/sites/:site/members` | Pessoas e equipes com acesso |
| GET | `/api/ai/extractions?modelId=&limit=` | Histórico de extrações |
| GET | `/api/admin/users` | (admin) Lista usuários + uso |
| PATCH | `/api/admin/users/:id` | (admin) Papel / status / cota |
| GET | `/api/shares` | Lista meus links |
| POST | `/api/shares` | Cria link público (arquivo/pasta) |
| DELETE | `/api/shares/:id` | Revoga link |
| GET | `/api/public/:token?folderId=&pw=` | (público) metadados/navegação |
| GET | `/api/public/:token/download?fileId=&pw=` | (público) URL de download |
| GET | `/api/public/:token/zip?folderId=&pw=` | (público) zip da pasta |

## Sites

Espaço estilo SharePoint dentro do drive, em **Sites** no menu. Cada site junta:

- **Páginas** em HTML, escritas no editor com prévia lado a lado; uma delas é a inicial
- **Bibliotecas** — pastas de arquivo do próprio site, com upload, subpasta e download. São
  pastas do drive marcadas com `site_id`, então reusam preview, zip e lixeira; não aparecem
  misturadas em *Meus Arquivos*
- **Membros** — pessoas e equipes, como `editor` (mexe em página e biblioteca) ou `leitor`

Quem enxerga o site é decisão por site: **restrito** (só quem está na lista) ou **aberto a
qualquer usuário logado**. Não existe site anônimo — abrir qualquer site exige sessão.

### Biblioteca dentro da página

No editor, **Inserir biblioteca** põe um marcador no HTML:

```html
<h2>Notas do mês</h2>
{{biblioteca:<id-da-biblioteca>}}
```

Na hora de exibir, o marcador vira a lista de arquivos daquela biblioteca — com upload para quem
é editor. O marcador também aceita o nome da biblioteca em forma de slug.

### Segurança do HTML

A página é HTML escrito à mão e renderizado **na mesma origem da sessão**, então o backend
**sanitiza no salvar e no ler**: caem `<script>`, `<style>`, `<iframe>`, todos os `on*` e
`href="javascript:"`. Link externo sai com `rel="noopener noreferrer"`. O marcador de biblioteca
não é HTML injetado: vira componente React de verdade.

## Extração de JSON com IA (Gemini)

Uma tela só: **Extrair JSON** (`/extrair`), em **Inteligência** no menu. À esquerda a lista de
modelos; à direita o modelo selecionado, em três abas:

- **Extrair** — sobe o arquivo e sai o JSON (copiar / baixar `.json`). O arquivo vai para
  *Meus Arquivos* por padrão (consome cota); o switch desliga isso. Abaixo, as execuções do
  modelo — clicar reabre o JSON daquela execução.
- **Schema** — o texto que você escreveu e o **JSON Schema** que a IA compilou dele, que é o
  que garante as mesmas chaves em toda execução. Dá para regerar ou voltar ao formato livre.
- **API / curl** — o `curl` pronto e o token do modelo. O token aparece mascarado na tela, mas
  o botão de copiar leva o token de verdade.

### O cadastro do modelo

O botão **Novo modelo** (ou o lápis, para editar) abre um diálogo de três abas:

1. **Campos** — nome, modelo do Gemini e os campos escritos em português (“o número da nota, o
   CNPJ do emitente, a lista de itens com descrição e valor…”). Se preferir não escrever,
   **Sugerir a partir de um arquivo** sobe um documento de exemplo e a IA escreve a lista de
   campos, propõe um nome e já monta o JSON de entrega — o arquivo é só lido, não vai para o drive.
2. **JSON de entrega** — o **contrato de saída**, editável à mão. São as chaves exatas que toda
   extração devolve, na mesma ordem, **em branco quando o documento não tiver o campo**. O valor
   no template diz o tipo:

   | No template | Tipo | Ausente na extração vira |
   |---|---|---|
   | `""` | texto | `""` |
   | `null` | número | `null` |
   | `false` | booleano | `null` |
   | `[{ "col": "" }]` | lista (o objeto de dentro é a linha) | `[]` |

   Chave que a IA inventar é descartada; chave que ela não achar volta em branco. Renomear,
   remover e acrescentar chave aqui muda o contrato na hora. Valores digitados são zerados ao
   salvar — é um contrato, não dado.
3. **Histórico** — quem alterou o modelo, quando e o de/para de cada campo.
`/modelos` continua funcionando: redireciona para `/extrair`.

Requisitos: `GEMINI_API_KEY` no `.env` e as migrations `0005`…`0008` aplicadas.

Formatos que o Gemini lê: PDF, imagem (png/jpeg/webp/heic), áudio, vídeo, XML, CSV, JSON, HTML,
Markdown e texto — até **14 MB** (limite do `inlineData` da API). `.docx`/`.xlsx` **não** são
suportados: converta para PDF ou CSV.

O tipo declarado pelo cliente é normalizado antes de ir para a IA: `application/xml` vira
`text/xml` (a API só aceita esse nome), `text/markdown` vira `text/md`, e `application/octet-stream`
cai na extensão do arquivo. Qualquer outro formato que seja texto legível vai como `text/plain`.
Só binário desconhecido devolve 415.

### Usando por fora (curl)

Cada modelo tem seu próprio token (`pdk_…`), então dá para chamar de qualquer sistema:

A URL termina com o **nome do modelo** (slug: `Nota fiscal de entrada` → `nota-fiscal-de-entrada`),
para a chamada dizer sozinha qual modelo está rodando. Quem autentica continua sendo o token.

```bash
# arquivo novo -> JSON (o arquivo é salvo no drive do dono do modelo)
curl -X POST https://SEU-HOST/api/ai/extract/nota-fiscal-de-entrada \
  -H "Authorization: Bearer pdk_SEU_TOKEN" \
  -F "file=@/caminho/nota.pdf"

# sem guardar o arquivo
curl -X POST https://SEU-HOST/api/ai/extract/nota-fiscal-de-entrada \
  -H "Authorization: Bearer pdk_SEU_TOKEN" \
  -F "file=@/caminho/nota.pdf" -F "save=0"

# reprocessar um arquivo que já está no drive
curl -X POST https://SEU-HOST/api/ai/extract/nota-fiscal-de-entrada \
  -H "Authorization: Bearer pdk_SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileId":"UUID_DO_ARQUIVO"}'
```

**Renomear o modelo muda o endereço.** Para integração que não pode quebrar, use o **id** no
lugar do nome (`/api/ai/extract/<uuid>`) — o id nunca muda. O endereço sem nenhum sufixo
(`/api/ai/extract`) também continua funcionando: o token já diz qual é o modelo.

O slug errado devolve 404 dizendo qual é a URL certa daquele token — não roda o modelo trocado.

Resposta:

```json
{
  "ok": true,
  "extractionId": "…",
  "model": { "id": "…", "name": "Nota fiscal", "slug": "nota-fiscal", "geminiModel": "gemini-2.5-flash" },
  "file": { "id": "…", "name": "nota.pdf", "sizeBytes": 51234, "saved": true },
  "durationMs": 4200,
  "json": { "numero_nota": "12345", "valor_total": 1899.9, "itens": [ … ] }
}
```

Outros campos aceitos no `-F`: `folderId` (pasta destino), `scope=corporate` (drive da
corporação). O token do modelo grava arquivo no drive do dono — trate como senha.

## Estrutura

```
pomindrive/
├─ src/                      # Backend Next.js
│  ├─ app/api/…              # rotas da API
│  └─ lib/                   # supabase, b2, drive, gemini, ai-extract, helpers
├─ web/                      # Frontend Vite
│  └─ src/
│     ├─ pages/              # Login, Register, Dashboard, Files, Extrair, SharePublic
│     ├─ components/extract/ # painéis da tela de extração (form, extrair, schema, api)
│     ├─ components/site/    # página, editor HTML, biblioteca, configurações do site
│     ├─ components/         # AppShell, ShareModal, MoveModal, ui, …
│     └─ lib/                # api, driveApi, driveStore
├─ supabase/migrations/      # schema pomindrive
├─ Dockerfile · web/Dockerfile · docker-compose.yml
```

## Exclusão

Todo cadastro é excluído **logicamente** (`deleted_at`): site, página, biblioteca, modelo de
extração, equipe, membro de equipe e link de compartilhamento somem das telas mas continuam no
banco, então erro de clique não é perda de dado.

As duas exceções são as ações em que o usuário pede para apagar de vez: **esvaziar a lixeira** e
**excluir de vez** (`?permanent=1`). Aí o registro sai da tabela e o objeto sai do B2 junto — se
fosse lógico, o armazenamento continuaria sendo cobrado para sempre.

Excluir um site não leva o conteúdo junto: as bibliotecas viram pastas comuns do dono.

## Notas de segurança

- Backend valida o JWT do Supabase e opera com **service role**; RLS fica **deny-all**
  (o front não lê tabelas direto).
- `storage_key` é sempre prefixado por `u/<owner_id>/…` e validado no confirm de upload.
- Links públicos suportam **senha** (scrypt) e **expiração**; download pode ser desabilitado.
- Navegação de share é confinada à subárvore compartilhada (checagem de descendência).
- Token de modelo (`pdk_…`) autentica só `/api/ai/extract` e age como o **dono do modelo**:
  extrai JSON e grava arquivo no drive dele. Revogue gerando um token novo na aba API.
- O histórico do modelo é escrito **pela API**, não por trigger, e só em edição humana de modelo —
  auditar tabela de volume de máquina (extração) já entupiu o banco compartilhado uma vez.
