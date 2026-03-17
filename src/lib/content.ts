import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort(
    (left, right) => right.data.date.getTime() - left.data.date.getTime(),
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function inferLanguage(post: PostEntry) {
  if (post.data.translationKey && post.id.endsWith("ko")) return "KR";
  if (post.data.translationKey && post.id.endsWith("en")) return "EN";
  if (post.id.endsWith(".ko")) return "KR";
  if (post.id.endsWith(".en")) return "EN";
  const koreanChars = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanChars.test(post.data.title) ? "KR" : "EN";
}

export function languageLabel(post: PostEntry) {
  return inferLanguage(post) === "KR" ? "Korean" : "English";
}

export function excerptFromBody(post: PostEntry, maxLength = 210) {
  const source = post.body ?? "";
  const normalized = source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[>#*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return post.data.description || "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function normalizeTag(tag: string) {
  return tag.replace(/[-_]/g, " ").trim();
}

export function readingMinutes(post: PostEntry) {
  const source = post.body ?? "";
  const wordCount = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 220));
}

export function getPostPath(post: PostEntry) {
  const slug = post.data.translationKey
    ? post.id.replace(/(en|ko)$/, "-$1")
    : post.id;
  return `/posts/${slug}/`;
}

export function getTranslationMatches(posts: PostEntry[], post: PostEntry) {
  if (!post.data.translationKey) return [];
  return posts.filter(
    (candidate) =>
      candidate.id !== post.id &&
      candidate.data.translationKey === post.data.translationKey,
  );
}
