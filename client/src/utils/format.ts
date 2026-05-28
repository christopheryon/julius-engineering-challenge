export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}
