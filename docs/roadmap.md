# Roadmap

## Phase 1

Status: implemented as a tested Domain/Application slice.

Scope:

- Core domain entities for the workflow:
  Artwork -> Observation -> Principle -> Software Concept -> Experiment -> Reflection.
- Study session lifecycle:
  start session, record observations, complete session.
- Traceability rules:
  principles reference observations, mappings connect one principle to one
  software concept, reflections link to experiments.
- Domain constraints:
  completed study sessions are read-only, principles require observations,
  mappings require rationale, experiments keep hypothesis, task, expected
  outcome, actual outcome and status distinct.
- Application use cases with in-memory repositories.
- Vitest coverage for domain rules and the Phase 1 study workflow.

Delivered later in Phase 1.5:

- Presentation/UI.
- Database persistence.

Deferred:

- Search implementation beyond repository-held reflection text.
- Knowledge graph visualization.
- Tags/filtering UI.
- AI assistance.

## Phase 1.5

Status: implemented as a persisted workflow-first MVP shell.

Scope:

- Prisma persistence over SQLite behind repository interfaces.
- Seeded starter artwork: Wassily Kandinsky, Composition VIII.
- Clean artwork media fields:
  renderable image URL, image page URL and source record URL remain distinct.
- Next.js presentation for the guided workflow instead of generic CRUD screens.
- Server actions call Application use cases; UI does not import Prisma directly.
- Playwright happy-path coverage for the traceable study workflow.

---

## Phase 2

Knowledge graph visualization

Search

Tags

Filtering

---

## Phase 3

AI assistant

Observation prompts

Principle suggestions

Relationship suggestions

---

## Phase 4

Personal learning analytics

Repeated patterns

Favorite principles

Project recommendations

---

## Phase 5

Large artwork catalog

Museum integrations

Community knowledge

Plugin ecosystem
