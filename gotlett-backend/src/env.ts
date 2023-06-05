import { ZodError, z } from "zod";

import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const EnvSchema = z.object({
  TEST: z.string({ required_error: "TEST2 is required" }),
});

EnvSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof EnvSchema> {}
  }
}
