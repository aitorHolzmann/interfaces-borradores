#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE CAPTURA VISUAL HEADLESS (PREVIEW)
# Permite al agente (y al desarrollador) renderizar cualquier página del proyecto
# y generar un screenshot PNG instantáneo para inspección visual con view_file.
#
# Uso:
#   ./scripts/preview.sh [pagina.html] [desktop|mobile|tablet]
# Ejemplos:
#   ./scripts/preview.sh index.html desktop
#   ./scripts/preview.sh login.html mobile
#   ./scripts/preview.sh game.html desktop
# ==============================================================================

set -euo pipefail

# Directorio raíz del proyecto
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PAGINA="${1:-index.html}"
DISPOSITIVO="${2:-desktop}"

# Resolver ruta completa del archivo HTML
if [[ "$PAGINA" = /* ]]; then
  RUTA_HTML="$PAGINA"
else
  RUTA_HTML="$DIR/$PAGINA"
fi

if [[ ! -f "$RUTA_HTML" ]]; then
  echo "Error: No se encontró el archivo $RUTA_HTML" >&2
  exit 1
fi

# Configurar dimensiones según el viewport solicitado
case "$DISPOSITIVO" in
  mobile)
    DIMENSIONES="390,844"
    ;;
  tablet)
    DIMENSIONES="768,1024"
    ;;
  desktop|*)
    DIMENSIONES="1440,900"
    DISPOSITIVO="desktop"
    ;;
esac

ARCHIVO_SALIDA="/tmp/preview_${DISPOSITIVO}.png"

# Ejecutar Chromium en modo headless
chromium --headless --disable-gpu --screenshot="$ARCHIVO_SALIDA" --window-size="$DIMENSIONES" "file://$RUTA_HTML" >/dev/null 2>&1

# Imprimir la ruta absoluta del archivo generado para que view_file pueda abrirlo
echo "$ARCHIVO_SALIDA"

