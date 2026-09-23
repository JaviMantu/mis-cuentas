# review — Una interfaz para cada dispositivo

> Revisión de interfaz con `impeccable audit` y `critique` sobre capturas de escritorio a 1440 px (claro y oscuro), tablet táctil a 1180 px y móvil a 390 px. Revisó el tech lead el 2026-09-23.

## Qué cambió frente a 005

| | Móvil (táctil) | Escritorio (mouse, 900 px o más) |
|---|---|---|
| Navegación | barra inferior con el botón «+ Gasto» elevado | riel lateral con «+ Gasto», ayuda de atajos y «Vista móvil» |
| Resumen | encabezado, carrusel de cuentas y próximos pagos | 2 columnas: encabezado y cuentas en grilla \| próximos pagos y **últimos movimientos** |
| Mes | tarjetas con pendientes y hechos | **tabla** con Fecha · Concepto · Cuenta · Monto · Estado |
| Presupuesto | formulario arriba y listas abajo | formulario fijo a la izquierda y listas a la derecha |
| Movimiento rápido | panel inferior | **panel lateral derecho** a toda la altura |
| Teclado | no aplica | G, I, 1, 2, 3 y Esc |
| Tablet táctil apaisada | usa la interfaz móvil (antes mostraba el riel de mouse) | no aplica |

## Hallazgos y cómo se cerraron

| Prioridad | Hallazgo | Corrección | Evidencia |
|---|---|---|---|
| P0 | La columna Concepto de la tabla colapsaba a una letra y los encabezados Concepto y Cuenta se superponían. Venía del `max-width: 800px` heredado de 005 más columnas fijas. | `#mes` a 1120 px y columnas con `minmax`. | Regresión agregada a AC-006.2, en rojo antes del fix |
| P1 | El bloque de atajos quedó dentro de `save()` al editar y no se registraba. | Se movió al final del módulo; AC-006.4 lo cubre. | commit del fix |
| P1 | Atajo ignorado justo después de cerrar el panel con Esc (35 de 40 intentos): Chrome deja el foco en el input oculto hasta el evento `close`, y la guarda «escribiendo» lo contaba. | La guarda ignora campos dentro de un `dialog` cerrado. Se detectó porque AC-006.4 era intermitente; se reprodujo en un bucle antes de corregir. | 40/40 en el bucle y 60 repeticiones en verde |
| P1 | En el proyecto móvil de Playwright, los contextos «mouse» del test heredaban el touch. | Contexto explícito sin touch en `dispositivo.spec.js`. Era un defecto del test, no de la app. | 40/40 en verde |

## Cambio de contrato declarado
AC-005.2 («la navegación depende del ancho») se reemplazó por AC-006.1 y AC-006.2. La razón está en `spec.md` §4, y el test cambió en el mismo commit que el spec. Es la forma correcta de modificar un test existente: con un intent que lo justifica, no en silencio.

## Pendiente conocido
- Hay un solo «Vista móvil» / «Vista de escritorio». Falta una opción «Automático» para volver a la regla del dispositivo después de forzar una vista; hoy se logra borrando `mis-cuentas:ui` o forzando la vista que corresponde al dispositivo.
