import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFromOnboarding } from '../../src/domain/onboarding.js';
import { validateItem } from '../../src/domain/budget.js';

test('AC-007.3 el onboarding construye ítems válidos y el libre al mes', () => {
  const out = buildFromOnboarding({
    accounts: [{ id: 'efectivo', name: 'Efectivo', type: 'cash', opening: 0 }, { id: 'banco', name: 'Banco', type: 'bank', opening: 0 }],
    incomes: [{ categoryId: 'salario', name: 'Salario', amount: 400000000, day: 30, account: 'banco' }],
    expenses: [
      { templateId: 'arriendo', categoryId: 'vivienda', name: 'Arriendo', amount: 120000000, day: 5, account: 'banco' },
      { templateId: 'internet', categoryId: 'servicios', name: 'Internet', amount: 9500000, day: 15, account: 'banco' },
    ],
  });
  assert.equal(out.items.length, 3);
  for (const i of out.items) assert.deepEqual(validateItem(i), [], i.name);
  assert.equal(out.freeMonthly, 270500000);
  assert.ok(out.items.every(i => i.id && i.categoryId));
});

test('AC-007.3 una fila inválida se rechaza con su nombre', () => {
  assert.throws(() => buildFromOnboarding({ accounts: [{ id: 'b', name: 'B', type: 'bank', opening: 0 }], incomes: [], expenses: [{ categoryId: 'vivienda', name: 'Arriendo', amount: 0, day: 5, account: 'b' }] }), /Arriendo/);
});
