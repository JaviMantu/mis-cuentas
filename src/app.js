// Arranque: una vista por módulo (src/ui), un estado (store.js), dominio puro (domain/). work/007
import { getState, subscribe } from './store.js';
import * as resumen from './ui/resumen.js';
import * as mes from './ui/mes.js';
import * as presupuesto from './ui/presupuesto.js';
import * as quick from './ui/quick.js';
import * as onboarding from './ui/onboarding.js';
import * as ajustes from './ui/ajustes.js';
import * as device from './ui/device.js';

const views = [onboarding, resumen, mes, presupuesto, ajustes];
const renderAll = () => { const s = getState(); for (const v of views) v.render(s); };

// Pestañas (flechas del teclado) y atajos data-goto
const tabs = [...document.querySelectorAll('[role=tab]')];
export function selectTab(tab) {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  }
  scrollTo({ top: 0 });
}
for (const t of tabs) {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (d) { e.preventDefault(); const n = tabs[(tabs.indexOf(t) + d + tabs.length) % tabs.length]; selectTab(n); n.focus(); }
  });
}
document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-goto]');
  if (!go) return;
  selectTab(document.getElementById(go.dataset.goto));
  if (go.dataset.focus) document.querySelector(go.dataset.focus)?.focus();
});

// Atajos de escritorio. Un campo cuenta como «escribiendo» solo si está visible: tras Esc, Chrome deja
// el foco en el input del diálogo ya cerrado hasta el evento close (work/006 review, P1).
document.addEventListener('keydown', (e) => {
  if (document.documentElement.dataset.ui !== 'desktop' || e.metaKey || e.ctrlKey || e.altKey) return;
  const typing = e.target.closest('input, select, textarea, [contenteditable]') && !e.target.closest('dialog:not([open])');
  if (quick.dialog().open || typing) return;
  const k = e.key.toLowerCase();
  const tab = { 1: 't-resumen', 2: 't-mes', 3: 't-presupuesto', 4: 't-ajustes' }[k];
  if (k === 'g') { e.preventDefault(); quick.openQuick('expense'); }
  else if (k === 'i') { e.preventDefault(); quick.openQuick('income'); }
  else if (tab && document.getElementById(tab)) { e.preventDefault(); const t = document.getElementById(tab); selectTab(t); t.focus(); }
});

for (const v of [...views, quick]) v.mount();
device.mount();
subscribe(renderAll);
renderAll();
