# spec — Una interfaz para cada dispositivo

- **Intent**: `work/006-ui-por-dispositivo/intent.md`
- **Brief**: `work/006-ui-por-dispositivo/design-brief.md`
- **Skills aplicadas**: `ui-quality@1`, `build-pattern@1`

## Requisitos
1. `uiFor({ hover, fine, width, override })` en `src/domain/device.js` decide entre `desktop` y `mobile`. `<html data-ui>` guarda el resultado y todo el CSS de escritorio depende de ese atributo, no de un media query de ancho.
2. En escritorio van la tabla del mes, los últimos movimientos, el panel lateral y los atajos. En móvil se mantiene la interfaz de 005.
3. La vista forzada persiste en `localStorage` (`mis-cuentas:ui`).
4. **Cambio de contrato:** AC-005.2 (la navegación depende del ancho) queda reemplazado por AC-006.1 y AC-006.2. Su test se actualiza en el mismo commit que este spec.

## Diseño
Según `design-brief.md`. El script inline de `<head>` aplica la misma regla que `uiFor` antes del primer pintado. AC-006.1 y AC-006.2 prueban que coinciden.

## Criterios de aceptación
- **AC-006.1** — Dado un dispositivo táctil sin hover de 1280 px de ancho, cuando abro la app, entonces uso la interfaz móvil con la navegación fija abajo.
- **AC-006.2** — Dado mouse y una pantalla de 1280 px, cuando abro la app, entonces uso la interfaz de escritorio: riel a la izquierda, el mes como tabla con los encabezados Fecha, Concepto, Cuenta, Monto y Estado, y el movimiento rápido como panel pegado al borde derecho.
- **AC-006.3** — Dado la interfaz de escritorio, cuando toco «Vista móvil» y recargo, entonces sigo en la interfaz móvil; y desde Presupuesto, «Vista de escritorio» me devuelve.
- **AC-006.4** — Dado la interfaz de escritorio, cuando presiono G, entonces se abre un nuevo gasto; con I, un nuevo ingreso; con 2, Mes; y mientras escribo en un campo, las teclas no disparan atajos.
- **AC-006.5** — Dado `uiFor`, cuando el dispositivo tiene hover y puntero fino con al menos 900 px, entonces devuelve desktop; si es táctil o angosto, mobile; y un override válido siempre gana.
- **AC-006.6** — Dado la interfaz de escritorio con datos de ejemplo, cuando veo Resumen, entonces aparece «Últimos movimientos» con los movimientos más recientes primero.

## Preocupaciones señaladas
- Cambiar el test de AC-005.2 contradice la regla «no editar tests existentes» del rediseño 005. Se resolvió con el dueño de los tests: aquí el cambio de comportamiento es intencional y está trazado a este spec, así que la regla no se viola. El commit lo declara.
