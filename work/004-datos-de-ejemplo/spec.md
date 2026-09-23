# spec — Ver la app con datos antes de cargar los míos

- **Intent**: `work/004-datos-de-ejemplo/intent.md`
- **Skills aplicadas**: `build-pattern@1`, `money-safety@1`

## Requisitos
1. `demoState(year, month)` en `src/domain/demo.js` devuelve cuentas, recurrentes y movimientos válidos para el mes pedido.
2. En Resumen, el botón «Cargar datos de ejemplo» aparece solo cuando no hay recurrentes ni movimientos.

## Diseño
Los saldos iniciales son Efectivo 200.000, Banco 1.500.000 y Tarjeta 0. Los recurrentes son:

| Recurrente | Tipo | Monto | Día | Cuenta |
|---|---|---|---|---|
| Salario | ingreso | 4.000.000 | 1 | Banco |
| Arriendo | gasto | 1.200.000 | 5 | Banco |
| Internet | gasto | 95.000 | 15 | Tarjeta |

Los movimientos son dos: el Salario del mes ya recibido y un Almuerzo de 25.000 pagado en Efectivo.

## Criterios de aceptación
- **AC-004.1** — Dado la app vacía, cuando hago clic en «Cargar datos de ejemplo», entonces el balance total es $ 5.675.000 y Mes muestra 3 recurrentes con Salario recibido.
- **AC-004.2** — Dado que ya hay datos, cuando veo Resumen, entonces el botón «Cargar datos de ejemplo» no existe.
- **AC-004.3** — Dado `demoState`, cuando valido sus recurrentes, entonces ninguno tiene errores y los movimientos suman lo esperado.

## Preocupaciones señaladas
- Ninguna.
