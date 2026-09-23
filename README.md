# mis-cuentas

Mis Cuentas: finanzas personales guiadas, hecha con el AI-Native SDLC (Amaris)

Creado 2026-09-23 · **worktree-ready** (scaffold-repo).

## Setup
```
./scripts/setup-git.sh   # merge=ours + hooks
```

## Worktrees concurrentes
```
git worktree add .claude/worktrees/<scope> -b worktree-<scope>
```
Ver `WORKTREES.md`. Editar solo `CLAUDE.md`; `AGENTS.md`/`GEMINI.md` se regeneran (`scripts/sync-mirrors.sh`).
