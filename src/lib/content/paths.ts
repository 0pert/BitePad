import path from "path";

export const contentRoot = path.join(process.cwd(), "content");
export const recipesDir = path.join(contentRoot, "recipes");
export const ideasDir = path.join(contentRoot, "ideas");

export function getDirForType(type: "recipe" | "idea") {
  return type === "recipe" ? recipesDir : ideasDir;
}