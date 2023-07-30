import { unified } from "unified";
import parse from "remark-parse";
import rehype from "remark-rehype";
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import stringify from "rehype-stringify";

export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(parse)
    .use(rehype)
    .use(slug)
    .use(toc)
    .use(stringify)
    .process(markdown);
  return result.toString();
}
