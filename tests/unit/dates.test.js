import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDay } from '../../src/domain/dates.js';

test('AC-007.5 formatDay muestra día y mes abreviado', () => {
  assert.equal(formatDay('2026-09-05'), '5 sep');
  assert.equal(formatDay('2026-02-28'), '28 feb');
  assert.equal(formatDay('2026-12-31'), '31 dic');
});
