<catalogo>
- PominAI (IA & criação) · pominai.auditto.com.br
  Assistentes de IA com os documentos e o conhecimento da sua empresa. Dê ao time assistentes com instruções e bases de arquivos próprias, controle de acesso e histórico de conversas. Para quem: Qualquer área que precisa usar IA com contexto e controle.
- Pomiro (IA & criação) · miro.grupopomin.com.br
  Um quadro colaborativo com IA para tirar as ideias do papel. Planeje em um canvas infinito com mapas mentais, desenho e comentários. A IA monta o primeiro rascunho do board. Para quem: Times de projetos, produto e planejamento.
- PominMKT (IA & criação) · mkt.grupopomin.com.br
  Crie imagens, aprove conteúdos e acompanhe suas publicações. Reúna criação com IA, biblioteca de marca, aprovação e publicação no Instagram em um mesmo fluxo. Para quem: Marketing, agências internas e equipes de conteúdo.
- PominPRD (IA & criação) · prd.grupopomin.com.br
  Crie projetos e gere o PRD para levar ao PominDev. Transforme a ideia em um projeto com um documento de requisitos do produto (PRD). Use o documento no PominDev para dar continuidade ao desenvolvimento. Para quem: Times de produto, projetos e desenvolvimento.
- PominReport (Gestão & inteligência) · pominreports.auditto.com.br
  Relatórios de liderança com indicadores, metas e acompanhamento. Cada gestor entrega sua semana com números e metas. A diretoria acompanha os relatórios e compara períodos em um só lugar. Para quem: Diretoria, gestores e lideranças de operação.
- PominBI (Gestão & inteligência) · bi.grupopomin.com.br
  Transforme dados em painéis para apoiar suas decisões. Conecte bancos relacionais ou APIs REST. O sistema lê a estrutura dos dados e sugere gráficos para montar seus dashboards. Para quem: TI, controladoria e áreas orientadas a dados.
- PominGoverna (Gestão & inteligência) · pomingoverna.auditto.com.br
  Riscos, políticas, auditorias e planos de ação no mesmo lugar. Organize governança e compliance com histórico: políticas, riscos, auditorias, acessos, fornecedores e planos de ação. Para quem: Compliance, auditoria, segurança da informação e jurídico.
- PominSprint (Operação & execução) · sprint.grupopomin.com.br
  Organize projetos, sprints e entregas com clareza. Acompanhe o trabalho do time com quadros, sprints e visão das entregas em uma experiência consistente com o ecossistema Pomin. Para quem: TI, projetos e operação.
- PominDev (Operação & execução) · pomindev.auditto.com.br
  Do chamado ao deploy, com IA e governança. Uma esteira de desenvolvimento com IA: o agente lê o código do repositório, desenvolve, passa por revisão e testes e publica em produção depois do seu aceite. Para quem: Times de tecnologia, produto e desenvolvimento.
- PominSAC (Relacionamento) · sac.grupopomin.com.br
  Cada pedido com responsável, prazo e histórico. Organize canais por área com e-mail de entrada, fluxo de status, prazo e responsável. Abra chamados de dentro dos sistemas Pomin. Para quem: Atendimento, TI, RH e áreas que recebem solicitações.
- PominCHAT (Relacionamento) · call.grupopomin.com.br
  Mensagens, WhatsApp e comunicação interna em uma plataforma. No atendimento externo, filas, SLA, campanhas e automações. Na comunicação interna, conversas, grupos, vídeo e salas de reunião. Para quem: Atendimento, vendas e comunicação entre equipes.
- PominCS (Relacionamento) · pomincs.auditto.com.br
  Acompanhe a saúde dos clientes e antecipe riscos na carteira. Reúna carteira, contratos, notas de saúde, pesquisas NPS e CSAT, jornada e tarefas para orientar o relacionamento. Para quem: Customer Success, pós-venda e negócios recorrentes.
</catalogo>

<documento repositorio="pominai">
# Pominai

**Orquestrador de IA enterprise** — plataforma para criar, configurar e operar agentes de inteligência artificial em escala, com governança, controle de acesso, conhecimento por agente e widgets incorporáveis em sites internos.

