import { Artwork } from "../domain/artwork.js";
import { Experiment } from "../domain/experiment.js";
import { Mapping, MappingConfidence } from "../domain/mapping.js";
import { Principle } from "../domain/principle.js";
import { Reflection } from "../domain/reflection.js";
import { SoftwareConcept } from "../domain/software-concept.js";
import { StudySession } from "../domain/study-session.js";
import { Clock, EntityId, IdGenerator } from "../domain/types.js";
import { ApplicationError } from "./errors.js";
import { UnitOfWork } from "./repositories.js";

export type ApplicationDependencies = {
  repositories: UnitOfWork;
  clock: Clock;
  ids: IdGenerator;
};

export function createApplication(dependencies: ApplicationDependencies) {
  const { repositories, clock, ids } = dependencies;

  return {
    createArtwork(input: {
      title: string;
      artist?: string;
      year?: string;
      movement?: string;
      imageUrl?: string;
      sourceUrl?: string;
    }) {
      const artwork = Artwork.create({
        id: ids(),
        ...input,
      });

      repositories.artworks.save(artwork);
      return artwork;
    },

    startStudySession(input: { artworkId: EntityId }) {
      requireEntity(repositories.artworks.findById(input.artworkId), "Artwork");

      const studySession = StudySession.start({
        id: ids(),
        artworkId: input.artworkId,
        startedAt: clock(),
      });

      repositories.studySessions.save(studySession);
      return studySession;
    },

    recordObservation(input: {
      studySessionId: EntityId;
      text: string;
      tags?: string[];
    }) {
      const studySession = requireEntity(
        repositories.studySessions.findById(input.studySessionId),
        "Study session",
      );
      const observation = studySession.recordObservation({
        id: ids(),
        text: input.text,
        tags: input.tags,
      });

      repositories.studySessions.save(studySession);
      repositories.observations.save(observation);
      return observation;
    },

    completeStudySession(input: { studySessionId: EntityId }) {
      const studySession = requireEntity(
        repositories.studySessions.findById(input.studySessionId),
        "Study session",
      );

      studySession.complete(clock());
      repositories.studySessions.save(studySession);
      return studySession;
    },

    derivePrinciple(input: { text: string; observationIds: EntityId[] }) {
      for (const observationId of input.observationIds) {
        requireEntity(repositories.observations.findById(observationId), "Observation");
      }

      const principle = Principle.create({
        id: ids(),
        text: input.text,
        observationIds: input.observationIds,
      });

      repositories.principles.save(principle);
      return principle;
    },

    createSoftwareConcept(input: { name: string }) {
      const concept = SoftwareConcept.create({
        id: ids(),
        name: input.name,
      });

      repositories.softwareConcepts.save(concept);
      return concept;
    },

    mapPrincipleToSoftwareConcept(input: {
      principleId: EntityId;
      softwareConceptId: EntityId;
      rationale: string;
      confidence: MappingConfidence;
      notes?: string;
    }) {
      requireEntity(repositories.principles.findById(input.principleId), "Principle");
      requireEntity(
        repositories.softwareConcepts.findById(input.softwareConceptId),
        "Software concept",
      );

      const mapping = Mapping.create({
        id: ids(),
        ...input,
      });

      repositories.mappings.save(mapping);
      return mapping;
    },

    createExperiment(input: {
      mappingId: EntityId;
      hypothesis: string;
      task: string;
      expectedOutcome: string;
    }) {
      requireEntity(repositories.mappings.findById(input.mappingId), "Mapping");

      const experiment = Experiment.create({
        id: ids(),
        ...input,
      });

      repositories.experiments.save(experiment);
      return experiment;
    },

    recordExperimentOutcome(input: {
      experimentId: EntityId;
      actualOutcome: string;
      reflectionText: string;
    }) {
      const experiment = requireEntity(
        repositories.experiments.findById(input.experimentId),
        "Experiment",
      );

      experiment.recordOutcome({
        actualOutcome: input.actualOutcome,
        status: "completed",
      });
      const reflection = Reflection.create({
        id: ids(),
        experimentId: experiment.id,
        text: input.reflectionText,
        createdAt: clock(),
      });

      repositories.experiments.save(experiment);
      repositories.reflections.save(reflection);
      return { updatedExperiment: experiment, reflection };
    },
  };
}

function requireEntity<T>(entity: T | undefined, entityName: string): T {
  if (!entity) {
    throw new ApplicationError(`${entityName} was not found`);
  }

  return entity;
}
