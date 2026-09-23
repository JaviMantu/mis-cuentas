// Una interfaz por dispositivo (work/006): la regla es uiFor; la vista forzada se recuerda.
import { uiFor } from '../domain/device.js';

export const UI_KEY = 'mis-cuentas:ui';
const fineHover = matchMedia('(hover: hover) and (pointer: fine)');

export function forced() {
  const q = new URLSearchParams(location.search).get('ui');
  try { return q || localStorage.getItem(UI_KEY); } catch { return q; }
}
export function applyUi() {
  document.documentElement.dataset.ui = uiFor({ hover: fineHover.matches, fine: fineHover.matches, width: innerWidth, override: forced() });
}
export function setUi(mode) {
  try { mode === 'auto' ? localStorage.removeItem(UI_KEY) : localStorage.setItem(UI_KEY, mode); } catch { /* sin almacenamiento: vale solo esta visita */ }
  const url = new URL(location.href);
  url.searchParams.delete('ui');
  history.replaceState(null, '', url);
  if (mode !== 'auto' && !forced()) document.documentElement.dataset.ui = mode; else applyUi();
}
export function mount() {
  fineHover.addEventListener('change', applyUi);
  addEventListener('resize', applyUi);
  document.addEventListener('click', (e) => {
    const set = e.target.closest('[data-ui-set]')?.dataset.uiSet;
    if (set) { setUi(set); scrollTo({ top: 0 }); }
  });
  applyUi();
}
