import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import dayjs from "dayjs";

export interface ArticleType {
  slug: string;
  content: string;
  title: string;
  dateCreated: string;
  lastUpdated?: string;
  authorUsername?: string;
  authorImgUrl?: string | undefined;
  coverImg?: string;
  readTime?: string;
  summary?: string;
  hidden?: boolean;
  categories?: string[];
}

const postsDirectory = join(process.cwd(), "articles");

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {
    ...data,
    categories: data.categories.split(","),
    slug: realSlug,
    content: content,
    authorImgUrl: "",
  } as ArticleType;

  return items;
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => !post.hidden)
    // sort posts by date in descending order
    .sort((post1, post2) => (dayjs(post1.dateCreated).isAfter(dayjs(post2.dateCreated)) ? 1 : -1));
  return posts;
}
