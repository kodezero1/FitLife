import { useContext, useState, useEffect } from "react";
import Toggle from "../Shared/Toggle";
import { ThemeToggleContext } from "./useThemeState";

const ThemeToggle: React.FC = () => {
  const { themeToggler } = useContext(ThemeToggleContext)!;

  const [checked, setChecked] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    setChecked(localStorage.getItem("theme") === "dark");
  }, [themeToggler]);

  return <Toggle checked={checked} onChange={() => themeToggler()} />;
};
export default ThemeToggle;
