# spec — Llevar mis cuentas personales con pocos clics

> Etapa 2 · Design. Se generó con la skill `intent-to-spec@1` a partir de `intent.md`. Lo aprobó el product owner.

- **Intent**: `work/001-marcar-pagado/intent.md`
- **Skills aplicadas**: `money-safety@1`, `build-pattern@1`

## Requisitos
1. Cada cuenta tiene nombre y saldo inicial. Por defecto hay tres: Efectivo, Banco y Tarjeta.
2. El presupuesto guarda recurrentes con nombre, tipo (ingreso o gasto), monto, día del mes (1–31) y cuenta.
3. La pantalla Mes lista las ocurrencias del mes en curso. "Pagado" o "Recibido" crea el movimiento en **1 clic**.
4. El movimiento rápido de un gasto o ingreso se registra en **≤ 2 clics** además de escribir el monto.
5. El balance de cada cuenta es su saldo inicial + ingresos − gastos. El total es la suma de las cuentas. Todo es exacto al centavo.
6. Los datos sobreviven a recargar la página, porque se guardan en `localStorage`.

## Diseño
- Es una sola página, `src/index.html`, con tres pestañas (Resumen, Mes y Presupuesto) y dos botones fijos: **+ Gasto** y **+ Ingreso**.
- El movimiento rápido se hace con el `<dialog>` nativo. El monto recibe el foco al abrirlo y la cuenta viene preseleccionada con la última usada. El botón Guardar también responde a Enter.
- El dominio es puro y va en `src/domain/`: `money.js`, `budget.js` y `ledger.js`. La UI (`app.js`) solo pinta y delega en el dominio.
- Para las pruebas, la fecha de "hoy" se puede fijar con `?hoy=AAAA-MM-DD`.

## Criterios de aceptación
- **AC-001.1** — Dado un recurrente de gasto "Arriendo" de 1.200.000 el día 5 en Banco, cuando en Mes hago clic en "Pagado", entonces el balance de Banco baja 1.200.000 y el ítem se muestra como pagado.
- **AC-001.2** — Dado un recurrente de ingreso "Salario" de 4.000.000 en Banco, cuando hago clic en "Recibido", entonces el balance de Banco sube 4.000.000.
- **AC-001.3** — Dado que estoy en Resumen, cuando hago clic en "+ Gasto", escribo 25.000 y hago clic en "Guardar", entonces el balance de la cuenta seleccionada baja 25.000 con 2 clics.
- **AC-001.4** — Dado Efectivo con saldo inicial 1.000,10 y Banco con 2.000,20, cuando veo Resumen, entonces el total es 3.000,30.
- **AC-001.5** — Dado un recurrente ya marcado como pagado, cuando recargo la página, entonces sigue pagado y no hay forma de marcarlo dos veces.
- **AC-001.6** — Dado el formulario de movimiento rápido, cuando escribo un monto inválido como "abc" o "-5", entonces no se guarda y veo un mensaje de error.

## Preocupaciones señaladas
- Guardar solo en el navegador significa que si se borran los datos del navegador, se pierde todo. La dueña del producto lo acepta para esta versión: el export queda como intent futuro.
