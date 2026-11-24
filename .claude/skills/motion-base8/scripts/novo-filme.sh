#!/bin/bash
# Cria a pasta de um filme novo a partir do filme-modelo da skill, com o render.js do VideoHub já em 60 qps.
#   novo-filme.sh <pasta-destino> [duração em s]
# A pasta-destino deve ficar na pasta de filmes do VideoHub (hub_workspace diz qual é), uma pasta por filme.
# Nunca apaga nem sobrescreve: se a pasta já existe, para.
set -euo pipefail
DEST="$1"; DUR="${2:-30}"
SKILL="$(cd "$(dirname "$0")/.." && pwd)"; HUB="${VIDEOHUB_DIR:-/Users/brunohigashi/Documents/Claude Code/Videohub}"
if [ -e "$DEST" ]; then echo "Já existe: $DEST (para refazer uma peça, arquive a versão antiga em versoes-antigas/ antes)"; exit 1; fi
mkdir -p "$DEST"; cp -R "$SKILL/assets/filme-modelo/." "$DEST/"
cp "$HUB/templates/new-film/render.js" "$DEST/render.js"
# 60 qps e pedaços de 2 s (120 quadros); o resto do script do VideoHub fica como está
perl -pi -e 's/const FPS = \+\(process\.env\.FPS \|\| \d+\), DUR = \+\(process\.env\.DUR \|\| \d+\), CH = \d+,/const FPS = +(process.env.FPS || 60), DUR = +(process.env.DUR || '"$DUR"'), CH = 120,/' "$DEST/render.js"
if ! grep -q "process.env.FPS || 60), DUR = +(process.env.DUR || $DUR), CH = 120," "$DEST/render.js"; then
  echo "AVISO: não consegui ajustar FPS/DUR/CH no render.js (o template do VideoHub mudou?). Ajuste a linha 'const FPS = …' à mão: 60 qps, CH = 120."
fi
echo "Filme criado em: $DEST (duração $DUR s). Próximo passo: editar film.js e make-audio.js."
