import { defineConfig } from "drizzle-kit";

function databaseUrl() {
  return (
    process.env.DATABASE_URL ??
    "postgresql://seedstack:seedstack@localhost:5432/seedstack"
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: databaseUrl() },
});
