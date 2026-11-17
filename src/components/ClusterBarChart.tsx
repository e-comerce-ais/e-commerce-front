import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../hooks/useTheme";
import type { Cluster, Metric } from "../types/cluster";
import { formatCompact, formatCurrencyCompact, metricLabel } from "../utils/format";
import { ClusterTooltip } from "./ClusterTooltip";

interface Props {
  clusters: Cluster[];
  metric: Metric;
  topN: number;
  selected?: string;
  onSelect: (geohash: string) => void;
}

export function ClusterBarChart({ clusters, metric, topN, selected, onSelect }: Props) {
  const theme = useTheme();
  const key = metric === "orders" ? "totalOrders" : "totalValue";
  const data = [...clusters].sort((a, b) => b[key] - a[key]).slice(0, topN);
  const tickFmt = metric === "value" ? formatCurrencyCompact : formatCompact;

  return (
    <div className="card">
      <h2>
        Top {topN} clusters por {metricLabel[metric].toLowerCase()}
      </h2>
      <div style={{ height: Math.max(220, data.length * 32 + 40) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }} barCategoryGap={2}>
            <CartesianGrid horizontal={false} stroke={theme.grid} strokeWidth={1} />
            <XAxis
              type="number"
              tickFormatter={tickFmt}
              stroke={theme.axis}
              tick={{ fill: theme.muted, fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="geohash"
              width={72}
              stroke={theme.axis}
              tick={{ fill: theme.textSecondary, fontSize: 12, fontFamily: "ui-monospace, monospace" }}
            />
            <Tooltip cursor={{ fill: theme.grid, opacity: 0.5 }} content={<ClusterTooltip />} />
            <Bar
              dataKey={key}
              name={metricLabel[metric]}
              radius={[0, 4, 4, 0]}
              maxBarSize={22}
              onClick={(d) => onSelect((d as unknown as { payload: Cluster }).payload.geohash)}
              style={{ cursor: "pointer" }}
            >
              {data.map((c) => (
                <Cell
                  key={c.geohash}
                  fill={theme.series}
                  fillOpacity={!selected || c.geohash === selected ? 1 : 0.45}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
