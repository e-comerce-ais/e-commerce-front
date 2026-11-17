import { useState } from "react";
import type { Cluster } from "../types/cluster";
import { formatDate, formatInt } from "../utils/format";

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
      <h2>Tabela de clusters</h2>
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
                <td className="mono">{c.geohash}</td>
                <td className="num">
                  {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                </td>
                <td className="num">{formatInt(c.count)}</td>
                <td className="num">{formatDate(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
