# review — Que Mis Cuentas se sienta como una app de la App Store

> Etapa 5 · Deploy, revisión de interfaz. Se aplicaron `impeccable audit` y `critique` (registro product) sobre capturas de 390 px (claro y oscuro), 768 px y 1440 px con los datos de ejemplo. Revisó el tech lead el 2026-09-23.

## Puntaje (heurísticas de impeccable, 0 a 4)

| Heurística | Antes del audit | Después |
|---|---|---|
| Visibilidad del estado (qué falta, qué hice) | 3 | 4 |
| Coincidencia con el mundo real (billetera, recurrentes) | 4 | 4 |
| Control y libertad (deshacer) | 4 | 4 |
| Consistencia y estándares (tab bar, sheet) | 3 | 4 |
| Prevención de errores | 3 | 3 |
| Estética y diseño mínimo | 2 | 4 |
| Accesibilidad (AA, 44 px, reduce-motion) | 3 | 4 |

## Hallazgos y cómo se cerraron

| Prioridad | Hallazgo | Corrección | Evidencia |
|---|---|---|---|
| P0 | `display` en `.empty` y `.toast` anulaba `hidden`: con datos seguían visibles el estado vacío, «Aún no hay pagos este mes» y un toast sin texto. Los tests no lo detectaban porque ninguno verificaba esa ausencia. | Regla global `[hidden] { display: none !important }`. | AC-005.9, escrito en rojo antes del fix |
| P1 | Mes con mayúscula de más («Septiembre De 2026»), por `text-transform: capitalize`. | Mayúscula solo en la primera letra, desde JS. | captura `v2-m-resumen` |
| P1 | El FAB quedaba descentrado respecto de las pestañas (columnas asimétricas). | Grilla `1fr 1fr 88px 2fr`. | captura `v2-m-resumen` |
| P1 | Las insignias de ingreso y de hecho se veían gris azulado, porque `color-mix` en OKLCH arrastraba el hue. | Mezcla en sRGB. | captura `m-presupuesto` |
| P1 | En oscuro, «Deshacer» del toast casi no se veía. | Fondo con `currentColor` al 14 %. | captura `v2-m-dark-toast` |
| P2 | En escritorio, el carrusel cortaba la tarjeta «Tarjeta» aunque sobraba espacio. | Grilla auto-fill desde 900 px; en móvil se mantiene el carrusel. | captura `v2-d-resumen` |

## Bans de ui-quality verificados
- Sin bordes laterales de color, sin texto con gradiente y sin em dashes en `src/`: el eval `ui-quality` pasa.
- El encabezado no es la plantilla «hero-metric». Lleva una frase de acción («Te faltan…») y una barra por recurrente, no una grilla de métricas.
- Glassmorphism: solo el `backdrop-filter` de la barra inferior en móvil, un patrón nativo de iOS que mantiene legible el contenido que pasa por debajo.
- Modal: el sheet de movimiento rápido está justificado en `design-brief.md`. Agregar una cuenta es un formulario en línea, no un modal.

## Pendiente conocido (no bloquea)
- Las fechas de las filas se muestran en ISO (`2026-09-05`), porque AC-002.3 fija ese formato. Pasar a «5 sep» sería un intent propio que cambie ese contrato de forma explícita.
