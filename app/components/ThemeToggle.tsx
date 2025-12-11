"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleThemeChange = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    console.log(`Changing theme from ${currentTheme} to ${newTheme}`); 
    setTheme(newTheme);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={handleThemeChange}
      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600 shadow-lg hover:shadow-xl border-2 border-amber-300 dark:border-slate-500 hover:border-amber-400 dark:hover:border-slate-400 font-semibold text-gray-800 dark:text-amber-100 transition-all duration-300 hover:scale-105 active:scale-95 z-50"
    >
      {currentTheme === "dark" ? (
        <span className="text-xl" aria-hidden>☀️</span>
      ) : (
        <span className="text-xl" aria-hidden>🌙</span>
      )}
      <span className="ml-2">{currentTheme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
