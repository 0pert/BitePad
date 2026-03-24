import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { createEntryInputSchema, type CreateEntryInput, type Entry } from "./schema";
import { getDirForType } from "./paths";
import { makeSlug } from "./slugs";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function saveEntry(input: CreateEntryInput): Promise<Entry> {
  const parsed = createEntryInputSchema.parse(input);
  const slug = makeSlug(parsed.title);
  const dir = getDirForType(parsed.type);
  const filePath = path.join(dir, `${slug}.md`);

  const created = today();
  const updated = today();
  console.log(parsed)
  const frontmatter = {
    title: parsed.title,
    type: parsed.type,
    status: parsed.status,
    tags: parsed.tags,
    mainIngredients: parsed.mainIngredients || "",
    cuisine: parsed.cuisine,
    timeMinutes: parsed.timeMinutes,
    // difficulty: parsed.difficulty,
    // rating: parsed.rating,
    // source: parsed.source,
    created,
    updated,
  };
  console.log(frontmatter)

  const fileContents = matter.stringify(parsed.body.trim(), frontmatter);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, fileContents, "utf8");

  return {
    slug,
    body: parsed.body.trim(),
    ...frontmatter,
  };
}