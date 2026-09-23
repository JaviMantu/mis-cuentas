// Onboarding de 4 pasos (work/007): chips del catálogo, la persona teclea solo montos.
// Es un panel en el lugar de Resumen, no un modal: la navegación y los atajos siguen vivos.
import { $, esc, icon } from './dom.js';
import { formatMoney, toCents } from '../domain/money.js';
import { active } from '../domain/catalog.js';
import { ACCOUNT_TYPES } from '../domain/schema.js';
import { buildFromOnboarding } from '../domain/onboarding.js';
import { demoState } from '../domain/demo.js';
import { getState, setState } from '../store.js';
import { year, month } from './dom.js';

const DAYS = [1, 5, 10, 15, 20, 25, 30];
const TYPE_NAME = { cash: 'Efectivo', bank: 'Banco', card: 'Tarjeta de crédito', wallet: 'Billetera digital' };
let draft = null;
let shownStep = 0;

function newDraft(state) {
  return { step: 1, accounts: state.accounts.map(a => ({ ...a })), incomes: {}, expenses: {}, error: '' };
}

const root = () => $('#onboarding');
const uniqueId = (name, taken) => {
  let id = name.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'cuenta';
  while (taken.includes(id)) id += '-2';
  return id;
};
const defaultAccount = () => (draft.accounts.find(a => a.type === 'bank') ?? draft.accounts.find(a => a.type === 'wallet') ?? draft.accounts[0])?.id;

function chip(label, pressed, data, iconName) {
  return `<button type="button" class="pick${pressed ? ' is-on' : ''}" aria-pressed="${pressed}" ${data}>${iconName ? icon(pressed ? 'check' : iconName) : ''}${esc(label)}</button>`;
}

function dayChips(key, day) {
  const days = DAYS.includes(day) ? DAYS : [...DAYS, day].sort((a, b) => a - b);
  return `<fieldset class="days"><legend>Día</legend>${days.map(d =>
    `<label class="chip"><input type="radio" name="day-${esc(key)}" value="${d}"${d === day ? ' checked' : ''}><span>${d}</span></label>`).join('')}</fieldset>`;
}

function accountSelect(key, name, current) {
  return `<label class="field">Cuenta de ${esc(name)}<select data-acc="${esc(key)}">${draft.accounts.map(a =>
    `<option value="${esc(a.id)}"${a.id === current ? ' selected' : ''}>${esc(a.name)}</option>`).join('')}</select></label>`;
}

function rowFor(list, key, name) {
  const r = draft[list][key];
  return `<div class="ob-row" data-row="${list}:${esc(key)}">
    <label class="field">Monto de ${esc(name)}<input inputmode="decimal" autocomplete="off" data-amount="${list}:${esc(key)}" value="${esc(r.amountText ?? '')}" placeholder="0"></label>
    ${dayChips(`${list}-${key}`, r.day)}${draft.accounts.length > 1 ? accountSelect(`${list}:${key}`, name, r.account) : ''}</div>`;
}

