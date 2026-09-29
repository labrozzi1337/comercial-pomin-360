# @pomin/ui

O padrão visual do **PominStart** empacotado como biblioteca, para os apps do
Grupo Pomin pararem de copiar 73 componentes de um repositório para o outro.

## O que tem aqui

O kit são **três peças que só funcionam juntas**:

| Peça | O que é | Por que não dá para separar |
|---|---|---|
| `@pomin/ui` | 73 componentes React (shadcn + os nossos) | usam classes como `hub-btn-primary` e `ease-hub` |
| `@pomin/ui/styles.css` | 101 tokens de cor/raio/sombra + a camada `hub-*` | define essas classes e as variáveis CSS |
| `@pomin/ui/preset` | preset do Tailwind com o tema | liga `bg-primary`, `shadow-premium-md`, `ease-hub` aos tokens |

Sem a folha, o `<Button>` perde o gradiente e o `<Skeleton>` perde o brilho.
Sem o preset, as classes do Tailwind apontam para variáveis que não existem.

## Instalando num app

```bash
npm i github:Auditto/pomin-ui#v0.1.0
```

O `dist/` vai versionado no repositório de propósito: assim o `npm install`
dentro do Docker não precisa de token, de build nem de devDependencies.

**1. CSS** — em `src/index.css`, troque todo o bloco de tokens por uma linha:

```css
@import "@pomin/ui/styles.css";

/* daqui para baixo, o que for específico deste app */
```

**2. Tailwind** — em `tailwind.config.ts`:

```ts
import pominPreset from "@pomin/ui/preset";

export default {
  presets: [pominPreset],
  // o `content` é do app, e precisa varrer também os fontes do kit —
  // senão o Tailwind não gera as classes que só aparecem lá dentro
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@pomin/ui/dist/**/*.js"],
} satisfies Config;
```

**3. Componentes** — a migração é troca de prefixo:

```diff
-import { Button } from "@/components/ui/button";
+import { Button } from "@pomin/ui/button";
```

Os dois formatos funcionam:

```ts
import { Button, Card } from "@pomin/ui";        // barril
import { Button } from "@pomin/ui/button";       // subcaminho (recomendado)
```

O subcaminho é o recomendado porque carrega só aquele módulo — quem importa
dois componentes não leva os 73 — e porque torna a migração um find/replace.

## O shell da aplicação

O maior pedaço duplicado depois dos componentes era o layout: cada app copiava
~400 linhas de sidebar retrátil, alfinete, header de vidro e breadcrumb. Agora:

```tsx
import { AppShell } from "@pomin/ui/layout";
import { Store, LayoutDashboard, Package } from "lucide-react";

<AppShell
  brandShort="PDV"
  brand={{ name: <>Pomin<span className="text-primary">PDV</span></>, subtitle: "retaguarda", icon: Store }}
  sections={[
    { items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }] },
    { label: "Cadastros", items: [{ title: "Produtos", url: "/produtos", icon: Package }] },
    // permissão é do app: o kit não sabe o que é "admin"
    { label: "Administração", hidden: !ehAdmin, items: [...] },
  ]}
  user={{ name, email, onLogout }}
  routeLabels={{ produtos: "Produtos" }}
  storageKey="pdv"
  headerActions={<ThemeToggle />}
>
  {children}
</AppShell>
```

O que vem de graça: sidebar que expande no hover e fixa no alfinete (guardado
por app no localStorage), breadcrumb montado da URL — com UUID virando
"Detalhe" —, área de conteúdo com rolagem própria e animação de troca de rota.

`@pomin/ui/layout` é o único subcaminho que usa `react-router-dom` (peer
**opcional**). Ele fica fora do barril de propósito: um app sem router nunca
resolve esse import.

## Storybook

```bash
npm run storybook          # localhost:6006
npm run build:storybook
```

É onde o padrão se vê: paleta e tokens, as variantes do Button, o AppShell
inteiro. Tem alternador de tema claro/escuro na barra — regressão de tema é o
tipo de coisa que só aparece quando alguém troca.

## CI

Dois workflows:

- **CI** (todo push/PR): typecheck, build, Storybook — e dois guardas que
  existem por causa de escolhas deste pacote. O `dist/` é versionado para o
  `npm i github:` funcionar sem build; o preço é dar para mexer no `src` e
  esquecer de rebuildar, então a CI recusa um `dist` diferente do `src`. O
  mesmo para o barril gerado.
- **Apps-piloto** (sob demanda, ou com o label `testar-apps` no PR): baixa os
  apps que já consomem o kit e compila cada um contra o código do branch. Um
  erro aqui não aparece aqui — aparece no próximo app que atualizar a tag; este
  workflow traz isso para o PR. Chamada natural: antes de cortar tag.


## Quando o app precisa fugir do padrão

Sobrescrever **um token**: redeclare a variável depois do import.

```css
@import "@pomin/ui/styles.css";
:root { --primary: 160 84% 32%; }   /* este app é verde */
```

Sobrescrever **um componente**: crie o seu em `src/components/ui/` e importe
de lá. O kit não impede — ele é o padrão, não uma cerca. O que não vale é
copiar o kit inteiro de volta para dentro do app: aí voltamos ao problema.

## Mexendo no kit

```bash
npm install
npm run build        # tsup -> dist/ (ESM + .d.ts) e copia o CSS
npm run typecheck
```

`src/index.ts` é gerado — ao adicionar um componente, rode
`node scripts/gerar-barril.mjs`.

Uma mudança aqui afeta todos os apps, então: mudança de comportamento ou de
API sobe a **minor** e ganha nota no CHANGELOG; correção visual sobe a
**patch**. Os apps ficam presos a uma tag (`#v0.1.0`), então ninguém é
atualizado sem querer — a atualização é um passo explícito no app.
