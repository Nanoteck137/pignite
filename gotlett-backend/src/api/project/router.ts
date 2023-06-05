import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { ProjectSchema } from "../../model/project";
import { TRPCError } from "@trpc/server";

const projectRouter = router({
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
    .output(ProjectSchema)
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.project.findUnique({
        where: { id: input.id },
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
    .mutation(({ input, ctx }) => {
      return ctx.prisma.project.create({ data: input });
    }),
});
export default projectRouter;
