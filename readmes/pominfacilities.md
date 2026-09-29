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

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Supabase** (Auth + Postgres via client JS / service role — mesmo padrão dos outros apps Pomin)
- **Tailwind CSS v4** + **shadcn/ui** (Radix) + **Framer Motion**
- **Recharts** para os gráficos dos dashboards
- **xlsx** (exportação Excel) e **tesseract.js** (OCR de boletos)

## Como rodar localmente

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Configurar variáveis de ambiente — copie `.env.example` para `.env` e preencha:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. (Uma vez) aplicar o SQL em `supabase/migrations/` no SQL Editor do Supabase.
4. Rodar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
supabase/migrations/       — SQL das tabelas pominfacilities_* (aplicar uma vez no Supabase)
supabase/functions/        — Edge Functions (Deno) para ações sensíveis: aprovação de
                              pagamentos da frota, criação de usuários e troca de papéis
src/app/(app)/             — páginas autenticadas (App Router), uma pasta por módulo
src/app/api/                — rotas de API (upload, exportação, extração de documentos, etc.)
src/actions/                 — server actions (mutations) por módulo
src/lib/                     — dados via Supabase (service role), alertas, utilitários
src/components/              — componentes de UI, organizados por módulo + primitivos compartilhados (ui/)
scripts/                     — scripts pontuais de manutenção (não fazem parte da aplicação)
```