---

## ✨ Visão geral

Pominai é o ponto central onde times constroem agentes de IA reutilizáveis. Cada agente tem modelo, instruções, temperatura, conhecimento (arquivos) e personalidade próprios, e pode ser conversado, treinado, compartilhado entre usuários ou incorporado como widget em outros sites.

**Capacidades atuais**

- 🤖 **Agentes de IA** — CRUD com modelo, system prompt, temperatura, voice mode, status de treinamento e compartilhamento (viewer/editor)
- 🧠 **Multi-provider** — agentes podem rodar em **Anthropic Claude** (Opus 4.7, Sonnet 4.6, Haiku 4.5), **OpenAI** (GPT-4o, GPT-4o mini, GPT-4 Turbo) ou **Google Gemini** (2.0 Flash, 1.5 Pro/Flash)
- 📎 **Conhecimento (RAG-lite)** — upload de `.txt/.md/.csv/.json/.log` por agente (até 1MB). Cada arquivo é resumido por Claude Haiku (~400 palavras) e o resumo é injetado no system prompt, mantendo o custo por chamada baixo
- 💬 **Chat logs** — toda conversa é persistida (admin vê tudo via `/admin/chat-logs`, usuário vê só as próprias)
- 🎙️ **Voice Mode** — conversa por voz em tempo real (WSS) com qualquer agente: STT/TTS via provider configurável por ambiente, VAD no cliente, mesma conversa/contexto do chat textual, sem persistir áudio
- 🪟 **Embed/Incorporar** — gera HTML de iframe que pode ser colado em `*.auditto.com.br`, `*.solutta.com` ou `*.grupopomin.com.br`. Validação dupla: CSP `frame-ancestors` no servidor + `Origin` checado na edge function
- 📊 **Dashboard** — KPIs, atividade por dia, top agentes e conversas recentes na home
- 🎨 **UI premium** — dark/light, command palette (⌘K), animação "pensando", ambient backgrounds

---
</documento>

<documento repositorio="pominbank">
# PominBank

Cobranças, faturas e assinaturas do Grupo Pomin, integradas à **Iugu**.

Segue o molde dos demais apps `pomin*`: **front em Vite** (SPA, `web/`) e **back em

| Camada | Stack | Porta |
|---|---|---|
| Frontend | Vite + React + Tailwind + shadcn/ui | `7571` |
| Backend | Next.js 14 (App Router, API routes) | `7471` |
| Gateway | Iugu (`https://api.iugu.com/v1`) | — |

---

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

---
</documento>

<documento repositorio="pominbi">
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

---

## Módulos

| Módulo | O que faz |
|---|---|
| **Integrações** | Cadastro/teste de bancos e APIs; sincronização de estrutura; painel Movidesk. |
| **Descoberta** | Classificação de campos + sugestão de gráficos com pré-visualização real. |
| **Dashboards** | Lista, criação, duplicação e o **builder** visual (react-grid-layout). |
| **Templates** | Modelos prontos (Tickets, Movidesk; Financeiro/Vendas/RH/Projetos como roadmap). |
| **Suporte (SAC)** | Botão de chamado no header, integrado ao PominSAC (ver `soul/skill/suporte.md`). |

---

## Permissões

- **Admin:** cria/edita/exclui integrações e dashboards, sincroniza fontes, gerencia usuários.
- **Usuário:** visualiza dashboards, aplica filtros, exporta (export na fase 2).
</documento>

<documento repositorio="pominchat">
# Pomin Call

Painel de operação multicanal para WhatsApp via **Evolution API**, com autenticação **Supabase**, assistente **Ditto** (Gemini), tickets **Movidesk**, fluxos visuais estilo n8n, SLA, fila de atendimento, campanhas em massa e relatórios. Multi-empresa (carteiras).

---

## ✨ Features

