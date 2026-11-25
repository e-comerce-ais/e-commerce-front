import { useState } from "react";
import { ClusterBarChart } from "../components/ClusterBarChart";
import { ClusterMap } from "../components/ClusterMap";
import { ClusterTable } from "../components/ClusterTable";
import { SummaryCards } from "../components/SummaryCards";
import { useClusters, useSummary } from "../hooks/useClusters";

export function Dashboard() {
  const clusters = useClusters();
  const summary = useSummary();
  const [topN, setTopN] = useState(10);
  const [minCount, setMinCount] = useState(0);
  const [selected, setSelected] = useState<string>();

  const toggleSelect = (g: string) => setSelected((cur) => (cur === g ? undefined : g));
  const data = (clusters.data ?? []).filter((c) => c.count >= minCount);

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
          // Com o polling de 2s, isFetching liga e desliga o tempo todo;
          // por isso o botão só fica desativado na primeira carga.
          disabled={clusters.isLoading}
        >
          {clusters.isLoading ? "Carregando…" : "Atualizar"}
        </button>
      </header>

      <div className="filters" role="group" aria-label="Filtros">
        <label>
          Mínimo de pedidos
          <select value={minCount} onChange={(e) => setMinCount(Number(e.target.value))}>
            {[0, 5, 10, 50, 100, 500].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "Todos" : `≥ ${n}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ranking
          <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                Top {n}
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
          <ClusterMap clusters={data} selected={selected} onSelect={toggleSelect} />
          <div className="grid-2">
            <ClusterBarChart clusters={data} topN={topN} selected={selected} onSelect={toggleSelect} />
            <ClusterTable clusters={data} selected={selected} onSelect={toggleSelect} />
          </div>
        </>
      )}
    </main>
  );
}
