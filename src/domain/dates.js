// work/007: fechas legibles. El dominio sigue guardando ISO (AAAA-MM-DD); solo la presentación cambia.
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDay(iso) {
  const [, m, d] = String(iso).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}
