#!/bin/bash
# Versão final do relatório (24/11/2026): .docx limpo (sem alterações controladas) + PDF.
# Uso:  bash gerar_final.sh <docx-limpo-do-atualizar_relatorio.py> <pasta-de-saída>
#   O docx limpo sai de:  python3 atualizar_relatorio.py <tmp> <tmp>/limpo.docx
# Faz até 3 passadas: as listas de figuras, quadros e tabelas recebem as páginas lidas do PDF anterior.
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
LIMPO="$1"; SAIDA="$2"
C="$HOME/Library/Group Containers/UBF8T346G9.Office"   # pasta que o Word abre sem pedir permissão
TMP="$(mktemp -d)"
FINAL="$SAIDA/Relatório_TCC_BASE8.docx"
PDF="$SAIDA/Relatório_TCC_BASE8.pdf"

pdf_do_word() {
  python3 - "$FINAL" "$C/Relatorio_final_pdf.docx" <<'PY'
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
  open POSIX file "$C/Relatorio_final_pdf.docx"
  set d to document "Relatorio_final_pdf.docx"
  update (table of contents 1 of d)
  save as d file name "$C/Relatorio_final.pdf" file format format PDF
  close d saving no
end tell
end timeout
OSA
  cp "$C/Relatorio_final.pdf" "$PDF"
  rm -f "$C/Relatorio_final.pdf" "$C/Relatorio_final_pdf.docx"
}

ANT=""
for passada in 1 2 3; do
  cd "$AQUI"
  PYTHONDONTWRITEBYTECODE=1 python3 finalizar_relatorio.py "$LIMPO" "$FINAL" "$TMP/paginas.json"
  rm -rf "$FINAL.dir"
  pdf_do_word
  swift "$AQUI/paginas_legendas.swift" "$PDF" > "$TMP/paginas.json"
  NOVO="$(cat "$TMP/paginas.json")"
  echo "passada $passada: $(echo "$NOVO" | head -c 120)…"
  [ "$passada" -gt 1 ] && [ "$NOVO" = "$ANT" ] && break
  ANT="$NOVO"
done
echo "docx: $FINAL"
echo "PDF:  $PDF"