### Comunicação
- **Mensagens unificadas** por instância WhatsApp (`/messages`).
- **Toolbar do chat** compacta: IA auto · Respostas rápidas · Disparo manual de fluxo · Carteira (empresa Movidesk) · Info do cliente.
- **Respostas rápidas (canned)**: CRUD de templates pessoais ou compartilhados por instância.
- **Disparo manual de fluxo**: executa qualquer fluxo cadastrado contra o cliente atual.
- **Hidratação de nomes**: chats sem `pushName` (criados via API/n8n) recebem nome real do contato salvo no DB.

### Campanhas (`/campaigns`)
- Disparo em massa com agendamento.
- Segmentação por etiquetas, lista manual (JIDs) ou broadcast global da instância.
- Status: SCHEDULED → RUNNING → COMPLETED/FAILED/CANCELLED.
- Disparo manual de batch (sem cron) ou automático via cron tick.

### Tickets (`/tickets`)
- **Movidesk multi-empresa**: 4 carteiras (SOLUTTA, AUDITTO, ALERTA FISCAL, MONITTORE).
- **SLA**: prazos de 1ª resposta + resolução, badge colorida (verde/amarelo/vermelho), breach automatizado via cron.
- **Atribuição**: dropdown de agente direto na lista.
- **Widget de chat Movidesk** carregado **somente** nessa página (não polui demais telas).
- Detalhe do ticket: prazos SLA, agente atribuído, status timestamps.

### Fila de atendimento (`/queue`)
- WAITING → PICKED → RELEASED.
- Prioridade configurável + ordem por entrada.
- Botão "Pegar" assume o próximo na fila e redireciona pro chat do cliente.

### Fluxos (`/flows` + `/flows/[id]/canvas`)
- **Canvas n8n-style** com React Flow.
- Nós: `filter_text`, `filter_sender`, `ai_reply`, `send_text`, `http_request`, `log`, **`webhook_in`**, **`webhook_out`**, **`condition`** (branching true/false).
- Webhook In: endpoint público `/api/flows/webhook/<path>` p/ integrações n8n.
- Webhook Out: posta evento + vars p/ URL externa.
- Disparo manual a partir da tela de mensagens (operador escolhe fluxo).
- Compatibilidade com fluxos lineares antigos (sem edges).

### Relatórios (`/reports`)
- Exportação CSV (UTF-8 BOM, Excel-friendly).
- **Tickets**: filtros por instância, período e agente.
- **Agentes**: sumário por agente — total, resolvidos, fechados, breaches, médias.

### Config por instância (`/instances/[name]/config`)
Tudo abaixo é configurado **por instância** (cada número WhatsApp tem o seu):
- **Persona IA**: prompt do bot dessa instância.
- **Horário de atendimento (Business Hours)**: agenda semanal por dia + timezone IANA + prompt de "Out-of-Office" com placeholder `{{next_opening}}`.
- **SLA**: 1ª resposta e resolução em minutos.

Também escopados por instância: **tags** (`/tags`), **fluxos** (`/flows`), **respostas rápidas** (canned), **contatos**.

### Movidesk admin (`/movidesk`)
- CRUD de **setores** por empresa: nome + email destino + tag (`financeiro`/`contabil`/`suporte`/`outro`).
- Email de setor é a **única fonte** de roteamento — não há mais fallback global.

### Perfil do usuário (`/profile`)
- Self-service: nome, **email Movidesk padrão** (vira `createdBy` no ticket), prompt IA pessoal (sobrescreve o da instância).
- Admin também edita o email Movidesk de qualquer usuário em `/users`.

### Carteiras (multi-empresa Movidesk)
- Cada contato pode ter uma **carteira** (= empresa Movidesk).
- Ao abrir ticket, a empresa vem pré-selecionada da carteira do contato.
- Botão "Carteira" na toolbar do chat.
</documento>

<documento repositorio="pominchurch">
# PominChurch — Gestão de Igrejas

SaaS de **gestão contábil e financeira para igrejas**, preparado para o impacto da **Reforma Tributária (IBS/CBS)**. Traz praticidade, segurança e transparência para os gestores, com compliance contábil suportado por CRC.

## Módulos

