# WORKTREES.md — Trabajo concurrente por git worktrees

Este repo es **worktree-ready** (scaffold-repo). Separar *fuente* de *generado*; 1 scope por worktree.

## Setup (1× por clon/worktree)
```
./scripts/setup-git.sh   # merge=ours (mirrors) + core.hooksPath (pre-commit)
```

## Crear worktree
- Claude Code: `claude --worktree <scope>` → `.claude/worktrees/<scope>/`, rama `worktree-<scope>`.
- Manual: `git worktree add .claude/worktrees/<scope> -b worktree-<scope>`.
- `baseRef=fresh` (desde `origin/main`; offline → HEAD local) — `.claude/settings.json`.

## Reglas de oro
1. **Mirrors** (`AGENTS.md`/`GEMINI.md`): NO editar a mano; se regeneran (`scripts/sync-mirrors.sh`). `merge=ours` evita conflictos; regen solo en main (pre-commit).
2. **Editar solo `CLAUDE.md`** + contenido; nunca los espejos.
3. 1 scope por worktree; no editar el mismo archivo desde dos worktrees.
4. Commit/push seguido; merge feature → main; resolver en main.

## Cleanup
- Limpio sin cambios → auto-remove. Con cambios → `git worktree remove <path>` tras merge/push. `.claude/worktrees/` está gitignored.
