// Acciones de un toque que comparten varias vistas. Toda acción de un toque se puede deshacer.
import { getState, setState } from '../store.js';
import { occurrencesFor } from '../domain/budget.js';
import { markDone, unmarkDone } from '../domain/ledger.js';
import { toast, verb, year, month } from './dom.js';

export let justDone = null;
export function markOccurrence(key) {
  const s = getState();
  const occ = occurrencesFor(s.items, year, month).find(o => o.key === key);
  if (!occ) return;
  justDone = key;
  setState({ movements: markDone(s.movements, occ) });
  justDone = null;
  toast(`${occ.name} ${verb(occ.kind)}`, () => setState(st => ({ ...st, movements: unmarkDone(st.movements, key) })));
}
export const onMarkClick = (e) => { const key = e.target.closest('[data-occ]')?.dataset.occ; if (key) markOccurrence(key); };
