import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;

export const ProjectListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  projectId: z.string().cuid(),
});
export type ProjectListSchema = z.infer<typeof ProjectListSchema>;

export const ProjectListItemSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  done: z.boolean(),
  listId: z.string().cuid(),
});
export type ProjectListItemSchema = z.infer<typeof ProjectListItemSchema>;
