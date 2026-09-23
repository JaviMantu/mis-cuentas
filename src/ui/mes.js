// Mes: pendientes primero, después hechos. En escritorio se pinta como tabla (work/006).
import { $, monthLabel, year, month } from './dom.js';
import { occurrenceRow } from './rows.js';
import { onMarkClick, justDone } from './actions.js';
import { occurrencesFor } from '../domain/budget.js';
import { pending } from '../domain/ledger.js';

export function mount() { $('#ocurrencias').addEventListener('click', onMarkClick); }

export function render(state) {
  const occ = occurrencesFor(state.items, year, month);
  const todo = pending(occ, state.movements);
  const doneKeys = new Set(state.movements.map(m => m.occurrenceKey).filter(Boolean));
  const ordered = [...todo, ...occ.filter(o => doneKeys.has(o.key))];
  const rows = ordered.map(o => occurrenceRow(state, o, doneKeys.has(o.key), justDone));
  if (todo.length && rows.length > todo.length) rows[0].classList.add('first-pending');
  if (rows[todo.length]) rows[todo.length].classList.add('first-done');
  $('#ocurrencias').replaceChildren(...rows);
  $('#mes-vacio').hidden = occ.length > 0;
  $('#mes-titulo').textContent = monthLabel({ month: 'long' });
  $('#mes-resumen').textContent = occ.length ? `${occ.length - todo.length} de ${occ.length} hechos` : '';
}
