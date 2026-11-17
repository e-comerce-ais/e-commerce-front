import type { Cluster } from "../types/cluster";
import { formatDate, formatInt } from "../utils/format";

interface Props {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: Cluster }>;
}

/** Tooltip dos gráficos Recharts. */
export function ClusterTooltip({ active, payload }: Props) {
  if (!active || !payload?.length) return null;
  const c = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{c.geohash}</div>
      <div>Pedidos: <strong>{formatInt(c.count)}</strong></div>
      <div>Centroide: <strong>{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</strong></div>
      <div>Atualizado: <strong>{formatDate(c.updatedAt)}</strong></div>
    </div>
  );
}
