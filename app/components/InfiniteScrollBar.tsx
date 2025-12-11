"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchArticles, fetchArticlesByTag, fetchArticlesByQuery } from "@/redux/slices/articlesSlice";
import { Article } from "@/redux/api/articlesApi";
import BlogCard from "./BlogCard";
import SkeletonCard from "./SkeletonCard";

export default function InfiniteScrollBar() {
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

  // Get position from URL query parameter
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
          setItems((prev) =>
            Array.from(new Map([...prev, ...payload].map((a) => [a.id, a])).values())
          );
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

  // Initial load - load enough pages to reach the target article
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    hasRestoredScroll.current = false;

    const loadInitialArticles = async () => {
      if (returnPos) {
        const targetIndex = parseInt(returnPos, 10);
        const pagesNeeded = Math.ceil((targetIndex + 1) / perPage);
        
        // Load all necessary pages sequentially
        for (let i = 1; i <= pagesNeeded; i++) {
          await loadArticles(i);
        }
      } else {
        await loadArticles(1);
      }
    };

    loadInitialArticles();
  }, [selectedTag, searchQuery, returnPos, perPage]);

  // Restore scroll position when returning from article page
  useEffect(() => {
    if (!returnPos || hasRestoredScroll.current) return;

    const targetIndex = parseInt(returnPos, 10);
    
    // Check if enough items loaded
    if (items.length <= targetIndex) {
      return; // Wait for more items to load
    }

    const targetElement = document.querySelector(
      `[data-article-index="${targetIndex}"]`
    );

    if (targetElement) {
      hasRestoredScroll.current = true;
      
      // Use requestAnimationFrame 
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetElement.scrollIntoView({ 
            block: "center", 
            behavior: "instant"
          });
          setTimeout(() => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("pos");
            try {
              window.history.replaceState({ ...history.state }, "", newUrl.pathname + newUrl.search); // replace the current history instead of adding new one
            } catch (e) {
              // router.replace if history API is unavailable
              router.replace(newUrl.pathname + newUrl.search, { scroll: false });
            }
          }, 500);
        });
      });
    }
  }, [items, returnPos, router]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadArticles(page + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loadArticles, isLoading]);

  return (
    <div>
      <div className="articles-grid">
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
        <div className="articles-grid mt-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      <div ref={sentinelRef} className="h-10" />

      {!hasMore && items.length > 0 && !isLoading && (
        <p className="text-center text-gray-500 py-12">No more articles</p>
      )}
    </div>
  );
}