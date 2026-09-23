# REVIEW.md — política de revisión de PRs

La aplica Claude (`claude-code-action` o `claude -p`) sobre cada PR, siempre igual. La escribe el tech lead y cada cambio a este archivo pasa por un PR.
El agente **no aprueba**: deja hallazgos. La aprobación es del code owner, vía branch protection.

## Contexto que se lee antes de revisar
1. `work/NNN-*/spec.md` y `plan.md` del cambio (el PR debe citarlos).
2. `CLAUDE.md` y las skills que se aplicaron.

## Pasada 1 — Bugs y cumplimiento del plan
- ¿El diff coincide con "Archivos que cambian" del `plan.md`? Si hay desviación sin actualizar el plan, es **Alta**.
- ¿Cada `AC-*` del spec tiene un test que pasa? ¿Hay tests que se debilitaron (se borraron asserts o se agregó `.skip`)? Cualquiera de los dos es **Alta**.
- Casos borde: listas vacías, días 29, 30 o 31, montos límite.

## Pasada 2 — Seguridad
- Toda inserción en `innerHTML` pasa por `esc()`. Si no, es **Crítica**.
- No hay secretos, ni `eval`, ni red nueva sin intent aprobado. Si aparece, es **Crítica**.

## Pasada 3 — Cumplimiento de políticas
- `money-safety`: centavos enteros, sin float. Si se viola, es **Alta**.
- `build-pattern`: dependencia nueva sin justificar en `plan.md`, o abstracción de un solo uso. Es **Media**.
- Accesibilidad: labels, foco y teclado. Es **Media**.

## Severidades
| Nivel | Significa | Bloquea merge |
|---|---|---|
| Crítica | riesgo de seguridad o pérdida de datos | sí |
| Alta | comportamiento incorrecto o incumple el spec | sí |
| Media | deuda o incumplimiento de patrón | no; se crea un intent si se repite |
| Nit | estilo | no; **máximo 3 por PR** |

## Excluido
- Formato que ya corrige una herramienta, y preferencias personales sin una regla escrita aquí.

## Bucle de aprendizaje
El mismo hallazgo en dos PRs distintos se vuelve una línea en `CLAUDE.md` ("Errores que Claude ya cometió aquí") o un eval nuevo.
