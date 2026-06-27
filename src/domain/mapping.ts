import { EntityId, requireNonEmptyText } from "./types";

export type MappingConfidence = "low" | "medium" | "high";

export type MappingProps = {
  id: EntityId;
  principleId: EntityId;
  softwareConceptId: EntityId;
  rationale: string;
  confidence: MappingConfidence;
  notes?: string;
};

export class Mapping {
  private constructor(
    readonly id: EntityId,
    readonly principleId: EntityId,
    readonly softwareConceptId: EntityId,
    readonly rationale: string,
    readonly confidence: MappingConfidence,
    readonly notes?: string,
  ) {}

  static create(props: MappingProps): Mapping {
    return new Mapping(
      requireNonEmptyText(props.id, "Mapping id"),
      requireNonEmptyText(props.principleId, "Principle id"),
      requireNonEmptyText(props.softwareConceptId, "Software concept id"),
      requireNonEmptyText(props.rationale, "Mapping rationale"),
      props.confidence,
      props.notes?.trim(),
    );
  }
}
