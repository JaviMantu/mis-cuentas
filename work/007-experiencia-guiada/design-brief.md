# design-brief — Una experiencia guiada que no te hace teclear lo que ya sabemos

> Deriva de `intent.md` + `../../PRODUCT.md` + `../../DESIGN.md`, con `ui-quality` (flujo `impeccable shape`). Hereda la dirección de 005 y el modelo por dispositivo de 006.

- **Intent**: `work/007-experiencia-guiada/intent.md`
- **Contexto**: `PRODUCT.md` · `DESIGN.md`

## Resumen
Un onboarding guiado, catálogos y plantillas que convierten la configuración en tocar chips y escribir solo montos, y una sección de Ajustes para personalizar todo eso. Es para la persona que abre Mis Cuentas por primera vez y para la que ya la usa y quiere adaptar categorías y cuentas a su vida.

## Acción primaria
Terminar el onboarding en menos de un minuto, tecleando solo montos. Después, registrar un gasto con su categoría sin escribir la categoría.

## Dirección
Estrategia Committed, como en 005.
- **Escena:** «Primera noche con la app, en el sofá, con el celular y la última factura a mano: quiero ver mi mes armado antes de dormir».
- **Referencias:**
  - Copilot Money: onboarding de cuentas con chips.
  - YNAB: asignar el dinero paso a paso.
  - Revolut: plantillas de pago recurrente con monto sugerido.
  - Ajustes de iOS: listas agrupadas con controles en línea.

## Alcance
Listo para producción, en las dos interfaces (móvil y escritorio). Cubre el onboarding de 4 pasos, el gasto rápido con categorías, Presupuesto con plantillas, Ajustes (cuentas, catálogos, vista, datos) y las fechas humanas.

## Layout
- **Onboarding.** Es un panel que ocupa el lugar de Resumen, no un modal, para que la navegación y los atajos sigan vivos.
  - Arriba: barra de progreso de 4 segmentos y «Paso N de 4».
  - Una pregunta grande por paso.
  - Chips de selección y, por cada chip elegido, una fila con monto y chips de día.
  - Pie fijo con «Atrás», «Siguiente» y «Saltar».
  - En escritorio, un ancho máximo de 640 px centrado.
- **Gasto rápido:**
  - Chips de categoría (las 6 más usadas y «Más»).
  - «Mismo monto» aparece cuando la categoría tiene historial.
  - Monto, chips de cuenta y Guardar.
- **Presupuesto.** «Agregar fijo» muestra chips de plantillas y «Otro» abre el formulario en blanco.
- **Ajustes.** Lista agrupada estilo iOS: Cuentas · Catálogos (pestañas Ingresos · Gastos · Plantillas) · Vista · Datos. En escritorio va a 2 columnas: índice de grupos y contenido.
- **Navegación:** 4 pestañas y el FAB. La barra móvil queda simétrica y en escritorio se usa el riel.

## Estados
- Primer uso: onboarding en el paso 1.
- Onboarding saltado: Resumen vacío con «Configurar en 1 minuto».
- Paso sin selección: «Siguiente» sigue habilitado, porque todo es opcional.
- Monto inválido en una fila: error en línea en esa fila, y no se avanza.
- Paso 4 sin ingresos ni gastos: «Aún no hay fijos; puedes agregarlos después».
- Categoría archivada: desaparece de los chips, pero sigue en el historial con su nombre.
- «Empezar de cero»: pide confirmación en línea y vuelve al paso 1.

## Interacción
- Tocar un chip de ingreso o plantilla lo agrega y abre su fila, con el foco en el monto. Tocarlo de nuevo lo quita.
- Los chips de día se eligen con un toque; «Otro» abre un campo numérico.
- «Mismo monto» llena el monto con el último de esa categoría, así que no hay que teclear.
- En Ajustes, renombrar ocurre en línea (Enter guarda y Esc cancela) y archivar se revierte con «Deshacer».
- Motion: el cambio de paso es un cross-fade de 150 ms y la barra de progreso crece en 200 ms (la barra se anima; los números no). Todo se apaga con reduced-motion.

## Contenido
- Paso 1: «¿Dónde tienes tu plata?», con chips Efectivo · Banco · Tarjeta de crédito · Billetera digital.
- Paso 2: «¿Qué te entra cada mes?», con los tipos de ingreso del catálogo.
- Paso 3: «¿Qué pagas fijo cada mes?», con las plantillas agrupadas por categoría.
- Paso 4: «Listo. Te quedan $ X libres al mes».
- Botones: «Saltar», «Siguiente», «Atrás», «Empezar», «Configurar en 1 minuto», «Mismo monto», «Agregar fijo», «Otro», «Empezar de cero».
- Fechas en formato «5 sep».

## Referencias de implementación
`ui-quality` §2 y §3, y de impeccable: onboard, interaction-design y ux-writing.

## Preguntas abiertas
- Ninguna.
