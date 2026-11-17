import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { useTheme } from "../hooks/useTheme";
import type { Cluster, Metric } from "../types/cluster";
import { binIndex, formatCompact, formatCurrency, formatCurrencyCompact, formatInt, metricLabel } from "../utils/format";

interface Props {
  clusters: Cluster[];
  metric: Metric;
  selected?: string;
  onSelect: (geohash: string) => void;
}

const valueOf = (c: Cluster, m: Metric) => (m === "orders" ? c.totalOrders : c.totalValue);

export function ClusterMap({ clusters, metric, selected, onSelect }: Props) {
  const theme = useTheme();

  const { min, max, bounds } = useMemo(() => {
    const values = clusters.map((c) => valueOf(c, metric));
    const lats = clusters.map((c) => c.latitude);
    const lngs = clusters.map((c) => c.longitude);
    const b: LatLngBoundsExpression | undefined = clusters.length
      ? [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ]
      : undefined;
    return { min: Math.min(...values), max: Math.max(...values), bounds: b };
  }, [clusters, metric]);

  const fmt = metric === "value" ? formatCurrencyCompact : formatCompact;
  const legend = theme.sequential.map((color, i) => ({
    color,
    from: min + ((max - min) * i) / 5,
    to: min + ((max - min) * (i + 1)) / 5,
  }));

  return (
    <div className="card">
      <h2>Mapa dos clusters</h2>
      <p className="subtitle">
        Cada círculo é um geohash. Tamanho e cor indicam {metricLabel[metric].toLowerCase()}.
      </p>

      <div className="map-wrap">
        {bounds ? (
          <MapContainer bounds={bounds} boundsOptions={{ padding: [24, 24] }} scrollWheelZoom className="map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clusters.map((c) => {
              const v = valueOf(c, metric);
              const ratio = max > 0 ? Math.sqrt(v / max) : 0; // área ∝ valor
              const isSel = c.geohash === selected;
              return (
                <CircleMarker
                  key={c.geohash}
                  center={[c.latitude, c.longitude]}
                  radius={6 + ratio * 22}
                  pathOptions={{
                    color: isSel ? theme.textPrimary : theme.surface,
                    weight: isSel ? 3 : 2,
                    fillColor: theme.sequential[binIndex(v, min, max)],
                    fillOpacity: 0.85,
                  }}
                  eventHandlers={{ click: () => onSelect(c.geohash) }}
                >
                  <Tooltip>
                    <strong>{c.geohash}</strong>
                    <br />
                    Pedidos: {formatInt(c.totalOrders)}
                    <br />
                    Valor: {formatCurrency(c.totalValue)}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="empty">Nenhum cluster para exibir.</div>
        )}
      </div>

      <div className="seq-legend" aria-label={`Legenda: ${metricLabel[metric]}`}>
        <span className="legend-title">{metricLabel[metric]}</span>
        {legend.map((l) => (
          <span key={l.color} className="seq-legend-item">
            <span className="swatch" style={{ background: l.color }} />
            {fmt(l.from)}–{fmt(l.to)}
          </span>
        ))}
      </div>
    </div>
  );
}
