---
name: money-safety
description: Use when code or specs touch amounts, balances, budgets or currency formatting. Policy-as-code for money handling in Mis Cuentas.
version: 1
---

# Política de dinero

- **Representación**: los montos se guardan como enteros en centavos. `toCents()` es la única entrada y `formatMoney()` la única salida; ambas viven en `src/domain/money.js`.
- **Entrada del usuario**: el formato es es-CO, con `.` para miles y `,` para decimales. Montos vacíos, negativos, con más de 2 decimales o que no sean números se rechazan con un error explícito.
- **Signo**: lo decide `kind` (`income` o `expense`), nunca el monto. Un monto siempre es > 0.
- **Balances**: el balance de una cuenta es su saldo inicial más la suma de ingresos menos la suma de gastos, todo en centavos. Los balances no se guardan: siempre se derivan de los movimientos.
- **Idempotencia**: marcar dos veces como pagada la misma ocurrencia recurrente no duplica el movimiento. La clave es `itemId:YYYY-MM`.
- **Prohibido**: `parseFloat`, `toFixed` sobre montos y `Number(x) * 100`. El eval `money-safety` lo verifica.

Si un spec pide algo que contradice esta política, deja la preocupación en `spec.md` bajo "Preocupaciones señaladas" y resuélvela con el dueño de la política antes de construir.
