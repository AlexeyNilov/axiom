import { EntityId, requireNonEmptyText } from "./types.js";

export type ReflectionProps = {
  id: EntityId;
  experimentId: EntityId;
  text: string;
  createdAt: Date;
};

export class Reflection {
  private constructor(
    readonly id: EntityId,
    readonly experimentId: EntityId,
    readonly text: string,
    readonly createdAt: Date,
  ) {}

  static create(props: ReflectionProps): Reflection {
    return new Reflection(
      requireNonEmptyText(props.id, "Reflection id"),
      requireNonEmptyText(props.experimentId, "Experiment id"),
      requireNonEmptyText(props.text, "Reflection text"),
      new Date(props.createdAt),
    );
  }
}
