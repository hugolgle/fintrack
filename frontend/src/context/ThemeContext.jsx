import React, { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
  backgroundColor: "#ffffff39",
  setBackgroundColor: () => null,
};

const ThemeContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage?.getItem(storageKey) || defaultTheme
  );

  const [backgroundColor, setBackgroundColorState] = useState(
    () => localStorage?.getItem("colorBackground") || "#ffffff39"
  );


  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark", "custom");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    if (theme === "custom") {
      root.classList.add("custom");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--colorBackground",
      backgroundColor
    );
  }, [backgroundColor]);

  const setBackgroundColor = (color) => {
    localStorage.setItem("colorBackground", color);
    setBackgroundColorState(color);
  };

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
    backgroundColor,
    setBackgroundColor,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
