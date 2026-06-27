import { UnitOfWork } from "../../application/repositories.js";
import { Artwork } from "../../domain/artwork.js";
import { Experiment } from "../../domain/experiment.js";
import { Mapping } from "../../domain/mapping.js";
import { Observation } from "../../domain/observation.js";
import { Principle } from "../../domain/principle.js";
import { Reflection } from "../../domain/reflection.js";
import { SoftwareConcept } from "../../domain/software-concept.js";
import { StudySession } from "../../domain/study-session.js";
import { InMemoryRepository } from "./in-memory-repository.js";

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
