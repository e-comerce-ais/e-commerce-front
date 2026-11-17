import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../hooks/useTheme";
import type { Cluster } from "../types/cluster";
import { formatCompact, formatCurrencyCompact } from "../utils/format";
import { ClusterTooltip } from "./ClusterTooltip";

interface Props {
  clusters: Cluster[];
  selected?: string;
  onSelect: (geohash: string) => void;
}

/** Cada ponto é um cluster: pedidos (x) × valor total (y). */
export function ClusterScatter({ clusters, selected, onSelect }: Props) {
  const theme = useTheme();

  return (
    <div className="card">
      <h2>Pedidos × valor por cluster</h2>
      <p className="subtitle">Clusters acima da tendência têm ticket médio maior.</p>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 24, bottom: 24, left: 8 }}>
            <CartesianGrid stroke={theme.grid} />
            <XAxis
              type="number"
              dataKey="totalOrders"
              name="Pedidos"
              tickFormatter={formatCompact}
              stroke={theme.axis}
              tick={{ fill: theme.muted, fontSize: 12 }}
              label={{ value: "Pedidos", position: "insideBottom", offset: -12, fill: theme.textSecondary, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="totalValue"
              name="Valor"
              tickFormatter={formatCurrencyCompact}
              width={80}
              stroke={theme.axis}
              tick={{ fill: theme.muted, fontSize: 12 }}
            />
            <Tooltip cursor={{ stroke: theme.axis, strokeDasharray: "3 3" }} content={<ClusterTooltip />} />
            <Scatter
              data={clusters}
              onClick={(d) => onSelect((d as unknown as { payload: Cluster }).payload.geohash)}
              shape={(props: { cx?: number; cy?: number; payload?: Cluster }) => {
                const isSel = props.payload?.geohash === selected;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={isSel ? 7 : 5}
                    fill={theme.series}
                    fillOpacity={!selected || isSel ? 0.85 : 0.35}
                    stroke={isSel ? theme.textPrimary : theme.surface}
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
