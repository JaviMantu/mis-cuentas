// Presupuesto: recurrentes mensuales y sus ocurrencias por mes.

export const KINDS = ['income', 'expense'];

export function validateItem(item) {
  const errors = [];
  if (!item.name?.trim()) errors.push('name');
  if (!KINDS.includes(item.kind)) errors.push('kind');
  if (!Number.isInteger(item.amount) || item.amount <= 0) errors.push('amount');
  if (!Number.isInteger(item.day) || item.day < 1 || item.day > 31) errors.push('day');
  if (!item.account) errors.push('account');
  return errors;
}

const pad = n => String(n).padStart(2, '0');

export function occurrencesFor(items, year, month) {
  return items
    .map(item => {
      const lastDay = new Date(year, month, 0).getDate(); // work/002: día 31 en febrero → último día
      const d = new Date(year, month - 1, Math.min(item.day, lastDay));
      return {
        key: `${item.id}:${year}-${pad(month)}`,
        itemId: item.id,
        name: item.name,
        kind: item.kind,
        amount: item.amount,
        account: item.account,
        day: item.day,
        categoryId: item.categoryId,
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      };
    })
    .sort((a, b) => a.day - b.day);
}
