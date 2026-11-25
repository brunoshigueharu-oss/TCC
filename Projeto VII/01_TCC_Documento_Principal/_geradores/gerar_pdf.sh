#!/bin/bash
# Gera o relatório (versão com alterações controladas) e o PDF limpo, com o sumário atualizado.
# Uso:  bash gerar_pdf.sh
# O Word precisa estar instalado. O PDF sai em ../Relatório_TCC_BASE8.pdf
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
C="$HOME/Library/Group Containers/UBF8T346G9.Office"   # pasta que o Word abre sem pedir permissão
TMP="$(mktemp -d)"
cd "$AQUI"
PYTHONDONTWRITEBYTECODE=1 python3 atualizar_relatorio.py "$TMP/build" "$C/Relatorio_TCC_BASE8_limpo.docx"
# sem "atualizar campos ao abrir", para o Word não travar em um diálogo
python3 - "$C/Relatorio_TCC_BASE8_limpo.docx" "$C/Relatorio_TCC_BASE8_pdf.docx" <<'PY'
import sys, zipfile
zin = zipfile.ZipFile(sys.argv[1]); zout = zipfile.ZipFile(sys.argv[2], "w", zipfile.ZIP_DEFLATED)
for it in zin.infolist():
    data = zin.read(it.filename)
    if it.filename == "word/settings.xml":
        data = data.replace(b'<w:updateFields w:val="true"/>', b"")
    zout.writestr(it, data)
zout.close()
PY
osascript <<OSA
with timeout of 400 seconds
tell application "Microsoft Word"
  open POSIX file "$C/Relatorio_TCC_BASE8_pdf.docx"
  set d to document "Relatorio_TCC_BASE8_pdf.docx"
  update (table of contents 1 of d)
  save as d file name "$C/Relatorio_TCC_BASE8.pdf" file format format PDF
  close d saving no
end tell
end timeout
OSA
cp "$C/Relatorio_TCC_BASE8.pdf" "$AQUI/../Relatório_TCC_BASE8.pdf"
rm "$C/Relatorio_TCC_BASE8.pdf" "$C/Relatorio_TCC_BASE8_limpo.docx" "$C/Relatorio_TCC_BASE8_pdf.docx"
echo "PDF: $AQUI/../Relatório_TCC_BASE8.pdf"
