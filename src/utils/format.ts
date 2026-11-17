const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const int = new Intl.NumberFormat("pt-BR");
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

export const formatCurrency = (v: number) => brl.format(v);
export const formatCurrencyCompact = (v: number) => brlCompact.format(v);
export const formatInt = (v: number) => int.format(Math.round(v));
export const formatCompact = (v: number) => compact.format(v);

export const metricLabel = { orders: "Pedidos", value: "Valor total" } as const;

/** Divide [min, max] em 5 faixas iguais e devolve o índice 0..4 do valor. */
export function binIndex(value: number, min: number, max: number): number {
  if (max <= min) return 4;
  return Math.min(4, Math.floor(((value - min) / (max - min)) * 5));
}
