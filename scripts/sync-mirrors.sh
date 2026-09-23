#!/usr/bin/env bash
# sync-mirrors.sh — genera AGENTS.md + GEMINI.md desde el CLAUDE.md de ESTE repo. Idempotente.
# Convención multi-agente: editar solo CLAUDE.md; estos espejos se regeneran.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
[ -f CLAUDE.md ] || { echo "[sync-mirrors] no CLAUDE.md"; exit 0; }

# Expansión de imports `@archivo`: los lectores no-Claude (Codex, Gemini, Cursor)
# NO resuelven la sintaxis `@archivo`; si se emite literal, esa sección llega
# VACÍA al consumidor. Se inlinea el contenido con marca de procedencia.
# Recursivo con guarda de ciclo; import irresoluble se declara, no se traga.
BODY="$(python3 - "$ROOT/CLAUDE.md" <<'PY'
import sys
from pathlib import Path

def expand(text, base, seen):
    out = []
    for line in text.split("\n"):
        s = line.strip()
        if not (s.startswith("@") and len(s) > 1 and " " not in s):
            out.append(line)
            continue
        p = Path(s[1:]).expanduser()
        if not p.is_absolute():
            p = base / p
        p = p.absolute()
        if p in seen:
            out.append(f"<!-- import ciclico omitido: {s} ({p}) -->")
        elif not p.is_file():
            out.append(f"<!-- import no resuelto: {s} (no existe: {p}) -->")
        else:
            out.append(f"<!-- inline de {p} (import {s} expandido) -->")
            out.append(expand(p.read_text(encoding="utf-8").rstrip(), p.parent, seen | {p}))
    return "\n".join(out)

src = Path(sys.argv[1]).absolute()
print(expand(src.read_text(encoding="utf-8").rstrip(), src.parent, frozenset({src})).rstrip())
PY
)"

{
  echo "# AGENTS.md · Espejo de CLAUDE.md"
  echo
  echo "> Espejo generado desde CLAUDE.md por scripts/sync-mirrors.sh. Regeneración manual: edita CLAUDE.md y vuelve a correr el script."
  echo "> Imports \`@archivo\` del canon expandidos inline aquí."
  echo "> Lectores: Codex · OpenCode · Cursor · Copilot · cualquier agente agents-md."
  echo
  echo "---"
  echo
  printf '%s\n' "$BODY"
} > AGENTS.md

{
  echo "# GEMINI.md · Espejo Gemini de CLAUDE.md"
  echo
  echo "> Espejo generado desde CLAUDE.md por scripts/sync-mirrors.sh. Regeneración manual: edita CLAUDE.md y vuelve a correr el script."
  echo "> Imports \`@archivo\` del canon expandidos inline aquí."
  echo "> Lectores: Gemini CLI · Gemini Code Assist · Gems."
  echo
  echo "## Encuadre Gemini (Persona · Task · Context · Format)"
  echo "- Persona/Task/Context/Format: ver cuerpo canónico abajo."
  echo
  echo "---"
  echo
  printf '%s\n' "$BODY"
} > GEMINI.md

echo "[sync-mirrors] AGENTS.md + GEMINI.md regenerados desde CLAUDE.md"
