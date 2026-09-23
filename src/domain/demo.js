// work/004: un mes de ejemplo creíble. Solo se ofrece con la app vacía. (work/007: ítems con categoría)
import { occurrencesFor } from './budget.js';
import { markDone, addMovement } from './ledger.js';

const pad = n => String(n).padStart(2, '0');

export function demoState(year, month) {
  const accounts = [
    { id: 'efectivo', name: 'Efectivo', type: 'cash', opening: 20000000 },
    { id: 'banco', name: 'Banco', type: 'bank', opening: 150000000 },
    { id: 'tarjeta', name: 'Tarjeta', type: 'card', opening: 0 },
  ];
  const items = [
    { id: 'demo-salario', name: 'Salario', kind: 'income', amount: 400000000, day: 1, account: 'banco', categoryId: 'salario' },
    { id: 'demo-arriendo', name: 'Arriendo', kind: 'expense', amount: 120000000, day: 5, account: 'banco', categoryId: 'vivienda' },
    { id: 'demo-internet', name: 'Internet', kind: 'expense', amount: 9500000, day: 15, account: 'tarjeta', categoryId: 'servicios' },
  ];
  const salario = occurrencesFor(items, year, month).find(o => o.itemId === 'demo-salario');
  let movements = markDone([], salario);
  movements = addMovement(movements, { kind: 'expense', amount: 2500000, account: 'efectivo', date: `${year}-${pad(month)}-02`, note: 'Almuerzo', categoryId: 'mercado' });
  return { accounts, items, movements, lastAccount: 'efectivo', onboarded: true };
}
