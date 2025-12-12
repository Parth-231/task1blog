"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchArticles, fetchArticlesByTag, fetchArticlesByQuery } from "@/redux/slices/articlesSlice";
import { Article } from "@/redux/api/articlesApi";
import BlogCard from "./BlogCard";
import SkeletonCard from "./SkeletonCard";

interface InfiniteScrollBarProps { isListView: boolean;}

export default function InfiniteScrollBar({ isListView }: InfiniteScrollBarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const perPage = useAppSelector((s) => s.articles.perPage);
  const selectedTag = useAppSelector((s) => s.articles.selectedTag);
  const searchQuery = useAppSelector((s) => s.articles.searchQuery);

  const [items, setItems] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const hasRestoredScroll = useRef(false);
  const scrollAttempts = useRef(0);

  const returnPos = searchParams.get("pos");

  const loadArticles = useCallback(
    async (pageToLoad: number) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        let payload: Article[] = [];
        if (selectedTag) {
          payload = await dispatch(
            fetchArticlesByTag({ tag: selectedTag, page: pageToLoad, perPage })
          ).unwrap();
        } else if (searchQuery) {
          payload = await dispatch(
            fetchArticlesByQuery({ query: searchQuery, perPage, maxPages: 5 })
          ).unwrap();
          setHasMore(false);
        } else {
          payload = await dispatch(
            fetchArticles({ page: pageToLoad, perPage })
          ).unwrap();
        }
        if (payload.length) {
          setItems((prev) => {
            if (pageToLoad === 1) {
              return payload;
            }
            return Array.from(new Map([...prev, ...payload].map((a) => [a.id, a])).values());
          });
          setPage(pageToLoad);
          if (payload.length < perPage) setHasMore(false);
        } else {
          setHasMore(false);
        }
      } catch {
        setHasMore(false);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [dispatch, perPage, selectedTag, searchQuery]
  );

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    hasRestoredScroll.current = false;
    scrollAttempts.current = 0;
    isLoadingRef.current = false;
    
    loadArticles(1);
  }, [isListView, selectedTag, searchQuery, loadArticles]);

  useEffect(() => {
    if (!returnPos || hasRestoredScroll.current) return;

    const targetIndex = parseInt(returnPos, 10);
    
    if (items.length <= targetIndex && hasMore && !isLoading) {
      const pagesNeeded = Math.ceil((targetIndex + 1) / perPage);
      if (page < pagesNeeded) {
        loadArticles(page + 1);
        return;
      }
    }

    if (items.length > targetIndex || (!hasMore && items.length > 0)) {
      const actualIndex = Math.min(targetIndex, items.length - 1);
      const targetElement = document.querySelector(
        `[data-article-index="${actualIndex}"]`
      );

      if (targetElement && scrollAttempts.current < 10) {
        scrollAttempts.current++;
        setTimeout(() => {
          targetElement.scrollIntoView({
            block: "center",
            behavior: "instant",
          });
          hasRestoredScroll.current = true;
          setTimeout(() => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("pos");
            window.history.replaceState(
              { ...window.history.state }, 
              "", 
              newUrl.pathname + newUrl.search
            );
          }, 800);
        }, 100);
      } else if (!targetElement && scrollAttempts.current < 10) {
        scrollAttempts.current++;
        setTimeout(() => {
          const check = targetElement;
        }, 100);
      }
    }
  }, [items, returnPos, router, hasMore, isLoading, page, perPage, loadArticles]);

  useEffect(() => {
    if (!sentinelRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
          if (items.length === 0) {
            return;
          }
          loadArticles(page + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loadArticles, isLoading, items.length]);

  const containerClass = isListView ? "articles-list" : "articles-grid";

  return (
    <div>
      <div className={containerClass}>
        {items.map((article, index) => (
          <div
            key={article.id}
            data-article-index={index}
            id={`article-${index}`}
          >
            <BlogCard article={article} index={index} />
          </div>
        ))}
      </div>

      {isLoading && (
        <div className={`${containerClass} mt-8`}>
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-20" />

      {!hasMore && items.length > 0 && !isLoading && (
        <p className="text-center text-gray-500 py-12">
          {searchQuery
            ? "No more results for your search."
            : "You've reached the end. No more articles."}
        </p>
      )}

      {!isLoading && items.length === 0 && !hasMore && (
        <p className="text-center text-gray-500 py-20">No articles found.</p>
      )}
    </div>
  );
}