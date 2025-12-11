"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedTag, fetchTags } from "@/redux/slices/articlesSlice";

export default function Filter() {
  const dispatch = useAppDispatch();
  const selectedTag = useAppSelector((s) => s.articles.selectedTag);
  const tags = useAppSelector((s) => s.articles.tags);
  const tagsLoading = useAppSelector((s) => s.articles.tagsLoading);

  // Fetch tags on mount
  useEffect(() => {
    dispatch(fetchTags({ perPage: 50 }));
  }, [dispatch]);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Filter by Tag</label>
      <select
        value={selectedTag || ""}
        onChange={(e) => {
          e.preventDefault(); 
          dispatch(setSelectedTag(e.target.value));
        }}
        disabled={tagsLoading}
        className="px-4 py-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700 text-gray-800 dark:text-gray-100 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:focus:ring-purple-400 transition-all hover:border-purple-400 dark:hover:border-purple-600 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">
          {tagsLoading ? "Loading tags..." : "🏷️ Select a tag..."}
        </option>

        {Array.isArray(tags) &&
          tags.map((tag) => (
            <option key={tag.slug} value={tag.slug} >
              {tag.name || tag.slug}
            </option>
          ))}
      </select>
    </div>
  );
}
