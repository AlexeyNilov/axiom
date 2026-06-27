import { describe, expect, it } from "vitest";
import { DomainError } from "../../src/domain/errors.js";
import { Experiment } from "../../src/domain/experiment.js";
import { Reflection } from "../../src/domain/reflection.js";

describe("Experiment and reflection rules", () => {
  it("keeps hypothesis, task, expected outcome, actual outcome, and status distinct", () => {
    const experiment = Experiment.create({
      id: "experiment-1",
      mappingId: "mapping-1",
      hypothesis:
        "If command boundaries mirror visual contrast, API usage becomes easier to scan.",
      task: "Split the command module by user intent.",
      expectedOutcome: "Developers identify the right command without reading all options.",
    });

    experiment.recordOutcome({
      actualOutcome: "Developers found the command faster but missed advanced options.",
      status: "completed",
    });

    expect(experiment.hypothesis).toContain("visual contrast");
    expect(experiment.task).toBe("Split the command module by user intent.");
    expect(experiment.expectedOutcome).toContain("identify the right command");
    expect(experiment.actualOutcome).toContain("missed advanced options");
    expect(experiment.status).toBe("completed");
  });

  it("requires reflection text to become searchable knowledge", () => {
    expect(() =>
      Reflection.create({
        id: "reflection-1",
        experimentId: "experiment-1",
        text: " ",
        createdAt: new Date("2026-06-27T10:00:00.000Z"),
      }),
    ).toThrow(DomainError);
  });
});
