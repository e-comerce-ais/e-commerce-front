import { useState } from "react";
import type { Cluster } from "../types/cluster";
import { formatCurrency, formatInt } from "../utils/format";

type SortKey = "geohash" | "totalOrders" | "totalValue" | "ticket";

interface Props {
  clusters: Cluster[];
  selected?: string;
  onSelect: (geohash: string) => void;
}

const ticket = (c: Cluster) => (c.totalOrders ? c.totalValue / c.totalOrders : 0);

export function ClusterTable({ clusters, selected, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("totalOrders");
  const [asc, setAsc] = useState(false);

  const rows = [...clusters].sort((a, b) => {
    const va = sortKey === "ticket" ? ticket(a) : a[sortKey];
    const vb = sortKey === "ticket" ? ticket(b) : b[sortKey];
    const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
    return asc ? cmp : -cmp;
  });

  const header = (key: SortKey, label: string, numeric = true) => (
    <th
      className={numeric ? "num" : undefined}
      aria-sort={sortKey === key ? (asc ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => (sortKey === key ? setAsc(!asc) : (setSortKey(key), setAsc(false)))}
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
              <th className="num">Lat / Lng</th>
              {header("totalOrders", "Pedidos")}
              {header("totalValue", "Valor total")}
              {header("ticket", "Ticket médio")}
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
                <td className="num">{formatInt(c.totalOrders)}</td>
                <td className="num">{formatCurrency(c.totalValue)}</td>
                <td className="num">{formatCurrency(ticket(c))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
