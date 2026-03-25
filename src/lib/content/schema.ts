import { z } from "zod";

export const entryTypeSchema = z.enum(["recipe", "idea"]);
export const entryStatusSchema = z.enum(["idea", "saved", "tested", "favorite"]);
export const difficultySchema = z.enum(["easy", "medium", "hard"]).optional();

export const entryFrontmatterSchema = z.object({
  title: z.string().min(1),
  type: entryTypeSchema,
  status: entryStatusSchema,
  tags: z.array(z.string()).default([]),
  mainIngredients: z.array(z.string()).default([]),
  cuisine: z.string().optional(),
  timeMinutes: z.number().int().nonnegative().optional(),
  difficulty: difficultySchema,
  rating: z.number().min(1).max(5).optional(),
  source: z.string().optional(),
  created: z.string(),
  updated: z.string(),
});

export const entrySchema = entryFrontmatterSchema.extend({
  slug: z.string(),
  body: z.string(),
});

export const createEntryInputSchema = z.object({
  title: z.string().min(1),
  type: entryTypeSchema,
  status: entryStatusSchema.default("saved"),
  tags: z.array(z.string()).default([]),
  mainIngredients: z.array(z.string()).default([]).optional(),
  cuisine: z.string().optional(),
  timeMinutes: z.number().int().nonnegative().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  rating: z.number().min(1).max(5).optional(),
  source: z.string().optional(),
  body: z.string().default(""),
});

export type Entry = z.infer<typeof entrySchema>;
export type EntryFrontmatter = z.infer<typeof entryFrontmatterSchema>;
export type CreateEntryInput = z.infer<typeof createEntryInputSchema>;