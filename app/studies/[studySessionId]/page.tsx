import {
  completeStudySessionAction,
  createExperimentAction,
  derivePrincipleAction,
  mapPrincipleAction,
  recordExperimentOutcomeAction,
  recordObservationAction,
} from "../../actions";
import { getApplication } from "../../../src/presentation/application";

type PageProps = {
  params: Promise<{ studySessionId: string }>;
};

export const dynamic = "force-dynamic";

export default async function StudyPage({ params }: PageProps) {
  const { studySessionId } = await params;
  const app = getApplication();
  const session = await app.getStudySession({ studySessionId });
  const artwork = await app.getArtwork({ artworkId: session.artworkId });
  const principles = (await app.listPrinciples()).filter((principle) =>
    principle.observationIds.some((observationId) =>
      session.observations.some((observation) => observation.id === observationId),
    ),
  );
  const mappings = (await app.listMappings()).filter((mapping) =>
    principles.some((principle) => principle.id === mapping.principleId),
  );
  const concepts = await app.listSoftwareConcepts();
  const experiments = (await app.listExperiments()).filter((experiment) =>
    mappings.some((mapping) => mapping.id === experiment.mappingId),
  );
  const reflections = (await app.listReflections()).filter((reflection) =>
    experiments.some((experiment) => experiment.id === reflection.experimentId),
  );

  return (
    <div className="study-layout">
      <aside className="artwork-reference" data-testid="artwork-reference">
        <div className="artwork-reference-inner">
          <div className="stack">
            <p className="kicker">Active study</p>
            <h1>{artwork.title}</h1>
            <p className="meta">
              {[artwork.artist, artwork.year, artwork.movement]
                .filter(Boolean)
                .join(" / ")}
            </p>
            {session.isCompleted ? (
              <p className="status">Completed study sessions are read-only.</p>
            ) : null}
          </div>
          {artwork.imageUrl ? (
            <img
              className="artwork-image artwork-reference-image"
              src={artwork.imageUrl}
              alt={`${artwork.title} by ${artwork.artist ?? "unknown artist"}`}
            />
          ) : null}
          <div className="artwork-links">
            {artwork.sourceUrl ? (
              <a href={artwork.sourceUrl} rel="noreferrer" target="_blank">
                Guggenheim record
              </a>
            ) : null}
            {artwork.imagePageUrl ? (
              <a href={artwork.imagePageUrl} rel="noreferrer" target="_blank">
                Wikimedia file page
              </a>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="study-flow">
        <section className="section">
          <div className="section-header">
            <h2>Observations</h2>
            <p className="trace">{session.observations.length}</p>
          </div>
          <div className="grid">
            <div className="stack">
              {session.observations.length > 0 ? (
                session.observations.map((observation) => (
                  <article className="item" key={observation.id}>
                    <p>{observation.text}</p>
                  </article>
                ))
              ) : (
                <p className="empty">No observations recorded.</p>
              )}
            </div>
            <form action={recordObservationAction} className="stack">
              <input type="hidden" name="studySessionId" value={session.id} />
              <label>
                Observation
                <textarea name="text" required disabled={session.isCompleted} />
              </label>
              <button type="submit" disabled={session.isCompleted}>
                Record observation
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Principles</h2>
            <p className="trace">{principles.length}</p>
          </div>
          <div className="grid">
            <div className="stack">
              {principles.length > 0 ? (
                principles.map((principle) => (
                  <article className="item" key={principle.id}>
                    <p>{principle.text}</p>
                    <p className="trace">
                      Derived from {principle.observationIds.length} observation
                      {principle.observationIds.length === 1 ? "" : "s"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="empty">No principles derived.</p>
              )}
            </div>
            <form action={derivePrincipleAction} className="stack">
              <input type="hidden" name="studySessionId" value={session.id} />
              <fieldset className="checkbox-list" disabled={session.isCompleted}>
                <legend className="meta">Source observations</legend>
                {session.observations.map((observation) => (
                  <label className="checkbox-row" key={observation.id}>
                    <input type="checkbox" name="observationIds" value={observation.id} />
                    <span>{observation.text}</span>
                  </label>
                ))}
              </fieldset>
              <label>
                Principle
                <textarea
                  name="text"
                  required
                  disabled={session.isCompleted || session.observations.length === 0}
                />
              </label>
              <button
                type="submit"
                disabled={session.isCompleted || session.observations.length === 0}
              >
                Derive principle
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Mappings</h2>
            <p className="trace">{mappings.length}</p>
          </div>
          <div className="grid">
            <div className="stack">
              {mappings.length > 0 ? (
                mappings.map((mapping) => {
                  const concept = concepts.find(
                    (item) => item.id === mapping.softwareConceptId,
                  );
                  const principle = principles.find(
                    (item) => item.id === mapping.principleId,
                  );

                  return (
                    <article className="item" key={mapping.id}>
                      <h3>{concept?.name ?? "Software concept"}</h3>
                      <p>{mapping.rationale}</p>
                      <p className="trace">
                        {principle?.text ?? mapping.principleId} / {mapping.confidence}
                      </p>
                    </article>
                  );
                })
              ) : (
                <p className="empty">No mappings created.</p>
              )}
            </div>
            <form action={mapPrincipleAction} className="stack">
              <input type="hidden" name="studySessionId" value={session.id} />
              <label>
                Principle
                <select
                  name="principleId"
                  required
                  disabled={session.isCompleted || principles.length === 0}
                >
                  {principles.map((principle) => (
                    <option key={principle.id} value={principle.id}>
                      {principle.text}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Software concept
                <input
                  name="conceptName"
                  required
                  disabled={session.isCompleted || principles.length === 0}
                />
              </label>
              <label>
                Rationale
                <textarea
                  name="rationale"
                  required
                  disabled={session.isCompleted || principles.length === 0}
                />
              </label>
              <label>
                Confidence
                <select
                  name="confidence"
                  defaultValue="medium"
                  disabled={session.isCompleted || principles.length === 0}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={session.isCompleted || principles.length === 0}
              >
                Create mapping
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Experiments</h2>
            <p className="trace">{experiments.length}</p>
          </div>
          <div className="grid">
            <div className="stack">
              {experiments.length > 0 ? (
                experiments.map((experiment) => (
                  <article className="item" key={experiment.id}>
                    <h3>{experiment.hypothesis}</h3>
                    <p>{experiment.task}</p>
                    <p className="trace">
                      Expected: {experiment.expectedOutcome} / Status:{" "}
                      {experiment.status}
                    </p>
                    {experiment.actualOutcome ? <p>{experiment.actualOutcome}</p> : null}
                  </article>
                ))
              ) : (
                <p className="empty">No experiments created.</p>
              )}
            </div>
            <form action={createExperimentAction} className="stack">
              <input type="hidden" name="studySessionId" value={session.id} />
              <label>
                Mapping
                <select
                  name="mappingId"
                  required
                  disabled={session.isCompleted || mappings.length === 0}
                >
                  {mappings.map((mapping) => (
                    <option key={mapping.id} value={mapping.id}>
                      {mapping.rationale}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Hypothesis
                <textarea
                  name="hypothesis"
                  required
                  disabled={session.isCompleted || mappings.length === 0}
                />
              </label>
              <label>
                Task
                <textarea
                  name="task"
                  required
                  disabled={session.isCompleted || mappings.length === 0}
                />
              </label>
              <label>
                Expected outcome
                <textarea
                  name="expectedOutcome"
                  required
                  disabled={session.isCompleted || mappings.length === 0}
                />
              </label>
              <button
                type="submit"
                disabled={session.isCompleted || mappings.length === 0}
              >
                Create experiment
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Reflections</h2>
            <p className="trace">{reflections.length}</p>
          </div>
          <div className="grid">
            <div className="stack">
              {reflections.length > 0 ? (
                reflections.map((reflection) => (
                  <article className="item" key={reflection.id}>
                    <p>{reflection.text}</p>
                    <p className="trace">{formatDate(reflection.createdAt)}</p>
                  </article>
                ))
              ) : (
                <p className="empty">No reflections recorded.</p>
              )}
            </div>
            <form action={recordExperimentOutcomeAction} className="stack">
              <input type="hidden" name="studySessionId" value={session.id} />
              <label>
                Experiment
                <select
                  name="experimentId"
                  required
                  disabled={session.isCompleted || experiments.length === 0}
                >
                  {experiments.map((experiment) => (
                    <option key={experiment.id} value={experiment.id}>
                      {experiment.hypothesis}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Actual outcome
                <textarea
                  name="actualOutcome"
                  required
                  disabled={session.isCompleted || experiments.length === 0}
                />
              </label>
              <label>
                Reflection
                <textarea
                  name="reflectionText"
                  required
                  disabled={session.isCompleted || experiments.length === 0}
                />
              </label>
              <button
                type="submit"
                disabled={session.isCompleted || experiments.length === 0}
              >
                Record outcome
              </button>
            </form>
          </div>
        </section>

        <section className="section">
          <form action={completeStudySessionAction} className="actions">
            <input type="hidden" name="studySessionId" value={session.id} />
            <button
              type="submit"
              className="secondary"
              disabled={session.isCompleted || session.observations.length === 0}
            >
              Complete study
            </button>
            {session.completedAt ? (
              <p className="trace">Completed {formatDate(session.completedAt)}</p>
            ) : null}
          </form>
        </section>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
