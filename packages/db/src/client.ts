import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type SeedstackDatabase = PostgresJsDatabase<typeof schema>;

declare global {
  var seedstackDb: SeedstackDatabase | undefined;
}

function databaseUrl() {
  return (
    process.env.DATABASE_URL ??
    "postgresql://seedstack:seedstack@localhost:5432/seedstack"
  );
}

export const db =
  globalThis.seedstackDb ??
  (globalThis.seedstackDb = drizzle(postgres(databaseUrl()), { schema }));
