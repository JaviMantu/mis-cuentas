// Estado único: load → migrate (schema v2) → save. Las vistas se suscriben y se repintan. (work/007)
import { migrate, freshState } from './domain/schema.js';

const KEY = 'mis-cuentas:v1'; // nombre histórico de la clave; la versión real viaja dentro del estado
const listeners = new Set();
let state = load();

function load() {
  try { return migrate(JSON.parse(localStorage.getItem(KEY))) ?? freshState(); } catch { return freshState(); }
}
export const getState = () => state;
export function setState(next) {
  state = typeof next === 'function' ? next(state) : { ...state, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* modo privado: queda en memoria */ }
  for (const fn of listeners) fn(state);
}
export const subscribe = (fn) => listeners.add(fn);
export function resetAll() { setState(freshState()); }
