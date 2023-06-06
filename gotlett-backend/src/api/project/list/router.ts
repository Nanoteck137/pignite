import { z } from "zod";
import { publicProcedure, router } from "../../../trpc";
import { ProjectListSchema } from "../../../model/project";

const listRouter = router({
  getListForProject: publicProcedure
    .meta({ openapi: { method: "GET", path: "/project/list/getForProject" } })
    .input(z.object({ projectId: z.string().cuid() }))
    .output(z.array(ProjectListSchema))
    .query(async ({ input, ctx }) => {
      const { projectId } = input;
      return await ctx.prisma.projectList.findMany({
        where: { projectId },
      });
    }),
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: "/project/list" } })
    .input(z.object({ name: z.string(), projectId: z.string().cuid() }))
    .output(ProjectListSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectList.create({ data: input });
    }),
});

export default listRouter;
