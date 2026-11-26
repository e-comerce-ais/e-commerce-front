import type { CSSProperties, ReactNode } from "react";
import type { ClustersSummary } from "../types/cluster";
import { formatDate, formatInt } from "../utils/format";
import { IconAvg, IconBox, IconGrid, IconTrophy } from "./Icons";

interface Props {
  summary?: ClustersSummary;
  loading: boolean;
}

interface Tile {
  label: string;
  value?: string;
  foot: ReactNode;
  icon: ReactNode;
  /** Gradiente do ícone: cada card tem sua cor. */
  color: string;
}

export function SummaryCards({ summary, loading }: Props) {
  const largest = summary?.largestCluster;
  const tiles: Tile[] = [
    {
      label: "Clusters ativos",
      value: summary && formatInt(summary.totalClusters),
      foot: "geohashes com pedidos",
      icon: <IconGrid size={22} />,
      color: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    },
    {
      label: "Total de pedidos",
      value: summary && formatInt(summary.totalOrders),
      foot: summary?.lastUpdatedAt ? `atualizado ${formatDate(summary.lastUpdatedAt)}` : "processados pela fila SQS",
      icon: <IconBox size={22} />,
      color: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    },
    {
      label: "Média por cluster",
      value: summary && formatInt(summary.averageOrdersPerCluster),
      foot: "pedidos / geohash",
      icon: <IconAvg size={22} />,
      color: "linear-gradient(135deg, #ec4899, #f43f5e)",
    },
    {
      label: "Maior cluster",
      value: largest ? formatInt(largest.count) : undefined,
      foot: largest ? (
        <>
          pedidos em <span className="mono">{largest.geohash}</span>
        </>
      ) : (
        "—"
      ),
      icon: <IconTrophy size={22} />,
      color: "linear-gradient(135deg, #f59e0b, #f97316)",
    },
  ];

  return (
    <section aria-label="Resumo" className="tiles">
      {tiles.map((t) => (
        <div className="tile card" key={t.label} style={{ "--tile-color": t.color } as CSSProperties}>
          <span className="tile-icon" style={{ background: t.color }}>
            {t.icon}
          </span>
          <div className="tile-body">
            <span className="tile-label">{t.label}</span>
            {loading ? (
              <span className="skeleton" style={{ height: 34, width: 96 }} />
            ) : (
              <span className="tile-value">{t.value ?? "—"}</span>
            )}
            <span className="tile-foot">{t.foot}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
