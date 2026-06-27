import { EntityId, requireNonEmptyText } from "./types.js";

export type SoftwareConceptProps = {
  id: EntityId;
  name: string;
};

export class SoftwareConcept {
  private constructor(
    readonly id: EntityId,
    readonly name: string,
  ) {}

  static create(props: SoftwareConceptProps): SoftwareConcept {
    return new SoftwareConcept(
      requireNonEmptyText(props.id, "Software concept id"),
      requireNonEmptyText(props.name, "Software concept name"),
    );
  }
}
