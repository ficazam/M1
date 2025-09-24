export const moneyFormatter = (m: { currency: string; amount: number }) => {
  return `${m.currency} ${(m.amount / 100).toLocaleString()}`;
}
