import { randomUUID } from "node:crypto";
import { createApplication } from "../application/create-application";
import { PrismaUnitOfWork } from "../infrastructure/prisma/prisma-repositories";
import { prisma } from "../infrastructure/prisma/prisma-client";

export function getApplication() {
  return createApplication({
    repositories: new PrismaUnitOfWork(prisma),
    clock: () => new Date(),
    ids: () => randomUUID(),
  });
}
