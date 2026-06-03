/**
 * Type definitions for the public Zenn API (https://zenn.dev/api/*).
 *
 * All payloads are returned as snake_case keys from the server, so the
 * types below mirror that wire format. Optional fields are flagged with
 * `?` only when the server has been observed to omit them.
 */

export type Iso8601 = string;

export type ArticleType = "tech" | "idea";

export type PostType = "Article" | "Book" | "Scrap" | "Comment" | "Chapter";

export type PrincipalType = "User" | "Publication";

export type CommentableType = "Article" | "Scrap";

export type EventType = "contest" | "hackathon" | "event";

export type PrizeRank =
  | "grand_prize"
  | "winner"
  | "runner_up"
  | "participant"
  | (string & {});

export interface UserMini {
  id: number;
  username: string;
  name: string;
  avatar_small_url: string;
  avatar_url?: string;
}

export interface PublicationMini {
  id: number;
  name: string;
  display_name: string;
  avatar_small_url: string;
  avatar_url: string;
  pro: boolean;
  avatar_registered: boolean;
}

export interface PublicationArticleOverride {
  publication_id: number;
  pathname: string;
  title: string;
  author_type: "Publication" | "User";
  publication_avatar_registered?: boolean;
}

export interface Topic {
  id: number;
  name: string;
  taggings_count: number;
  image_url: string;
  display_name: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

export interface UserAward {
  event_slug: string;
  event_title: string;
  event_type: EventType;
  prize_rank: PrizeRank;
  prize_display_name: string;
  article: ArticleListItem;
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar_small_url: string;
  avatar_url: string;
  bio: string;
  autolinked_bio: string;
  github_username: string | null;
  twitter_username: string | null;
  is_support_open: boolean;
  tokusyo_contact: string | null;
  tokusyo_name: string | null;
  website_url: string | null;
  website_domain: string | null;
  total_liked_count: number;
  ga_tracking_id: string | null;
  hatena_id: string | null;
  is_invoice_issuer: boolean;
  follower_count: number;
  following_count: number;
  following_user_count: number;
  following_publication_count: number;
  badge_count: number;
  articles_count: number;
  books_count: number;
  scraps_count: number;
  awards: UserAward[];
}

export interface PublicationNavigation {
  id: number;
  position: number;
  label: string;
  url: string;
}

export interface PublicationArticleList {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles_count: number;
  position: number;
}

export interface Publication {
  id: number;
  name: string;
  display_name: string;
  avatar_small_url: string;
  avatar_url: string;
  pro: boolean;
  avatar_registered: boolean;
  description: string;
  autolinked_description: string;
  twitter_username: string | null;
  github_username: string | null;
  cover_image_url: string;
  fixed_sentences_html: string;
  is_support_open: boolean;
  is_article_comment_open: boolean;
  ga_tracking_id: string | null;
  follower_count: number;
  sponsor_count: number;
  navigations: PublicationNavigation[];
  article_lists: PublicationArticleList[];
  has_recent_article_lists: boolean;
}

export interface GitHubRepository {
  id: number;
  owner_name: string;
  repo_name: string;
}

export interface ArticleListItem {
  id: number;
  post_type: "Article";
  slug: string;
  comments_count: number;
  liked_count: number;
  bookmarked_count: number;
  body_letters_count: number;
  article_type: ArticleType;
  emoji: string;
  is_suspending_private: boolean;
  published_at: Iso8601;
  body_updated_at: Iso8601;
  source_repo_updated_at: Iso8601 | null;
  pinned: boolean;
  path: string;
  principal_type: PrincipalType;
  title: string;
  user: UserMini;
  publication: PublicationMini | null;
  publication_article_override: PublicationArticleOverride | null;
}

export interface ArticlesResponse {
  articles: ArticleListItem[];
  next_page: number | null;
  total_count?: number;
}

export interface ArticleDetail extends ArticleListItem {
  toc_enabled: boolean;
  should_noindex: boolean;
  scheduled_publish_at: Iso8601 | null;
  can_send_badge: boolean;
  status: "published" | "draft" | (string & {});
  og_image_url: string;
  body_html: string;
  toc: TocItem[];
  badges: ArticleBadge[];
  is_mine: boolean;
  is_preview: boolean;
  draft_reveal_scope: string | null;
  current_user_liked: boolean;
  current_user_bookmarked: boolean;
  github_repository: GitHubRepository | null;
  publication_article_override: PublicationArticleOverride | null;
  contest: ArticleContest | null;
  topics: Topic[];
  top_article_list: unknown;
  comments: ArticleComment[];
  positive_comments_count: number;
  commented_users: UserMini[];
}

export interface ArticleResponse {
  article: ArticleDetail;
}

export interface ArticleBadge {
  badge_type: string;
  rank: string | null;
  created_at: Iso8601;
}

export interface ArticleContest {
  slug: string;
  title: string;
  emoji: string;
  icon_url: string;
  description: string;
  short_title: string;
  url: string;
  started_at: Iso8601;
  ended_at: Iso8601;
}

export interface BookListItem {
  id: number;
  post_type: "Book";
  title: string;
  slug: string;
  published: boolean;
  price: number;
  is_suspending_private: boolean;
  liked_count: number;
  published_at: Iso8601;
  body_updated_at: Iso8601;
  source_repo_updated_at: Iso8601;
  cover_image_small_url: string;
  path: string;
  user: UserMini;
}

export interface BooksResponse {
  books: BookListItem[];
  next_page: number | null;
}

export interface BookChapter {
  id: number;
  post_type: "Chapter";
  is_free: boolean;
  slug: string;
  body_letters_count: number;
  source_repo_updated_at: Iso8601;
  body_updated_at: Iso8601;
  filename: string;
  position: number;
  path: string;
  title: string;
}

export interface BookBadge {
  badge_type: string;
  rank: string | null;
  created_at: Iso8601;
}

export interface BookContact {
  url: string;
  label: string;
}

export interface BookDetail {
  id: number;
  post_type: "Book";
  title: string;
  slug: string;
  published: boolean;
  price: number;
  is_suspending_private: boolean;
  liked_count: number;
  published_at: Iso8601;
  body_updated_at: Iso8601;
  source_repo_updated_at: Iso8601;
  cover_image_small_url: string;
  path: string;
  summary: string;
  autolinked_summary: string;
  og_image_url: string;
  toc_enabled: boolean;
  cover_image_url: string;
  should_noindex: boolean;
  total_letters_count: number;
  badges: BookBadge[];
  toc_depth: number;
  require_additional_settings: boolean;
  is_mine: boolean;
  is_preview: boolean;
  draft_reveal_scope: string | null;
  current_user_liked: boolean;
  purchase_in_progress: boolean;
  can_read_all_chapters: boolean;
  contact: BookContact | null;
  user: User;
  topics: Topic[];
  chapters: BookChapter[];
  github_repository: GitHubRepository | null;
  cross_references: unknown[];
}

export interface BookResponse {
  book: BookDetail;
}

export interface ChapterDetail {
  id: number;
  post_type: "Chapter";
  is_free: boolean;
  slug: string;
  body_letters_count: number;
  source_repo_updated_at: Iso8601;
  body_updated_at: Iso8601;
  filename: string;
  position: number;
  path: string;
  title: string;
  body_html: string;
  toc: TocItem[];
}

export interface ChapterResponse {
  chapter: ChapterDetail;
}

export interface ScrapListItem {
  id: number;
  post_type: "Scrap";
  user_id: number;
  slug: string;
  title: string;
  closed: boolean;
  closed_at: Iso8601 | null;
  archived: boolean;
  liked_count: number;
  can_others_post: boolean;
  comments_count: number;
  created_at: Iso8601;
  last_comment_created_at: Iso8601;
  should_noindex: boolean;
  path: string;
  unlisted: boolean;
  topics: Topic[];
  user: UserMini;
}

export interface ScrapsResponse {
  scraps: ScrapListItem[];
  next_page: number | null;
}

export interface ScrapCommentable {
  id: number;
  post_type: "Scrap" | "Article";
  user_id: number;
  slug: string;
  title: string;
  closed: boolean;
  closed_at: Iso8601 | null;
  archived: boolean;
  liked_count: number;
  can_others_post: boolean;
  comments_count: number;
  created_at: Iso8601;
  last_comment_created_at: Iso8601;
  should_noindex: boolean;
  path: string;
  unlisted: boolean;
}

export interface ScrapDetail extends ScrapListItem {
  current_user_liked: boolean;
  is_mine: boolean;
  comments: ArticleComment[];
  positive_comments_count: number;
  commented_users: UserMini[];
}

export interface ScrapResponse {
  scrap: ScrapDetail;
}

export interface ArticleComment {
  id: number;
  post_type: "Comment";
  slug: string;
  user_id: number;
  liked_count: number;
  body_updated_at: Iso8601 | null;
  created_at: Iso8601;
  pinned: boolean;
  body_html: string;
  hidden_reason: string | null;
  current_user_liked: boolean;
  is_mine: boolean;
  user: UserMini;
  children: ArticleComment[];
}

export interface UserCommentItem {
  id: number;
  post_type: "Comment";
  parent_id: number | null;
  slug: string;
  commentable_type: CommentableType;
  user_id: number;
  liked_count: number;
  body_updated_at: Iso8601 | null;
  created_at: Iso8601;
  reply: boolean;
  title: string;
  commentable: ScrapCommentable;
}

export interface UserCommentsResponse {
  comments: UserCommentItem[];
  next_page: number | null;
}

export interface UsersResponse {
  users: UserMini[];
  next_page: number | null;
}

export interface UserResponse {
  user: User;
}

export interface PublicationResponse {
  publication: Publication;
}

export interface TopicsResponse {
  topics: Topic[];
}

export interface TopicResponse {
  topic: Topic;
}

export interface Event {
  slug: string;
  event_type: EventType;
  emoji: string;
  icon_url: string;
  title: string;
  description: string;
  short_title: string;
  url: string;
  target_blank: boolean;
  promotion_started_at: Iso8601;
  promotion_ended_at: Iso8601;
  started_at: Iso8601;
  ended_at: Iso8601;
}

export type SearchSource =
  | "articles"
  | "users"
  | "topics"
  | "publications"
  | "scraps"
  | "books";

export interface SearchResponse<TKey extends SearchSource> {
  articles?: ArticleListItem[];
  users?: UserMini[];
  topics?: Topic[];
  publications?: PublicationMini[];
  scraps?: ScrapListItem[];
  books?: BookListItem[];
  next_page: number | null;
}

export type ArticleListOrder =
  | "latest"
  | "liked"
  | "trending"
  | "new"
  | "weekly_liked"
  | "monthly_liked"
  | "liked_daily"
  | "liked_weekly"
  | "liked_monthly"
  | "liked_alltime"
  | "daily_tech"
  | "daily_idea"
  | "daily_books"
  | "weekly_tech"
  | "weekly_idea"
  | "alltime_tech"
  | "alltime_idea"
  | "weekly_liked_tech"
  | "monthly_liked_tech"
  | "alltime_liked_tech"
  | (string & {});

export type BookListOrder = ArticleListOrder;
export type ScrapListOrder = ArticleListOrder;

export interface ListArticlesOptions {
  order?: ArticleListOrder;
  page?: number;
  username?: string;
  publication_name?: string;
  topicname?: string;
  article_type?: ArticleType;
}

export interface ListBooksOptions {
  order?: BookListOrder;
  page?: number;
  username?: string;
  publication_name?: string;
  topicname?: string;
}

export interface ListScrapsOptions {
  order?: ScrapListOrder;
  page?: number;
  username?: string;
  publication_name?: string;
  topicname?: string;
}

export interface ListUsersCommentsOptions {
  page?: number;
  commentable_type?: CommentableType;
}

export interface ListFollowersOptions {
  page?: number;
}

export interface SearchOptions {
  q: string;
  source: SearchSource;
  page?: number;
}

export interface ClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  headers?: HeadersInit;
}
