#!/usr/bin/env bash
# PreToolUse (Bash). Gate de despliegue en tres niveles, igual para todos, sin excepciones por persona:
#   dev     → allow (sin salida)
#   staging → ask   (pausa y pide aprobación humana)
#   prod    → block salvo que la sesión arrancara con RELEASE_APPROVED=1 (autorización de release)
set -euo pipefail
cmd="$(node "$(dirname "$0")/_input.mjs" command)"
printf '%s' "$cmd" | grep -Eq '(make|npm run)[^;&|]*deploy' || exit 0
if printf '%s' "$cmd" | grep -Eq 'ENV=prod'; then
  if [ "${RELEASE_APPROVED:-0}" != "1" ]; then
    echo "BLOQUEADO por production-gate: despliegue a prod sin autorización de release (RELEASE_APPROVED=1). El agente no puede pasar este gate." >&2
    exit 2
  fi
  exit 0
fi
if printf '%s' "$cmd" | grep -Eq 'ENV=staging'; then
  printf '%s\n' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"production-gate: staging requiere aprobación humana"}}'
fi
exit 0