- **Financeiro** — fluxo de caixa, dízimos, ofertas, despesas e conciliação bancária (banco digital próprio no SaaS).
- **Contábil** — balancetes e DRE mensais, plano de contas customizado para igrejas e prestação de contas.
- **Tributário** — cálculo de impostos sobre receitas não imunes, alertas de operações tributáveis e preparação para IBS/CBS.
- **Fiscal** — obrigações acessórias (ECF, DCTF, eSocial), emissão de NF-e, checklists de prazos e protocolos.
- **Administrativo** — cadastro da igreja, membros, patrimônio e repositório seguro de documentos.
- **Unigreja** — vertente educacional: workshops, treinamentos e mentoria para pastores, tesoureiros e conselho fiscal.

> **Status:** MVP em construção — os dados exibidos nos módulos são demonstrativos (mocks) e serão substituídos por queries reais (tabelas `pominchurch_*` no Supabase). Piloto inicial: 18 igrejas.

---

## Autenticação e gestão de usuários

Arquitetura (clonada do projeto `pominai`) para rodar bem num **Supabase compartilhado entre vários projetos**:
</documento>

<documento repositorio="pomincrm">
# CRM Pomin

CRM comercial e operacional do Grupo Pomin. Uma instalação atende **várias empresas nossas**
(Solutta, Auditto…), cada uma com seus **projetos** (IRPF, Monittore, Alerta Fiscal…), e o cadastro
de pessoas, empresas e grupos é **compartilhado** entre todas — cada CPF/CNPJ existe uma única vez.

Fluxo que o sistema cobre, de ponta a ponta:

- **Modelo de dados** (camada global + vínculo por workspace): RELACIONAMENTO_ENTIDADES.md
- **Padrões de engenharia** do projeto: soul/ — `arch.md` e `constitution.md`

## Integrações

| Serviço | Para que | Onde |
|---|---|---|

### Contratos

O aceite de uma proposta cria, de forma idempotente, um contrato em rascunho com todos os dados
já conhecidos. Campos obrigatórios ausentes ficam destacados no assistente e bloqueiam o avanço.
O pipeline segue `Rascunho → Em revisão → Aprovado → Enviado → Assinado → Homologado`; o contrato
assinado e os documentos gerados usam o cadastro e o armazenamento B2 já existentes no CRM.

A edição fica em **Comercial → Contratos** e as opções do módulo em **Configurações → Contratos**.
O template DOCX está em `apps/web/public/templates/`. A conversão para PDF usa o serviço Gotenberg

### Pagamento (Mercado Pago)

Usa **link de pagamento** (preference do Checkout Pro), não checkout transparente: o cliente paga
na tela do MP e nunca tocamos em dado de cartão. Cada meio libera só o que promete, via
`excluded_payment_types` — a cobrança nasce com o meio escolhido, e abrir a lista inteira faria o
cliente pagar por um meio que o financeiro não esperava.

O status **nunca** vem do corpo do webhook: ele traz só o id, e o pagamento é reconsultado na API

a `notification_url` (a tela avisa). Para testar a cadeia completa, exponha um túnel
use a baixa manual ("Pago" na lista de cobranças), que libera a entrega pelo mesmo trigger.

segredo de lá. Teste sempre em **janela anônima**: logado na conta que recebe, o MP esconde os meios
de pagamento (ninguém paga a si mesmo).
</documento>

<documento repositorio="pomind">
# PoMind

Plataforma de inteligência operacional do Grupo Pomin. Conecta máquinas, processos e times em um único painel para monitorar produtividade em tempo real e transformar dados em decisão.

Em uma frase: dashboard que classifica o que cada usuário está fazendo no computador (produtivo, improdutivo, neutro, ocioso, bloqueado, intervalo) com base em eventos coletados pelo agente desktop, e consolida isso por usuário, time e empresa.

## Suporte

Problemas, dúvidas ou pedidos: abra issue ou fale com o time de plataforma.
</documento>

<documento repositorio="pomindocs">
# PominDocs

**Plataforma de gestão de documentos do Grupo Pomin** — armazenamento estilo Dropbox com nomenclatura padronizada obrigatória, ciclo de vida de vencimento com alertas automáticos e upload programado.

