import { EntityId, requireNonEmptyText } from "./types.js";

export type ObservationProps = {
  id: EntityId;
  studySessionId: EntityId;
  text: string;
  tags?: string[];
};

export class Observation {
  private constructor(
    readonly id: EntityId,
    readonly studySessionId: EntityId,
    readonly text: string,
    readonly tags: string[],
  ) {}

  static create(props: ObservationProps): Observation {
    const tags = [...new Set((props.tags ?? []).map((tag) => tag.trim()).filter(Boolean))];

    return new Observation(
      requireNonEmptyText(props.id, "Observation id"),
      requireNonEmptyText(props.studySessionId, "Study session id"),
      requireNonEmptyText(props.text, "Observation text"),
      tags,
    );
  }
}
