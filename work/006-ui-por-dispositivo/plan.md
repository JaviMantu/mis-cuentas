# plan — Una interfaz para cada dispositivo

- **Spec**: `work/006-ui-por-dispositivo/spec.md`
- **Riesgo**: medio. La interfaz de escritorio cambia en todos los tests del proyecto `escritorio` de Playwright. Mitigación: los nombres accesibles no cambian. Aprobó el tech lead.

## Archivos que cambian
- `tests/unit/device.test.js`: AC-006.5, en rojo.
- `tests/acceptance/dispositivo.spec.js`: AC-006.1 a AC-006.4 y AC-006.6, en rojo.
- `tests/acceptance/rediseno.spec.js`: se quita AC-005.2, reemplazado (spec 006 §4).
- `work/005-rediseno-mobile/spec.md`: AC-005.2 queda marcado como reemplazado.
- `src/domain/device.js`: `uiFor`.
- `src/index.html`: script de elección en `<head>`, tabla del mes, últimos movimientos y botones de vista.
- `src/styles.css`: bloque de escritorio bajo `html[data-ui="desktop"]` en lugar de `@media (min-width: 900px)`.
- `src/app.js`: `applyUi`, atajos y render de la tabla y de los últimos movimientos.

## Orden de trabajo (TDD / ATDD)
1. Spec y tests en rojo (incluido el reemplazo de AC-005.2), en un commit.
2. `uiFor` hasta verde.
3. Interfaz hasta que la suite completa quede en verde en los dos proyectos.
4. Capturas, audit y `review.md`.

## Riesgos
- **Destello de la interfaz equivocada al cargar.** Mitigación: script inline en `<head>` antes del CSS.
- **Atajos que roban teclas mientras se escribe.** Mitigación: se ignoran si el foco está en `input`, `select`, `textarea` o en un diálogo abierto, y AC-006.4 lo prueba.

## Cómo se prueba que funciona
- `make check P=ejemplo/mis-cuentas` en verde.
- Capturas de escritorio a 1440 px (Resumen, Mes y panel) y de móvil a 390 px en `review.md`.