> Escopo funcional completo (user stories, fluxos e regras): ESCOPO-FUNCIONAL.md

---

## ✨ Módulos

- 📁 **Armazenamento (Módulo 1)** — pastas e subpastas (até 10 níveis), visão grade/lista, breadcrumb, drag-and-drop (mover itens e enviar arquivos do SO), favoritos por usuário, download com URL assinada, lixeira com retenção de 30 dias, busca global (⌘K / Ctrl+Q) por nome, tags e campos da máscara.
- 🏷️ **Nomenclatura personalizada (Módulo 2)** — admin define Tipos de Documento com máscaras (campos fixos, texto, lista, mês/ano, data, número). Todo upload passa pelo dialog de nomenclatura com preview ao vivo; cancelar descarta o upload (não existe arquivo "sem nome"). Renomear reabre a máscara. Valores viram metadados estruturados pesquisáveis.
- ⏰ **Vencimentos (Módulo 3)** — validade configurável por tipo (sem/opcional/obrigatória + sugestão em dias), status calculado (Válido / ≤30d / Expirado), painel `/expirations` por prioridade com ação Renovar, notificações no sino em 30/15/5/0 dias (deduplicadas por marco; renovar rearma).
- 📤 **Upload programado (Módulo 4)** — nomenclatura validada no agendamento, fila `/scheduled` com contagem regressiva, reagendar / publicar agora / cancelar, publicação automática com notificação e tratamento de conflito ("Ação necessária", nunca falha silenciosa).
</documento>

<documento repositorio="pomindrive">
# PominDrive

Armazenamento de arquivos em nuvem no estilo **SharePoint**, sobre o **Backblaze B2**
(barato). Segue o mesmo modelo dos demais apps do Grupo Pomin (ex.: `pominchat`):

- **Frontend**: SPA em **Vite + React** (`/web`)
- **Backend**: API em **Next.js** (App Router) (`/src`)
- **Storage**: **Backblaze B2** via API S3-compatível (URLs pré-assinadas)

## Funcionalidades

- 🔐 **Login** e **cadastro** de usuários (Supabase Auth)
- 📊 **Dashboard** com uso de armazenamento, nº de arquivos e links ativos
- 🗂️ **Pastas e arquivos** com navegação em árvore + breadcrumb
- ⬆️ **Upload** de qualquer tipo de arquivo (direto pro B2, com barra de progresso e drag & drop)
- ⬇️ **Download** de arquivos (URL pré-assinada) e de **pastas inteiras em `.zip`**
- 🔗 **Links públicos** para compartilhar **pasta** ou **arquivo**
- ✏️ **Renomear**, **mover** (com seleção de destino) e **excluir** pastas/arquivos
- 🗑️ **Lixeira restaurável** (soft-delete): restaurar item/subárvore, excluir de vez ou esvaziar
- 👁️ **Pré-visualização inline** de imagens, PDF, vídeo, áudio e texto (sem baixar)
- 🛡️ **Administração de usuários** (admin): papel, bloqueio e cota por usuário
- 🔎 **Busca** global por nome
- 🌗 Tema claro/escuro
- 📦 **Cota** por usuário (default 5 GB, configurável)

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

Na hora de exibir, o marcador vira a lista de arquivos daquela biblioteca — com upload para quem
é editor. O marcador também aceita o nome da biblioteca em forma de slug.

## Extração de JSON com IA (Gemini)

Uma tela só: **Extrair JSON** (`/extrair`), em **Inteligência** no menu. À esquerda a lista de
modelos; à direita o modelo selecionado, em três abas:

- **Extrair** — sobe o arquivo e sai o JSON (copiar / baixar `.json`). O arquivo vai para
  *Meus Arquivos* por padrão (consome cota); o switch desliga isso. Abaixo, as execuções do
  modelo — clicar reabre o JSON daquela execução.

### O cadastro do modelo

O botão **Novo modelo** (ou o lápis, para editar) abre um diálogo de três abas:

