import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { useTheme } from "../hooks/useTheme";
import type { Cluster } from "../types/cluster";
import { binIndex, formatDate, formatInt } from "../utils/format";
import { IconMap } from "./Icons";

interface Props {
  clusters: Cluster[];
  selected?: string;
  onSelect: (geohash: string) => void;
}

/** Raio do círculo em px: pequeno, para centenas de clusters não se sobreporem. */
const MIN_RADIUS = 3;
const MAX_RADIUS = 11;

/** Quando um cluster é selecionado (no mapa, no ranking ou na tabela), o mapa voa até ele. */
function FlyToSelected({ cluster }: { cluster?: Cluster }) {
  const map = useMap();
  useEffect(() => {
    if (cluster) map.flyTo([cluster.latitude, cluster.longitude], Math.max(map.getZoom(), 10), { duration: 0.8 });
  }, [cluster?.geohash]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
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

  if (!bounds) {
    return (
      <div className="map-empty">
        <IconMap size={32} />
        <p>Nenhum cluster para exibir ainda.</p>
        <span>Assim que a Lambda gravar pedidos no DynamoDB, eles aparecem aqui.</span>
      </div>
    );
  }

  const selectedCluster = clusters.find((c) => c.geohash === selected);
  // Desenha o selecionado por último para ele ficar por cima dos outros.
  const ordered = selectedCluster ? [...clusters.filter((c) => c !== selectedCluster), selectedCluster] : clusters;

  return (
    <div className="map-stage">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [40, 40] }}
        scrollWheelZoom
        preferCanvas
        zoomControl={false}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FlyToSelected cluster={selectedCluster} />
        {ordered.map((c) => {
          const ratio = max > 0 ? Math.sqrt(c.count / max) : 0; // área ∝ pedidos
          const isSel = c.geohash === selected;
          const color = theme.sequential[binIndex(c.count, min, max)];
          return (
            <CircleMarker
              key={c.geohash}
              center={[c.latitude, c.longitude]}
              radius={isSel ? MAX_RADIUS + 4 : MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS)}
              pathOptions={{
                color: isSel ? "#ffffff" : color,
                weight: isSel ? 3 : 1,
                fillColor: color,
                fillOpacity: selected && !isSel ? 0.35 : 0.7,
              }}
              eventHandlers={{ click: () => onSelect(c.geohash) }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <strong className="mono">{c.geohash}</strong>
                <br />
                {formatInt(c.count)} {c.count === 1 ? "pedido" : "pedidos"}
                <br />
                <span className="muted">{formatDate(c.updatedAt)}</span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="map-legend glass" aria-label="Legenda: pedidos por cluster">
        <span className="legend-title">Pedidos por cluster</span>
        <span className="legend-bar" style={{ background: `linear-gradient(90deg, ${theme.sequential.join(", ")})` }} />
        <span className="legend-scale">
          <span>{formatInt(min)}</span>
          <span>{formatInt(max)}</span>
        </span>
      </div>
    </div>
  );
}
