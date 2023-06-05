import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { TestSchema } from "../../prisma/generated/zod";

const prisma = new PrismaClient();

export const appRouter = router({
  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/test" } })
    .input(z.void())
    .output(z.array(TestSchema))
    .query(async () => {
      const tests = await prisma.test.findMany();
      return tests;
    }),
  createNew: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const result = await prisma.test.create({ data: input });
      return result;
    }),
});

export type AppRouter = typeof appRouter;
