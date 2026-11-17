import type { Cluster } from "../types/cluster";
import { formatCurrency, formatInt } from "../utils/format";

interface Props {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Cluster }>;
}

/** Tooltip compartilhado pelos gráficos Recharts. */
export function ClusterTooltip({ active, payload }: Props) {
  if (!active || !payload?.length) return null;
  const c = payload[0].payload;
  const ticket = c.totalOrders ? c.totalValue / c.totalOrders : 0;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{c.geohash}</div>
      <div>Pedidos: <strong>{formatInt(c.totalOrders)}</strong></div>
      <div>Valor: <strong>{formatCurrency(c.totalValue)}</strong></div>
      <div>Ticket médio: <strong>{formatCurrency(ticket)}</strong></div>
    </div>
  );
}
