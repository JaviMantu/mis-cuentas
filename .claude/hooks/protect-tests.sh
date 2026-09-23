#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit). Si la sesión arrancó con FIX_MODE=1, bloquea editar tests/:
# en un bug fix se arregla el código, nunca el test. Exit 2 = bloquear (stderr vuelve al agente).
set -euo pipefail
[ "${FIX_MODE:-0}" = "1" ] || exit 0
file="$(node "$(dirname "$0")/_input.mjs" file)"
case "$file" in
  */tests/*|tests/*)
    echo "BLOQUEADO por protect-tests: FIX_MODE=1 protege $file. Arregla el código, no el test." >&2
    exit 2 ;;
esac
exit 0
