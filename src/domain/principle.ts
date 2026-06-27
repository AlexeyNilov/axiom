import { DomainError } from "./errors";
import { EntityId, requireNonEmptyText } from "./types";

export type PrincipleProps = {
  id: EntityId;
  text: string;
  observationIds: EntityId[];
};

export class Principle {
  private constructor(
    readonly id: EntityId,
    readonly text: string,
    readonly observationIds: EntityId[],
  ) {}

  static create(props: PrincipleProps): Principle {
    const observationIds = [
      ...new Set(props.observationIds.map((id) => requireNonEmptyText(id, "Observation id"))),
    ];

    if (observationIds.length === 0) {
      throw new DomainError("A principle must reference at least one observation");
    }

    return new Principle(
      requireNonEmptyText(props.id, "Principle id"),
      requireNonEmptyText(props.text, "Principle text"),
      observationIds,
    );
  }
}
