import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "bibliotek-x-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const nextResolvedTheme = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      setResolvedTheme(nextResolvedTheme);
      document.documentElement.dataset.theme = nextResolvedTheme;
      document.documentElement.style.colorScheme = nextResolvedTheme;
    };

    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme();

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme: () =>
      setTheme((current) => {
        if (current === "system") {
          return resolvedTheme === "dark" ? "light" : "dark";
        }
        return current === "dark" ? "light" : "dark";
      })
  };
};
