/**
 * Tokens de cor para os gráficos. Recharts e Leaflet recebem cor por
 * atributo SVG/JS (onde var(--x) não funciona), então ficam aqui em JS.
 * Os mesmos valores existem como CSS vars em index.css para o resto da UI.
 */
export interface Theme {
  surface: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  grid: string;
  axis: string;
  series: string;
  /** Escala sequencial colorida, 5 faixas: menor → maior magnitude (ciano → laranja). */
  sequential: [string, string, string, string, string];
}

export const lightTheme: Theme = {
  surface: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  muted: "#94a3b8",
  grid: "#e7eaf1",
  axis: "#cbd5e1",
  series: "#2563eb",
  sequential: ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"],
};

export const darkTheme: Theme = {
  surface: "#121a2e",
  textPrimary: "#e8ecf5",
  textSecondary: "#a3adc2",
  muted: "#6b7591",
  grid: "#232d45",
  axis: "#2e3a56",
  series: "#5b8def",
  sequential: ["#22d3ee", "#60a5fa", "#a78bfa", "#f472b6", "#fb923c"],
};
