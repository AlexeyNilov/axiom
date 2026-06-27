"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApplication } from "../src/presentation/application";

export async function startStudySessionAction(formData: FormData) {
  const artworkId = requiredString(formData, "artworkId");
  const app = getApplication();
  const session = await app.startStudySession({ artworkId });

  redirect(`/studies/${session.id}`);
}

export async function recordObservationAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const text = requiredString(formData, "text");
  const app = getApplication();

  await app.recordObservation({
    studySessionId,
    text,
  });

  revalidatePath(`/studies/${studySessionId}`);
}

export async function derivePrincipleAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const text = requiredString(formData, "text");
  const observationIds = formData
    .getAll("observationIds")
    .map((value) => value.toString())
    .filter(Boolean);
  const app = getApplication();

  await app.derivePrinciple({
    text,
    observationIds,
  });

  revalidatePath(`/studies/${studySessionId}`);
}

export async function mapPrincipleAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const principleId = requiredString(formData, "principleId");
  const conceptName = requiredString(formData, "conceptName");
  const rationale = requiredString(formData, "rationale");
  const confidence = requiredString(formData, "confidence") as
    | "low"
    | "medium"
    | "high";
  const app = getApplication();
  const concept = await app.createSoftwareConcept({ name: conceptName });

  await app.mapPrincipleToSoftwareConcept({
    principleId,
    softwareConceptId: concept.id,
    rationale,
    confidence,
  });

  revalidatePath(`/studies/${studySessionId}`);
}

export async function createExperimentAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const mappingId = requiredString(formData, "mappingId");
  const hypothesis = requiredString(formData, "hypothesis");
  const task = requiredString(formData, "task");
  const expectedOutcome = requiredString(formData, "expectedOutcome");
  const app = getApplication();

  await app.createExperiment({
    mappingId,
    hypothesis,
    task,
    expectedOutcome,
  });

  revalidatePath(`/studies/${studySessionId}`);
}

export async function recordExperimentOutcomeAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const experimentId = requiredString(formData, "experimentId");
  const actualOutcome = requiredString(formData, "actualOutcome");
  const reflectionText = requiredString(formData, "reflectionText");
  const app = getApplication();

  await app.recordExperimentOutcome({
    experimentId,
    actualOutcome,
    reflectionText,
  });

  revalidatePath(`/studies/${studySessionId}`);
}

export async function completeStudySessionAction(formData: FormData) {
  const studySessionId = requiredString(formData, "studySessionId");
  const app = getApplication();

  await app.completeStudySession({ studySessionId });

  revalidatePath(`/studies/${studySessionId}`);
}

function requiredString(formData: FormData, name: string): string {
  const value = formData.get(name)?.toString().trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}
