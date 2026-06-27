import { Artwork } from "../domain/artwork";
import { Experiment } from "../domain/experiment";
import { Mapping } from "../domain/mapping";
import { Observation } from "../domain/observation";
import { Principle } from "../domain/principle";
import { Reflection } from "../domain/reflection";
import { SoftwareConcept } from "../domain/software-concept";
import { StudySession } from "../domain/study-session";
import { EntityId } from "../domain/types";

export type Repository<T> = {
  save(entity: T): Promise<void>;
  findById(id: EntityId): Promise<T | undefined>;
  list(): Promise<T[]>;
};

export type UnitOfWork = {
  artworks: Repository<Artwork>;
  studySessions: Repository<StudySession>;
  observations: Repository<Observation>;
  principles: Repository<Principle>;
  softwareConcepts: Repository<SoftwareConcept>;
  mappings: Repository<Mapping>;
  experiments: Repository<Experiment>;
  reflections: Repository<Reflection>;
};
