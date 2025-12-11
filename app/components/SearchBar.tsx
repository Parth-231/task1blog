"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSearchQuery, fetchArticlesByQuery } from "@/redux/slices/articlesSlice";
import Loading from "./Loading";
import NotFound from "./NotFound";

export default function SearchBar() {
  const dispatch = useAppDispatch(); // action dispatch 
  const perPage = useAppSelector((s) => s.articles.perPage) || 10; // per page article
  const loading = useAppSelector((s) => s.articles.loading); 
  const articles = useAppSelector((s) => s.articles.articles);
  const error = useAppSelector((s) => s.articles.error);
  const searchQuery = useAppSelector((s) => s.articles.searchQuery);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 1500);
  
  function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  }

  // search
  useEffect(() => {
    const searchQuery = debouncedQuery || null;
    dispatch(setSearchQuery(searchQuery));
    if (searchQuery) {
      dispatch(fetchArticlesByQuery({ query: searchQuery, perPage, maxPages: 5 }));
    }
  }, [debouncedQuery, perPage, dispatch]);

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles by title"
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:focus:ring-blue-400 transition-all hover:border-blue-400 dark:hover:border-blue-600 shadow-md hover:shadow-lg"
        />
      </div>
      
      <div className="mt-4">
        {loading && searchQuery && <Loading message="Searching articles..." />}
        {!loading && searchQuery && articles.length === 0 && !error && <NotFound resource="Articles" />}
        {!loading && error && (
          <div className="text-red-500 text-center mt-2 font-semibold">⚠️ {error}</div>
        )}
      </div>
    </div>
  );
}
