/**
 * Tokens de cor para os gráficos. Recharts e Leaflet recebem cor por
 * atributo SVG/JS (onde var(--x) não funciona), então ficam aqui em JS.
 * Os mesmos valores existem como CSS vars em index.css para o resto da UI.
 *
 * O dashboard usa um visual único, escuro ("radar"), independente do tema do sistema.
 */
export interface Theme {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  grid: string;
  axis: string;
  series: string;
  /** Escala de calor, 5 faixas: menor → maior quantidade de pedidos. */
  sequential: [string, string, string, string, string];
}

export const theme: Theme = {
  surface: "#0e1424",
  textPrimary: "#eef2ff",
  textSecondary: "#a5b0cc",
  muted: "#6b7697",
  grid: "#1e2740",
  axis: "#2a3557",
  series: "#c6f432",
  sequential: ["#38bdf8", "#34d399", "#c6f432", "#fb923c", "#f43f5e"],
};
