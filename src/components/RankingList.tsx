import type { Cluster } from "../types/cluster";
import { binIndex, formatInt } from "../utils/format";
import { theme } from "../utils/theme";

interface Props {
  clusters: Cluster[];
  topN: number;
  selected?: string;
  onSelect: (geohash: string) => void;
}

/** Ranking compacto dos clusters com mais pedidos, no painel lateral. */
export function RankingList({ clusters, topN, selected, onSelect }: Props) {
  const top = [...clusters].sort((a, b) => b.count - a.count).slice(0, topN);
  const counts = clusters.map((c) => c.count);
  const min = Math.min(...counts);
  const max = Math.max(1, ...counts);

  if (top.length === 0) return <p className="side-empty">Nenhum cluster ainda.</p>;

  return (
    <ol className="ranking">
      {top.map((c, i) => {
        const color = theme.sequential[binIndex(c.count, min, max)];
        return (
          <li key={c.geohash}>
            <button
              type="button"
              className={c.geohash === selected ? "active" : undefined}
              onClick={() => onSelect(c.geohash)}
              aria-pressed={c.geohash === selected}
            >
              <span className="rank-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="rank-geo mono">{c.geohash}</span>
              <span className="rank-bar">
                <span style={{ width: `${(c.count / max) * 100}%`, background: color }} />
              </span>
              <span className="rank-count">{formatInt(c.count)}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
