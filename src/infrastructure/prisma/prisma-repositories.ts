import { PrismaClient } from "@prisma/client";
import { Repository, UnitOfWork } from "../../application/repositories";
import { Artwork } from "../../domain/artwork";
import { Experiment, ExperimentStatus } from "../../domain/experiment";
import { Mapping, MappingConfidence } from "../../domain/mapping";
import { Observation } from "../../domain/observation";
import { Principle } from "../../domain/principle";
import { Reflection } from "../../domain/reflection";
import { SoftwareConcept } from "../../domain/software-concept";
import { StudySession } from "../../domain/study-session";
import { EntityId } from "../../domain/types";

export class PrismaUnitOfWork implements UnitOfWork {
  readonly artworks: Repository<Artwork>;
  readonly studySessions: Repository<StudySession>;
  readonly observations: Repository<Observation>;
  readonly principles: Repository<Principle>;
  readonly softwareConcepts: Repository<SoftwareConcept>;
  readonly mappings: Repository<Mapping>;
  readonly experiments: Repository<Experiment>;
  readonly reflections: Repository<Reflection>;

  constructor(client: PrismaClient) {
    this.artworks = new PrismaArtworkRepository(client);
    this.studySessions = new PrismaStudySessionRepository(client);
    this.observations = new PrismaObservationRepository(client);
    this.principles = new PrismaPrincipleRepository(client);
    this.softwareConcepts = new PrismaSoftwareConceptRepository(client);
    this.mappings = new PrismaMappingRepository(client);
    this.experiments = new PrismaExperimentRepository(client);
    this.reflections = new PrismaReflectionRepository(client);
  }
}

class PrismaArtworkRepository implements Repository<Artwork> {
  constructor(private readonly client: PrismaClient) {}

  async save(artwork: Artwork): Promise<void> {
    await this.client.artwork.upsert({
      where: { id: artwork.id },
      create: serializeArtwork(artwork),
      update: serializeArtwork(artwork),
    });
  }

  async findById(id: EntityId): Promise<Artwork | undefined> {
    const artwork = await this.client.artwork.findUnique({ where: { id } });
    return artwork ? deserializeArtwork(artwork) : undefined;
  }

  async list(): Promise<Artwork[]> {
    const artworks = await this.client.artwork.findMany({ orderBy: { title: "asc" } });
    return artworks.map(deserializeArtwork);
  }
}

class PrismaStudySessionRepository implements Repository<StudySession> {
  constructor(private readonly client: PrismaClient) {}

  async save(studySession: StudySession): Promise<void> {
    await this.client.studySession.upsert({
      where: { id: studySession.id },
      create: {
        id: studySession.id,
        artworkId: studySession.artworkId,
        startedAt: studySession.startedAt,
        completedAt: studySession.completedAt,
      },
      update: {
        artworkId: studySession.artworkId,
        startedAt: studySession.startedAt,
        completedAt: studySession.completedAt,
      },
    });
  }

  async findById(id: EntityId): Promise<StudySession | undefined> {
    const studySession = await this.client.studySession.findUnique({
      where: { id },
      include: { observations: true },
    });

    return studySession
      ? StudySession.rehydrate({
          id: studySession.id,
          artworkId: studySession.artworkId,
          startedAt: studySession.startedAt,
          completedAt: studySession.completedAt ?? undefined,
          observations: studySession.observations.map(deserializeObservation),
        })
      : undefined;
  }

  async list(): Promise<StudySession[]> {
    const studySessions = await this.client.studySession.findMany({
      include: { observations: true },
      orderBy: { startedAt: "desc" },
    });

    return studySessions.map((studySession) =>
      StudySession.rehydrate({
        id: studySession.id,
        artworkId: studySession.artworkId,
        startedAt: studySession.startedAt,
        completedAt: studySession.completedAt ?? undefined,
        observations: studySession.observations.map(deserializeObservation),
      }),
    );
  }
}

class PrismaObservationRepository implements Repository<Observation> {
  constructor(private readonly client: PrismaClient) {}

  async save(observation: Observation): Promise<void> {
    await this.client.observation.upsert({
      where: { id: observation.id },
      create: serializeObservation(observation),
      update: serializeObservation(observation),
    });
  }

