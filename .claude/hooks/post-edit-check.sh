#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit). Feedback inmediato: si el archivo JS editado no compila, el agente lo sabe ya.
set -euo pipefail
file="$(node "$(dirname "$0")/_input.mjs" file)"
case "$file" in
  *.js|*.mjs)
    if ! out="$(node --check "$file" 2>&1)"; then
      echo "post-edit-check: $file no compila → $out" >&2
      exit 2
    fi ;;
esac
exit 0
