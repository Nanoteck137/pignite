import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  test: publicProcedure
    .meta({ openapi: { method: "GET", path: "/test" } })
    .input(z.void())
    .output(z.string())
    .query(() => "Hello World"),
  other: publicProcedure
    .meta({ openapi: { method: "GET", path: "/other" } })
    .input(z.void())
    .output(z.string())
    .query(() => "Other Hello"),
});

export type AppRouter = typeof appRouter;
