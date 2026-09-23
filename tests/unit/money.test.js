import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCents, formatMoney } from '../../src/domain/money.js';

test('toCents lee formato es-CO: puntos de miles y coma decimal', () => {
  assert.equal(toCents('1.200.000'), 120000000);
  assert.equal(toCents('1.000,10'), 100010);
  assert.equal(toCents('25000'), 2500000);
  assert.equal(toCents('$ 25.000'), 2500000);
  assert.equal(toCents('0,5'), 50);
});

test('toCents acepta un punto como decimal si no son grupos de miles', () => {
  assert.equal(toCents('12.5'), 1250);
  assert.equal(toCents('1.200'), 120000); // grupo de 3 dígitos = miles
});

test('toCents rechaza vacío, negativo, texto y más de 2 decimales', () => {
  for (const bad of ['', '   ', 'abc', '-5', '0', '1,234', '1..2', null, undefined]) {
    assert.throws(() => toCents(bad), /monto/i, `debería rechazar ${bad}`);
  }
});

test('formatMoney muestra pesos sin decimales cuando son cero', () => {
  assert.match(formatMoney(120000000), /1\.200\.000$/);
  assert.match(formatMoney(300030), /3\.000,30$/);
  assert.match(formatMoney(-2500000), /^-.*25\.000$/);
});
