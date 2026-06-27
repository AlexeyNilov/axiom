import { Artwork } from "../domain/artwork.js";
import { Experiment } from "../domain/experiment.js";
import { Mapping } from "../domain/mapping.js";
import { Observation } from "../domain/observation.js";
import { Principle } from "../domain/principle.js";
import { Reflection } from "../domain/reflection.js";
import { SoftwareConcept } from "../domain/software-concept.js";
import { StudySession } from "../domain/study-session.js";
import { EntityId } from "../domain/types.js";

export type Repository<T> = {
  save(entity: T): void;
  findById(id: EntityId): T | undefined;
  list(): T[];
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