function stepBody(state) {
  const cat = state.catalog;
  if (draft.step === 1) {
    const has = (t) => draft.accounts.some(a => a.type === t);
    return `<h2 id="ob-titulo">¿Dónde tienes tu plata?</h2><p class="note">Toca las que uses. Luego puedes ponerles el nombre de tu banco.</p>
      <div class="chip-grid">${ACCOUNT_TYPES.map(t => chip(t.name, has(t.id), `data-type="${t.id}"`, t.id)).join('')}</div>
      <div class="ob-rows">${draft.accounts.map((a, k) => `<div class="ob-row ob-row-acct">
        <label class="field">Cómo llamas tu cuenta ${k + 1}<input data-acct-name="${k}" value="${esc(a.name)}" maxlength="40" autocomplete="off"></label>
        <label class="field">Saldo de hoy<input data-acct-opening="${k}" inputmode="decimal" autocomplete="off" value="${esc(a.openingText ?? '')}" placeholder="0"></label></div>`).join('')}</div>
      <p class="ob-demo">¿Solo quieres mirar? <button type="button" class="link" data-demo>Cargar datos de ejemplo</button></p>`;
  }
  if (draft.step === 2) {
    return `<h2 id="ob-titulo">¿Qué te entra cada mes?</h2><p class="note">Elige tus ingresos fijos y escribe cuánto.</p>
      <div class="chip-grid">${active(cat, 'income').map(c => chip(c.name, Boolean(draft.incomes[c.id]), `data-income="${c.id}"`, c.icon)).join('')}</div>
      <div class="ob-rows">${Object.keys(draft.incomes).map(id => rowFor('incomes', id, cat.income.find(c => c.id === id)?.name ?? id)).join('')}</div>`;
  }
  if (draft.step === 3) {
    const groups = active(cat, 'expense').map(c => ({ c, tpls: active(cat, 'templates').filter(t => t.categoryId === c.id) })).filter(g => g.tpls.length);
    return `<h2 id="ob-titulo">¿Qué pagas fijo cada mes?</h2><p class="note">Elige tus gastos fijos. El día ya viene sugerido.</p>
      ${groups.map(g => `<h3 class="group-title">${esc(g.c.name)}</h3><div class="chip-grid">${g.tpls.map(t => chip(t.name, Boolean(draft.expenses[t.id]), `data-template="${t.id}"`, g.c.icon)).join('')}</div>`).join('')}
      <div class="ob-rows">${Object.keys(draft.expenses).map(id => rowFor('expenses', id, cat.templates.find(t => t.id === id)?.name ?? id)).join('')}</div>`;
  }
  const { freeMonthly, items } = build(state);
  return `<h2 id="ob-titulo">Listo.</h2>
    <p class="ob-free">${items.length ? `Te quedan ${formatMoney(freeMonthly)} libres al mes` : 'Aún no hay fijos; puedes agregarlos después.'}</p>
    <ul class="rows rows-dense ob-summary">${items.map(i => `<li class="row"><span class="badge is-${i.kind}">${icon(state.catalog[i.kind].find(c => c.id === i.categoryId)?.icon ?? 'tag')}</span><span class="meta"><strong>${esc(i.name)}</strong><small>Día ${i.day}</small></span><span class="amt is-${i.kind}">${i.kind === 'expense' ? formatMoney(-i.amount) : '+' + formatMoney(i.amount)}</span></li>`).join('')}</ul>`;
}

function build(state) {
  const cat = state.catalog;
  const rows = (list, lookup) => Object.entries(draft[list]).map(([id, r]) => ({ ...lookup(id), amount: r.amount, day: r.day, account: r.account ?? defaultAccount() }));
  return buildFromOnboarding({
    accounts: draft.accounts.map(({ openingText, ...a }) => a),
    incomes: rows('incomes', id => ({ categoryId: id, name: cat.income.find(c => c.id === id).name })),
    expenses: rows('expenses', id => { const t = cat.templates.find(x => x.id === id); return { templateId: id, categoryId: t.categoryId, name: t.name }; }),
  });
}

export function render(state) {
  const show = !state.onboarded;
  root().hidden = !show;
  $('#resumen').classList.toggle('is-onboarding', show);
  if (!show) { draft = null; shownStep = 0; root().replaceChildren(); return; } // sin HTML oculto: sus etiquetas no chocan con las de otras vistas
  draft ??= newDraft(state);
  const n = draft.step;
  root().innerHTML = `<div class="ob-progress" aria-hidden="true">${[1, 2, 3, 4].map(k => `<span class="${k < n ? 'done' : k === n ? 'now' : ''}"></span>`).join('')}</div>
    <p class="ob-step">Paso ${n} de 4</p>
    <div class="ob-body${shownStep !== n ? ' is-entering' : ''}">${stepBody(state)}</div>
    <p class="error" role="alert"${draft.error ? '' : ' hidden'}>${esc(draft.error)}</p>
    <div class="ob-foot">
      <button type="button" class="link" data-ob="skip">Saltar</button>
      <span class="ob-nav">${n > 1 ? '<button type="button" class="btn btn-quiet" data-ob="back">Atrás</button>' : ''}
      <button type="button" class="btn btn-primary" data-ob="${n === 4 ? 'finish' : 'next'}">${n === 4 ? 'Empezar' : 'Siguiente'}</button></span>
    </div>`;
  shownStep = n;
}