  async findById(id: EntityId): Promise<Observation | undefined> {
    const observation = await this.client.observation.findUnique({ where: { id } });
    return observation ? deserializeObservation(observation) : undefined;
  }

  async list(): Promise<Observation[]> {
    const observations = await this.client.observation.findMany({ orderBy: { id: "asc" } });
    return observations.map(deserializeObservation);
  }
}

class PrismaPrincipleRepository implements Repository<Principle> {
  constructor(private readonly client: PrismaClient) {}

  async save(principle: Principle): Promise<void> {
    await this.client.principle.upsert({
      where: { id: principle.id },
      create: {
        id: principle.id,
        text: principle.text,
      },
      update: {
        text: principle.text,
      },
    });
    await this.client.principleObservation.deleteMany({
      where: { principleId: principle.id },
    });
    await Promise.all(
      principle.observationIds.map((observationId) =>
        this.client.principleObservation.create({
          data: {
            principleId: principle.id,
            observationId,
          },
        }),
      ),
    );
  }

  async findById(id: EntityId): Promise<Principle | undefined> {
    const principle = await this.client.principle.findUnique({
      where: { id },
      include: { observations: true },
    });

    return principle
      ? Principle.create({
          id: principle.id,
          text: principle.text,
          observationIds: principle.observations.map((link) => link.observationId),
        })
      : undefined;
  }

  async list(): Promise<Principle[]> {
    const principles = await this.client.principle.findMany({
      include: { observations: true },
      orderBy: { id: "asc" },
    });

    return principles.map((principle) =>
      Principle.create({
        id: principle.id,
        text: principle.text,
        observationIds: principle.observations.map((link) => link.observationId),
      }),
    );
  }
}

class PrismaSoftwareConceptRepository implements Repository<SoftwareConcept> {
  constructor(private readonly client: PrismaClient) {}

  async save(concept: SoftwareConcept): Promise<void> {
    await this.client.softwareConcept.upsert({
      where: { id: concept.id },
      create: { id: concept.id, name: concept.name },
      update: { name: concept.name },
    });
  }

  async findById(id: EntityId): Promise<SoftwareConcept | undefined> {
    const concept = await this.client.softwareConcept.findUnique({ where: { id } });
    return concept ? SoftwareConcept.create(concept) : undefined;
  }

  async list(): Promise<SoftwareConcept[]> {
    const concepts = await this.client.softwareConcept.findMany({
      orderBy: { name: "asc" },
    });
    return concepts.map(SoftwareConcept.create);
  }
}

class PrismaMappingRepository implements Repository<Mapping> {
  constructor(private readonly client: PrismaClient) {}

  async save(mapping: Mapping): Promise<void> {
    await this.client.mapping.upsert({
      where: { id: mapping.id },
      create: serializeMapping(mapping),
      update: serializeMapping(mapping),
    });
  }

  async findById(id: EntityId): Promise<Mapping | undefined> {
    const mapping = await this.client.mapping.findUnique({ where: { id } });
    return mapping ? deserializeMapping(mapping) : undefined;
  }

  async list(): Promise<Mapping[]> {
    const mappings = await this.client.mapping.findMany({ orderBy: { id: "asc" } });
    return mappings.map(deserializeMapping);
  }
}

class PrismaExperimentRepository implements Repository<Experiment> {
  constructor(private readonly client: PrismaClient) {}

  async save(experiment: Experiment): Promise<void> {
    await this.client.experiment.upsert({
      where: { id: experiment.id },
      create: serializeExperiment(experiment),
      update: serializeExperiment(experiment),
    });
  }

  async findById(id: EntityId): Promise<Experiment | undefined> {
    const experiment = await this.client.experiment.findUnique({ where: { id } });
    return experiment ? deserializeExperiment(experiment) : undefined;
  }

  async list(): Promise<Experiment[]> {
    const experiments = await this.client.experiment.findMany({ orderBy: { id: "asc" } });
    return experiments.map(deserializeExperiment);
  }
}

class PrismaReflectionRepository implements Repository<Reflection> {
  constructor(private readonly client: PrismaClient) {}

