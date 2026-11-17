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
  /** Escala sequencial azul, 5 faixas: menor → maior magnitude. */
  sequential: [string, string, string, string, string];
}

export const lightTheme: Theme = {
  surface: "#fcfcfb",
  textPrimary: "#0b0b0b",
  textSecondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  axis: "#c3c2b7",
  series: "#2a78d6",
  sequential: ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"],
};

export const darkTheme: Theme = {
  surface: "#1a1a19",
  textPrimary: "#f0efec",
  textSecondary: "#c3c2b7",
  muted: "#898781",
  grid: "#2c2c2a",
  axis: "#383835",
  series: "#3987e5",
  // No escuro, magnitude baixa recua para o fundo (mais escuro) e a alta clareia.
  sequential: ["#184f95", "#256abf", "#3987e5", "#6da7ec", "#9ec5f4"],
};
