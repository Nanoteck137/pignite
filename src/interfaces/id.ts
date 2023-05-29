import { z } from "zod";

export const Id = z.object({
  id: z.number(),
});
export type Id = z.infer<typeof Id>;
