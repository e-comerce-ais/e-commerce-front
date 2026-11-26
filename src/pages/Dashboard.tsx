import { useState } from "react";
import { Chips } from "../components/Chips";
import { ClusterBarChart } from "../components/ClusterBarChart";
import { ClusterMap } from "../components/ClusterMap";
import { ClusterTable } from "../components/ClusterTable";
import { IconAlert, IconBars, IconMap, IconRefresh, IconTable } from "../components/Icons";
import { RankingList } from "../components/RankingList";
import { SummaryCards } from "../components/SummaryCards";
import { useClusters, useSummary } from "../hooks/useClusters";
import { formatDate, formatInt } from "../utils/format";

const timeFmt = new Intl.DateTimeFormat("pt-BR", { timeStyle: "medium" });
const PIPELINE = ["S3", "SQS", "Lambda", "DynamoDB", "API"];

type View = "mapa" | "tabela" | "grafico";
const VIEWS: { id: View; label: string; icon: typeof IconMap }[] = [
  { id: "mapa", label: "Mapa", icon: IconMap },
  { id: "tabela", label: "Tabela", icon: IconTable },
  { id: "grafico", label: "Gráfico", icon: IconBars },
];

export function Dashboard() {
  const clusters = useClusters();
  const summary = useSummary();
  const [topN, setTopN] = useState(10);
  const [minCount, setMinCount] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [view, setView] = useState<View>("mapa");

  const toggleSelect = (g: string) => setSelected((cur) => (cur === g ? undefined : g));
  // Se a última busca falhou, não mostra os dados antigos que o React Query guardou.
  const all = clusters.isError ? [] : (clusters.data ?? []);
  const data = all.filter((c) => c.count >= minCount);
  const online = !clusters.isError && clusters.dataUpdatedAt > 0;

  const sel = all.find((c) => c.geohash === selected);
  const totalOrders = all.reduce((s, c) => s + c.count, 0);
  const selRank = sel ? [...all].sort((a, b) => b.count - a.count).findIndex((c) => c === sel) + 1 : 0;

  return (
    <div className="app">
      <aside className="side">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">
            <span className="radar-sweep" />
            <span className="radar-dot" />
          </span>
          <div>
            <h1>
              Radar<span>de pedidos</span>
            </h1>
            <p className="brand-sub">Clusters de e-commerce por geohash</p>
          </div>
        </div>

        <div className="live-row">
          <span className={`live${online ? "" : " offline"}`} role="status">
            <span className="live-dot" />
            {clusters.isError ? "API fora do ar" : online ? "Ao vivo · 2s" : "Conectando…"}
            {clusters.dataUpdatedAt > 0 && <span className="live-time">{timeFmt.format(clusters.dataUpdatedAt)}</span>}
          </span>
          <button
            type="button"
            className="btn-refresh"
            onClick={() => {
              clusters.refetch();
              summary.refetch();
            }}
            // Com o polling de 2s, isFetching liga e desliga o tempo todo;
            // por isso o botão só fica desativado na primeira carga.
            disabled={clusters.isLoading}
          >
            <IconRefresh size={15} className={clusters.isLoading ? "spin" : undefined} />
            {clusters.isLoading ? "Carregando…" : "Atualizar"}
          </button>
        </div>

        <SummaryCards summary={summary.isError ? undefined : summary.data} loading={summary.isLoading} />

        <div className="side-filters">
          <Chips
            label="Mínimo de pedidos"
            value={minCount}
            onChange={setMinCount}
            options={[0, 2, 5, 10, 50].map((n) => ({ value: n, label: n === 0 ? "Todos" : `≥ ${n}` }))}
          />
          <Chips
            label="Ranking"
            value={topN}
            onChange={setTopN}
            options={[5, 10, 20, 50].map((n) => ({ value: n, label: `Top ${n}` }))}
          />
        </div>

        <div className="side-section">
          <div className="side-heading">
            <span>Top {topN} clusters</span>
            <span className="muted">pedidos</span>
          </div>
          <RankingList clusters={data} topN={topN} selected={selected} onSelect={toggleSelect} />
        </div>

        <footer className="pipeline" aria-label="Pipeline de dados">
          {PIPELINE.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </footer>
      </aside>

      <main className="stage">
        <div className="stage-top">
          <div className="tabs" role="tablist" aria-label="Visualização">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                className={view === id ? "tab active" : "tab"}
                onClick={() => setView(id)}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
          <span className="stage-count glass">
            <strong>{formatInt(data.length)}</strong> {data.length === 1 ? "cluster" : "clusters"} visíveis
          </span>
        </div>

        {clusters.isError && (
          <div className="alert glass" role="alert">
            <IconAlert size={20} />
            <div>
              <strong>Não foi possível carregar os clusters</strong>
              {(clusters.error as Error).message}
            </div>
          </div>
        )}

        {clusters.isLoading ? (
          <div className="map-empty">
            <span className="skeleton" style={{ width: 220, height: 14 }} />
            <span className="skeleton" style={{ width: 160, height: 14 }} />
          </div>
        ) : view === "mapa" ? (
          <ClusterMap clusters={data} selected={selected} onSelect={toggleSelect} />
        ) : (
          <div className="panel">
            {view === "tabela" ? (
              <ClusterTable clusters={data} selected={selected} onSelect={toggleSelect} />
            ) : (
              <ClusterBarChart clusters={data} topN={topN} selected={selected} onSelect={toggleSelect} />
            )}
          </div>
        )}

        {sel && (
          <div className="detail glass" aria-label="Cluster selecionado">
            <div className="detail-head">
              <span className="detail-rank">#{selRank}</span>
              <span className="mono detail-geo">{sel.geohash}</span>
              <button type="button" className="detail-close" onClick={() => setSelected(undefined)} aria-label="Fechar">
                ✕
              </button>
            </div>
            <div className="detail-big">
              {formatInt(sel.count)} <span>{sel.count === 1 ? "pedido" : "pedidos"}</span>
            </div>
            <dl>
              <dt>Participação</dt>
              <dd>
                {totalOrders
                  ? ((sel.count / totalOrders) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })
                  : 0}
                %
              </dd>
              <dt>Centroide</dt>
              <dd className="mono">
                {sel.latitude.toFixed(4)}, {sel.longitude.toFixed(4)}
              </dd>
              <dt>Atualizado</dt>
              <dd>{formatDate(sel.updatedAt)}</dd>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}
