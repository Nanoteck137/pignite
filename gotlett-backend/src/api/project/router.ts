import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { ProjectSchema } from "../../model/project";
import { TRPCError } from "@trpc/server";
import listRouter from "./list/router";
import { WithId } from "../../model/id";

const projectRouter = router({
  list: listRouter,

  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/project/all" } })
    .input(z.void())
    .output(z.array(ProjectSchema))
    .query(({ ctx }) => {
      return ctx.prisma.project.findMany();
    }),
  get: publicProcedure
    .meta({ openapi: { method: "GET", path: "/project" } })
    .input(z.object({ id: z.string() }))
    .output(ProjectSchema.merge(z.object({ lists: z.array(WithId) })))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: { lists: { select: { id: true } } },
      });
      if (!result)
        throw new TRPCError({
          message: `No project with id: ${input.id}`,
          code: "NOT_FOUND",
        });
      return result;
    }),
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: "/project" } })
    .input(z.object({ name: z.string(), color: z.string() }))
    .output(ProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, color } = input;
      return await ctx.prisma.project.create({ data: { name, color } });
    }),
  delete: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/project" } })
    .input(WithId)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      await ctx.prisma.project.delete({ where: { id } });
    }),
});
export default projectRouter;
