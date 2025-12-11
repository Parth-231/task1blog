import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { articlesApi, Article, Tag } from "../api/articlesApi";

interface ArticlesState {
  articles: Article[];
  article: Article | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  selectedTag: string | null;
  searchQuery: string | null;
  tags: Tag[];
  tagsLoading: boolean;
  tagsError: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  article: null,
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  selectedTag: null,
  searchQuery: null,
  tags: [],
  tagsLoading: false,
  tagsError: null,
};

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async ({ page, perPage }: { page: number; perPage: number }) => {
    return await articlesApi.fetchArticles(page, perPage);
  }
);

export const fetchArticlesByTag = createAsyncThunk(
  "articles/fetchArticlesByTag",
  async ({
    tag,
    page,
    perPage,
  }: {
    tag: string;
    page: number;
    perPage: number;
  }) => {
    return await articlesApi.fetchArticlesByTag(tag, page, perPage);
  }
);

export const fetchArticlesByUser = createAsyncThunk(
  "articles/fetchArticlesByUser",
  async ({
    username,
    page,
    perPage,
  }: {
    username: string;
    page: number;
    perPage: number;
  }) => {
    return await articlesApi.fetchArticlesByUser(username, page, perPage);
  }
);

export const fetchArticleById = createAsyncThunk(
  "articles/fetchArticleById",
  async (id: number) => {
    return await articlesApi.fetchArticleById(id);
  }
);

export const fetchTags = createAsyncThunk(
  "articles/fetchTags",
  async ({ perPage = 50 }: { perPage?: number }) => {
    return await articlesApi.fetchTags(perPage);
  }
);

export const fetchArticlesByQuery = createAsyncThunk(
  "articles/fetchArticlesByQuery",
  async ({
    query,
    perPage,
    maxPages = 5,
  }: {
    query: string;
    perPage: number;
    maxPages?: number;
  }) => {
    const q = query.trim();

    // If the query is a number, treat it as an ID search
    if (/^\d+$/.test(q)) {
      const id = Number(q);
      const article = await articlesApi.fetchArticleById(id);
      return [article];
    }

    const lower = q.toLowerCase();
    const found: Article[] = [];

    // Fetch multiple pages
    for (let page = 1; page <= maxPages; page++) {
      const pageResults: Article[] = await articlesApi.fetchArticles(
        page,
        perPage,
        q
      );
      if (!pageResults || pageResults.length === 0) break;

      const matches = pageResults.filter((a) => {
        const title = (a.title || "").toLowerCase();
        return title.includes(lower);
      });
      found.push(...matches);

      // if (pageResults.length < perPage) break;
    }
    const unique = Array.from(new Map(found.map((a) => [a.id, a])).values());
    return unique;
  }
);

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
      state.articles = [];
      state.currentPage = 1;
    },
    resetArticles: (state) => {
      state.articles = [];
      state.currentPage = 1;
      state.error = null;
      state.selectedTag = null;
      state.searchQuery = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.articles = [];
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch articles";
      })
      .addCase(fetchArticlesByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticlesByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch articles by tag";
      })
      .addCase(fetchArticlesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticlesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch articles by user";
      })
      .addCase(fetchArticlesByQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticlesByQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to search articles";
      })
      // .addCase(fetchArticleById.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchArticleById.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.articles = [action.payload];
      // })
      // .addCase(fetchArticleById.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Failed to fetch article';
      // })
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.article = null; // optional: clear previous article while loading
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.article = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch article";
        state.article = null;
      })
      .addCase(fetchTags.pending, (state) => {
        state.tagsLoading = true;
        state.tagsError = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tagsLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tagsLoading = false;
        state.tagsError = action.error?.message || "Failed to fetch tags";
      });
  },
});

export const {
  setPage,
  setPerPage,
  setSelectedTag,
  resetArticles,
  setSearchQuery,
} = articlesSlice.actions;
export default articlesSlice.reducer;
