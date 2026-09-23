# mis-cuentas — CLAUDE.md

App de finanzas personales **publicada en Vercel Hobby**. Nació en el harness `ai-native-sdlc` (Amaris) y aquí sigue el mismo loop: cada cambio es un `work/NNN-*/` con intent → spec → plan → tests → código → review. Idioma: español.

## Comandos
- `make check` → unit + aceptación + evals + `deploy-check` = **definición de hecho**. Termina en `check OK · mis-cuentas`.
- `make serve` → http://localhost:4173 · `make smoke URL=<preview|prod>` → smoke contra lo desplegado.
- Verifica con `set -o pipefail`: `cmd | tail` oculta el exit code.

## Flujo obligatorio
1. `work/NNN-*/intent.md`, que aprueba una persona → `spec.md` (interfaz: skill `ui-quality`, que deriva `design-brief.md`) → `plan.md` en plan mode, commiteado antes del código.
2. Tests en rojo primero: TDD en `src/domain/` y ATDD en pantallas (skill `build-pattern`). Dinero: skill `money-safety`.
3. PR contra `main`: CI corre `make check`, Vercel publica un **preview** y el workflow `smoke` lo prueba. La revisión se hace con `REVIEW.md`.
4. **Producción = merge a `main` aprobado por una persona.** El agente nunca aprueba su PR, nunca empuja a `main` y nunca corre `vercel --prod` (el hook `production-gate` lo bloquea).

## Convenciones
- JS vanilla con ES modules y sin build: Vercel sirve `src/` tal cual. La única dependencia dev es `@playwright/test`.
- `src/domain/` es puro; `src/ui/*.js` tiene una vista por módulo; `src/store.js` es el único estado (esquema v2 con `migrate`).
- Si cambias el `<script>` inline de `index.html`, actualiza el hash CSP en `vercel.json`. `make deploy-check` lo detecta.
- Cambiar un test existente solo con un intent que declare el cambio de contrato.

## Errores que Claude ya cometió aquí (se agregan al segundo error repetido)
- Declarar `display` en una clase anula `hidden`: por eso existe `[hidden]{display:none!important}` global.
- Tras cerrar un `<dialog>` con Esc, el foco sigue un instante en su input: los atajos no deben tratarlo como escritura.
- Nombres accesibles duplicados en paneles ocultos rompen `getByLabel`: una etiqueta, un lugar.
