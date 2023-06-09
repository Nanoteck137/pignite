import { z } from "zod";

export const Id = z.string().cuid();
export type Id = z.infer<typeof Id>;

// TODO(patrik): Rename to OnlyId???
export const WithId = z.object({
  id: Id,
});
export type WithId = z.infer<typeof WithId>;
