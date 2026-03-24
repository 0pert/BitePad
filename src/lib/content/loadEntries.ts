import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { entrySchema, type Entry } from "./schema";
import { ideasDir, recipesDir } from "./paths";

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value;
  }

  throw new Error(`Invalid date value: ${String(value)}`);
}

async function readDirEntries(dir: string): Promise<Entry[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const entries = await Promise.all(
    mdFiles.map(async (file) => {
      const fullPath = path.join(dir, file);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(raw);

      const slug = file.replace(/\.md$/, "");

      return entrySchema.parse({
        ...data,
        created: normalizeDate(data.created),
        updated: normalizeDate(data.updated),
        slug,
        body: content.trim(),
      });
    })
  );

  return entries;
}

export async function loadEntries(): Promise<Entry[]> {
  const [recipes, ideas] = await Promise.all([
    readDirEntries(recipesDir),
    readDirEntries(ideasDir),
  ]);

  return [...recipes, ...ideas].sort((a, b) =>
    b.updated.localeCompare(a.updated)
  );
}

export async function loadEntryBySlug(slug: string): Promise<Entry | null> {
  const entries = await loadEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
}