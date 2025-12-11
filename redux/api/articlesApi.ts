export interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  tags: string[];
  cover_image?: string | undefined;
  published_at: string;
  user: {
    name: string;
    username: string;
  };
}

export interface Tag {
  name: string;
  slug: string;
}

const BASE_URL = "https://dev.to/api";

export const articlesApi = {
  fetchArticles: async (
    page: number,
    perPage: number,
    q?: string
  ): Promise<Article[]> => {
    const qParam = q ? `&q=${encodeURIComponent(q)}` : "";
    const response = await fetch(
      `${BASE_URL}/articles?page=${page}&per_page=${perPage}${qParam}`
    );
    if (!response.ok) throw new Error("Failed to fetch articles");
    return await response.json();
  },

  fetchArticlesByTag: async (
    tag: string,
    page: number,
    perPage: number
  ): Promise<Article[]> => {
    const response = await fetch(
      `${BASE_URL}/articles?tag=${tag}&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) throw new Error("Failed to fetch articles by tag");
    return await response.json();
  },

  fetchArticlesByUser: async (
    username: string,
    page: number,
    perPage: number
  ): Promise<Article[]> => {
    const response = await fetch(
      `${BASE_URL}/articles?username=${username}&page=${page}&per_page=${perPage}`
    );
    if (!response.ok) throw new Error("Failed to fetch articles by user");
    return await response.json();
  },

  fetchArticleById: async (id: number): Promise<Article> => {
    const response = await fetch(`${BASE_URL}/articles/${id}`);
    if (!response.ok) throw new Error("Failed to fetch article");
    return await response.json();
  },

  fetchTags: async (perPage: number = 50): Promise<Tag[]> => {
    const response = await fetch(`${BASE_URL}/tags?per_page=${perPage}`);
    if (!response.ok) throw new Error("Failed to fetch tags");
    return await response.json();
  },
};
