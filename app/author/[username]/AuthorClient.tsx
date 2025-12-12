"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Article, articlesApi } from "@/redux/api/articlesApi";
import BlogCard from "@/app/components/BlogCard";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import NotFound from "@/app/components/NotFound";
import SkeletonCard from "@/app/components/SkeletonCard";

export default function AuthorClient({ username }: { username: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const sentinelRef = useRef(null);
  const isLoadingRef = useRef(false);

  const perPage = 10;
  const pos = searchParams.get("pos") || "0";
  const view = searchParams.get("view") || "grid";
  const isListView = view === "list";

  // restore scroll
  useEffect(() => {
    const savedState = history.state;
    if (savedState?.scrollY) {
      setTimeout(() => {
        window.scrollTo(0, savedState.scrollY);
      }, 0);
    }
  }, []);
  
  // save scroll
  useEffect(() => {
    const saveScroll = () => {
      history.replaceState({ ...history.state, scrollY: window.scrollY }, "");
    };
    window.addEventListener("scroll", saveScroll);
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);

  // function to load article
  const loadArticles = useCallback(
    async (pageToLoad: number) => {
      if (isLoadingRef.current) return;
      if (!hasMore && pageToLoad > 1) return;
      isLoadingRef.current = true;
      setLoading(true);
      try {
        const newArticles = await articlesApi.fetchArticlesByUser(
          username,
          pageToLoad,
          perPage
        );
        setArticles((prev) =>
          pageToLoad === 1 ? newArticles : [...prev, ...newArticles]
        );
        setHasMore(newArticles.length === perPage);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load articles"
        );
        setHasMore(false);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
        if (pageToLoad === 1) setInitialLoading(false);
      }
    },
    [username, hasMore, perPage]
  );

  // when username changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
    loadArticles(1);
  }, [username]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || initialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, initialLoading]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) loadArticles(page);
  }, [page]);

  const handleGoBack = () => {
    const params = new URLSearchParams();
    params.set("pos", pos);
    searchParams.forEach((value, key) => {
      if (key !== "pos") {
        params.set(key, value);
      }
    });
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const containerClass = isListView ? "articles-list" : "articles-grid";

  if (initialLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Loading message={`Loading articles by ${username}...`} />
      </main>
    );
  }

  if (error && articles.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
        >
          ← Back
        </button>
        <ErrorMessage error={`${error}. Username: "${username}"`} />
      </main>
    );
  }

  if (articles.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
        >
          ← Back
        </button>
        <NotFound resource={`Articles by ${username}`} />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Articles by {username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total articles: {articles.length}
        </p>
      </div>

      <div className={containerClass}>
        {articles.map((article, index) => (
          <BlogCard 
            key={article.id} 
            article={article}
            index={parseInt(pos)}
          />
        ))}
      </div>

      {error && articles.length > 0 && (
        <div className="text-center py-4 text-orange-600 dark:text-orange-400">
          {error}
        </div>
      )}

      {loading && (
        <div className={containerClass}>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && (
            <span className="text-gray-500 dark:text-gray-400">
              Loading more...
            </span>
          )}
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No more articles
        </div>
      )}
    </main>
  );
}
