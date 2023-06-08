import { z } from "zod";
import { publicProcedure, router } from "../../../trpc";
import {
  ProjectListItemSchema,
  ProjectListSchema,
} from "../../../model/project";
import { TRPCError } from "@trpc/server";
import { Id, WithId } from "../../../model/id";

const listRouter = router({
  getListForProject: publicProcedure
    .meta({ openapi: { method: "GET", path: "/project/list/getForProject" } })
    .input(z.object({ projectId: Id }))
    .output(z.array(ProjectListSchema))
    .query(async ({ input, ctx }) => {
      const { projectId } = input;
      return await ctx.prisma.projectList.findMany({
        where: { projectId },
      });
    }),
  getList: publicProcedure
    .meta({ openapi: { method: "GET", path: "/project/list" } })
    .input(WithId)
    .output(
      ProjectListSchema.merge(
        z.object({
          items: z.array(ProjectListItemSchema),
        }),
      ),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const result = await ctx.prisma.projectList.findUnique({
        where: { id },
        include: { items: { orderBy: { createdAt: "asc" } } },
      });

      if (!result) {
        throw new TRPCError({
          message: `No list with id: ${id}`,
          code: "NOT_FOUND",
        });
      }

      return result;
    }),
  create: publicProcedure
    .meta({ openapi: { method: "POST", path: "/project/list" } })
    .input(z.object({ name: z.string(), projectId: Id }))
    .output(ProjectListSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectList.create({ data: input });
    }),
  delete: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/project/list" } })
    .input(WithId)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      await ctx.prisma.projectList.delete({ where: { id } });
    }),
  edit: publicProcedure
    .meta({ openapi: { method: "PATCH", path: "/project/list" } })
    .input(
      z.object({
        id: Id,
        data: z.object({ name: z.string().min(1).optional() }),
      }),
    )
    .output(ProjectListSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;
      return await ctx.prisma.projectList.update({ where: { id }, data });
    }),

  createItem: publicProcedure
    .meta({ openapi: { method: "POST", path: "/project/list/item" } })
    .input(
      z.object({
        name: z.string(),
        done: z.boolean().default(false),
        listId: Id,
      }),
    )
    .output(ProjectListItemSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectListItem.create({ data: input });
    }),
  deleteItem: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/project/list/item" } })
    .input(WithId)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      await ctx.prisma.projectListItem.delete({ where: { id } });
    }),
  editItem: publicProcedure
    .meta({ openapi: { method: "PATCH", path: "/project/list/item" } })
    .input(
      z.object({
        id: Id,
        data: z.object({
          name: z.string().optional(),
          done: z.boolean().optional(),
          listId: Id.optional(),
        }),
      }),
    )
    .output(ProjectListItemSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.projectListItem.update({
        where: { id: input.id },
        data: input.data,
      });
    }),
});

export default listRouter;
