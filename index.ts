import { ZennClient, ZennApiError } from "./src/index.ts";

async function main() {
  const zenn = new ZennClient();

  console.log("== topics (top 5) ==");
  const { topics } = await zenn.listTopics();
  for (const t of topics.slice(0, 5)) {
    console.log(`  ${t.name.padEnd(20)} ${t.taggings_count} articles  (${t.display_name})`);
  }

  console.log("\n== latest articles (top 3) ==");
  const { articles } = await zenn.listArticles({ order: "latest" });
  for (const a of articles.slice(0, 3)) {
    console.log(`  - [${a.article_type}] ${a.title}`);
    console.log(`    by ${a.user.name} (/${a.path})  likes=${a.liked_count}`);
  }

  console.log("\n== article detail ==");
  const first = articles[0]!;
  const { article } = await zenn.getArticle(first.slug);
  console.log(`  title: ${article.title}`);
  console.log(`  toc entries: ${article.toc.length}`);
  console.log(`  comments: ${article.comments.length}, positive=${article.positive_comments_count}`);
  console.log(`  body length: ${article.body_html.length} chars`);

  console.log("\n== user ==");
  const { user } = await zenn.getUser(first.user.username);
  console.log(`  ${user.name} (${user.username})`);
  console.log(`  followers=${user.follower_count} following=${user.following_count}`);
  console.log(`  articles=${user.articles_count} books=${user.books_count} scraps=${user.scraps_count}`);

  console.log("\n== followers (top 3) ==");
  const { users: followers } = await zenn.getUserFollowers(user.username);
  for (const u of followers.slice(0, 3)) {
    console.log(`  - ${u.name} (@${u.username})`);
  }

  console.log("\n== search 'claude' across users ==");
  const searchUsers = await zenn.search({ q: "claude", source: "users" });
  for (const u of (searchUsers.users ?? []).slice(0, 3)) {
    console.log(`  - ${u.name} (@${u.username})`);
  }

  console.log("\n== events ==");
  const events = await zenn.listEvents();
  for (const e of events.slice(0, 3)) {
    console.log(`  - [${e.event_type}] ${e.title}`);
  }
}

main().catch((err) => {
  if (err instanceof ZennApiError) {
    console.error(`API error ${err.status}:`, err.body);
  } else {
    console.error(err);
  }
  process.exit(1);
});
