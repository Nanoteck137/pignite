import { ProjectList } from "@prisma/client";
import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;

export const ProjectListSchema: z.ZodType<ProjectList> = z.object({
  id: z.string().cuid(),
  name: z.string(),
  projectId: z.string().cuid(),
});
export type ProjectListSchema = z.infer<typeof ProjectListSchema>;
