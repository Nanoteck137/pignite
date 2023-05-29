import { z } from "zod";

export const Todo = z.object({
  id: z.number(),
  content: z.string().min(1),
  done: z.boolean().default(false),
  listId: z.number(),
});
export type Todo = z.infer<typeof Todo>;

export const CreateTodo = Todo.omit({ id: true });
export type CreateTodo = z.infer<typeof CreateTodo>;

export const TodoPatch = z.object({
  content: z.string().min(1).optional(),
  done: z.boolean().optional(),
});
export type TodoPath = z.infer<typeof TodoPatch>;
