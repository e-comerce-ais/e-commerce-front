import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { useTheme } from "../hooks/useTheme";
import type { Cluster } from "../types/cluster";
import { binIndex, formatCompact, formatDate, formatInt } from "../utils/format";

interface Props {
  clusters: Cluster[];
  selected?: string;
  onSelect: (geohash: string) => void;
}

export function ClusterMap({ clusters, selected, onSelect }: Props) {
  const theme = useTheme();

  const { min, max, bounds } = useMemo(() => {
    const counts = clusters.map((c) => c.count);
    const lats = clusters.map((c) => c.latitude);
    const lngs = clusters.map((c) => c.longitude);
    const b: LatLngBoundsExpression | undefined = clusters.length
      ? [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ]
      : undefined;
    return { min: Math.min(...counts), max: Math.max(...counts), bounds: b };
  }, [clusters]);

  const legend = theme.sequential.map((color, i) => ({
    color,
    from: min + ((max - min) * i) / 5,
    to: min + ((max - min) * (i + 1)) / 5,
  }));

  return (
    <div className="card">
      <h2>Mapa dos clusters</h2>
      <p className="subtitle">
        Cada círculo é o centroide de um geohash. Tamanho e cor indicam a quantidade de pedidos.
      </p>

      <div className="map-wrap">
        {bounds ? (
          <MapContainer bounds={bounds} boundsOptions={{ padding: [24, 24] }} scrollWheelZoom className="map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clusters.map((c) => {
              const ratio = max > 0 ? Math.sqrt(c.count / max) : 0; // área ∝ pedidos
              const isSel = c.geohash === selected;
              return (
                <CircleMarker
                  key={c.geohash}
                  center={[c.latitude, c.longitude]}
                  radius={6 + ratio * 22}
                  pathOptions={{
                    color: isSel ? theme.textPrimary : theme.surface,
                    weight: isSel ? 3 : 2,
                    fillColor: theme.sequential[binIndex(c.count, min, max)],
                    fillOpacity: 0.85,
                  }}
                  eventHandlers={{ click: () => onSelect(c.geohash) }}
                >
                  <Tooltip>
                    <strong>{c.geohash}</strong>
                    <br />
                    Pedidos: {formatInt(c.count)}
                    <br />
                    Centroide: {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                    <br />
                    Atualizado: {formatDate(c.updatedAt)}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="empty">Nenhum cluster para exibir.</div>
        )}
      </div>

      <div className="seq-legend" aria-label="Legenda: pedidos">
        <span className="legend-title">Pedidos</span>
        {legend.map((l) => (
          <span key={l.color} className="seq-legend-item">
            <span className="swatch" style={{ background: l.color }} />
            {formatCompact(l.from)}–{formatCompact(l.to)}
          </span>
        ))}
      </div>
    </div>
  );
}
