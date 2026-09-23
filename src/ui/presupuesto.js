// Presupuesto: los fijos del mes, agrupados por tipo.
import { $, esc, icon, li, signed, showError, toast } from './dom.js';
import { accountName, iconOf } from './rows.js';
import { formatMoney, toCents } from '../domain/money.js';
import { validateItem } from '../domain/budget.js';
import { inferCategory, active } from '../domain/catalog.js';
import { getState, setState } from '../store.js';

export function mount() {
  $('#form-recurrente').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const name = String(f.get('name')).trim();
      const kind = f.get('kind');
      const item = { id: crypto.randomUUID(), name, kind, amount: toCents(f.get('amount')), day: Number(f.get('day')), account: f.get('account'), categoryId: f.get('categoryId') || inferCategory(name, kind) };
      const errors = validateItem(item);
      if (errors.length) throw new Error(`revisa: ${errors.join(', ')}`);
      setState(s => ({ ...s, items: [...s.items, item] }));
      e.target.reset();
      showError(e.target, '');
    } catch (err) { showError(e.target, err.message); }
  });
  // Plantillas (work/007): un toque prellena nombre, tipo, día y categoría; solo falta el monto.
  $('#plantillas').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tpl]');
    if (!b) return;
    const form = $('#form-recurrente');
    if (b.dataset.tpl === 'otro') { form.reset(); form.categoryId.value = ''; form.name.focus(); return; }
    const t = getState().catalog.templates.find(x => x.id === b.dataset.tpl);
    form.name.value = t.name;
    form.querySelector(`[name=kind][value=${t.kind}]`).checked = true;
    form.day.value = t.day;
    form.categoryId.value = t.categoryId;
    form.amount.focus();
  });
  $('#presupuesto').addEventListener('click', (e) => {
    const id = e.target.closest('[data-del]')?.dataset.del;
    if (!id) return;
    const removed = getState().items.find(i => i.id === id);
    setState(s => ({ ...s, items: s.items.filter(i => i.id !== id) }));
    toast(`${removed.name} eliminado`, () => setState(s => ({ ...s, items: [...s.items, removed] })));
  });
}

export function render(state) {
  const group = (kind) => state.items.filter(i => i.kind === kind).sort((x, y) => x.day - y.day);
  const total = (kind) => group(kind).reduce((s, i) => s + i.amount, 0);
  for (const [kind, list, title] of [['income', '#rec-ingresos', '#h-ingresos'], ['expense', '#rec-gastos', '#h-gastos']]) {
    const items = group(kind);
    $(title).innerHTML = `${kind === 'income' ? 'Ingresos' : 'Gastos'} <span class="num">${items.length ? signed(kind, total(kind)) : ''}</span>`;
    $(list).replaceChildren(...items.map(i => li('row',
      `<span class="badge is-${kind}">${icon(iconOf(state, i))}</span>`
      + `<span class="meta"><strong>${esc(i.name)}</strong><small>Día ${i.day} · ${esc(accountName(state, i.account))}</small></span>`
      + `<span class="amt is-${kind}">${signed(kind, i.amount)}</span>`
      + `<button class="icon-btn act" data-del="${esc(i.id)}" aria-label="Eliminar ${esc(i.name)}">${icon('trash')}</button>`)));
  }
  const used = new Set(state.items.map(i => i.name.toLowerCase()));
  $('#plantillas').innerHTML = active(state.catalog, 'templates').filter(t => !used.has(t.name.toLowerCase())).map(t =>
    `<button type="button" class="pick" data-tpl="${esc(t.id)}">${icon(state.catalog.expense.find(c => c.id === t.categoryId)?.icon ?? 'tag')}${esc(t.name)}</button>`).join('')
    + `<button type="button" class="pick pick-ghost" data-tpl="otro">${icon('plus')}Otro</button>`;
  $('#presupuesto-resumen').textContent = state.items.length
    ? `Al mes: ${formatMoney(total('income'))} de ingresos y ${formatMoney(total('expense'))} de gastos`
    : 'Define una vez lo que se repite cada mes.';
  for (const sel of document.querySelectorAll('.select-cuenta')) {
    const current = sel.value || state.lastAccount;
    sel.replaceChildren(...state.accounts.map(a => new Option(a.name, a.id, false, a.id === current)));
  }
}
