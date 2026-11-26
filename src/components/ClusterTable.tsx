import { useState } from "react";
import type { Cluster } from "../types/cluster";
import { formatDate, formatInt } from "../utils/format";
import { IconTable } from "./Icons";

type SortKey = "geohash" | "count" | "updatedAt";

interface Props {
  clusters: Cluster[];
  selected?: string;
  onSelect: (geohash: string) => void;
}

export function ClusterTable({ clusters, selected, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [asc, setAsc] = useState(false);

  const rows = [...clusters].sort((a, b) => {
    const cmp =
      sortKey === "count" ? a.count - b.count : String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
    return asc ? cmp : -cmp;
  });
  // Posição no ranking por pedidos, independente da ordenação escolhida.
  const rankOf = new Map([...clusters].sort((a, b) => b.count - a.count).map((c, i) => [c.geohash, i + 1]));
  const max = Math.max(1, ...clusters.map((c) => c.count));

  const header = (key: SortKey, label: string, numeric = true) => (
    <th
      className={numeric ? "num" : undefined}
      aria-sort={sortKey === key ? (asc ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => (sortKey === key ? setAsc(!asc) : (setSortKey(key), setAsc(key === "geohash")))}
      >
        {label} {sortKey === key ? (asc ? "▲" : "▼") : ""}
      </button>
    </th>
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">
            <IconTable />
          </span>
          <div>
            <h2>Tabela de clusters</h2>
            <p className="subtitle">Clique no cabeçalho para ordenar e numa linha para destacar.</p>
          </div>
        </div>
        <span className="badge">{formatInt(clusters.length)} clusters</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {header("geohash", "Geohash", false)}
              <th className="num">Centroide (lat, lng)</th>
              {header("count", "Pedidos")}
              {header("updatedAt", "Atualizado em")}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.geohash}
                className={c.geohash === selected ? "selected" : undefined}
                onClick={() => onSelect(c.geohash)}
              >
                <td>
                  <span className="geo mono">
                    <span className={`rank rank-${rankOf.get(c.geohash)}`}>{rankOf.get(c.geohash)}</span>
                    {c.geohash}
                  </span>
                </td>
                <td className="num muted">
                  {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                </td>
                <td className="num">
                  <span className="count-cell">
                    <span className="count-bar" aria-hidden="true">
                      <span style={{ width: `${(c.count / max) * 100}%` }} />
                    </span>
                    <strong>{formatInt(c.count)}</strong>
                  </span>
                </td>
                <td className="num muted">{formatDate(c.updatedAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="muted" style={{ textAlign: "center", padding: 32 }}>
                  Nenhum cluster para exibir ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
