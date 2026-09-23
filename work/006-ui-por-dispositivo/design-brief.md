# design-brief — Una interfaz para cada dispositivo

> Deriva de `intent.md` + `../../PRODUCT.md` + `../../DESIGN.md` con `ui-quality`. Hereda la dirección visual de 005; aquí solo cambia el modelo de interacción por dispositivo.

- **Intent**: `work/006-ui-por-dispositivo/intent.md`
- **Contexto**: `PRODUCT.md` · `DESIGN.md` · `work/005-rediseno-mobile/design-brief.md`

## Resumen
La app elige entre dos interfaces según las capacidades del dispositivo, no según el ancho: táctil frente a mouse. El escritorio deja de ser un móvil ancho y pasa a ser una herramienta de revisión, densa y manejable con teclado. El móvil conserva el diseño para el pulgar de 005.

## Acción primaria
- **Móvil:** registrar un gasto en 2 toques.
- **Escritorio:** revisar el mes completo de un vistazo y registrar con el teclado (G y Enter) sin tocar el mouse.

## Dirección
Estrategia Committed, igual que 005.
- **Escena de escritorio:** «Domingo en la noche, en el portátil, cuadrando el mes con calma antes de la semana». Tema claro con oscuro automático, más densidad y tipografía un escalón más chica en las filas.
- **Referencias de escritorio:** Monarch web (tabla del mes), Copilot Money para Mac (panel lateral) y Linear (atajos de una tecla).

## Alcance
Listo para producción, en las tres pestañas y el movimiento rápido, en las dos interfaces. El selector de vista es manual y se recuerda.

## Layout
- **Regla de elección:** escritorio si `(hover: hover) and (pointer: fine)` y el ancho es de 900 px o más; si no, móvil. `?ui=` o el botón de vista fuerzan una.
- **Escritorio:**
  - Riel izquierdo con marca, «+ Gasto», pestañas, la ayuda de atajos y el botón «Vista móvil».
  - Resumen a 2 columnas: encabezado y cuentas a la izquierda; próximos pagos y **Últimos movimientos** (5) a la derecha.
  - Mes como tabla con las columnas Fecha · Concepto · Cuenta · Monto · Estado.
  - Presupuesto con el formulario fijo a la izquierda y las listas a la derecha.
  - Movimiento rápido como panel lateral derecho de 420 px a toda la altura.
- **Móvil:** el de 005. Al final de Presupuesto va el botón «Vista de escritorio».

## Estados
Los de 005, más:
- últimos movimientos vacíos, con el mensaje «Aún no registras movimientos»;
- tabla del mes vacía, que muestra el mismo estado vacío de Mes;
- vista forzada, con el botón de vista mostrando la contraria.

## Interacción
- **Atajos, solo en escritorio y nunca mientras se escribe en un campo:**
  - G abre un nuevo gasto e I un nuevo ingreso;
  - 1, 2 y 3 van a Resumen, Mes y Presupuesto;
  - Esc cierra el panel.
- **Cambio de vista:** instantáneo, sin recargar, y se guarda en `localStorage`.
- **Cambio de dispositivo** (por ejemplo, rotar o conectar un mouse): la app reevalúa la regla si no hay una vista forzada.

## Contenido
- Encabezados de tabla: «Fecha», «Concepto», «Cuenta», «Monto», «Estado».
- «Últimos movimientos».
- Ayuda de atajos: «G gasto · I ingreso · 1 2 3 secciones».
- Botones: «Vista móvil» / «Vista de escritorio».

## Referencias de implementación
`ui-quality` §2, y de `impeccable` interaction-design (atajos) y responsive-design (capacidades de entrada en lugar de ancho).

## Preguntas abiertas
- Ninguna.