// Lee lo escrito en el paso actual y valida los montos antes de avanzar.
function readStep(strict) {
  for (const el of root().querySelectorAll('[data-acct-name]')) draft.accounts[el.dataset.acctName].name = el.value.trim() || draft.accounts[el.dataset.acctName].name;
  for (const el of root().querySelectorAll('[data-acct-opening]')) {
    const a = draft.accounts[el.dataset.acctOpening];
    a.openingText = el.value;
    a.opening = el.value.trim() ? toCents(el.value) : 0;
  }
  for (const el of root().querySelectorAll('[data-amount]')) {
    const [list, key] = el.dataset.amount.split(':');
    const r = draft[list][key];
    r.amountText = el.value;
    if (!el.value.trim()) { if (!strict) continue; throw new Error(`escribe el monto de ${el.closest('.ob-row').querySelector('label').textContent.replace('Monto de ', '').trim()}`); }
    r.amount = toCents(el.value);
  }
  for (const el of root().querySelectorAll('[data-acc]')) { const [list, key] = el.dataset.acc.split(':'); draft[list][key].account = el.value; }
  for (const el of root().querySelectorAll('.days input:checked')) {
    const [, list, key] = el.name.match(/^day-(incomes|expenses)-(.+)$/) ?? [];
    if (list) draft[list][key].day = Number(el.value);
  }
}

export function mount() {
  const rerender = () => render(getState());
  root().addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    const s = getState();
    const advancing = t.dataset.ob === 'next' || t.dataset.ob === 'finish';
    try { if (t.dataset.ob !== 'skip' && t.dataset.ob !== 'back' && !t.dataset.demo) readStep(advancing); draft.error = ''; } catch (err) { draft.error = err.message; rerender(); return; }
    if (t.dataset.type) {
      const type = t.dataset.type;
      if (draft.accounts.some(a => a.type === type)) draft.accounts = draft.accounts.filter(a => a.type !== type);
      else draft.accounts.push({ id: uniqueId(TYPE_NAME[type], draft.accounts.map(a => a.id)), name: TYPE_NAME[type], type, opening: 0 });
      if (!draft.accounts.length) draft.accounts.push({ id: 'efectivo', name: 'Efectivo', type: 'cash', opening: 0 });
    } else if (t.dataset.income) {
      const id = t.dataset.income;
      if (draft.incomes[id]) delete draft.incomes[id]; else draft.incomes[id] = { day: 30, account: defaultAccount() };
    } else if (t.dataset.template) {
      const id = t.dataset.template;
      if (draft.expenses[id]) delete draft.expenses[id];
      else draft.expenses[id] = { day: s.catalog.templates.find(x => x.id === id).day ?? 1, account: defaultAccount() };
    } else if (t.dataset.ob === 'next') draft.step++;
    else if (t.dataset.ob === 'back') draft.step--;
    else if (t.dataset.ob === 'skip') { setState({ onboarded: true }); return; }
    else if (t.dataset.ob === 'finish') {
      try {
        const { accounts, items } = build(s);
        const lastAccount = (accounts.find(a => a.type === 'bank') ?? accounts[0]).id;
        draft = null;
        setState(st => ({ ...st, accounts, items: [...st.items, ...items], lastAccount, onboarded: true }));
      } catch (err) { draft.error = err.message; rerender(); }
      return;
    } else return;
    rerender();
    const focus = t.dataset.income ? `[data-amount="incomes:${t.dataset.income}"]` : t.dataset.template ? `[data-amount="expenses:${t.dataset.template}"]` : null;
    (focus && root().querySelector(focus) ? root().querySelector(focus) : root().querySelector('h2')).focus?.();
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-demo]')) setState(s => ({ ...s, ...demoState(year, month) }));
    if (e.target.closest('[data-reonboard]')) { draft = null; setState({ onboarded: false }); }
  });
}
