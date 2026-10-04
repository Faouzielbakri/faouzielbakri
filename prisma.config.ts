import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next keeps local secrets in .env.local; the Prisma CLI reads the same file.
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env["DATABASE_URL"] },
});
