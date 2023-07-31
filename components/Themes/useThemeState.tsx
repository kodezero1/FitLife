import React, { useState, createContext, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { AccentColor, accentColors, darkTheme, lightTheme } from "./Themes";

const DefaultAccent = accentColors.find((accent) => accent.title === "Default");

export const useThemeState = () => {
  const [theme, setTheme] = useState(darkTheme);
  const [themeAccent, setThemeAccent] = useState(DefaultAccent);

  const handleThemeChange = (newTheme) => {
    window.localStorage.setItem("theme", newTheme.type);
    setTheme(newTheme);
  };

  const themeToggler = () => {
    theme.type === "light" ? handleThemeChange(darkTheme) : handleThemeChange(lightTheme);
  };

  const setAccentColor = (accentColor: AccentColor) => {
    window.localStorage.setItem("themeAccent", JSON.stringify(accentColor));
    setThemeAccent(accentColor);
  };

  useEffect(() => {
    const localThemeAccent = window.localStorage.getItem("themeAccent");
    if (localThemeAccent) setThemeAccent(JSON.parse(localThemeAccent));

    const localTheme = window.localStorage.getItem("theme");

    if (localTheme) {
      localTheme === "dark" ? setTheme(darkTheme) : setTheme(lightTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      handleThemeChange(darkTheme);
    } else {
      handleThemeChange(lightTheme);
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      console.log(e.matches);
      e.matches ? handleThemeChange(darkTheme) : handleThemeChange(lightTheme);
    });
  }, []);

  return { theme: { ...theme, ...themeAccent }, themeToggler, setAccentColor };
};

export const ThemeStoreProvider = ({ children }) => {
  const { theme, themeToggler, setAccentColor } = useThemeState();

  return (
    <ThemeProvider theme={theme}>
      <ThemeToggleContext.Provider value={{ themeToggler, setAccentColor }}>
        {children}
      </ThemeToggleContext.Provider>
    </ThemeProvider>
  );
};

export const ThemeToggleContext = createContext<null | {
  themeToggler: () => void;
  setAccentColor: React.Dispatch<React.SetStateAction<AccentColor>>;
}>(null);
