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
PAGINA_FILE="${PAGINA%%[#?]*}"
if [[ "$PAGINA_FILE" = /* ]]; then
  RUTA_HTML="$PAGINA"
  RUTA_CHECK="$PAGINA_FILE"
else
  RUTA_HTML="$DIR/$PAGINA"
  RUTA_CHECK="$DIR/$PAGINA_FILE"
fi

if [[ ! -f "$RUTA_CHECK" ]]; then
  echo "Error: No se encontró el archivo $RUTA_CHECK" >&2
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

# Parámetro opcional para espera de virtual time (ej. para superar loaders simulados)
TIEMPO_ESPERA="${3:-}"
EXTRA_FLAGS=""
if [[ -n "$TIEMPO_ESPERA" ]]; then
  EXTRA_FLAGS="--virtual-time-budget=$TIEMPO_ESPERA"
elif [[ "$PAGINA" == *"index.html"* ]]; then
  EXTRA_FLAGS="--virtual-time-budget=6500"
fi

# Ejecutar Chromium en modo headless
chromium --headless --disable-gpu $EXTRA_FLAGS --screenshot="$ARCHIVO_SALIDA" --window-size="$DIMENSIONES" "file://$RUTA_HTML" >/dev/null 2>&1

# Imprimir la ruta absoluta del archivo generado para que view_file pueda abrirlo
echo "$ARCHIVO_SALIDA"

