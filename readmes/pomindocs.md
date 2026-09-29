# PominDocs

**Plataforma de gestão de documentos do Grupo Pomin** — armazenamento estilo Dropbox com nomenclatura padronizada obrigatória, ciclo de vida de vencimento com alertas automáticos e upload programado.

> Escopo funcional completo (user stories, fluxos e regras): [ESCOPO-FUNCIONAL.md](./ESCOPO-FUNCIONAL.md)

---

## ✨ Módulos

- 📁 **Armazenamento (Módulo 1)** — pastas e subpastas (até 10 níveis), visão grade/lista, breadcrumb, drag-and-drop (mover itens e enviar arquivos do SO), favoritos por usuário, download com URL assinada, lixeira com retenção de 30 dias, busca global (⌘K / Ctrl+Q) por nome, tags e campos da máscara.
- 🏷️ **Nomenclatura personalizada (Módulo 2)** — admin define Tipos de Documento com máscaras (campos fixos, texto, lista, mês/ano, data, número). Todo upload passa pelo dialog de nomenclatura com preview ao vivo; cancelar descarta o upload (não existe arquivo "sem nome"). Renomear reabre a máscara. Valores viram metadados estruturados pesquisáveis.
- ⏰ **Vencimentos (Módulo 3)** — validade configurável por tipo (sem/opcional/obrigatória + sugestão em dias), status calculado (Válido / ≤30d / Expirado), painel `/expirations` por prioridade com ação Renovar, notificações no sino em 30/15/5/0 dias (deduplicadas por marco; renovar rearma).
- 📤 **Upload programado (Módulo 4)** — nomenclatura validada no agendamento, fila `/scheduled` com contagem regressiva, reagendar / publicar agora / cancelar, publicação automática com notificação e tratamento de conflito ("Ação necessária", nunca falha silenciosa).

## 🧱 Stack (padrão Pomin)

| Camada | Tecnologia |
|---|---|
| Frontend | Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui |
| Estado / fetch | TanStack Query · Zod |
| Backend | Supabase (Postgres · Auth · RLS · Storage · Edge Functions) |
| Container | Docker · Nginx (produção) |

Tabelas com prefixo `pomindocs_` no mesmo banco compartilhado do hub (coexistindo com `pominai_`, `pominsac_`, ...). Auth compartilhado (`auth.users`) com perfil próprio por projeto, login email/senha + Microsoft SSO, RBAC `admin`/`user`.

## 🚀 Setup

1. **Banco**: execute `supabase/migrations/20260611120000_pomindocs_init.sql` no SQL Editor do projeto Supabase do hub. Cria enums, tabelas, RLS, bucket `pomindocs` (Storage), RPCs e 3 tipos de documento de exemplo (Contrato, Nota Fiscal, Certidão).
2. **Edge functions** (gestão de usuários pelo admin):
   ```bash
   supabase functions deploy pomindocs-admin-create-user
   supabase functions deploy pomindocs-admin-update-password
   ```
3. **Frontend**:
   ```bash
   cp .env.example .env   # preencha URL e publishable key
   npm install
   npm run dev
   ```

## ⚙️ Jobs automáticos

`pomindocs_run_jobs()` (RPC `SECURITY DEFINER`) publica uploads programados vencidos, gera os alertas de vencimento (30/15/5/0 dias) e expurga a lixeira (>30 dias) e o histórico de agendamentos (>90 dias). O app chama no load e a cada 10 min. Para execução independente do app, agende via pg_cron:

```sql
SELECT cron.schedule('pomindocs-jobs', '*/10 * * * *', $$SELECT public.pomindocs_run_jobs()$$);
```

## 🧪 Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run lint     # eslint
npm run test     # vitest
```
