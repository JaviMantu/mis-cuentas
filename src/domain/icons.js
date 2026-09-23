// work/005: ícono por palabra clave (nombres del sprite en index.html). Presentación pura, sin estado.
const RULES = [
  ['home', /arriendo|alquiler|renta|hipoteca|administracion|casa/],
  ['wifi', /internet|wifi|celular|telefono|plan movil|streaming|netflix|spotify/],
  ['briefcase', /salario|sueldo|nomina|honorarios|pago cliente|freelance/],
  ['cart', /mercado|super|comida|almuerzo|restaurante|cafe/],
  ['car', /gasolina|uber|taxi|transporte|carro|moto|parqueadero|peaje/],
  ['heart', /salud|medic|farmacia|eps|seguro|odontolog/],
  ['bolt', /luz|energia|agua|gas|servicios|gimnasio|gym/],
];
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function iconFor(name) {
  const n = norm(name);
  return RULES.find(([, re]) => re.test(n))?.[0] ?? 'tag';
}

export function accountIcon(account) {
  const n = norm(`${account.id} ${account.name}`);
  if (/efectivo|cash/.test(n)) return 'cash';
  if (/tarjeta|credito|card/.test(n)) return 'card';
  if (/banco|bank|cuenta/.test(n)) return 'bank';
  return 'wallet';
}
