import { EntityId, requireNonEmptyText } from "./types.js";

export type ExperimentStatus = "planned" | "running" | "completed";

export type ExperimentProps = {
  id: EntityId;
  mappingId: EntityId;
  hypothesis: string;
  task: string;
  expectedOutcome: string;
  actualOutcome?: string;
  status?: ExperimentStatus;
};

export class Experiment {
  readonly id: EntityId;
  readonly mappingId: EntityId;
  readonly hypothesis: string;
  readonly task: string;
  readonly expectedOutcome: string;
  actualOutcome?: string;
  status: ExperimentStatus;

  private constructor(props: Required<Omit<ExperimentProps, "actualOutcome" | "status">> & {
    actualOutcome?: string;
    status: ExperimentStatus;
  }) {
    this.id = props.id;
    this.mappingId = props.mappingId;
    this.hypothesis = props.hypothesis;
    this.task = props.task;
    this.expectedOutcome = props.expectedOutcome;
    this.actualOutcome = props.actualOutcome;
    this.status = props.status;
  }

  static create(props: ExperimentProps): Experiment {
    return new Experiment({
      id: requireNonEmptyText(props.id, "Experiment id"),
      mappingId: requireNonEmptyText(props.mappingId, "Mapping id"),
      hypothesis: requireNonEmptyText(props.hypothesis, "Experiment hypothesis"),
      task: requireNonEmptyText(props.task, "Experiment task"),
      expectedOutcome: requireNonEmptyText(
        props.expectedOutcome,
        "Experiment expected outcome",
      ),
      actualOutcome: props.actualOutcome?.trim(),
      status: props.status ?? "planned",
    });
  }

  recordOutcome(props: { actualOutcome: string; status: Exclude<ExperimentStatus, "planned"> }): void {
    this.actualOutcome = requireNonEmptyText(
      props.actualOutcome,
      "Experiment actual outcome",
    );
    this.status = props.status;
  }
}
