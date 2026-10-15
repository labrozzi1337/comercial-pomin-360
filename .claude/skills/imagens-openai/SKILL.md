---
name: imagens-openai
description: Cria ou edita imagens raster (PNG/fotos/ilustrações/banners/texturas) para o frontend delegando exclusivamente ao Codex CLI com $imagegen autenticado pelo ChatGPT, copia o PNG para apps/frontend/public/images, valida e integra na aplicação. Use sempre que precisar de uma imagem bitmap nova ou editada. Não use para SVG, ícones vetoriais ou visuais que CSS/HTML resolvem.
---

# imagens-openai

Divisão de papéis:
- **Claude** (agente principal): código, componentes, CSS, integrações e o uso da imagem na aplicação.
- **Codex CLI + `$imagegen`**: única fonte de imagens raster, via ferramenta nativa `image_gen` da conta ChatGPT.

## Proibido
- `OPENAI_API_KEY`, `CODEX_API_KEY`, `scripts/image_gen.py` (fallback CLI pago) ou qualquer API paga.
- Automação de navegador (Playwright etc.) para gerar imagens, e outros geradores (MCPs de imagem, Higgsfield etc.).
- Gerar a imagem por conta própria ou substituí-la por placeholder em SVG/CSS quando o pedido é raster.

## Fluxo
1. Escreva um prompt objetivo (uso, assunto, estilo, enquadramento, paleta, texto literal se houver, o que evitar) e um nome kebab-case.
2. Rode a partir da raiz do repositório (timeout de 600000 ms, a geração leva de 1 a 3 min):
   ```bash
   bash .claude/skills/imagens-openai/gerar.sh <nome> "<prompt>"              # gerar
   bash .claude/skills/imagens-openai/gerar.sh <nome> "<prompt>" caminho.png  # editar (imagem anexada)
   ```
   O script remove as API keys do ambiente, executa `codex exec` em sandbox read-only, localiza o PNG novo em `~/.codex/generated_images`, copia para `apps/frontend/public/images/` (nunca sobrescreve: cria `-v2`, `-v3`) e valida a assinatura PNG e as dimensões.
3. Confira a saída `OK arquivo=... url=/images/<nome>.png LxA` e abra o PNG com a ferramenta Read para checar visualmente o resultado. Se ficar ruim, rode de novo com um ajuste pontual no prompt.
4. Integre: no código, referencie pela URL pública `/images/<nome>.png` (Vite serve `public/` na raiz e copia para `dist/`). Sempre informe `alt`, `width`/`height` (evita layout shift) e `loading="lazy"` quando a imagem estiver abaixo da dobra.
5. Valide com `npm run build` e confira se `apps/frontend/dist/images/<nome>.png` existe.

## Códigos de saída do script
- `2`: Codex ausente (`npm install -g @openai/codex`) ou não autenticado pelo ChatGPT (`codex logout && codex login`, escolher "Sign in with ChatGPT").
- `3`: o Codex não gerou PNG. Verifique o plano ChatGPT e `codex features list | grep image_generation` (deve estar `true`); ative com `codex features enable image_generation`.
- `4`: arquivo inválido (descartado).
