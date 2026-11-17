const int = new Intl.NumberFormat("pt-BR");
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const formatInt = (v: number) => int.format(Math.round(v));
export const formatCompact = (v: number) => compact.format(v);

/** Aceita ISO 8601 ou epoch (segundos ou milissegundos), como string ou número. */
export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const n = Number(value);
  const date = Number.isFinite(n) ? new Date(n < 1e12 ? n * 1000 : n) : new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTime.format(date);
}

/** Divide [min, max] em 5 faixas iguais e devolve o índice 0..4 do valor. */
export function binIndex(value: number, min: number, max: number): number {
  if (max <= min) return 4;
  return Math.min(4, Math.floor(((value - min) / (max - min)) * 5));
}
