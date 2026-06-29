import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

export const THEMES = [
  { id: "emerald", name: "Emerald", isDark: false },
  { id: "forest", name: "Forest", isDark: true },
  { id: "retro", name: "Retro", isDark: false },
  { id: "cyberpunk", name: "Cyberpunk", isDark: false },
  { id: "dracula", name: "Dracula", isDark: true },
  { id: "nord", name: "Nord", isDark: true },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("daisyui-theme");
    if (saved) {
      // Ensure the saved theme is in our allowed list
      if (THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    // Default to emerald
    return "emerald";
  });

  const currentThemeConfig = THEMES.find((t) => t.id === theme) || THEMES[0];
  const isDarkMode = currentThemeConfig.isDark;

  useEffect(() => {
    const root = window.document.documentElement;

    // Set class dark for Tailwind utility classes if necessary
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Set data-theme for daisyUI
    root.setAttribute("data-theme", theme);
    localStorage.setItem("daisyui-theme", theme);
  }, [theme, isDarkMode]);

  const toggleTheme = () => {
    // Basic cycle or default toggle
    setTheme((prev) => {
      const currentIndex = THEMES.findIndex((t) => t.id === prev);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      return THEMES[nextIndex].id;
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDarkMode, toggleTheme, themes: THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
