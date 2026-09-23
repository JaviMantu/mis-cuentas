# intent — El arriendo del 31 aparece en marzo

> Etapa 1 · Plan. Un bug reportado por un usuario se escribe como intent en el mismo formato.

- **ID**: 002
- **Origen**: reporte de un usuario, pantalla Mes, 2026-02-10
- **Estado**: aprobado

## Problema
Tengo un recurrente el día 31. En febrero, la pantalla Mes lo muestra con fecha 2026-03-03: se cuela en el mes siguiente y el pendiente de febrero queda mal.

## Resultado esperado
Un recurrente de un día que no existe en el mes cae en el último día de ese mes: 28 o 29 de febrero, o 30 en los meses de 30 días.

## Usuarios y sistemas afectados
- Toda persona con recurrentes en los días 29, 30 o 31.

## Restricciones
- Es un bug fix test-first: primero un test que falle, después el fix. El test no se toca, y `FIX_MODE=1` lo garantiza con el hook `protect-tests`.

## Fuera de alcance
- Reglas del tipo "día hábil anterior".

## Preguntas abiertas
- Ninguna.
