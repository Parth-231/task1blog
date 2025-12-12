"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchArticleById } from "@/redux/slices/articlesSlice";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import NotFound from "@/app/components/NotFound";

export default function ArticleClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Get ALL parameters
  const pos = searchParams.get("pos") || "0";
  const view = searchParams.get("view");
  const query = searchParams.get("query");
  const tag = searchParams.get("tag");

  const { article: singleArticle, loading, error } = useAppSelector(
    (state) => state.articles
  );

  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === currentId) return;

    const numericId = Number(id);
    if (isNaN(numericId)) return;

    setCurrentId(id);
    dispatch(fetchArticleById(numericId));
  }, [id, dispatch, currentId]);

  const isCurrentlyLoading = loading || currentId !== id;

  const handleGoBack = () => {
    const params = new URLSearchParams();
    
    params.set("pos", pos);
    if (view) {
      params.set("view", view);
    }    
    searchParams.forEach((value, key) => {
      if (key !== "pos" && key !== "view") {
        params.set(key, value);
      }
    }); 
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  if (isCurrentlyLoading) return <Loading message="Loading article..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!singleArticle) return <NotFound resource="Article" />;

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <button
          onClick={handleGoBack}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          ← Back to Articles
        </button>
      </div>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        {singleArticle.cover_image && (
          <img
            src={singleArticle.cover_image}
            alt={singleArticle.title}
            className="w-full h-96 object-cover rounded-xl mb-10 shadow-xl"
          />
        )}

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {singleArticle.title}
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            By{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {singleArticle.user?.name || "Unknown Author"}
            </span>
          </p>
        </header>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div
            dangerouslySetInnerHTML={{
              __html:
                singleArticle.body_html ||
                singleArticle.description ||
                "<p>No content available.</p>",
            }}
          />
        </article>
      </main>
    </>
  );
}