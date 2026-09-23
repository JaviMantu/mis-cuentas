#!/usr/bin/env bash
# PreToolUse (Bash). En este repo, producción = merge a main aprobado por una persona (work/008, AC-008.5).
# El agente no puede tomar atajos: vercel --prod, vercel deploy --prod ni git push a main,
# salvo que la sesión haya arrancado con RELEASE_APPROVED=1 (autorización humana explícita).
set -euo pipefail
cmd="$(node "$(dirname "$0")/_input.mjs" command)"
[ "${RELEASE_APPROVED:-0}" = "1" ] && exit 0
if printf '%s' "$cmd" | grep -Eq '(^|[;&|[:space:]])(npx[[:space:]]+)?vercel([[:space:]].*)?[[:space:]]--prod\b'; then
  echo "BLOQUEADO por production-gate: producción solo por merge a main aprobado por una persona (abre un PR; el preview es automático)." >&2
  exit 2
fi
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push\b.*([[:space:]]|:)main([[:space:]]|$)'; then
  echo "BLOQUEADO por production-gate: no se empuja a main. Empuja tu rama y abre un PR." >&2
  exit 2
fi
exit 0
