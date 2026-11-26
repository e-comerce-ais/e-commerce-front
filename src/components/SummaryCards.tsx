import type { ClustersSummary } from "../types/cluster";
import { formatInt } from "../utils/format";

interface Props {
  summary?: ClustersSummary;
  loading: boolean;
}

/** Os 4 números principais, em grade 2×2 no painel lateral. */
export function SummaryCards({ summary, loading }: Props) {
  const largest = summary?.largestCluster;
  const kpis = [
    { label: "Pedidos", value: summary && formatInt(summary.totalOrders), accent: "var(--lime)", big: true },
    { label: "Clusters", value: summary && formatInt(summary.totalClusters), accent: "var(--sky)" },
    {
      label: "Média",
      value: summary && summary.averageOrdersPerCluster.toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
      accent: "var(--mint)",
    },
    {
      label: "Maior",
      sub: largest?.geohash,
      value: largest ? formatInt(largest.count) : undefined,
      accent: "var(--rose)",
    },
  ];

  return (
    <section aria-label="Resumo" className="kpis">
      {kpis.map((k) => (
        <div className={`kpi${k.big ? " kpi-big" : ""}`} key={k.label}>
          <span className="kpi-label">
            <span className="kpi-dot" style={{ background: k.accent }} />
            {k.label}
          </span>
          {loading ? (
            <span className="skeleton" style={{ height: 30, width: 72 }} />
          ) : (
            <span className="kpi-value">{k.value ?? "—"}</span>
          )}
          {k.sub && <span className="kpi-sub mono">{k.sub}</span>}
        </div>
      ))}
    </section>
  );
}
