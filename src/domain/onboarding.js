// work/007: del onboarding (selecciones de chips + montos) a cuentas e ítems válidos.
import { validateItem } from './budget.js';

export function buildFromOnboarding({ accounts, incomes = [], expenses = [] }) {
  const rows = [...incomes.map(r => ({ ...r, kind: 'income' })), ...expenses.map(r => ({ ...r, kind: 'expense' }))];
  const items = rows.map((r, k) => {
    const item = { id: `ob-${k + 1}-${r.templateId ?? r.categoryId}`, name: r.name, kind: r.kind, amount: r.amount, day: r.day, account: r.account, categoryId: r.categoryId };
    const errors = validateItem(item);
    if (errors.length) throw new Error(`${r.name}: revisa ${errors.join(', ')}`);
    return item;
  });
  const sum = (kind) => items.filter(i => i.kind === kind).reduce((s, i) => s + i.amount, 0);
  return { accounts, items, freeMonthly: sum('income') - sum('expense') };
}
