import { z } from "zod";
import { Id } from "./id";

export const List = z.object({
  id: z.number(),
  name: z.string(),
  todos: z.array(Id),
});
export type List = z.infer<typeof List>;

export const CreateList = List.omit({ id: true, todos: true });
export type CreateList = z.infer<typeof CreateList>;
