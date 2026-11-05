"""Recorte ampliado do rascunho com grade de 5 px (rótulos a cada 20) — e, se houver, o contorno atual por cima."""
import sys, os
from PIL import Image, ImageDraw, ImageEnhance
FOTO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "fontes", "rascunho-logo-base8.jpeg")
nome, x0, y0, x1, y1 = sys.argv[1], *map(int, sys.argv[2:6]); k = int(sys.argv[6]) if len(sys.argv) > 6 else 4
im = ImageEnhance.Contrast(Image.open(FOTO).convert("L")).enhance(2.2).convert("RGB")
c = im.crop((x0, y0, x1, y1)).resize(((x1 - x0) * k, (y1 - y0) * k), Image.LANCZOS)
ov = sys.argv[7] if len(sys.argv) > 7 else None
if ov:
    o = Image.open(ov).convert("RGBA")  # render 4x do svg em coordenadas do recorte
    c.paste(o, (0, 0), o)
d = ImageDraw.Draw(c)
for x in range((x0 // 5 + 1) * 5, x1, 5):
    X = (x - x0) * k; forte = x % 20 == 0
    d.line([(X, 0), (X, c.height)], fill=(230, 60, 60) if forte else (255, 205, 205), width=1)
    if forte: d.text((X + 2, 2), str(x), fill=(200, 0, 0))
for y in range((y0 // 5 + 1) * 5, y1, 5):
    Y = (y - y0) * k; forte = y % 20 == 0
    d.line([(0, Y), (c.width, Y)], fill=(60, 60, 230) if forte else (205, 205, 255), width=1)
    if forte: d.text((2, Y + 2), str(y), fill=(0, 0, 200))
c.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_conf", nome + ".png"))
