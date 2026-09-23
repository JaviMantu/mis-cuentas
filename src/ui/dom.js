// Utilidades de presentación compartidas por las vistas.
import { formatMoney } from '../domain/money.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const esc = (s) => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const icon = (name) => `<svg class="ico" aria-hidden="true"><use href="#i-${name}"/></svg>`;
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const signed = (kind, amount) => kind === 'expense' ? formatMoney(-amount) : `+${formatMoney(amount)}`;
export const verb = (kind) => kind === 'income' ? 'recibido' : 'pagado';
export const Verb = (kind) => kind === 'income' ? 'Recibido' : 'Pagado';
export const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || crypto.randomUUID();

// Fecha de "hoy" fijable para pruebas: ?hoy=AAAA-MM-DD
export const today = (() => {
  const q = new URLSearchParams(location.search).get('hoy');
  return /^\d{4}-\d{2}-\d{2}$/.test(q ?? '') ? q : new Date().toISOString().slice(0, 10);
})();
export const [year, month] = today.split('-').map(Number);
export const monthLabel = (opts) => cap(new Date(year, month - 1, 1).toLocaleDateString('es-CO', opts));

export function li(className, html) {
  const el = document.createElement('li');
  el.className = className;
  el.innerHTML = html;
  return el;
}

export function showError(form, message) {
  const p = form.querySelector('.error');
  p.textContent = message;
  p.hidden = !message;
}

let toastTimer = null;
export function toast(text, undo) {
  $('#toast-text').textContent = text;
  $('#toast').hidden = false;
  $('#toast-undo').onclick = () => { undo(); hideToast(); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}
export function hideToast() { $('#toast').hidden = true; clearTimeout(toastTimer); }
