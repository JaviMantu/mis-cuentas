// Dinero en centavos enteros. Única entrada: toCents. Única salida: formatMoney. (skill money-safety)

const THOUSANDS = /^\d{1,3}(\.\d{3})+$/;

export function toCents(input) {
  let s = String(input ?? '').replace(/[\s$]/g, '');
  if (!s) throw new Error('monto vacío');
  if (s.includes(',')) {
    const [int, dec, extra] = s.split(',');
    if (extra !== undefined) throw new Error(`monto inválido: ${input}`);
    s = `${int.replace(/\./g, '')}.${dec}`;
  } else if (THOUSANDS.test(s)) {
    s = s.replace(/\./g, '');
  }
  const m = /^(\d+)(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) throw new Error(`monto inválido: ${input}`);
  const cents = Number(m[1] + (m[2] ?? '').padEnd(2, '0')); // concatenar dígitos: sin aritmética float
  if (cents <= 0) throw new Error('el monto debe ser mayor que cero');
  return cents;
}

export function formatMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const int = Math.trunc(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const dec = abs % 100;
  return `${sign}$ ${int}${dec ? ',' + String(dec).padStart(2, '0') : ''}`;
}
