import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrate, freshState, VERSION } from '../../src/domain/schema.js';

const v1 = {
  accounts: [{ id: 'efectivo', name: 'Efectivo', opening: 0 }, { id: 'banco', name: 'Bancolombia', opening: 500000000 }],
  items: [{ id: 'a1', name: 'Arriendo', kind: 'expense', amount: 120000000, day: 5, account: 'banco' }],
  movements: [{ id: 'm1', kind: 'expense', amount: 2500000, account: 'efectivo', date: '2026-09-02', note: 'Almuerzo' }],
  lastAccount: 'banco',
};

test('AC-007.1 migrate lleva v1 a v2 sin perder datos', () => {
  const s = migrate(v1);
  assert.equal(s.version, VERSION);
  assert.equal(s.onboarded, true);
  assert.deepEqual(s.accounts.map(a => a.type), ['cash', 'bank']);
  assert.equal(s.items[0].categoryId, 'vivienda');
  assert.equal(s.items[0].amount, 120000000);
  assert.equal(s.movements[0].categoryId, 'mercado');
  assert.equal(s.lastAccount, 'banco');
  assert.ok(s.catalog.expense.length > 5 && s.catalog.templates.length > 5);
});

test('AC-007.1 migrate es idempotente y completa un v1 parcial con las cuentas de siempre', () => {
  assert.deepEqual(migrate(migrate(v1)), migrate(v1));
  const partial = migrate({ items: [] });
  assert.deepEqual(partial.accounts.map(a => a.id), ['efectivo', 'banco', 'tarjeta']);
  assert.equal(partial.onboarded, true);
});

test('AC-007.1 sin nada guardado arranca un estado nuevo que pide onboarding', () => {
  assert.equal(migrate(null), null);
  const f = freshState();
  assert.equal(f.onboarded, false);
  assert.equal(f.version, VERSION);
  assert.deepEqual(f.accounts.map(a => a.type), ['cash']);
});
