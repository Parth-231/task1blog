"use client";
import Filter from "./components/Filter";
import InfiniteScrollBar from "./components/InfiniteScrollBar";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Blogs</h1>
            <ThemeToggle />
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
        
        {/* Articles Grid */}
        <InfiniteScrollBar />
      </main>
    </div>
  );
}
