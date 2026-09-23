// Movimiento rápido: toque 1 abre, toque 2 guarda.
import { $, esc, showError, today } from './dom.js';
import { toCents } from '../domain/money.js';
import { addMovement } from '../domain/ledger.js';
import { inferCategory, active } from '../domain/catalog.js';
import { lastAmountFor } from '../domain/suggest.js';
import { formatMoney } from '../domain/money.js';
import { getState, setState } from '../store.js';

export const dialog = () => $('#rapido');
const form = () => $('#form-rapido');

function setKind(kind) {
  form().dataset.kind = kind;
  form().querySelector(`[name=kind][value=${kind}]`).checked = true;
  $('#rapido-titulo').textContent = kind === 'income' ? 'Nuevo ingreso' : 'Nuevo gasto';
  // Chips de categoría del catálogo activo (work/007): elegir en vez de escribir.
  $('#rapido-categorias').replaceChildren(
    Object.assign(document.createElement('legend'), { textContent: 'Categoría' }),
    ...active(getState().catalog, kind === 'income' ? 'income' : 'expense').map(c => {
      const label = document.createElement('label');
      label.className = 'chip';
      label.innerHTML = `<input type="radio" name="categoryId" value="${esc(c.id)}"><span>${esc(c.name)}</span>`;
      return label;
    }),
  );
  updateSame();
}

// «Mismo monto»: si la categoría tiene historial, un toque llena el monto.
function updateSame() {
  const cat = form().querySelector('[name=categoryId]:checked')?.value;
  const last = cat ? lastAmountFor(getState().movements, cat) : null;
  const btn = $('#mismo-monto');
  btn.hidden = last === null;
  if (last !== null) { btn.dataset.amount = String(last); btn.textContent = `Mismo monto ${formatMoney(last)}`; }
}

export function openQuick(kind) {
  const s = getState();
  form().reset();
  setKind(kind);
  $('#rapido-cuentas').replaceChildren(
    Object.assign(document.createElement('legend'), { textContent: 'Cuenta' }),
    ...s.accounts.map(a => {
      const label = document.createElement('label');
      label.className = 'chip';
      label.innerHTML = `<input type="radio" name="account" value="${esc(a.id)}"${a.id === s.lastAccount ? ' checked' : ''}><span>${esc(a.name)}</span>`;
      return label;
    }),
  );
  showError(form(), '');
  dialog().showModal();
  form().amount.focus();
}

export function mount() {
  form().addEventListener('change', (e) => {
    if (e.target.name === 'kind') setKind(e.target.value);
    if (e.target.name === 'categoryId') updateSame();
  });
  $('#mismo-monto').addEventListener('click', (e) => {
    const cents = Number(e.currentTarget.dataset.amount);
    form().amount.value = formatMoney(cents).replace('$ ', '');
    $('#guardar').focus();
  });
  $('#nuevo-gasto').addEventListener('click', () => openQuick('expense'));
  $('#nuevo-ingreso').addEventListener('click', () => openQuick('income'));
  $('#cancelar').addEventListener('click', () => dialog().close());
  dialog().addEventListener('click', (e) => { if (e.target === dialog()) dialog().close(); });
  form().addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form();
    try {
      const s = getState();
      const account = f.querySelector('[name=account]:checked')?.value ?? s.accounts[0]?.id;
      const kind = f.dataset.kind, note = f.note.value.trim();
      const categoryId = f.querySelector('[name=categoryId]:checked')?.value ?? inferCategory(note, kind);
      const movements = addMovement(s.movements, { kind, amount: toCents(f.amount.value), account, date: today, note, categoryId });
      dialog().close();
      setState({ movements, lastAccount: account });
    } catch (err) { showError(f, err.message); }
  });
}
