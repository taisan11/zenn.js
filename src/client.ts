import type {
  ArticleDetail,
  ArticleResponse,
  ArticlesResponse,
  BookResponse,
  BooksResponse,
  ChapterResponse,
  ClientOptions,
  ListArticlesOptions,
  ListBooksOptions,
  ListFollowersOptions,
  ListScrapsOptions,
  ListUsersCommentsOptions,
  PublicationMini,
  PublicationResponse,
  ScrapsResponse,
  ScrapResponse,
  SearchOptions,
  SearchResponse,
  SearchSource,
  TopicResponse,
  TopicsResponse,
  UserCommentsResponse,
  UserResponse,
  UsersResponse,
  Event,
} from "./types.ts";

const DEFAULT_BASE_URL = "https://zenn.dev";

export class ZennApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ZennApiError";
    this.status = status;
    this.body = body;
  }
}

export interface PublicationsMiniResponse {
  publications: PublicationMini[];
  next_page: number | null;
}

function buildQuery(params: object | undefined): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    search.set(k, String(v));
  }
  const qs = search.toString();
  return qs.length > 0 ? `?${qs}` : "";
}

export class ZennClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly headers: HeadersInit;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetcher = options.fetch ?? fetch;
    this.headers = options.headers ?? {};
  }

  private async request<T>(path: string, params?: object): Promise<T> {
    const url = `${this.baseUrl}${path}${buildQuery(params)}`;
    const res = await this.fetcher(url, {
      headers: {
        Accept: "application/json",
        ...this.headers,
      },
    });
    const text = await res.text();
    const data: unknown = text.length > 0 ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new ZennApiError(res.status, data, `Zenn API request failed: ${res.status} ${res.statusText} (${url})`);
    }
    return data as T;
  }

  // ---------- Articles ----------

  listArticles(options: ListArticlesOptions = {}): Promise<ArticlesResponse> {
    return this.request<ArticlesResponse>("/api/articles", options);
  }

  getArticle(slug: string): Promise<ArticleResponse> {
    return this.request<ArticleResponse>(`/api/articles/${encodeURIComponent(slug)}`);
  }

  getArticleById(id: number): Promise<ArticleResponse> {
    return this.request<ArticleResponse>("/api/articles", { id });
  }

  async *iterArticles(options: Omit<ListArticlesOptions, "page"> = {}): AsyncGenerator<ArticleDetail, void, void> {
    let page = 1;
    while (true) {
      const res = await this.listArticles({ ...options, page });
      for (const item of res.articles) {
        const detail = await this.getArticle(item.slug);
        yield detail.article;
      }
      if (res.next_page === null || res.next_page === undefined) break;
      page = res.next_page;
    }
  }

  // ---------- Books ----------

  listBooks(options: ListBooksOptions = {}): Promise<BooksResponse> {
    return this.request<BooksResponse>("/api/books", options);
  }

  getBook(slug: string): Promise<BookResponse> {
    return this.request<BookResponse>(`/api/books/${encodeURIComponent(slug)}`);
  }

  getChapter(id: number): Promise<ChapterResponse> {
    return this.request<ChapterResponse>(`/api/chapters/${id}`);
  }

  // ---------- Scraps ----------

  listScraps(options: ListScrapsOptions = {}): Promise<ScrapsResponse> {
    return this.request<ScrapsResponse>("/api/scraps", options);
  }

  getScrap(slug: string): Promise<ScrapResponse> {
    return this.request<ScrapResponse>(`/api/scraps/${encodeURIComponent(slug)}`);
  }

  // ---------- Users ----------

  getUser(username: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/api/users/${encodeURIComponent(username)}`);
  }

  getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/api/users/current");
  }

  getUserFollowers(username: string, options: ListFollowersOptions = {}): Promise<UsersResponse> {
    return this.request<UsersResponse>(`/api/users/${encodeURIComponent(username)}/followers`, options);
  }

  getUserFollowingsUsers(username: string, options: ListFollowersOptions = {}): Promise<UsersResponse> {
    return this.request<UsersResponse>(`/api/users/${encodeURIComponent(username)}/followings/users`, options);
  }

  getUserFollowingsPublications(
    username: string,
    options: ListFollowersOptions = {},
  ): Promise<PublicationsMiniResponse> {
    return this.request<PublicationsMiniResponse>(
      `/api/users/${encodeURIComponent(username)}/followings/publications`,
      options,
    );
  }

  getUserComments(username: string, options: ListUsersCommentsOptions = {}): Promise<UserCommentsResponse> {
    return this.request<UserCommentsResponse>(`/api/users/${encodeURIComponent(username)}/comments`, options);
  }

  // ---------- Publications ----------

  getPublication(name: string): Promise<PublicationResponse> {
    return this.request<PublicationResponse>(`/api/publications/${encodeURIComponent(name)}`);
  }

  getPublicationFollowers(name: string, options: ListFollowersOptions = {}): Promise<UsersResponse> {
    return this.request<UsersResponse>(`/api/publications/${encodeURIComponent(name)}/followers`, options);
  }

  // ---------- Topics ----------

  listTopics(): Promise<TopicsResponse> {
    return this.request<TopicsResponse>("/api/topics");
  }

  getTopic(name: string): Promise<TopicResponse> {
    return this.request<TopicResponse>(`/api/topics/${encodeURIComponent(name)}`);
  }

  // ---------- Search ----------

  search<TSource extends SearchSource>(
    options: SearchOptions & { source: TSource },
  ): Promise<SearchResponse<TSource>> {
    return this.request<SearchResponse<TSource>>("/api/search", options);
  }

  // ---------- Events ----------

  listEvents(): Promise<Event[]> {
    return this.request<Event[]>("/api/events");
  }
}
