import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";

export type Context = {
  prisma: PrismaClient;
};

export const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
