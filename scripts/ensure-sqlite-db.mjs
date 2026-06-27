import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

const databasePath = sqliteDatabasePath(process.env.DATABASE_URL ?? "file:./dev.db");

mkdirSync(dirname(databasePath), { recursive: true });

if (!existsSync(databasePath)) {
  closeSync(openSync(databasePath, "w"));
}

function sqliteDatabasePath(databaseUrl) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("Only file: SQLite DATABASE_URL values are supported");
  }

  const filePath = databaseUrl.slice("file:".length);

  if (isAbsolute(filePath)) {
    return filePath;
  }

  return join(process.cwd(), "prisma", filePath);
}