1. **Campos** — nome, modelo do Gemini e os campos escritos em português (“o número da nota, o
   CNPJ do emitente, a lista de itens com descrição e valor…”). Se preferir não escrever,
   **Sugerir a partir de um arquivo** sobe um documento de exemplo e a IA escreve a lista de
   campos, propõe um nome e já monta o JSON de entrega — o arquivo é só lido, não vai para o drive.
   extração devolve, na mesma ordem, **em branco quando o documento não tiver o campo**. O valor
   no template diz o tipo:

   | No template | Tipo | Ausente na extração vira |
   |---|---|---|
   | `""` | texto | `""` |
   | `null` | número | `null` |
   | `false` | booleano | `null` |
   | `[{ "col": "" }]` | lista (o objeto de dentro é a linha) | `[]` |

   salvar — é um contrato, não dado.
3. **Histórico** — quem alterou o modelo, quando e o de/para de cada campo.
`/modelos` continua funcionando: redireciona para `/extrair`.

Formatos que o Gemini lê: PDF, imagem (png/jpeg/webp/heic), áudio, vídeo, XML, CSV, JSON, HTML,
Markdown e texto — até **14 MB** (limite do `inlineData` da API). `.docx`/`.xlsx` **não** são
suportados: converta para PDF ou CSV.

O tipo declarado pelo cliente é normalizado antes de ir para a IA: `application/xml` vira
`text/xml` (a API só aceita esse nome), `text/markdown` vira `text/md`, e `application/octet-stream`
cai na extensão do arquivo. Qualquer outro formato que seja texto legível vai como `text/plain`.
Só binário desconhecido devolve 415.
</documento>

<documento repositorio="pominfacilities">
# Pomin Facilities

Sistema interno de gestão de frota e facilities do Grupo Pomin, cobrindo o dia a dia da área: veículos, custos operacionais, documentos legais/técnicos das unidades, controle financeiro e cotações de compra.

## Módulos

- **Dashboard Executivo** — visão geral em tempo real da frota (KPIs, custos mensais, custo por veículo/unidade, alertas de documentação).
- **Frota** — cadastro de veículos, abastecimentos, manutenções, pedágios, lava-rápido, seguros, multas, quilometragem, CNH dos motoristas e agendamento de veículos (com calendário mês/semana/dia).
- **Financeiro** — contas a pagar/receber por categoria e unidade, contratos com fornecedores, orçamento planejado (orçado x realizado), extração automática de dados de XML de NFe e OCR de boletos, exportação para Excel.
- **Laudos e Certificações** — controle de documentos técnicos obrigatórios das unidades (AVCB, SPDA, Brigada de Incêndio, Extintores, Dedetização, etc.), com alertas de vencimento e cronograma de renovações.
- **Orçamentos** — cotações de compra por fornecedor com numeração automática, fluxo de aprovação e integração automática com o Financeiro (aprovação gera lançamento em Contas a Pagar).
- **Configurações** — cadastros de apoio: unidades, centros de custo, motoristas, oficinas, seguradoras, fornecedores.

Todo módulo com registros individuais segue o mesmo padrão: diálogo com abas **Dados / Anexos / Histórico** (upload de PDF/imagens/planilhas + trilha de auditoria de todas as alterações).
</documento>

<documento repositorio="pominreportscfo">
# Reports CFO

> Plataforma de gestão de performance financeira com IA que conecta os números da empresa às pessoas responsáveis por eles.
> Todo desvio relevante evolui de número → explicação → responsável → plano de ação → impacto financeiro mensurável.

