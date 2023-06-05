import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),
});
export type ProjectSchema = z.infer<typeof ProjectSchema>;
