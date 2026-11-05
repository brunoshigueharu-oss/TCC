#!/bin/zsh
D="${0:A:h}"; FOTO="$D/../../fontes/rascunho-logo-base8.jpeg"
python3 "$D/gerar-rodada-9.py" "$D" "${FOTO:A}" || exit 1
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for n in _sobreposicao base8-logo; do "$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --window-size=2120,470 --screenshot="$D/_conferencia/$n.png" "file://$D/$n.svg" 2>/dev/null; done
cd "$D/_conferencia" && python3 -c "
from PIL import Image
for src,tag in (('_sobreposicao.png','sob'),('base8-logo.png','limpo')):
  im=Image.open(src)
  for i,(a,b) in enumerate([(300,720),(700,1100),(1060,1460),(1420,1800),(1770,2100),(2060,2420)]):
    c=im.crop((a-300,0,b-300,470)); c=c.resize((c.width*2,c.height*2)); c.save(f'{tag}{i}.png')
"
