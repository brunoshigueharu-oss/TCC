#!/bin/bash
# Vira um vídeo de referência em folhas de quadros (20 por folha), para ler a direção de arte e o ritmo dos cortes.
#   folha-de-video.sh <vídeo> <prefixo-de-saída> [quadros por segundo = 3] [recorte = largura:altura:x:y]
# Saída: <prefixo>_01.jpg, <prefixo>_02.jpg … (ordem de leitura: esquerda → direita, cima → baixo).
#
# Gravações de tela do iPhone do Bruno (1320×2868) com um post do X aberto:
#   vídeo deitado 16:9  → recorte 1320:744:0:942
#   vídeo quadrado      → recorte 1320:1326:0:648
# Sem recorte, usa o quadro inteiro. Confira a primeira folha: se o vídeo estiver cortado, ajuste o recorte.
set -euo pipefail
VID="$1"; PRE="$2"; FPS="${3:-3}"; CROP="${4:-}"
vf="fps=${FPS}"
[ -n "$CROP" ] && vf+=",crop=${CROP}"
dim=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$VID")
w=${dim%x*}; h=${dim#*x}
if [ -n "$CROP" ]; then w=$(echo "$CROP" | cut -d: -f1); h=$(echo "$CROP" | cut -d: -f2); fi
if [ $((w * 10)) -gt $((h * 13)) ]; then vf+=",scale=384:-2,tile=4x5:padding=4:color=white"   # deitado: 4 colunas
else vf+=",scale=300:-2,tile=5x4:padding=4:color=white"; fi                                      # quadrado ou em pé: 5 colunas
ffmpeg -v error -y -i "$VID" -vf "$vf" -q:v 4 "${PRE}_%02d.jpg"
ls "${PRE}"_*.jpg
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VID")
echo "duração: ${dur} s · ${FPS} quadros por segundo · cada folha cobre $(echo "scale=1; 20 / $FPS" | bc) s"
