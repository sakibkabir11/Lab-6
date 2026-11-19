import "dotenv/config";
import { defineConfig, env } from "prisma/config";

process.env.DATABASE_URL ||= "file:./dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "node prisma/seed.cjs" },
  engine: "classic",
  datasource: { url: env("DATABASE_URL") },
});
