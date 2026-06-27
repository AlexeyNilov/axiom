import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApplication } from "../../src/application/create-application";
import { PrismaUnitOfWork } from "../../src/infrastructure/prisma/prisma-repositories";
import { prisma } from "../../src/infrastructure/prisma/prisma-client";

describe("Prisma persistence", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists and reloads the traceable study workflow", async () => {
    const ids = sequentialIds([
      "artwork-1",
      "session-1",
      "observation-1",
      "principle-1",
      "concept-1",
      "mapping-1",
      "experiment-1",
      "reflection-1",
    ]);
    const app = createApplication({
      repositories: new PrismaUnitOfWork(prisma),
      clock: () => new Date("2026-06-27T10:00:00.000Z"),
      ids,
    });

    const artwork = await app.createArtwork({
      title: "Composition VIII",
      artist: "Wassily Kandinsky",
      year: "1923",
      movement: "Abstract Art",
      imageUrl:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Kandinsky_-_Composition_8%2C_July_1923.jpg",
      imagePageUrl:
        "https://commons.wikimedia.org/wiki/File:Kandinsky_-_Composition_8,_July_1923.jpg",
      sourceUrl: "https://www.guggenheim.org/artwork/1924",
    });
    const session = await app.startStudySession({ artworkId: artwork.id });
    const observation = await app.recordObservation({
      studySessionId: session.id,
      text: "Several circles and lines overlap without a single central object.",
      tags: ["composition"],
    });
    const principle = await app.derivePrinciple({
      text: "A system can stay coherent without a single dominant center.",
      observationIds: [observation.id],
    });
    const concept = await app.createSoftwareConcept({ name: "Distributed Systems" });
    const mapping = await app.mapPrincipleToSoftwareConcept({
      principleId: principle.id,
      softwareConceptId: concept.id,
      rationale:
        "Distributed systems need local relationships that remain understandable without one controlling module.",
      confidence: "medium",
    });
    const experiment = await app.createExperiment({
      mappingId: mapping.id,
      hypothesis:
        "If service boundaries expose local responsibilities clearly, a central orchestration layer becomes less necessary.",
      task: "Move one orchestration decision into an explicit service contract.",
      expectedOutcome: "The dependency direction is easier to explain from the service boundary.",
    });
    await app.recordExperimentOutcome({
      experimentId: experiment.id,
      actualOutcome:
        "The service boundary became clearer, but cross-service naming still needed review.",
      reflectionText:
        "Decentralized coherence depends on local naming as much as structural separation.",
    });

    const persistedSession = await app.getStudySession({ studySessionId: session.id });
    const persistedPrinciple = await app.listPrinciples();
    const persistedReflections = await app.listReflections();

    expect(persistedSession.observations).toHaveLength(1);
    expect(persistedPrinciple[0]?.observationIds).toEqual([observation.id]);
    expect(persistedReflections[0]?.text).toContain("Decentralized coherence");
  });
});

async function cleanDatabase(): Promise<void> {
  await prisma.reflection.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.mapping.deleteMany();
  await prisma.softwareConcept.deleteMany();
  await prisma.principleObservation.deleteMany();
  await prisma.principle.deleteMany();
  await prisma.observation.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.artwork.deleteMany();
}

function sequentialIds(ids: string[]): () => string {
  let index = 0;

  return () => {
    const id = ids[index];
    index += 1;

    if (!id) {
      throw new Error("No test id configured");
    }

    return id;
  };
}
