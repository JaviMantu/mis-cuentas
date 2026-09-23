// Resumen: la respuesta primero (PRODUCT.md, principio 1).
import { $, esc, icon, li, monthLabel, year, month } from './dom.js';
import { occurrenceRow, movementRow } from './rows.js';
import { onMarkClick, justDone } from './actions.js';
import { formatMoney } from '../domain/money.js';
import { occurrencesFor } from '../domain/budget.js';
import { pending, balances } from '../domain/ledger.js';
import { accountIcon } from '../domain/icons.js';

export function mount() {
  $('#proximos').addEventListener('click', onMarkClick);
}

export function render(state) {
  const occ = occurrencesFor(state.items, year, month);
  const todo = pending(occ, state.movements);
  const doneKeys = new Set(state.movements.map(m => m.occurrenceKey).filter(Boolean));
  const b = balances(state.accounts, state.movements);
  const empty = state.items.length === 0 && state.movements.length === 0;

  $('#mes-actual').textContent = monthLabel({ month: 'long', year: 'numeric' });
  $('#total').textContent = formatMoney(b.total);
  const out = todo.filter(o => o.kind === 'expense');
  const owed = out.reduce((s, o) => s + o.amount, 0);
  $('#pendiente').textContent = out.length
    ? `Te faltan ${formatMoney(owed)} en ${out.length} ${out.length === 1 ? 'pago' : 'pagos'} este mes`
    : occ.length ? 'Todo al día este mes' : 'Agrega tus pagos del mes para ver qué falta';
  const expenses = occ.filter(o => o.kind === 'expense');
  const nextKey = expenses.find(e => !doneKeys.has(e.key))?.key;
  $('#barra').innerHTML = expenses.map(o =>
    `<span class="${doneKeys.has(o.key) ? 'done' : o.key === nextKey ? 'next' : ''}" style="--w:${Math.max(1, Math.round(o.amount / 100000))}"></span>`).join('');
  $('#vacio').hidden = !(empty && state.onboarded);

  $('#cuentas').replaceChildren(
    ...state.accounts.map(a => {
      const v = b.byAccount[a.id];
      const t = a.type ?? accountIcon(a);
      return li(`acct is-${t}${v < 0 ? ' is-neg' : ''}`,
        `${icon(t)}<span class="acct-name">${esc(a.name)}</span><output aria-label="Balance ${esc(a.name)}">${formatMoney(v)}</output>`);
    }),
    li('acct-add', `<button type="button" data-goto="t-ajustes" data-focus="#form-cuenta [name=name]">${icon('plus')}Agregar cuenta</button>`),
  );

  const next = todo.slice(0, 3);
  $('#proximos').replaceChildren(...next.map(o => occurrenceRow(state, o, false, justDone)));
  $('#proximos-vacio').hidden = next.length > 0;
  $('#proximos-vacio').textContent = occ.length ? 'Nada pendiente. Buen mes.' : 'Cuando agregues recurrentes, los próximos aparecen aquí.';

  // Escritorio: últimos movimientos, el más reciente primero (work/006)
  const recent = state.movements.map((m, k) => ({ m, k })).sort((x, y) => y.m.date.localeCompare(x.m.date) || y.k - x.k).slice(0, 5).map(({ m }) => m);
  $('#recientes').replaceChildren(...recent.map(m => movementRow(state, m)));
  $('#recientes-vacio').hidden = recent.length > 0;
}
