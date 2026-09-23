// Filas compartidas por Resumen y Mes.
import { esc, icon, li, signed, verb, Verb } from './dom.js';
import { iconFor } from '../domain/icons.js';
import { entry } from '../domain/catalog.js';
import { formatDay } from '../domain/dates.js';

export const accountName = (state, id) => state.accounts.find(a => a.id === id)?.name ?? id;
export const iconOf = (state, x) => entry(state.catalog, x.categoryId)?.icon ?? iconFor(x.name ?? x.note);

export function occurrenceRow(state, o, done, justDone) {
  const action = done
    ? `<span class="state act">${icon('check')}${Verb(o.kind)}</span>`
    : `<button class="quiet-btn act" data-occ="${esc(o.key)}" aria-label="Marcar ${esc(o.name)} como ${verb(o.kind)}">${Verb(o.kind)}</button>`;
  const day = formatDay(o.date);
  return li(`row ${done ? 'is-done' : 'is-pending'}${justDone === o.key ? ' just-done' : ''}`,
    `<span class="badge is-${o.kind}">${icon(done ? 'check' : iconOf(state, o))}</span>`
    + `<span class="c-date">${day}</span>`
    + `<span class="meta"><strong>${esc(o.name)}</strong><small>${day} · ${esc(accountName(state, o.account))}</small></span>`
    + `<span class="c-acct">${esc(accountName(state, o.account))}</span>`
    + `<span class="amt is-${o.kind}">${signed(o.kind, o.amount)}</span>${action}`);
}

export function movementRow(state, m) {
  const name = m.note || entry(state.catalog, m.categoryId)?.name || (m.kind === 'income' ? 'Ingreso' : 'Gasto');
  return li('row', `<span class="badge is-${m.kind}">${icon(iconOf(state, { ...m, name }))}</span>`
    + `<span class="meta"><strong>${esc(name)}</strong><small>${formatDay(m.date)} · ${esc(accountName(state, m.account))}</small></span>`
    + `<span class="amt is-${m.kind}">${signed(m.kind, m.amount)}</span>`);
}
