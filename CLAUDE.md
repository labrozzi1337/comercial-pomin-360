# Pomin360 Comercial

## Imagens raster: somente via Codex
Claude é o agente principal: código, componentes, CSS e integrações. Para criar ou editar qualquer imagem raster do frontend, use **exclusivamente** a skill `imagens-openai` (`.claude/skills/imagens-openai/SKILL.md`), que delega ao Codex CLI com `$imagegen` autenticado pelo ChatGPT e salva em `apps/frontend/public/images/`.

Proibido: `OPENAI_API_KEY`, APIs pagas, scripts de automação do navegador ou qualquer alternativa que gere cobrança adicional.
