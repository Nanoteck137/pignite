import "./env";

import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { appRouter } from "./api/router";

const app = express();

app.use(cors());

app.use("/api", createOpenApiExpressMiddleware({ router: appRouter }));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.listen(3000);
