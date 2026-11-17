import { useState } from "react";
import { ClusterBarChart } from "../components/ClusterBarChart";
import { ClusterMap } from "../components/ClusterMap";
import { ClusterScatter } from "../components/ClusterScatter";
import { ClusterTable } from "../components/ClusterTable";
import { SummaryCards } from "../components/SummaryCards";
import { useClusters, useSummary } from "../hooks/useClusters";
import type { Metric } from "../types/cluster";

export function Dashboard() {
  const clusters = useClusters();
  const summary = useSummary();
  const [metric, setMetric] = useState<Metric>("orders");
  const [topN, setTopN] = useState(10);
  const [selected, setSelected] = useState<string>();

  const toggleSelect = (g: string) => setSelected((cur) => (cur === g ? undefined : g));
  const data = clusters.data ?? [];

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Clusters de pedidos</h1>
          <p className="subtitle">Pedidos de e-commerce agrupados por geohash</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            clusters.refetch();
            summary.refetch();
          }}
          disabled={clusters.isFetching}
        >
          {clusters.isFetching ? "Atualizando…" : "Atualizar"}
        </button>
      </header>

      <div className="filters" role="group" aria-label="Filtros">
        <label>
          Métrica
          <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)}>
            <option value="orders">Pedidos</option>
            <option value="value">Valor total</option>
          </select>
        </label>
        <label>
          Top
          <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {selected && (
          <button type="button" className="btn btn-ghost" onClick={() => setSelected(undefined)}>
            Limpar seleção ({selected})
          </button>
        )}
      </div>

      {clusters.isError && (
        <div className="alert" role="alert">
          Não foi possível carregar os clusters: {(clusters.error as Error).message}
        </div>
      )}

      <SummaryCards summary={summary.data} loading={summary.isLoading} />

      {clusters.isLoading ? (
        <div className="card empty">Carregando clusters…</div>
      ) : (
        <>
          <ClusterMap clusters={data} metric={metric} selected={selected} onSelect={toggleSelect} />
          <div className="grid-2">
            <ClusterBarChart clusters={data} metric={metric} topN={topN} selected={selected} onSelect={toggleSelect} />
            <ClusterScatter clusters={data} selected={selected} onSelect={toggleSelect} />
          </div>
          <ClusterTable clusters={data} selected={selected} onSelect={toggleSelect} />
        </>
      )}
    </main>
  );
}
