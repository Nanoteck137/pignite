import "./env";

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { appRouter } from "./api/router";
import { PrismaClient } from "@prisma/client";
import { Context } from "./trpc";

const prismaClient = new PrismaClient();

function createContextInner(): Context {
  return {
    prisma: prismaClient,
  };
}

const app = express();

app.use(cors());

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext: () => createContextInner(),
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => createContextInner(),
  }),
);

app.listen(3000);
