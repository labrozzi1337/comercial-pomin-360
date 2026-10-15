#!/usr/bin/env bash
# Gera (ou edita) uma imagem raster via Codex CLI + $imagegen (login ChatGPT, sem API paga)
# e copia o PNG validado para apps/frontend/public/images/<nome>.png.
# Uso: gerar.sh <nome-kebab> "<prompt>" [imagem-base-para-editar.png]
set -euo pipefail

nome="${1:?uso: gerar.sh <nome-kebab> \"<prompt>\" [imagem-base.png]}"
pedido="${2:?prompt obrigatório}"
base="${3:-}"
[[ "$nome" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "ERRO: nome deve ser kebab-case (ex.: hero-calculadora)" >&2; exit 1; }

command -v codex >/dev/null || { echo "ERRO: Codex CLI ausente. Instale: npm install -g @openai/codex" >&2; exit 2; }
codex login status 2>&1 | grep -qi chatgpt || { echo "ERRO: Codex não autenticado pelo ChatGPT. Rode: codex logout && codex login" >&2; exit 2; }

raiz="$(git rev-parse --show-toplevel)"
destdir="$raiz/apps/frontend/public/images"
gerados="${CODEX_HOME:-$HOME/.codex}/generated_images"
mkdir -p "$destdir" "$gerados"

log="$(mktemp)"
trap 'rm -f "$log"' EXIT

args=(exec --sandbox read-only --skip-git-repo-check -C "$raiz")
acao="Gere uma nova imagem"
if [[ -n "$base" ]]; then
  # várias imagens de referência: separe os caminhos com | (a primeira é a imagem principal)
  IFS='|' read -ra bases <<< "$base"
  for b in "${bases[@]}"; do
    [[ -f "$b" ]] || { echo "ERRO: imagem base não encontrada: $b" >&2; exit 1; }
    args+=(-i "$b")
  done
  acao="Edite a imagem anexada (preserve tudo que não for pedido)"
  (( ${#bases[@]} > 1 )) && acao="Use as imagens anexadas como referência (a primeira é a principal; as outras são referências visuais, como logos)"
fi

# env -u: impede qualquer caminho por API key paga; só o image_gen nativo (conta ChatGPT).
# "--": o -i aceita vários arquivos e engoliria o pedido como se fosse outra imagem.
env -u OPENAI_API_KEY -u CODEX_API_KEY codex "${args[@]}" -- "\$imagegen $acao usando SOMENTE a ferramenta nativa image_gen.
Proibido: scripts/image_gen.py, CLI fallback, OPENAI_API_KEY, qualquer API paga, automação de navegador.
Não crie nem altere arquivos no repositório; apenas gere a imagem (PNG) e termine.
Pedido: $pedido" </dev/null 2>&1 | tee "$log"

# A pasta de saída tem o id da sessão: assim várias gerações podem rodar em paralelo sem trocar arquivos
sessao="$(grep -oiE 'session id: [0-9a-f-]+' "$log" | head -n1 | awk '{print $3}')"
png="$(ls -t "$gerados/$sessao"/*.png 2>/dev/null | head -n1)"
[[ -n "$sessao" && -n "$png" ]] || { echo "ERRO: o Codex não gerou nenhum PNG (sessão: ${sessao:-?})" >&2; exit 3; }

# Nunca sobrescreve: hero.png -> hero-v2.png -> hero-v3.png
destino="$destdir/$nome.png"; v=2
while [[ -e "$destino" ]]; do destino="$destdir/$nome-v$v.png"; v=$((v+1)); done
cp -n "$png" "$destino"

# Validação: assinatura PNG + IHDR com largura/altura > 0
[[ "$(od -An -tx1 -N8 "$destino" | tr -d ' \n')" == "89504e470d0a1a0a" ]] || { rm -f "$destino"; echo "ERRO: arquivo não é PNG válido" >&2; exit 4; }
read -r w1 w2 w3 w4 h1 h2 h3 h4 < <(od -An -tu1 -j16 -N8 "$destino")
largura=$(( (w1<<24)|(w2<<16)|(w3<<8)|w4 )); altura=$(( (h1<<24)|(h2<<16)|(h3<<8)|h4 ))
(( largura > 0 && altura > 0 )) || { rm -f "$destino"; echo "ERRO: dimensões inválidas" >&2; exit 4; }

echo "OK origem=$png"
echo "OK arquivo=${destino#"$raiz"/} url=/images/$(basename "$destino") ${largura}x${altura} $(wc -c <"$destino") bytes"
