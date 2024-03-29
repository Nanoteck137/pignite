import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;

export const ProjectListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  projectId: z.string().cuid(),
  index: z.number(),
});
export type ProjectListSchema = z.infer<typeof ProjectListSchema>;

export const ProjectListItemSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  done: z.boolean(),
  listId: z.string().cuid(),
  index: z.number(),
});
export type ProjectListItemSchema = z.infer<typeof ProjectListItemSchema>;
