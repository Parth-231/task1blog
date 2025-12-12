"use client";

import { Grid3X3, List } from "lucide-react";

interface ViewToggleProps {
  isListView: boolean;
  setIsListView: (value: boolean) => void;
}

export default function ViewToggle({ isListView, setIsListView }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
        View:
      </span>

      <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-1 shadow-sm">
        <button
          onClick={() => setIsListView(true)}
          aria-pressed={isListView}
          aria-label="List view"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            isListView
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          <List size={16} />
          <span className="hidden sm:inline">List</span>
        </button>

        <button
          onClick={() => setIsListView(false)}
          aria-pressed={!isListView}
          aria-label="Grid view"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            !isListView
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          <Grid3X3 size={16} />
          <span className="hidden sm:inline">Grid</span>
        </button>
      </div>
    </div>
  );
}