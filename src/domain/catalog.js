// work/007: catálogos que ahorran tipeo. Listas: income · expense (categorías) y templates (fijos frecuentes).
// Funciones puras: devuelven un catálogo nuevo y nunca mutan el recibido.

export const DEFAULT_CATALOG = Object.freeze({
  income: [
    { id: 'salario', name: 'Salario', icon: 'briefcase' },
    { id: 'honorarios', name: 'Honorarios', icon: 'pen' },
    { id: 'arriendo-recibido', name: 'Arriendo recibido', icon: 'home' },
    { id: 'prima', name: 'Prima', icon: 'gift' },
    { id: 'otros-ingresos', name: 'Otros ingresos', icon: 'in' },
  ],
  expense: [
    { id: 'vivienda', name: 'Vivienda', icon: 'home' },
    { id: 'servicios', name: 'Servicios', icon: 'bolt' },
    { id: 'mercado', name: 'Mercado', icon: 'cart' },
    { id: 'transporte', name: 'Transporte', icon: 'car' },
    { id: 'salud', name: 'Salud', icon: 'heart' },
    { id: 'educacion', name: 'Educación', icon: 'book' },
    { id: 'suscripciones', name: 'Suscripciones', icon: 'repeat' },
    { id: 'deudas', name: 'Deudas', icon: 'card' },
    { id: 'otros-gastos', name: 'Otros gastos', icon: 'tag' },
  ],
  templates: [
    { id: 'arriendo', name: 'Arriendo', kind: 'expense', categoryId: 'vivienda', day: 5 },
    { id: 'administracion', name: 'Administración', kind: 'expense', categoryId: 'vivienda', day: 5 },
    { id: 'servicios-publicos', name: 'Servicios públicos', kind: 'expense', categoryId: 'servicios', day: 20 },
    { id: 'internet', name: 'Internet', kind: 'expense', categoryId: 'servicios', day: 15 },
    { id: 'celular', name: 'Celular', kind: 'expense', categoryId: 'servicios', day: 15 },
    { id: 'eps', name: 'EPS o prepagada', kind: 'expense', categoryId: 'salud', day: 10 },
    { id: 'gimnasio', name: 'Gimnasio', kind: 'expense', categoryId: 'salud', day: 1 },
    { id: 'streaming', name: 'Streaming', kind: 'expense', categoryId: 'suscripciones', day: 10 },
    { id: 'cuota-credito', name: 'Cuota de crédito', kind: 'expense', categoryId: 'deudas', day: 25 },
    { id: 'colegio', name: 'Colegio o universidad', kind: 'expense', categoryId: 'educacion', day: 5 },
  ],
});

export const LISTS = ['income', 'expense', 'templates'];
const norm = (s) => String(s ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clone = (c) => Object.fromEntries(LISTS.map(l => [l, (c[l] ?? []).map(e => ({ ...e }))]));

function checkName(catalog, list, name, exceptId) {
  const n = norm(name);
  if (!n) throw new Error('escribe un nombre');
  if (catalog[list].some(e => e.id !== exceptId && norm(e.name) === n)) throw new Error(`«${String(name).trim()}» ya existe`);
}

export function addEntry(catalog, list, entry) {
  const c = clone(catalog);
  checkName(c, list, entry.name);
  let id = slug(entry.name) || 'item';
  while (LISTS.some(l => c[l].some(e => e.id === id))) id += '-2';
  const icon = entry.icon ?? (list === 'income' ? 'in' : 'tag');
  c[list].push({ ...entry, id, name: String(entry.name).trim(), ...(list === 'templates' ? {} : { icon }) });
  return c;
}

export function renameEntry(catalog, list, id, name) {
  const c = clone(catalog);
  checkName(c, list, name, id);
  c[list] = c[list].map(e => e.id === id ? { ...e, name: String(name).trim() } : e);
  return c;
}

export function archiveEntry(catalog, list, id, archived = true) {
  const c = clone(catalog);
  c[list] = c[list].map(e => e.id === id ? { ...e, archived } : e);
  return c;
}

export const active = (catalog, list) => (catalog[list] ?? []).filter(e => !e.archived);

// El historial resuelve por id aunque la entrada esté archivada.
export function entry(catalog, id) {
  for (const l of LISTS) { const e = (catalog[l] ?? []).find(x => x.id === id); if (e) return e; }
  return null;
}
export const entryName = (catalog, id) => entry(catalog, id)?.name ?? null;

const RULES = {
  expense: [
    ['vivienda', /arriendo|alquiler|renta|hipoteca|administracion/],
    ['servicios', /internet|wifi|celular|telefono|luz|agua|gas|energia|servicios/],
    ['mercado', /mercado|super|comida|almuerzo|restaurante|cafe|domicilio/],
    ['transporte', /gasolina|uber|taxi|transporte|carro|moto|parqueadero|peaje|bus/],
    ['salud', /salud|medic|farmacia|eps|prepagada|odontolog|gimnasio|gym/],
    ['educacion', /colegio|universidad|curso|matricula|libros/],
    ['suscripciones', /netflix|spotify|streaming|suscripcion|disney|youtube/],
    ['deudas', /credito|cuota|prestamo|tarjeta/],
  ],
  income: [
    ['salario', /salario|sueldo|nomina/],
    ['honorarios', /honorarios|freelance|cliente|factura/],
    ['arriendo-recibido', /arriendo/],
    ['prima', /prima|bonificacion|bono/],
  ],
};

export function inferCategory(name, kind) {
  const n = norm(name);
  const hit = RULES[kind]?.find(([, re]) => re.test(n));
  return hit ? hit[0] : kind === 'income' ? 'otros-ingresos' : 'otros-gastos';
}
