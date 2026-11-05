#!/bin/zsh
# uso: ./ov.sh nome x0 y0 x1 y1 k  → _conf/nome.png (rascunho + grade + contorno magenta)
D="${0:A:h}"; n=$1; x0=$2; y0=$3; x1=$4; y1=$5; k=${6:-3}
python3 "$D/contorno.py" $x0 $y0 $x1 $y1 $k >/dev/null || exit 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 \
  --window-size=$(( (x1-x0)*k )),$(( (y1-y0)*k )) --screenshot="$D/_conf/_ov.png" "file://$D/_conf/_ov.svg" 2>/dev/null
python3 "$D/_grade.py" $n $x0 $y0 $x1 $y1 $k "$D/_conf/_ov.png"
