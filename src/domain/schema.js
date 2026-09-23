// work/007: esquema versionado. migrate() es pura e idempotente; nunca pierde montos.
import { DEFAULT_CATALOG, inferCategory, LISTS } from './catalog.js';
import { accountIcon } from './icons.js';

export const VERSION = 2;
export const ACCOUNT_TYPES = [
  { id: 'cash', name: 'Efectivo' }, { id: 'bank', name: 'Banco' },
  { id: 'card', name: 'Tarjeta de crédito' }, { id: 'wallet', name: 'Billetera digital' },
];
const V1_ACCOUNTS = [
  { id: 'efectivo', name: 'Efectivo', opening: 0 },
  { id: 'banco', name: 'Banco', opening: 0 },
  { id: 'tarjeta', name: 'Tarjeta', opening: 0 },
];
const copyCatalog = (c) => Object.fromEntries(LISTS.map(l => [l, (c?.[l] ?? DEFAULT_CATALOG[l]).map(e => ({ ...e }))]));
const typeOf = (a) => ACCOUNT_TYPES.some(t => t.id === a.type) ? a.type : accountIcon(a);

export function freshState() {
  return {
    version: VERSION, onboarded: false,
    accounts: [{ id: 'efectivo', name: 'Efectivo', type: 'cash', opening: 0 }],
    catalog: copyCatalog(DEFAULT_CATALOG), items: [], movements: [],
    lastAccount: 'efectivo', lastByCategory: {},
  };
}

export function migrate(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const accounts = (raw.accounts ?? V1_ACCOUNTS).map(a => ({ ...a, type: typeOf(a), opening: a.opening ?? 0 }));
  return {
    version: VERSION,
    // Todo estado guardado antes de v2 es de alguien que ya usa la app: no ve el onboarding.
    onboarded: raw.version === VERSION ? Boolean(raw.onboarded) : true,
    accounts,
    catalog: copyCatalog(raw.catalog),
    items: (raw.items ?? []).map(i => ({ ...i, categoryId: i.categoryId ?? inferCategory(i.name, i.kind) })),
    movements: (raw.movements ?? []).map(m => ({ ...m, categoryId: m.categoryId ?? inferCategory(m.note ?? '', m.kind) })),
    lastAccount: raw.lastAccount ?? accounts.find(a => a.type === 'bank')?.id ?? accounts[0]?.id,
    lastByCategory: { ...(raw.lastByCategory ?? {}) },
    ...(raw.ui ? { ui: raw.ui } : {}),
  };
}
