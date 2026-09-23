# design-brief — Que Mis Cuentas se sienta como una app de la App Store

> Deriva de `intent.md` + `../../PRODUCT.md` + `../../DESIGN.md`, con la skill `ui-quality` (flujo `impeccable shape`). Lo confirmó el product owner el 2026-09-23.
> Las sondas visuales se omitieron porque el harness no tiene generación de imágenes nativa.

- **Intent**: `work/005-rediseno-mobile/intent.md`
- **Contexto**: `PRODUCT.md` · `DESIGN.md`

## Resumen
Rediseño completo de las tres pantallas y del movimiento rápido de Mis Cuentas, para una persona que registra un gasto de pie, con una mano, en la fila del supermercado. Tiene que contestar en un vistazo cuánto hay y qué falta pagar, y dejar la acción frecuente a un toque del pulgar.

## Acción primaria
Registrar un gasto en 2 toques desde cualquier pantalla («+ Gasto» y «Guardar»). La secundaria: marcar un recurrente como pagado en 1 toque, también desde Resumen.

## Dirección
- **Color:** Committed. El púrpura Amaris lleva el encabezado y las acciones primarias.
- **Escena:** «Una persona de pie en la fila del supermercado, a plena luz, con el celular en una mano y cinco segundos para anotar lo que pagó». Por eso el tema es claro, con oscuro automático de noche.
- **Referencias:**
  - Apple Wallet: cuentas como tarjetas físicas.
  - Revolut: saldo protagonista y acciones rápidas.
  - YNAB / Monarch: qué falta frente a lo hecho.
  - Copilot Money: íconos por tipo de pago y pulido.

## Alcance
Listo para producción, sobre toda la superficie: Resumen, Mes, Presupuesto, sheet, estados vacíos y toast. Interactivo y en verde con todos los tests de aceptación. Se pule hasta que el audit no deje hallazgos P0 ni P1.

## Layout
- **Móvil (< 900 px), de arriba abajo:**
  - Encabezado púrpura con el mes, el saldo total, la frase «Te faltan $ X en N pagos este mes», la barra segmentada por recurrente y las acciones «+ Ingreso» y «Ver el mes».
  - Carrusel de cuentas.
  - Próximos pagos, con un máximo de 3.
  - Barra inferior fija: Resumen · Mes · FAB «+ Gasto» · Presupuesto.
  - Lo secundario, como agregar una cuenta, queda al final del carrusel.
- **Escritorio (≥ 900 px):** riel lateral de 248 px. Resumen en dos columnas: a la izquierda el encabezado y las cuentas, a la derecha los próximos pagos. Mes y Presupuesto van centrados con un ancho máximo de 720 px.
- **Ritmo:** 24 px entre secciones, 8 px entre filas y 16 px de margen lateral.

## Estados
- **Vacío (0 recurrentes y 0 movimientos):** ilustración SVG de billetera más «Cargar datos de ejemplo» y «Crear mi primer recurrente».
- **Mes vacío:** mensaje con un botón que lleva a Presupuesto.
- **Típico (3 a 15 recurrentes):** Pendientes primero, luego Hechos, con separador.
- **Máximo (30 o más):** la lista crece con scroll y los nombres largos se cortan con elipsis.
- **Error:** mensaje inline con `role=alert` en el campo del sheet o del formulario.
- **Éxito:** toast «Arriendo pagado · Deshacer» durante 5 s.
- **Saldo negativo:** signo menos y color rosa en la tarjeta.
- **Todo al día:** la frase cambia a «Todo al día este mes».

## Interacción
- **FAB «+ Gasto»:**
  - el sheet sube en 220 ms y el foco va al monto;
  - Enter o «Guardar» guarda y cierra;
  - Escape o «Cancelar» cierra.
- **«Pagado» / «Recibido»:** marca, el ícono pasa a check, la fila baja a Hechos y aparece el toast con «Deshacer».
- **Pestañas:** cross-fade de 150 ms; las flechas del teclado navegan entre pestañas.
- **Carrusel:** scroll-snap horizontal con el dedo o la rueda.
- **Motion:** todo se desactiva con `prefers-reduced-motion`.

## Contenido
- **Copy, en español neutro y sin em dashes:**
  - «Te faltan $ X en N pagos este mes» / «Todo al día este mes»;
  - «Próximos pagos», «Cuentas», «Agregar cuenta»;
  - «Pendientes», «Hechos»;
  - «Arriendo pagado», «Salario recibido», «Deshacer».
- **Íconos:** sprite SVG propio con trazo de 2 px, en `index.html`: casa, wifi, maletín, carrito, auto, corazón, rayo, etiqueta, efectivo, banco, tarjeta, más, check, deshacer, calendario, lista, billetera.
  - `iconFor(nombre)` elige el ícono por palabra clave.
  - `accountIcon(cuenta)` elige el de la tarjeta de cuenta.

## Referencias de implementación
`ui-quality` §2 y §3, y el DESIGN.md completo. De `impeccable`: responsive-design, interaction-design, color-and-contrast y motion-design.

## Preguntas abiertas
- Ninguna.
