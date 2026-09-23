import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uiFor } from '../../src/domain/device.js';

test('AC-006.5 uiFor elige por capacidades del dispositivo y el override gana', () => {
  assert.equal(uiFor({ hover: true, fine: true, width: 1280 }), 'desktop');
  assert.equal(uiFor({ hover: true, fine: true, width: 900 }), 'desktop');
  assert.equal(uiFor({ hover: true, fine: true, width: 899 }), 'mobile');
  assert.equal(uiFor({ hover: false, fine: false, width: 1280 }), 'mobile', 'tablet táctil apaisada');
  assert.equal(uiFor({ hover: false, fine: false, width: 390 }), 'mobile');
  assert.equal(uiFor({ hover: false, fine: false, width: 390, override: 'desktop' }), 'desktop');
  assert.equal(uiFor({ hover: true, fine: true, width: 1440, override: 'mobile' }), 'mobile');
  assert.equal(uiFor({ hover: true, fine: true, width: 1440, override: 'tablet' }), 'desktop', 'override inválido se ignora');
});
