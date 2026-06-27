import { Artwork } from "../domain/artwork";
import { Experiment } from "../domain/experiment";
import { Mapping, MappingConfidence } from "../domain/mapping";
import { Principle } from "../domain/principle";
import { Reflection } from "../domain/reflection";
import { SoftwareConcept } from "../domain/software-concept";
import { StudySession } from "../domain/study-session";
import { Clock, EntityId, IdGenerator } from "../domain/types";
import { ApplicationError } from "./errors";
import { UnitOfWork } from "./repositories";

export type ApplicationDependencies = {
  repositories: UnitOfWork;
  clock: Clock;
  ids: IdGenerator;
};

export function createApplication(dependencies: ApplicationDependencies) {
  const { repositories, clock, ids } = dependencies;

  return {
    async listArtworks() {
      return repositories.artworks.list();
    },

    async getArtwork(input: { artworkId: EntityId }) {
      return requireEntity(
        await repositories.artworks.findById(input.artworkId),
        "Artwork",
      );
    },

    async createArtwork(input: {
      title: string;
      artist?: string;
      year?: string;
      movement?: string;
      imageUrl?: string;
      imagePageUrl?: string;
      sourceUrl?: string;
    }) {
      const artwork = Artwork.create({
        id: ids(),
        ...input,
      });

      await repositories.artworks.save(artwork);
      return artwork;
    },

    async listStudySessions() {
      return repositories.studySessions.list();
    },

    async getStudySession(input: { studySessionId: EntityId }) {
      return requireEntity(
        await repositories.studySessions.findById(input.studySessionId),
        "Study session",
      );
    },

    async startStudySession(input: { artworkId: EntityId }) {
      requireEntity(await repositories.artworks.findById(input.artworkId), "Artwork");

      const studySession = StudySession.start({
        id: ids(),
        artworkId: input.artworkId,
        startedAt: clock(),
      });

      await repositories.studySessions.save(studySession);
      return studySession;
    },

    async recordObservation(input: {
      studySessionId: EntityId;
      text: string;
      tags?: string[];
    }) {
      const studySession = requireEntity(
        await repositories.studySessions.findById(input.studySessionId),
        "Study session",
      );
      const observation = studySession.recordObservation({
        id: ids(),
        text: input.text,
        tags: input.tags,
      });

      await repositories.studySessions.save(studySession);
      await repositories.observations.save(observation);
      return observation;
    },

    async listObservations() {
      return repositories.observations.list();
    },

    async completeStudySession(input: { studySessionId: EntityId }) {
      const studySession = requireEntity(
        await repositories.studySessions.findById(input.studySessionId),
        "Study session",
      );

      studySession.complete(clock());
      await repositories.studySessions.save(studySession);
      return studySession;
    },

    async derivePrinciple(input: { text: string; observationIds: EntityId[] }) {
      for (const observationId of input.observationIds) {
        requireEntity(
          await repositories.observations.findById(observationId),
          "Observation",
        );
      }

      const principle = Principle.create({
        id: ids(),
        text: input.text,
        observationIds: input.observationIds,
      });

      await repositories.principles.save(principle);
      return principle;
    },

    async listPrinciples() {
      return repositories.principles.list();
    },

    async createSoftwareConcept(input: { name: string }) {
      const concept = SoftwareConcept.create({
        id: ids(),
        name: input.name,
      });

      await repositories.softwareConcepts.save(concept);
      return concept;
    },

    async listSoftwareConcepts() {
      return repositories.softwareConcepts.list();
    },

    async mapPrincipleToSoftwareConcept(input: {
      principleId: EntityId;
      softwareConceptId: EntityId;
      rationale: string;
      confidence: MappingConfidence;
      notes?: string;
    }) {
      requireEntity(
        await repositories.principles.findById(input.principleId),
        "Principle",
      );
      requireEntity(
        await repositories.softwareConcepts.findById(input.softwareConceptId),
        "Software concept",
      );

      const mapping = Mapping.create({
        id: ids(),
        ...input,
      });

      await repositories.mappings.save(mapping);
      return mapping;
    },

    async listMappings() {
      return repositories.mappings.list();
    },

    async createExperiment(input: {
      mappingId: EntityId;
      hypothesis: string;
      task: string;
      expectedOutcome: string;
    }) {
      requireEntity(await repositories.mappings.findById(input.mappingId), "Mapping");

      const experiment = Experiment.create({
        id: ids(),
        ...input,
      });

      await repositories.experiments.save(experiment);
      return experiment;
    },

    async listExperiments() {
      return repositories.experiments.list();
    },

    async recordExperimentOutcome(input: {
      experimentId: EntityId;
      actualOutcome: string;
      reflectionText: string;
    }) {
      const experiment = requireEntity(
        await repositories.experiments.findById(input.experimentId),
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

      await repositories.experiments.save(experiment);
      await repositories.reflections.save(reflection);
      return { updatedExperiment: experiment, reflection };
    },

    async listReflections() {
      return repositories.reflections.list();
    },
  };
}

function requireEntity<T>(entity: T | undefined, entityName: string): T {
  if (!entity) {
    throw new ApplicationError(`${entityName} was not found`);
  }

  return entity;
}
