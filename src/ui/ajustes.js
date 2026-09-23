// Ajustes (work/007): cuentas con nombre libre, catálogos personalizables, vista y datos.
// Renombrar ocurre en línea (Enter guarda, Esc cancela); archivar se revierte con «Deshacer».
import { $, esc, icon, li, showError, slug, toast } from './dom.js';
import { formatMoney, toCents } from '../domain/money.js';
import { addEntry, renameEntry, archiveEntry, active } from '../domain/catalog.js';
import { ACCOUNT_TYPES } from '../domain/schema.js';
import { getState, setState, resetAll } from '../store.js';
import { forced, setUi } from './device.js';

const LIST_LABEL = { income: 'categoría', expense: 'categoría', templates: 'plantilla' };
let editing = null; // { list, id } fila en modo renombrar
let confirmReset = false;
const list = () => document.querySelector('[name=catlist]:checked')?.value ?? 'expense';
const typeName = (t) => ACCOUNT_TYPES.find(x => x.id === t)?.name ?? t;

function nameCell(kind, id, name) {
  if (editing?.list === kind && editing.id === id) {
    return `<label class="sr-only" for="ren-${esc(id)}">Nuevo nombre de ${esc(name)}</label><input id="ren-${esc(id)}" class="rename" data-rename="${kind}:${esc(id)}" value="${esc(name)}" maxlength="40" autocomplete="off">`;
  }
  return `<strong>${esc(name)}</strong>`;
}

function catalogForm(kind, state) {
  if (kind !== 'templates') {
    return `<label class="field">Nueva ${LIST_LABEL[kind]}<input name="name" maxlength="40" autocomplete="off" placeholder="${kind === 'income' ? 'Ventas' : 'Mascotas'}"></label>
      <p class="error" role="alert" hidden></p><button class="btn btn-primary">Agregar categoría</button>`;
  }
  return `<label class="field">Nueva plantilla<input name="name" maxlength="40" autocomplete="off" placeholder="Seguro del carro"></label>
    <div class="field-row"><label class="field">Categoría<select name="categoryId">${active(state.catalog, 'expense').map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label>
    <label class="field">Día típico<input name="day" type="number" min="1" max="31" value="1"></label></div>
    <p class="error" role="alert" hidden></p><button class="btn btn-primary">Agregar plantilla</button>`;
}

export function render(state) {
  const b = new Map(state.accounts.map(a => [a.id, a]));
  $('#aj-cuentas').replaceChildren(...[...b.values()].map(a => li('settings-row',
    `<span class="settings-main">${nameCell('accounts', a.id, a.name)}<small>${esc(typeName(a.type))} · saldo inicial ${formatMoney(a.opening)}</small></span>`
    + `<button class="icon-btn" data-edit="accounts:${esc(a.id)}" aria-label="Renombrar ${esc(a.name)}">${icon('pen')}</button>`)));
  const sel = $('#tipo-cuenta');
  if (!sel.options.length) sel.replaceChildren(...ACCOUNT_TYPES.map(t => new Option(t.name, t.id, false, t.id === 'bank')));

  const kind = list();
  const catName = (id) => state.catalog.expense.find(c => c.id === id)?.name ?? '';
  const entries = state.catalog[kind];
  const rows = entries.filter(e => !e.archived).map(e => li('settings-row',
    `<span class="badge">${icon(e.icon ?? state.catalog.expense.find(c => c.id === e.categoryId)?.icon ?? 'tag')}</span>`
    + `<span class="settings-main">${nameCell(kind, e.id, e.name)}${kind === 'templates' ? `<small>${esc(catName(e.categoryId))} · día ${e.day}</small>` : ''}</span>`
    + `<button class="icon-btn" data-edit="${kind}:${esc(e.id)}" aria-label="Renombrar ${esc(e.name)}">${icon('pen')}</button>`
    + `<button class="icon-btn" data-archive="${kind}:${esc(e.id)}" aria-label="Archivar ${esc(e.name)}">${icon('archive')}</button>`));
  const archived = entries.filter(e => e.archived);
  if (archived.length) rows.push(li('settings-row settings-archived', `<span class="settings-main"><small>Archivadas: ${archived.map(e =>
    `<button class="link" data-restore="${kind}:${esc(e.id)}">Restaurar ${esc(e.name)}</button>`).join(' ')}</small></span>`));
  $('#aj-catalogo').replaceChildren(...rows);
  const form = $('#form-catalogo');
  if (form.dataset.kind !== kind) { form.dataset.kind = kind; form.innerHTML = catalogForm(kind, state); }

  const mode = forced() ?? 'auto';
  for (const r of document.querySelectorAll('[name=ui-mode]')) r.checked = r.value === mode;

  $('#aj-reset').innerHTML = confirmReset
    ? '<p class="note">Se borran tus cuentas, fijos y movimientos de este navegador.</p><div class="form-actions"><button class="btn btn-quiet" data-reset-no>Cancelar</button><button class="btn btn-danger" data-reset-yes>Sí, borrar todo</button></div>'
    : '<button class="btn btn-quiet" data-reset-ask>Empezar de cero</button>';

  const input = editing && document.querySelector(`[data-rename="${editing.list}:${CSS.escape(editing.id)}"]`);
  if (input && document.activeElement !== input) { input.focus(); input.select(); }
}

