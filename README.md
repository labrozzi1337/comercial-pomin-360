# Pomin360 Comercial

Base monorepo para a evolução da experiência comercial: Vite no frontend, API Next.js no backend e migrations Supabase em `supabase/`.

## Desenvolvimento

1. Copie `.env.example` para `.env` e preencha as chaves apenas quando for usar Supabase.
2. Execute `npm install`.
3. Execute `npm run dev` e abra `http://localhost:8081`.

O frontend atual entrega a página comercial legada sem alterar seu HTML-fonte. Os endpoints novos começam no Next em `http://localhost:3000/api`; o health check é `GET /api/v1/health`.

## Experiência comercial v1 (apps/frontend/v1)

`http://localhost:8081/v1/` abre a primeira versão da página nova: universo 3D (three.js), rolagem com GSAP, antes × depois, capítulo de cada aplicação, demonstração ao vivo com guia do consultor (a antiga COLINHA) e o simulador de investimento (a antiga calculadora, mesma fórmula).

- Código: `src/data.ts` (catálogo, antes/depois e guias), `src/scene.ts` (3D), `src/motion.ts` (scroll e animações), `src/ui.ts` (interações), `src/calc.ts` (simulador).
- Imagens: geradas pela skill `imagens-openai`; os PNG originais ficam em `apps/frontend/imagens-originais/` e o site usa as versões WebP de `public/images/`.
- IA e Contratar continuam no `servir.py`: rode `npm run legacy:dev`, entre em `http://localhost:5360` e use a página nova em `http://localhost:8081` (o login vale para as duas portas).
- Desde 14/10/2026 a versão oficial (v3) ocupa a página principal `/`; a v1 foi para `/v1/` e a v2 continua em `/apresentacao/`.
- Antes de publicar para clientes: o simulador mostra custo e margem (recolhidos em "Visão interna"). Ele precisa ficar atrás do login do comercial, como a calculadora antiga.

## Apresentação comercial v2 (apps/frontend/apresentacao)

`http://localhost:8081/apresentacao/` abre a apresentação para conduzir reuniões: um dia comum na empresa, os episódios de cada dor em formato de streaming, quem cobra hoje (preços de tabela dos concorrentes, com link da fonte), por que citamos nomes, as 13 aplicações em 3D e uma maquete 3D de antes e depois para cada aplicação.

- Teclado: ← → ou PageUp/PageDown trocam de capítulo; F põe em tela cheia; dentro de uma demonstração, ← → trocam de aplicação.
- Conteúdo em `apresentacao/dados.ts`; maquetes em `apresentacao/demos.ts`; universo em `apresentacao/universo.ts`.
- Preços dos concorrentes: lidos nos sites oficiais em 14/10/2026, sem promoções, dólar pela PTAX do dia. Atualize `concorrentes` e `cotacao` em `dados.ts` quando for apresentar com dados novos.
- A v1 está em `http://localhost:8081/v1/` e as duas usam o mesmo catálogo e os mesmos preços (`src/data.ts`).

## Apresentação comercial v3, a versão oficial (apps/frontend/index.html e apps/frontend/v3)

`http://localhost:8081/` abre a versão oficial, "O molho de chaves", em 11 cenas. Vai do problema (cada ferramenta é uma chave, com senha, fatura e dono) à virada (tudo em um, uma chave só), passando pelo mapa do que o Pomin360 substitui, pelas aplicações e pelo placar de uso real. O roteiro aprovado está em `apps/frontend/ROTEIRO-V3.md`.

- **Teclado:** ← → trocam de cena, G abre o guia, P abre o simulador de investimento e F põe em tela cheia.
- **Menu:** é âncora e transparente, com uma entrada por cena e o botão Guia. A tecla F continua pondo em tela cheia. O endereço antigo `/v3/` redireciona para `/`.
- **Simulador de investimento:** é só para o comercial. Abre pelo rodapé, pelo cadeado do controle, pela tecla P ou pela aba Preços do guia. O código fica em `v3/simulador.ts`, com a mesma conta da calculadora antiga.
- **Páginas de cada aplicação:** `/v3/produto/?app=<id>`. Cada uma tem:
  - o vídeo;
  - o botão para abrir a aplicação;
  - o antes e depois arrastável;
  - o passo a passo;
  - quem cobra hoje;
  - o guia com o acesso interno.
- **Guia em outra janela:** `/v3/guia/`. Fica sincronizado com a apresentação e tem as abas Cena, Aplicações, Preços e Acessos. Funciona com duas janelas no mesmo computador.
- **Vídeos das aplicações:** o motor está em `v3/filme.ts` e `v3/filme.css`, e cada aplicação tem o seu roteiro em `v3/trailers/<id>.ts`. As telas foram recriadas a partir dos sistemas reais, com dados fictícios. Os textos ficam em `v3/dados.ts`.
- **Acesso de demonstração:** vem do `.env.local` na raiz, fora do git (`VITE_DEMO_EMAIL`, `VITE_DEMO_SENHA`, `VITE_DEMO_CFO_EMAIL` e `VITE_DEMO_CFO_SENHA`). Sem ele, o guia mostra só o endereço de cada sistema. Depois de criar ou mudar o arquivo, reinicie o `npm run dev`.
- **O que tem dentro:** os recursos de cada aplicação ficam em `v3/recursos.ts`. Foram levantados nas telas reais em 14/10/2026. Atualize esse arquivo quando os sistemas ganharem funções novas.
- **Imagens:** feitas pela skill `imagens-openai`, com nomes `v3-*.webp`. Os PNG originais ficam em `apps/frontend/imagens-originais/`.

## Legado preservado

`Pomin360 · Universo de soluções.html`, seus CSS/JS, `calculadora.html`, `login.html` e `servir.py` continuam na raiz, sem alterações. Para executar a versão com autenticação, IA e Mercado Pago exatamente como antes, use `npm run legacy:dev` e abra `http://localhost:5360`.

## Supabase

As migrations devem ser revisadas e aplicadas manualmente no projeto Supabase. Não há dados, tabelas ou credenciais criados por esta base; a primeira migration apenas reserva o schema `pomin360_comercial`.
