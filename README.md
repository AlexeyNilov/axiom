# Axiom: Creative Companion for Software Architects

Focuses on extracting timeless principles.

Observation -> Axiom -> Architecture

## Vision

Creative Companion helps software architects develop better software by studying principles from visual art.

Rather than teaching art history, the application guides users through a structured thinking process:

```
Artwork
    ↓
Observation
    ↓
Principle
    ↓
Software Concept
    ↓
Experiment
    ↓
Reflection
```

Every insight remains traceable.

The system functions as a personal knowledge graph where observations become reusable design knowledge.

---

## Core Philosophy

The application is not an AI that invents ideas.

It is a thinking tool that helps users discover ideas.

AI acts as an assistant.

The user owns every observation, principle, mapping and experiment.

---

## MVP

The first release focuses on one workflow only.

1. Select artwork
2. Record observations
3. Extract design principles
4. Map principles to software concepts
5. Create implementation experiments
6. Reflect on results

No collaboration.

No social features.

No recommendation engine.

No automatic graph generation.

Everything should remain simple and explicit.

---

## Development Principles

* Specification Driven Development
* Test Driven Development
* Domain Driven Design (lightweight)
* Small iterative releases
* AI assists implementation but never owns business logic

---

## Repository Map

This repository now contains a persisted, workflow-first MVP shell for the core
study workflow. The implementation keeps business rules in Domain, orchestration
in Application, persistence behind repository interfaces and UI in Next.js
Presentation code.

### Root

* `README.md` - project overview, workflow, philosophy and repository map.
* `AGENTS.md` - instructions for AI coding agents working in this repo.
* `.gitignore` - ignore rules for the intended Next.js, TypeScript, Prisma and
  Playwright stack.
* `LICENSE` - project license.
* `package.json` - TypeScript and Vitest scripts for the Phase 1 implementation.
* `prisma/schema.prisma` - SQLite persistence schema for the explicit workflow
  relationships.
* `prisma/seed.mjs` - seeds the starter artwork, Kandinsky's Composition VIII.
* `tsconfig.json` - TypeScript compiler configuration.
* `vitest.config.ts` - Vitest test configuration.
* `playwright.config.ts` - browser workflow test configuration.

### Documentation

* `docs/vision.md` - problem framing, product vision and design principles.
* `docs/product-requirements.md` - functional and non-functional requirements.
* `docs/architecture.md` - layer boundaries, dependency rules and suggested
  implementation stack.
* `docs/development-process.md` - SDD/TDD workflow and implementation order.
* `docs/domain-model.md` - initial domain entities and their fields.
* `docs/knowledge-graph.md` - node types, edge types and graph flow.
* `docs/roadmap.md` - phased delivery plan from core domain to plugin
  ecosystem.
* `docs/engineering-principles.md` - engineering guardrails against
  architectural drift.

### Specifications

* `specs/study-session.feature` - study session creation, observation capture
  and completion behavior.
* `specs/principle-mapping.feature` - principle derivation and mapping
  rationale behavior.
* `specs/experiment.feature` - experiment creation and outcome/reflection
  behavior.

### Application Structure

Code follows the documented layer order:

1. `src/domain` - entities, value objects and business rules.
2. `src/application` - use cases, repository contracts and orchestration.
3. `src/infrastructure/memory` - in-memory repository implementations for fast
   application tests.
4. `src/infrastructure/prisma` - Prisma-backed repository implementations.
5. `app` - Next.js routes, server actions and workflow-first presentation.
6. `tests/domain` - focused domain rule tests.
7. `tests/application` - vertical application workflow tests.
8. `tests/infrastructure` - Prisma persistence tests.
9. `tests/e2e` - browser workflow tests.

Planned later layers:

1. Search and filtering behavior.
2. Knowledge graph visualization.
3. AI adapters for assistive suggestions.

### Commands

```bash
npm run db:push
npm run db:seed
npm run typecheck
npm test
npm run test:e2e
npm run dev
```

---

## Success Metric

A user should be able to study one artwork and produce one concrete software experiment in under 15 minutes.
