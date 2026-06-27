import { describe, expect, it } from "vitest";
import { DomainError } from "../../src/domain/errors.js";
import { Mapping } from "../../src/domain/mapping.js";
import { Principle } from "../../src/domain/principle.js";
import { SoftwareConcept } from "../../src/domain/software-concept.js";

describe("Principle and mapping rules", () => {
  it("requires every principle to reference at least one observation", () => {
    expect(() =>
      Principle.create({
        id: "principle-1",
        text: "Hierarchy emerges from contrast.",
        observationIds: [],
      }),
    ).toThrow(DomainError);
  });

  it("creates a traceable principle from observations", () => {
    const principle = Principle.create({
      id: "principle-1",
      text: "Hierarchy emerges from contrast.",
      observationIds: ["observation-1", "observation-2"],
    });

    expect(principle.observationIds).toEqual([
      "observation-1",
      "observation-2",
    ]);
  });

  it("requires rationale when mapping a principle to a software concept", () => {
    const concept = SoftwareConcept.create({
      id: "concept-1",
      name: "API Design",
    });

    expect(() =>
      Mapping.create({
        id: "mapping-1",
        principleId: "principle-1",
        softwareConceptId: concept.id,
        rationale: " ",
        confidence: "medium",
        notes: undefined,
      }),
    ).toThrow(DomainError);
  });
});
