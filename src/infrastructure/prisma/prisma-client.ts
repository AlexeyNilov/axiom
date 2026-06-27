import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const globalForPrisma = globalThis as unknown as {
  axiomPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.axiomPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.axiomPrisma = prisma;
}
