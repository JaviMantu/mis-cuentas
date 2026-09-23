# spec — El arriendo del 31 aparece en marzo

- **Intent**: `work/002-bug-febrero/intent.md`
- **Skills aplicadas**: `build-pattern@1` §5 (bug fix)

## Requisitos
1. `occurrencesFor` limita el día al último día del mes pedido.

## Diseño
Cambia una línea en `src/domain/budget.js`. La pantalla no cambia.

## Criterios de aceptación
- **AC-002.1** — Dado un recurrente el día 31, cuando pido las ocurrencias de febrero de 2026, entonces la fecha es 2026-02-28.
- **AC-002.2** — Dado un recurrente el día 31, cuando pido las de febrero de 2028 (bisiesto), entonces la fecha es 2028-02-29.
- **AC-002.3** — Dado un recurrente "Gimnasio" el día 31, cuando abro Mes con hoy = 2026-02-10, entonces veo "2026-02-28" y no "2026-03".

## Preocupaciones señaladas
- Ninguna.
