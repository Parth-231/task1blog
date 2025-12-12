"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Filter from "./components/Filter";
import InfiniteScrollBar from "./components/InfiniteScrollBar";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import ViewToggle from "./components/ViewToggle";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isListView, setIsListView] = useState(() => {
    return searchParams.get("view") === "list";
  });

  const handleViewChange = (newIsListView: boolean) => {
    setIsListView(newIsListView);    
    const params = new URLSearchParams(searchParams.toString());
    if (newIsListView) {
      params.set("view", "list");
    } else {
      params.delete("view"); // Grid is default
    }    
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Blogs</h1>
            <ThemeToggle />
          </div>
          <div className="space-y-4">
            <ViewToggle isListView={isListView} setIsListView={handleViewChange} />
          </div>
          {/* Search and Filter Section */}
          <div className="space-y-4">
            <div>
              <SearchBar />
            </div>
            
            <div>
              <Filter />
            </div>
          </div>
        </div>
        
        {/* Articles Grid - Pass the view state */}
        <InfiniteScrollBar isListView={isListView} />
      </main>
    </div>
  );
}