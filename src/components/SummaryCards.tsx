import type { ClustersSummary } from "../types/cluster";
import { formatCurrency, formatInt } from "../utils/format";

interface Props {
  summary?: ClustersSummary;
  loading: boolean;
}

export function SummaryCards({ summary, loading }: Props) {
  const tiles = [
    { label: "Clusters", value: summary && formatInt(summary.totalClusters) },
    { label: "Pedidos", value: summary && formatInt(summary.totalOrders) },
    { label: "Valor total", value: summary && formatCurrency(summary.totalValue) },
    { label: "Ticket médio", value: summary && formatCurrency(summary.averageTicket) },
    {
      label: "Pedidos por cluster (média)",
      value: summary && formatInt(summary.averageOrdersPerCluster),
    },
  ];

  return (
    <section className="tiles" aria-label="Resumo">
      {tiles.map((t) => (
        <div className="tile card" key={t.label}>
          <span className="tile-label">{t.label}</span>
          <span className="tile-value">{loading ? "…" : (t.value ?? "—")}</span>
        </div>
      ))}
    </section>
  );
}
