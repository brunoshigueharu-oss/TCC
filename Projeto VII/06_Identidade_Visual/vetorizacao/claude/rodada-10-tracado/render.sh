#!/bin/zsh
D="${0:A:h}"; CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=2 --window-size=1720,460 --screenshot="$D/_conferencia/limpo.png" "file://$D/base8-letras-tracadas.svg" 2>/dev/null
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=2 --window-size=1720,460 --screenshot="$D/_conferencia/sob.png" "file://$D/_conferencia/sobreposicao.svg" 2>/dev/null
cd "$D/_conferencia" && python3 -c "
from PIL import Image
for src in ('limpo','sob'):
  im=Image.open(src+'.png')
  for i,(a,b) in enumerate([(700,1100),(1060,1460),(1420,1800),(1770,2100),(2060,2420)]):
    im.crop(((a-700)*2,0,(b-700)*2,920)).save(f'{src}{i}.png')
"
