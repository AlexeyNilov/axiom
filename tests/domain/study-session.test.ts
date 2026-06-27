import { describe, expect, it } from "vitest";
import { DomainError } from "../../src/domain/errors";
import { StudySession } from "../../src/domain/study-session";

describe("StudySession", () => {
  it("records observations as user-authored claims owned by the study session", () => {
    const session = StudySession.start({
      id: "session-1",
      artworkId: "artwork-1",
      startedAt: new Date("2026-06-27T10:00:00.000Z"),
    });

    const observation = session.recordObservation({
      id: "observation-1",
      text: "Three circles dominate the composition.",
      tags: ["composition"],
    });

    expect(observation).toMatchObject({
      id: "observation-1",
      studySessionId: "session-1",
      text: "Three circles dominate the composition.",
      tags: ["composition"],
    });
    expect(session.observations).toHaveLength(1);
  });

  it("rejects completion until the session contains at least one observation", () => {
    const session = StudySession.start({
      id: "session-1",
      artworkId: "artwork-1",
      startedAt: new Date("2026-06-27T10:00:00.000Z"),
    });

    expect(() =>
      session.complete(new Date("2026-06-27T10:05:00.000Z")),
    ).toThrow(DomainError);
  });

  it("prevents observation changes after completion", () => {
    const session = StudySession.start({
      id: "session-1",
      artworkId: "artwork-1",
      startedAt: new Date("2026-06-27T10:00:00.000Z"),
    });
    session.recordObservation({
      id: "observation-1",
      text: "Three circles dominate the composition.",
      tags: [],
    });

    session.complete(new Date("2026-06-27T10:05:00.000Z"));

    expect(() =>
      session.recordObservation({
        id: "observation-2",
        text: "The background is divided into high contrast regions.",
        tags: [],
      }),
    ).toThrow(DomainError);
  });
});
