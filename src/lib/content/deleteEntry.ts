import fs from "fs/promises";
import path from "path";
import { getDirForType } from "./paths";

export async function deleteEntry(type: "recipe" | "idea", slug: string) {
    const dir = getDirForType(type);
    const filePath = path.join(dir, `${slug}.md`);

    await fs.unlink(filePath);

    const ok = 200
    return {
        ok
      }
}