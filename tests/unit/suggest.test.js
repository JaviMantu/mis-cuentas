import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lastAmountFor } from '../../src/domain/suggest.js';

test('AC-007.4 lastAmountFor devuelve el monto más reciente de la categoría', () => {
  const ms = [
    { kind: 'expense', amount: 1000, categoryId: 'mercado', date: '2026-09-01' },
    { kind: 'expense', amount: 2500, categoryId: 'mercado', date: '2026-09-03' },
    { kind: 'expense', amount: 9999, categoryId: 'transporte', date: '2026-09-04' },
    { kind: 'expense', amount: 3000, categoryId: 'mercado', date: '2026-09-03' },
  ];
  assert.equal(lastAmountFor(ms, 'mercado'), 3000, 'mismo día: gana el último registrado');
  assert.equal(lastAmountFor(ms, 'salud'), null);
});
