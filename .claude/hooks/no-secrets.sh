#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit). Bloquea escrituras que contienen credenciales.
set -euo pipefail
text="$(node "$(dirname "$0")/_input.mjs" text)"
if printf '%s' "$text" | grep -Eq 'AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,}'; then
  echo "BLOQUEADO por no-secrets: el contenido parece una credencial. Usa variables de entorno o un gestor de secretos." >&2
  exit 2
fi
exit 0
