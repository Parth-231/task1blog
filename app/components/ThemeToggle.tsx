"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  // const currentTheme = theme === "light" ? "light" : theme === "dark" ? "dark" : systemTheme;

  const handleThemeChange = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    console.log(`Changing theme from ${currentTheme} to ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={handleThemeChange}
      className="inline-flex items-center justify-center p-2 rounded-md bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur transition-colors hover:scale-105 z-50"
    >
      {currentTheme === "dark" ? (
        <span aria-hidden>Light</span>
      ) : (
        <span aria-hidden>Dark</span>
      )}
    </button>
  );
}