function commitRename(el) {
  const [kind, id] = el.dataset.rename.split(':');
  const name = el.value.trim();
  try {
    if (kind === 'accounts') {
      if (!name) throw new Error('escribe un nombre');
      setState(s => ({ ...s, accounts: s.accounts.map(a => a.id === id ? { ...a, name } : a) }));
    } else setState(s => ({ ...s, catalog: renameEntry(s.catalog, kind, id, name) }));
    editing = null;
    setState(s => s);
  } catch (err) { toast(err.message, () => {}); }
}

export function mount() {
  const panel = $('#ajustes');
  panel.addEventListener('change', (e) => {
    if (e.target.name === 'catlist') { editing = null; render(getState()); }
    if (e.target.name === 'ui-mode') setUi(e.target.value);
  });
  panel.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.edit) { const [l, id] = t.dataset.edit.split(':'); editing = { list: l, id }; render(getState()); }
    if (t.dataset.archive) {
      const [l, id] = t.dataset.archive.split(':');
      const name = getState().catalog[l].find(x => x.id === id)?.name;
      setState(s => ({ ...s, catalog: archiveEntry(s.catalog, l, id) }));
      toast(`${name} archivada`, () => setState(s => ({ ...s, catalog: archiveEntry(s.catalog, l, id, false) })));
    }
    if (t.dataset.restore) { const [l, id] = t.dataset.restore.split(':'); setState(s => ({ ...s, catalog: archiveEntry(s.catalog, l, id, false) })); }
    if (t.hasAttribute('data-reset-ask')) { confirmReset = true; render(getState()); }
    if (t.hasAttribute('data-reset-no')) { confirmReset = false; render(getState()); }
    if (t.hasAttribute('data-reset-yes')) { confirmReset = false; try { localStorage.removeItem('mis-cuentas:ui'); } catch { /* nada que limpiar */ } resetAll(); document.getElementById('t-resumen').click(); }
  });
  panel.addEventListener('keydown', (e) => {
    const el = e.target.closest('[data-rename]');
    if (!el) return;
    if (e.key === 'Enter') { e.preventDefault(); commitRename(el); }
    if (e.key === 'Escape') { e.preventDefault(); editing = null; render(getState()); }
  });
  $('#form-cuenta').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      const name = String(f.get('name')).trim();
      if (!name) throw new Error('escribe el nombre de la cuenta');
      if (getState().accounts.some(a => a.name.toLowerCase() === name.toLowerCase())) throw new Error(`«${name}» ya existe`);
      const raw = String(f.get('opening') ?? '').trim();
      const opening = raw && !/^0+$/.test(raw) ? toCents(raw) : 0;
      let id = slug(name);
      while (getState().accounts.some(a => a.id === id)) id += '-2';
      e.target.reset();
      $('#tipo-cuenta').value = 'bank';
      showError(e.target, '');
      setState(s => ({ ...s, accounts: [...s.accounts, { id, name, type: f.get('type'), opening }] }));
    } catch (err) { showError(e.target, err.message); }
  });
  $('#form-catalogo').addEventListener('submit', (e) => {
    e.preventDefault();
    const kind = e.target.dataset.kind;
    const f = new FormData(e.target);
    try {
      const entry = kind === 'templates'
        ? { name: f.get('name'), kind: 'expense', categoryId: f.get('categoryId'), day: Math.min(31, Math.max(1, Number(f.get('day')) || 1)) }
        : { name: f.get('name') };
      setState(s => ({ ...s, catalog: addEntry(s.catalog, kind, entry) }));
      e.target.reset();
      showError(e.target, '');
    } catch (err) { showError(e.target, err.message); }
  });
}
