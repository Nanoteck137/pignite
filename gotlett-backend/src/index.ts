import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { OpenApiMeta, createOpenApiExpressMiddleware } from "trpc-openapi";
import { z } from "zod";

const t = initTRPC.meta<OpenApiMeta>().create();

const appRouter = t.router({
  test: t.procedure
    .meta({ openapi: { method: "GET", path: "/test" } })
    .input(z.void())
    .output(z.string())
    .query(() => "Hello World"),
  other: t.procedure
    .meta({ openapi: { method: "GET", path: "/other" } })
    .input(z.void())
    .output(z.string())
    .query(() => "Other Hello"),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

app.use("/api", createOpenApiExpressMiddleware({ router: appRouter }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.listen(3000);
