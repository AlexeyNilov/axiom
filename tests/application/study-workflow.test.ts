import { describe, expect, it } from "vitest";
import { createApplication } from "../../src/application/create-application.js";
import { ApplicationError } from "../../src/application/errors.js";
import { InMemoryUnitOfWork } from "../../src/infrastructure/memory/in-memory-unit-of-work.js";

describe("Phase 1 study workflow", () => {
  it("keeps artwork study knowledge traceable across the core workflow", () => {
    const app = createApplication({
      repositories: new InMemoryUnitOfWork(),
      clock: () => new Date("2026-06-27T10:00:00.000Z"),
      ids: sequentialIds([
        "artwork-1",
        "session-1",
        "observation-1",
        "principle-1",
        "concept-1",
        "mapping-1",
        "experiment-1",
        "reflection-1",
      ]),
    });

    const artwork = app.createArtwork({
      title: "Composition With Red, Blue and Yellow",
      artist: "Piet Mondrian",
      year: "1930",
    });
    const session = app.startStudySession({ artworkId: artwork.id });
    const observation = app.recordObservation({
      studySessionId: session.id,
      text: "Primary color blocks are separated by black lines.",
      tags: ["composition"],
    });
    const principle = app.derivePrinciple({
      text: "Boundaries clarify relationships between parts.",
      observationIds: [observation.id],
    });
    const concept = app.createSoftwareConcept({ name: "Module Boundaries" });
    const mapping = app.mapPrincipleToSoftwareConcept({
      principleId: principle.id,
      softwareConceptId: concept.id,
      rationale:
        "Explicit module boundaries make dependency relationships easier to reason about.",
      confidence: "high",
    });
    const experiment = app.createExperiment({
      mappingId: mapping.id,
      hypothesis:
        "If module boundaries are explicit, onboarding developers will trace dependencies faster.",
      task: "Split the payment package into ports, adapters, and domain modules.",
      expectedOutcome: "A developer can identify allowed dependency direction in one pass.",
    });
    const { updatedExperiment, reflection } = app.recordExperimentOutcome({
      experimentId: experiment.id,
      actualOutcome:
        "Dependency direction became obvious, but package names need clearer verbs.",
      reflectionText:
        "Visual boundaries transfer best when software boundaries are both structural and named well.",
    });

    expect(reflection.experimentId).toBe(experiment.id);
    expect(updatedExperiment.actualOutcome).toContain("Dependency direction");
    expect(principle.observationIds).toEqual([observation.id]);
    expect(mapping.principleId).toBe(principle.id);
  });

  it("does not start a study session for missing artwork", () => {
    const app = createApplication({
      repositories: new InMemoryUnitOfWork(),
      clock: () => new Date("2026-06-27T10:00:00.000Z"),
      ids: sequentialIds(["session-1"]),
    });

    expect(() => app.startStudySession({ artworkId: "missing-artwork" })).toThrow(
      ApplicationError,
    );
  });

  it("requires derived principles to reference existing observations", () => {
    const app = createApplication({
      repositories: new InMemoryUnitOfWork(),
      clock: () => new Date("2026-06-27T10:00:00.000Z"),
      ids: sequentialIds(["principle-1"]),
    });

    expect(() =>
      app.derivePrinciple({
        text: "Hierarchy emerges from contrast.",
        observationIds: ["missing-observation"],
      }),
    ).toThrow(ApplicationError);
  });
});

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
