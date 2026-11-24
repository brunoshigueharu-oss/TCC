#!/bin/bash
# Tira quadros parados de um filme e monta uma folha de contato (2 colunas) para conferir de uma vez.
# Não é render: são só alguns quadros, pelo próprio render.js do filme.
#   quadros.sh <pasta-do-filme> <saida.jpg> <t1> <t2> ...        (tempos em segundos; até 8 por folha fica legível)
# Os quadros soltos ficam em <pasta-do-filme>/snaps/<t>.jpg (em tamanho real: abra um deles para ver detalhe).
set -euo pipefail
FILM="$1"; OUT="$2"; shift 2
export VIDEOHUB_DIR="${VIDEOHUB_DIR:-/Users/brunohigashi/Documents/Claude Code/Videohub}"
cd "$FILM"
node render.js snap "$@"
n=$#; ins=(); scale=""; cat=""; lay=""; i=0
for t in "$@"; do
  ins+=(-i "snaps/$t.jpg"); scale+="[$i:v]scale=768:-2[s$i];"; cat+="[s$i]"
  [ -n "$lay" ] && lay+="|"; lay+="$(( (i % 2) * 772 ))_$(( (i / 2) * 436 ))"; i=$((i + 1))
done
if [ "$n" -eq 1 ]; then cp "snaps/$1.jpg" "$OUT"
else ffmpeg -v error -y "${ins[@]}" -filter_complex "${scale}${cat}xstack=inputs=${n}:layout=${lay}:fill=white" -q:v 3 "$OUT"; fi
echo "folha: $OUT"
