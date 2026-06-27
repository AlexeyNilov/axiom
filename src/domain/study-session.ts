import { DomainError } from "./errors";
import { Observation, ObservationProps } from "./observation";
import { EntityId, requireNonEmptyText } from "./types";

export type StartStudySessionProps = {
  id: EntityId;
  artworkId: EntityId;
  startedAt: Date;
};

export class StudySession {
  private readonly recordedObservations: Observation[];
  private finishedAt?: Date;

  private constructor(
    readonly id: EntityId,
    readonly artworkId: EntityId,
    readonly startedAt: Date,
    observations: Observation[],
    completedAt?: Date,
  ) {
    this.recordedObservations = observations;
    this.finishedAt = completedAt;
  }

  static start(props: StartStudySessionProps): StudySession {
    return new StudySession(
      requireNonEmptyText(props.id, "Study session id"),
      requireNonEmptyText(props.artworkId, "Artwork id"),
      new Date(props.startedAt),
      [],
    );
  }

  static rehydrate(props: {
    id: EntityId;
    artworkId: EntityId;
    startedAt: Date;
    observations: Observation[];
    completedAt?: Date;
  }): StudySession {
    return new StudySession(
      requireNonEmptyText(props.id, "Study session id"),
      requireNonEmptyText(props.artworkId, "Artwork id"),
      new Date(props.startedAt),
      [...props.observations],
      props.completedAt ? new Date(props.completedAt) : undefined,
    );
  }

  get observations(): Observation[] {
    return [...this.recordedObservations];
  }

  get completedAt(): Date | undefined {
    return this.finishedAt ? new Date(this.finishedAt) : undefined;
  }

  get isCompleted(): boolean {
    return this.finishedAt !== undefined;
  }

  recordObservation(props: Omit<ObservationProps, "studySessionId">): Observation {
    if (this.isCompleted) {
      throw new DomainError("Completed study sessions are read-only");
    }

    const observation = Observation.create({
      ...props,
      studySessionId: this.id,
    });

    this.recordedObservations.push(observation);
    return observation;
  }

  complete(completedAt: Date): void {
    if (this.recordedObservations.length === 0) {
      throw new DomainError("A study session requires observations before completion");
    }

    this.finishedAt = new Date(completedAt);
  }
}
