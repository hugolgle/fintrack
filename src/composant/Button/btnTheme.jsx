import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export function BtnTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <div
      onClick={toggleTheme}
      className="cursor-pointer absolute top-2 right-7"
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all dark:text-black ${theme === "dark" ? "scale-0" : "scale-100"}`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all dark:text-white ${theme === "dark" ? "scale-100" : "scale-0"}`}
      />
    </div>
  );
}