  async save(reflection: Reflection): Promise<void> {
    await this.client.reflection.upsert({
      where: { id: reflection.id },
      create: serializeReflection(reflection),
      update: serializeReflection(reflection),
    });
  }

  async findById(id: EntityId): Promise<Reflection | undefined> {
    const reflection = await this.client.reflection.findUnique({ where: { id } });
    return reflection ? deserializeReflection(reflection) : undefined;
  }

  async list(): Promise<Reflection[]> {
    const reflections = await this.client.reflection.findMany({
      orderBy: { createdAt: "desc" },
    });
    return reflections.map(deserializeReflection);
  }
}

function serializeArtwork(artwork: Artwork) {
  return {
    id: artwork.id,
    title: artwork.title,
    artist: artwork.artist,
    year: artwork.year,
    movement: artwork.movement,
    imageUrl: artwork.imageUrl,
    imagePageUrl: artwork.imagePageUrl,
    sourceUrl: artwork.sourceUrl,
  };
}

function deserializeArtwork(record: {
  id: string;
  title: string;
  artist: string | null;
  year: string | null;
  movement: string | null;
  imageUrl: string | null;
  imagePageUrl: string | null;
  sourceUrl: string | null;
}): Artwork {
  return Artwork.create({
    id: record.id,
    title: record.title,
    artist: record.artist ?? undefined,
    year: record.year ?? undefined,
    movement: record.movement ?? undefined,
    imageUrl: record.imageUrl ?? undefined,
    imagePageUrl: record.imagePageUrl ?? undefined,
    sourceUrl: record.sourceUrl ?? undefined,
  });
}

function serializeObservation(observation: Observation) {
  return {
    id: observation.id,
    studySessionId: observation.studySessionId,
    text: observation.text,
    tagsJson: JSON.stringify(observation.tags),
  };
}

function deserializeObservation(record: {
  id: string;
  studySessionId: string;
  text: string;
  tagsJson: string;
}): Observation {
  return Observation.create({
    id: record.id,
    studySessionId: record.studySessionId,
    text: record.text,
    tags: parseTags(record.tagsJson),
  });
}

function serializeMapping(mapping: Mapping) {
  return {
    id: mapping.id,
    principleId: mapping.principleId,
    softwareConceptId: mapping.softwareConceptId,
    rationale: mapping.rationale,
    confidence: mapping.confidence,
    notes: mapping.notes,
  };
}

function deserializeMapping(record: {
  id: string;
  principleId: string;
  softwareConceptId: string;
  rationale: string;
  confidence: string;
  notes: string | null;
}): Mapping {
  return Mapping.create({
    id: record.id,
    principleId: record.principleId,
    softwareConceptId: record.softwareConceptId,
    rationale: record.rationale,
    confidence: record.confidence as MappingConfidence,
    notes: record.notes ?? undefined,
  });
}

function serializeExperiment(experiment: Experiment) {
  return {
    id: experiment.id,
    mappingId: experiment.mappingId,
    hypothesis: experiment.hypothesis,
    task: experiment.task,
    expectedOutcome: experiment.expectedOutcome,
    actualOutcome: experiment.actualOutcome,
    status: experiment.status,
  };
}

function deserializeExperiment(record: {
  id: string;
  mappingId: string;
  hypothesis: string;
  task: string;
  expectedOutcome: string;
  actualOutcome: string | null;
  status: string;
}): Experiment {
  return Experiment.create({
    id: record.id,
    mappingId: record.mappingId,
    hypothesis: record.hypothesis,
    task: record.task,
    expectedOutcome: record.expectedOutcome,
    actualOutcome: record.actualOutcome ?? undefined,
    status: record.status as ExperimentStatus,
  });
}

function serializeReflection(reflection: Reflection) {
  return {
    id: reflection.id,
    experimentId: reflection.experimentId,
    text: reflection.text,
    createdAt: reflection.createdAt,
  };
}

function deserializeReflection(record: {
  id: string;
  experimentId: string;
  text: string;
  createdAt: Date;
}): Reflection {
  return Reflection.create(record);
}

function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}
