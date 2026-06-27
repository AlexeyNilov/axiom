import { UnitOfWork } from "../../application/repositories";
import { Artwork } from "../../domain/artwork";
import { Experiment } from "../../domain/experiment";
import { Mapping } from "../../domain/mapping";
import { Observation } from "../../domain/observation";
import { Principle } from "../../domain/principle";
import { Reflection } from "../../domain/reflection";
import { SoftwareConcept } from "../../domain/software-concept";
import { StudySession } from "../../domain/study-session";
import { InMemoryRepository } from "./in-memory-repository";

export class InMemoryUnitOfWork implements UnitOfWork {
  readonly artworks = new InMemoryRepository<Artwork>();
  readonly studySessions = new InMemoryRepository<StudySession>();
  readonly observations = new InMemoryRepository<Observation>();
  readonly principles = new InMemoryRepository<Principle>();
  readonly softwareConcepts = new InMemoryRepository<SoftwareConcept>();
  readonly mappings = new InMemoryRepository<Mapping>();
  readonly experiments = new InMemoryRepository<Experiment>();
  readonly reflections = new InMemoryRepository<Reflection>();
}
