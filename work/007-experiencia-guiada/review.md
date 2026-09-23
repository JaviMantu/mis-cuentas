# review — Una experiencia guiada que no te hace teclear lo que ya sabemos

> Revisión de interfaz con `impeccable audit` y `critique` sobre capturas a 390 px (claro y oscuro) y 1440 px: onboarding paso a paso, gasto rápido con categorías, Presupuesto con plantillas y Ajustes. Revisó el tech lead el 2026-09-23.

## Qué cambió

| Antes (006) | Ahora (007) |
|---|---|
| La primera visita caía en un Resumen vacío y un formulario | Onboarding de 4 pasos: cuentas, ingresos, fijos y «Te quedan $ X libres al mes» |
| Cada fijo se escribía a mano: nombre, tipo y día | Chips de plantillas con el día sugerido; solo se escribe el monto |
| Gastos sin categoría | Chips de categoría en el gasto rápido y «Mismo monto» con el último valor |
| Tres cuentas fijas | Cuentas con nombre libre y tipo (efectivo, banco, tarjeta, billetera) |
| Sin lugar para personalizar | Ajustes: cuentas, catálogos (agregar, renombrar, archivar), vista Automático y «Empezar de cero» |
| Fechas `2026-09-05` | «5 sep» (cambio de contrato declarado en AC-002.3) |
| `app.js` de 334 líneas | `store.js` + 9 módulos en `ui/`, todos de menos de 180 líneas; dominio v2 con `migrate` |

## Puntaje (heurísticas de impeccable, 0 a 4)

| Heurística | 006 | 007 |
|---|---|---|
| Reconocer antes que recordar (catálogos, plantillas) | 2 | 4 |
| Flexibilidad y eficiencia (Mismo monto, atajos) | 3 | 4 |
| Ayuda al primer uso (onboarding) | 1 | 4 |
| Control y libertad (saltar, atrás, deshacer y restaurar) | 4 | 4 |
| Consistencia (chips con el mismo vocabulario en todas partes) | 3 | 4 |

## Hallazgos y cómo se cerraron

| Prioridad | Hallazgo | Corrección | Evidencia |
|---|---|---|---|
| P1 | Cada toque en un chip del onboarding repintaba el paso y repetía el fundido: todo el paso parpadeaba. | La animación corre solo al cambiar de paso (`is-entering`). | AC-007.14: falla con el código anterior (verificado con `git stash`) y pasa con el fix |
| P1 | Al ocultarse, el HTML del onboarding quedaba en el DOM, y sus etiquetas («Monto de…») podían chocar con `getByLabel('Monto')` del gasto rápido. | Al ocultarse se vacía el contenedor. | Suite en verde en los 2 proyectos |
| P1 | «Nombre de la cuenta» existía dos veces: en el formulario en línea de Resumen y en Ajustes. | Agregar cuenta vive solo en Ajustes; la tarjeta «Agregar cuenta» de Resumen lleva allí y enfoca el campo. | AC-007.11 |
| P2 | «Archivar» usaba el ícono de basura, que sugiere borrar para siempre. | Ícono de archivo propio. | captura de Ajustes |
| P2 | El resumen del paso 4 usaba íconos genéricos. | Ícono de la categoría. | captura `ob4` |
| Nota | Las primeras capturas se veían lavadas porque se tomaron durante el fundido de 150 ms. No era un bug, pero reveló el P1 del parpadeo. | Capturas repetidas después de la animación. | `sheet2` |

## Verificación
- `set -o pipefail; make check P=ejemplo/mis-cuentas` → exit 0.
- La aceptación completa corre con `--repeat-each=3` sin intermitencias.
- Migración: los estados v1 que siembran los tests anteriores (y el de cualquier usuario) no ven el onboarding y conservan sus datos (AC-007.1 y los 40 tests anteriores).

## Pendiente conocido (no bloquea)
- La fase B (repo aparte para Vercel Hobby) y la fase C (entregables de clase) tienen su propio plan.
