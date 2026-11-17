import { useEffect, useState } from "react";
import { darkTheme, lightTheme, type Theme } from "../utils/theme";

/** Tokens de cor do tema atual (segue o tema do sistema operacional). */
export function useTheme(): Theme {
  const query = "(prefers-color-scheme: dark)";
  const [dark, setDark] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return dark ? darkTheme : lightTheme;
}
