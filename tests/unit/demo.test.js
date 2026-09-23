import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demoState } from '../../src/domain/demo.js';
import { validateItem } from '../../src/domain/budget.js';
import { balances } from '../../src/domain/ledger.js';

test('AC-004.3 demoState trae recurrentes válidos y un balance conocido', () => {
  const s = demoState(2026, 9);
  assert.equal(s.items.length, 3);
  for (const item of s.items) assert.deepEqual(validateItem(item), [], item.name);
  assert.equal(balances(s.accounts, s.movements).total, 567500000);
  assert.ok(s.movements.every(m => m.date.startsWith('2026-09')));
});
