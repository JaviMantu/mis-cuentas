import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iconFor, accountIcon } from '../../src/domain/icons.js';

test('AC-005.8 iconFor elige el ícono por palabra clave, sin importar tildes ni mayúsculas', () => {
  assert.equal(iconFor('Arriendo'), 'home');
  assert.equal(iconFor('Internet hogar'), 'wifi');
  assert.equal(iconFor('Sueldo'), 'briefcase');
  assert.equal(iconFor('Mercado del mes'), 'cart');
  assert.equal(iconFor('Farmacia'), 'heart');
  assert.equal(iconFor('Gasolina'), 'car');
  assert.equal(iconFor('Suscripción rara'), 'tag');
});

test('AC-005.8 accountIcon reconoce efectivo, banco y tarjeta', () => {
  assert.equal(accountIcon({ id: 'efectivo', name: 'Efectivo' }), 'cash');
  assert.equal(accountIcon({ id: 'x', name: 'Bancolombia' }), 'bank');
  assert.equal(accountIcon({ id: 'tarjeta', name: 'Tarjeta' }), 'card');
  assert.equal(accountIcon({ id: 'ahorro', name: 'Ahorro' }), 'wallet');
});
