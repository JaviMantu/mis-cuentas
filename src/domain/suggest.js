// work/007: sugerencias que ahorran tipeo.
export function lastAmountFor(movements, categoryId) {
  let best = null;
  movements.forEach((m, k) => {
    if (m.categoryId !== categoryId) return;
    if (!best || m.date > best.m.date || (m.date === best.m.date && k > best.k)) best = { m, k };
  });
  return best ? best.m.amount : null;
}
