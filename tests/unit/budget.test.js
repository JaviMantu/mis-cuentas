import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateItem, occurrencesFor } from '../../src/domain/budget.js';

const arriendo = { id: 'a1', name: 'Arriendo', kind: 'expense', amount: 120000000, day: 5, account: 'banco' };

test('validateItem acepta un recurrente válido', () => {
  assert.deepEqual(validateItem(arriendo), []);
});

test('validateItem reporta cada campo inválido', () => {
  const errors = validateItem({ name: ' ', kind: 'gift', amount: 0, day: 32, account: '' });
  assert.deepEqual(errors.sort(), ['account', 'amount', 'day', 'kind', 'name']);
});

test('occurrencesFor genera una ocurrencia por recurrente con clave idempotente', () => {
  const [o] = occurrencesFor([arriendo], 2026, 9);
  assert.equal(o.key, 'a1:2026-09');
  assert.equal(o.date, '2026-09-05');
  assert.equal(o.amount, 120000000);
  assert.equal(o.kind, 'expense');
});

test('occurrencesFor ordena por día', () => {
  const salario = { ...arriendo, id: 's1', name: 'Salario', kind: 'income', day: 1 };
  assert.deepEqual(occurrencesFor([arriendo, salario], 2026, 9).map(o => o.name), ['Salario', 'Arriendo']);
});

// work/002-bug-febrero — test-first: estos tests se commitean en rojo antes del fix.
test('AC-002.1 un recurrente del 31 cae el 28 en febrero no bisiesto', () => {
  const [o] = occurrencesFor([{ ...arriendo, day: 31 }], 2026, 2);
  assert.equal(o.date, '2026-02-28');
});

test('AC-002.2 un recurrente del 31 cae el 29 en febrero bisiesto', () => {
  const [o] = occurrencesFor([{ ...arriendo, day: 31 }], 2028, 2);
  assert.equal(o.date, '2028-02-29');
});
