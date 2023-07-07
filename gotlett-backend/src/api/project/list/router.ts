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
        include: { items: { orderBy: { index: "asc" } } },
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
  action: publicProcedure
    .input(
      z.discriminatedUnion("action", [
        z.object({
          action: z.literal("MOVE_ITEM"),
          data: z.object({ itemId: Id, beforeItemId: Id }),
        }),
      ]),
    )
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      // if (input.action == "SWAP_ITEMS") {
      //   const { source, destination } = input.data;
      //   console.log("Swap", input.data.source, "-", input.data.destination);
      //   const sourceItem = await ctx.prisma.projectListItem.findUnique({
      //     where: { id: source },
      //   });
      //   const destItem = await ctx.prisma.projectListItem.findUnique({
      //     where: { id: destination },
      //   });
      //
      //   if (!sourceItem) {
      //     throw new TRPCError({ code: "BAD_REQUEST" });
      //   }
      //
      //   if (!destItem) {
      //     throw new TRPCError({ code: "BAD_REQUEST" });
      //   }
      //
      //   const first = ctx.prisma.projectListItem.update({
      //     where: { id: source },
      //     data: { index: destItem.index },
      //   });
      //   const second = ctx.prisma.projectListItem.update({
      //     where: { id: destination },
      //     data: { index: sourceItem.index },
      //   });
      //   const res = await ctx.prisma.$transaction([first, second]);
      //   console.log("Res", res);
      // }
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
      const count = await ctx.prisma.projectListItem.count({
        where: { listId: input.listId },
      });

      const data = {
        ...input,
        index: count,
      };
      return await ctx.prisma.projectListItem.create({ data });
    }),
  deleteItem: publicProcedure
    .meta({ openapi: { method: "DELETE", path: "/project/list/item" } })
    .input(WithId)
    .output(z.void())
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const oldItem = await ctx.prisma.projectListItem.findUnique({
        where: { id },
      });
      if (!oldItem) throw new TRPCError({ code: "BAD_REQUEST" });

      await ctx.prisma.projectListItem.updateMany({
        where: { index: { gt: oldItem.index } },
        data: { index: { decrement: 1 } },
      });

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
