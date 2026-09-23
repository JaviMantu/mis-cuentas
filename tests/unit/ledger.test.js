import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balances, markDone, pending, addMovement } from '../../src/domain/ledger.js';

const accounts = [
  { id: 'efectivo', name: 'Efectivo', opening: 100010 },
  { id: 'banco', name: 'Banco', opening: 200020 },
];
const occ = { key: 'a1:2026-09', itemId: 'a1', name: 'Arriendo', kind: 'expense', amount: 50000, account: 'banco', date: '2026-09-05' };

test('balances = saldo inicial + ingresos − gastos, exacto en centavos', () => {
  const movements = [
    { kind: 'income', amount: 10, account: 'efectivo' },
    { kind: 'expense', amount: 20, account: 'efectivo' },
  ];
  const b = balances(accounts, movements);
  assert.equal(b.byAccount.efectivo, 100000);
  assert.equal(b.byAccount.banco, 200020);
  assert.equal(b.total, 300020);
});

test('markDone crea el movimiento de la ocurrencia y es idempotente', () => {
  const once = markDone([], occ);
  const twice = markDone(once, occ);
  assert.equal(once.length, 1);
  assert.equal(twice, once, 'segunda vez devuelve la misma lista, sin duplicar');
  assert.equal(once[0].occurrenceKey, 'a1:2026-09');
});

test('pending excluye las ocurrencias ya marcadas', () => {
  const other = { ...occ, key: 'b2:2026-09', itemId: 'b2' };
  assert.deepEqual(pending([occ, other], markDone([], occ)).map(o => o.key), ['b2:2026-09']);
});

test('addMovement valida monto y tipo antes de agregar', () => {
  const ok = addMovement([], { kind: 'expense', amount: 2500000, account: 'banco', date: '2026-09-23' });
  assert.equal(ok.length, 1);
  assert.throws(() => addMovement([], { kind: 'expense', amount: -1, account: 'banco', date: '2026-09-23' }), /monto/i);
  assert.throws(() => addMovement([], { kind: 'x', amount: 1, account: 'banco', date: '2026-09-23' }), /tipo/i);
});

// work/005 — deshacer una acción de un toque
import { unmarkDone } from '../../src/domain/ledger.js';

test('AC-005.7 unmarkDone quita solo el movimiento de esa ocurrencia y es idempotente', () => {
  const other = { ...occ, key: 'b2:2026-09', itemId: 'b2' };
  const both = markDone(markDone([], occ), other);
  const undone = unmarkDone(both, 'a1:2026-09');
  assert.deepEqual(undone.map(m => m.occurrenceKey), ['b2:2026-09']);
  assert.deepEqual(unmarkDone(undone, 'a1:2026-09'), undone);
});
