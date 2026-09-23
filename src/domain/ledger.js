// Libro de movimientos. Los balances nunca se guardan: se derivan. (skill money-safety)
import { KINDS } from './budget.js';

export function addMovement(movements, m) {
  if (!Number.isInteger(m.amount) || m.amount <= 0) throw new Error('monto inválido');
  if (!KINDS.includes(m.kind)) throw new Error('tipo inválido');
  if (!m.account) throw new Error('cuenta requerida');
  return [...movements, { id: m.id ?? crypto.randomUUID(), ...m }];
}

export function markDone(movements, occ) {
  if (movements.some(m => m.occurrenceKey === occ.key)) return movements;
  return addMovement(movements, {
    kind: occ.kind, amount: occ.amount, account: occ.account,
    date: occ.date, note: occ.name, occurrenceKey: occ.key, categoryId: occ.categoryId,
  });
}

export function pending(occurrences, movements) {
  const done = new Set(movements.map(m => m.occurrenceKey).filter(Boolean));
  return occurrences.filter(o => !done.has(o.key));
}

export function balances(accounts, movements) {
  const byAccount = Object.fromEntries(accounts.map(a => [a.id, a.opening]));
  for (const m of movements) {
    if (m.account in byAccount) byAccount[m.account] += m.kind === 'income' ? m.amount : -m.amount;
  }
  const total = Object.values(byAccount).reduce((s, v) => s + v, 0);
  return { byAccount, total };
}

// work/005: toda acción de un toque se puede deshacer.
export function unmarkDone(movements, key) {
  return movements.some(m => m.occurrenceKey === key) ? movements.filter(m => m.occurrenceKey !== key) : movements;
}