Fontes normativas do projeto: `soul/constitution.md` (inegociável) e `soul/arch.md`.
Desvios do `arch.md` estão documentados em `docs/adr/`. Resumo de arquitetura em `docs/architecture/overview.md`.

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
- A **nota** é calculada na geração do documento e aparece no painel lateral, com o detalhe por critério. As atualizações de tarefas e metas derivadas do relatório são aplicadas no **envio** (`POST /reports/{id}/submit`), que devolve o resumo do que mudou — ver adendo no ADR 0005.
- **Esteira de desenvolvimento** (menu *Desenvolvimento*, só CFO): quadro que leva uma demanda do próprio Reports CFO de *Demandas → Análise → Produto → Desenvolvimento → Teste → Aceite → Produção*, no mesmo fluxo da esteira do pomindev, mas com um único sistema (este). Cartão com tipo/prioridade/responsável, plano técnico gerado pela IA (`POST /dev/items/{id}/plan`, com fallback para edição à mão), branch/PR registrados e histórico de cada passo. Cancelar não apaga (`REVOKE DELETE`), e o Aceite trava enquanto o cartão não tiver plano ou PR.
- **Claude local na esteira** (só no dev server; em produção os dois endpoints respondem 404): no cartão, *Gerar plano com IA* (`POST /dev/items/{id}/plan`) roda o **Claude Code desta máquina** em modo leitura (`--restricted`: sem shell, sem edição) e grava o plano técnico; *Desenvolver com IA* (`POST /dev/items/{id}/develop`) exige o plano, deixa o Claude escrever o código **na cópia local** com as ferramentas limitadas a edição de arquivo e aos comandos do próprio repositório, guarda o resumo da execução no cartão e o move para *Teste*. Ele não faz commit nem push: quem revisa o diff e publica é você. Os dois botões respondem na hora (202) e **já movem o cartão** para a coluna do trabalho — *Produto* ou *Desenvolvimento* —, onde ele fica com o rótulo *Produtizando com IA… / Desenvolvendo com IA…* e um spinner, visível no quadro sem abrir nada; o trabalho corre no servidor e a tela se atualiza sozinha.
- **IA auditável**: LLM nunca acessa o banco; só ferramentas estreitas com a autorização do usuário. Mutations viram propostas que o usuário confirma. Generative UI tipada (registry fechado).
- Importação CSV/XLSX controlada: upload → validação → preview → mapeamento → confirmação idempotente.

## IA, tools e Generative UI

- Tools de leitura chamam os mesmos serviços da API com o `AccessContext` do usuário. Tools `propose*` nunca executam: devolvem propostas tipadas; a UI confirma via REST.
- Conteúdo de tools/importações entra no prompt como `<data>` (dado, nunca instrução).
</documento>

<documento repositorio="pominsac">
# Pomin SAC

Central interna do **Grupo Pomin** para registrar, priorizar e acompanhar **chamados de melhorias, correções e novas funcionalidades** dos sistemas do grupo (Pomin AI, Pomin Call, Pomin D, Pomin Start, Pomiro, Auditto, Solutta, Alerta Fiscal, etc).

> Construído sobre o mesmo padrão do `pominstart` — mesmo tema visual, mesmo shell, mesmo modelo de auth/RLS. Toda artefato no Supabase usa o prefixo **`pominsac_`** para coexistir no Supabase compartilhado entre projetos do grupo (vide `soul/arch.md`).

---

## 1. Visão geral

- **Stack**: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Supabase (Postgres + Auth + Edge Functions).
- **Tema**: dark-first, fonte `Oxanium`, paleta `hub-blue` (mesmo do Pomin Hub / pominstart).

---
</documento>

<documento repositorio="pominsecurity">
# PomInSecurity

Plataforma interna de **segurança e observabilidade** do Grupo Pomin. Reúne, num só painel:

- **Pentest automatizado** — recebe a URL de produção + o repositório GitHub de um projeto, roda checagens **estáticas + dinâmicas**, e usa o Claude para gerar um **relatório** no layout corporativo (OWASP Top 10 + Twelve-Factor), exportável em PDF.
- **Monitoramento / observabilidade** — coletores (agentes) reportam saúde de **servidores, domínios e robôs**; o sistema calcula estado (operacional/degradado/fora do ar), abre **incidentes automáticos com SLA**, dispara **alertas** e publica uma **status page** pública.
- **Visão geral (dashboard)** — tela inicial com contagem de servidores monitorados, OK/degradados/fora do ar, uptime, agentes online, incidentes ativos e uso médio de recursos.
- **Auditoria / Logs** — trilha **imutável** que registra quem alterou o quê, quando, de onde e o antes/depois (LGPD/ISO 27001, forensics).
- **Gestão de usuários** com **papéis granulares** e permissões por capacidade.
- **Boia de SAC** — botão salva-vidas no header que abre chamados no **pominsac** (SAC central do grupo).

