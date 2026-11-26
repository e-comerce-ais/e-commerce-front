import { useState } from "react";
import { ClusterBarChart } from "../components/ClusterBarChart";
import { ClusterMap } from "../components/ClusterMap";
import { ClusterTable } from "../components/ClusterTable";
import { IconAlert, IconPin, IconRefresh } from "../components/Icons";
import { SummaryCards } from "../components/SummaryCards";
import { useClusters, useSummary } from "../hooks/useClusters";

const timeFmt = new Intl.DateTimeFormat("pt-BR", { timeStyle: "medium" });
const PIPELINE = ["CSV no S3", "sqs-producer", "SQS", "Lambda consumidora", "DynamoDB", "api-geohash", "Dashboard"];

export function Dashboard() {
  const clusters = useClusters();
  const summary = useSummary();
  const [topN, setTopN] = useState(10);
  const [minCount, setMinCount] = useState(0);
  const [selected, setSelected] = useState<string>();

  const toggleSelect = (g: string) => setSelected((cur) => (cur === g ? undefined : g));
  // Se a última busca falhou, não mostra os dados antigos que o React Query guardou.
  const data = clusters.isError ? [] : (clusters.data ?? []).filter((c) => c.count >= minCount);
  const online = !clusters.isError && clusters.dataUpdatedAt > 0;

  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <span className="brand-logo">
              <IconPin size={26} />
            </span>
            <div>
              <p className="eyebrow">E-commerce · Geohash</p>
              <h1>Clusters de pedidos</h1>
              <p className="hero-sub">Onde os pedidos estão se concentrando, em tempo real</p>
            </div>
          </div>

          <div className="hero-actions">
            <span className={`status-pill${online ? "" : " offline"}`} role="status">
              <span className="status-dot" />
              {clusters.isError ? "Sem conexão com a API" : online ? "Ao vivo · a cada 2s" : "Conectando…"}
              {clusters.dataUpdatedAt > 0 && (
                <span className="status-time">{timeFmt.format(clusters.dataUpdatedAt)}</span>
              )}
            </span>
            <button
              type="button"
              className="btn btn-hero"
              onClick={() => {
                clusters.refetch();
                summary.refetch();
              }}
              // Com o polling de 2s, isFetching liga e desliga o tempo todo;
              // por isso o botão só fica desativado na primeira carga.
              disabled={clusters.isLoading}
            >
              <IconRefresh size={16} className={clusters.isLoading ? "spin" : undefined} />
              {clusters.isLoading ? "Carregando…" : "Atualizar"}
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="card toolbar" role="group" aria-label="Filtros">
          <div className="filters">
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
          </div>
          {selected ? (
            <button type="button" className="btn btn-ghost" onClick={() => setSelected(undefined)}>
              Limpar seleção <span className="mono">{selected}</span> ✕
            </button>
          ) : (
            <span className="toolbar-hint">Clique num cluster no mapa, no gráfico ou na tabela para destacá-lo</span>
          )}
        </div>

        {clusters.isError && (
          <div className="alert" role="alert">
            <IconAlert size={20} />
            <div>
              <strong>Não foi possível carregar os clusters</strong>
              {(clusters.error as Error).message}
            </div>
          </div>
        )}

        <SummaryCards summary={summary.isError ? undefined : summary.data} loading={summary.isLoading} />

        {clusters.isLoading ? (
          <div className="card">
            <div className="skeleton" style={{ height: 24, width: 220, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 420 }} />
          </div>
        ) : (
          <>
            <ClusterMap clusters={data} selected={selected} onSelect={toggleSelect} />
            <div className="grid-2">
              <ClusterBarChart clusters={data} topN={topN} selected={selected} onSelect={toggleSelect} />
              <ClusterTable clusters={data} selected={selected} onSelect={toggleSelect} />
            </div>
          </>
        )}

        <footer className="footer" aria-label="Pipeline de dados">
          {PIPELINE.map((step, i) => (
            <span key={step} style={{ display: "contents" }}>
              {i > 0 && <span aria-hidden="true">→</span>}
              <span className="step">{step}</span>
            </span>
          ))}
        </footer>
      </main>
    </>
  );
}
