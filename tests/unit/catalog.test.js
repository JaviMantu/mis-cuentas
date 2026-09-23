import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CATALOG, addEntry, renameEntry, archiveEntry, active, entryName, inferCategory } from '../../src/domain/catalog.js';

test('AC-007.2 nombres únicos (sin importar tildes ni mayúsculas) y renombrar conserva el id', () => {
  const c1 = addEntry(DEFAULT_CATALOG, 'expense', { name: 'Mascotas' });
  const pet = c1.expense.find(e => e.name === 'Mascotas');
  assert.ok(pet.id);
  assert.throws(() => addEntry(c1, 'expense', { name: 'mascotas' }), /ya existe/);
  assert.throws(() => addEntry(c1, 'expense', { name: '  ' }), /nombre/);
  const c2 = renameEntry(c1, 'expense', pet.id, 'Mascota');
  assert.equal(c2.expense.find(e => e.id === pet.id).name, 'Mascota');
  assert.throws(() => renameEntry(c2, 'expense', pet.id, 'Mercado'), /ya existe/);
  assert.equal(DEFAULT_CATALOG.expense.some(e => e.name === 'Mascotas'), false, 'no muta el catálogo por defecto');
});

test('AC-007.2 archivar oculta de las opciones pero el historial resuelve el nombre por id', () => {
  const id = DEFAULT_CATALOG.expense.find(e => e.name === 'Mercado').id;
  const c = archiveEntry(DEFAULT_CATALOG, 'expense', id);
  assert.equal(active(c, 'expense').some(e => e.id === id), false);
  assert.equal(entryName(c, id), 'Mercado');
});

test('AC-007.2 inferCategory clasifica por palabra clave', () => {
  assert.equal(inferCategory('Arriendo', 'expense'), 'vivienda');
  assert.equal(inferCategory('Internet hogar', 'expense'), 'servicios');
  assert.equal(inferCategory('Almuerzo', 'expense'), 'mercado');
  assert.equal(inferCategory('Sueldo', 'income'), 'salario');
  assert.equal(inferCategory('Algo raro', 'expense'), 'otros-gastos');
  assert.equal(inferCategory('', 'income'), 'otros-ingresos');
});