Para padrões de stack e convenções do grupo, veja `../soul/arch.md`.

---

## Papéis e permissões

| Papel | Pentests | Monitoramento | Incidentes | Usuários | Auditoria |
|---|---|---|---|---|---|
| **Admin** | rodar / excluir | gerenciar | gerenciar | gerenciar | ver |
| **Operador** | rodar | gerenciar | gerenciar | — | — |
| **Auditor** | ver / exportar | ver | ver | — | **ver** |
| **Viewer** | ver | só visão geral | — | — | — |
| **user** (legado) | ver | só visão geral | — | — | — |

---

## Módulos

### 1. Pentest automatizado

### 2. Monitoramento / observabilidade
- Agentes nos hosts enviam métricas (CPU/mem/disco), **heartbeat** e estado de robôs (supervisor) via a edge function `pominsecurity-agent-ingest`.
- Entidades monitoradas: **servidores** (compute instances, com thresholds de CPU/mem/disco), **domínios** (SSL/DNS/latência) e **robôs** (programas supervisionados).
- Calcula estado **operacional / degradado / fora do ar**, gera **alertas** (CPU/mem/disco/latência/SSL/heartbeat/robot fatal…) com deduplicação e abre **incidentes automáticos**.

### 3. Incidentes & SLA
- Incidentes manuais ou **automáticos**; status `investigating → identified → monitoring → resolved`; severidade `minor/major/critical/maintenance`.
- **SLA** de resposta/resolução com prazo e marcação de "estourado"; reconhecimento (ack) e **timeline** de updates. Incidentes públicos aparecem na status page.

### 4. Status page pública (`/status`)
Banner de status geral + componentes + uptime + incidentes públicos, servida por RPCs **públicas** (sem login).

### 5. Dashboard (tela inicial)
Contagem de servidores monitorados, OK/degradados/fora do ar, uptime (30d), agentes online, incidentes ativos e uso médio de CPU/mem/disco — com fallback gracioso por papel.

### 6. Auditoria / Logs (`/admin/audit`, admin + auditor)
- Tabela `audit_logs` **append-only** (trigger de imutabilidade bloqueia UPDATE/DELETE).
- Eventos de app via RPC `audit_log_event` (LOGIN/LOGOUT já capturados).
- UI com filtros (usuário, ação, recurso, datas, busca), diff expansível e **export CSV/JSON**.

### 7. Boia de SAC

### 8. Usuários
</documento>

<documento repositorio="pominvarejo">
# PominVarejo — retaguarda de varejo

Retaguarda das lojas do Grupo Pomin: cadastro de **produto** (com tabela de preços,
tributação e níveis mercadológicos), **fornecedor** e **cliente**; **leitura das vendas
dos PDVs** (começando pela Zanthus) com armazenamento interno; **pedidos de compra**;
**entrada de notas**; e uma seção de **relatórios** em cima de tudo isso.

- **Front:** Vite + React + TypeScript + Tailwind (SPA) — porta **7572**
- **Back:** Next.js 14 (App Router, só `/api`) — porta **7472**
- **Layout:** padrão PominStart (sidebar retrátil, breadcrumb, tema claro/escuro)

---

## Leitura de PDV

O pipeline de importação está inteiro pronto e é **agnóstico de fabricante**: cada driver
sabe de qual marca a venda veio.

Ao gravar, cada item é amarrado ao produto **pelo código interno ou pelo EAN** (inclusive os
códigos de embalagem); produto que ainda não existe no cadastro entra como item solto, com
descrição e código — não trava a importação.

**Estado hoje (V1):** a chamada ao webservice da Zanthus fica para a fase de integrações
Até lá, a tela **Importações** aceita **carga por arquivo** — um JSON no formato canônico
que percorre exatamente o mesmo caminho, então tudo o que vem depois já está exercitado.

---
</documento>

<documento repositorio="pomiro">
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
- **Painel admin**: gestão de usuários (criar/bloquear/promover) por administradores.
</documento>
