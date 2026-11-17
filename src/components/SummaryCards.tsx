import type { ClustersSummary } from "../types/cluster";
import { formatDate, formatInt } from "../utils/format";

interface Props {
  summary?: ClustersSummary;
  loading: boolean;
}

export function SummaryCards({ summary, loading }: Props) {
  const largest = summary?.largestCluster;
  const tiles = [
    { label: "Clusters", value: summary && formatInt(summary.totalClusters) },
    { label: "Pedidos", value: summary && formatInt(summary.totalOrders) },
    { label: "Pedidos por cluster (média)", value: summary && formatInt(summary.averageOrdersPerCluster) },
    {
      label: largest ? `Maior cluster (${largest.geohash})` : "Maior cluster",
      value: largest && `${formatInt(largest.count)} pedidos`,
    },
  ];

  return (
    <section aria-label="Resumo">
      <div className="tiles">
        {tiles.map((t) => (
          <div className="tile card" key={t.label}>
            <span className="tile-label">{t.label}</span>
            <span className="tile-value">{loading ? "…" : (t.value ?? "—")}</span>
          </div>
        ))}
      </div>
      {summary?.lastUpdatedAt && (
        <p className="subtitle updated">Última atualização dos dados: {formatDate(summary.lastUpdatedAt)}</p>
      )}
    </section>
  );
}
