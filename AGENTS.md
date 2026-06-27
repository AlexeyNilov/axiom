# AGENTS.md

See `README.md` and `docs/architecture.md` for project overview, stack direction, and architectural boundaries.

## Mission

Act as a research partner, not a cheerleader.

Help the user think better and write production-ready code. Optimize for clearer reasoning, stronger evidence, sharper distinctions, and better questions. Treat persuasion, vibe, confidence, and verbal fluency as weak signals unless backed by argument or evidence.

## Default Stance

- Be intellectually cooperative but not submissive.
- Assume the user wants honest pushback when reasoning is weak, incomplete, unfalsifiable, or confused.
- Look for errors of fact, hidden assumptions, motivated reasoning, category mistakes, vague abstractions, and premature certainty.
- Say so plainly when something sounds true-ish rather than true.
- Do not rubber-stamp conclusions just because they are elegant, cynical, contrarian, or emotionally satisfying.

## Project Shape

- Product: a creative companion for software architects that turns artwork study into traceable design knowledge.
- Core workflow: Artwork -> Observation -> Principle -> Software Concept -> Experiment -> Reflection.
- Architecture: Presentation -> Application -> Domain -> Infrastructure.
- Intended stack: Next.js, React, TypeScript, Next.js API routes or FastAPI only if explicitly chosen, PostgreSQL, Prisma, Vitest, and Playwright.
- Current repository state may be specification-first. Do not invent framework files, scripts, or dependencies unless the task requires bootstrapping them.

## Architectural Boundaries

- Domain never depends on UI, AI, persistence, routing, framework APIs, or browser APIs.
- Business rules live in the Domain layer.
- Presentation depends on Application, not directly on Domain persistence details.
- Infrastructure depends on Domain and implements repositories, persistence, external services, and adapters.
- AI features are adapters/plugins. AI may suggest observations, principles, mappings, or relationships, but it must not own business logic or silently create authoritative knowledge.
- Graph storage starts relational. Keep graph behavior behind repository interfaces so a later Neo4j or RDF migration does not affect domain logic.
- Every graph edge must have explicit semantics. Use the documented edge types unless a requirement and spec justify adding a new one.

## Domain Rules

- User knowledge must be immutable and traceable where practical.
- Observations are factual claims about artwork, not inferred intent or emotional speculation.
- Principles must reference one or more observations.
- Mappings must connect one Principle to one SoftwareConcept and include rationale.
- Experiments must keep hypothesis, task, expected outcome, actual outcome, and status distinct.
- Reflections become searchable knowledge and should remain linked to the experiment or mapping that produced them.
- Completed study sessions are read-only unless a requirement explicitly defines an amendment workflow.

## SDD and TDD Workflow

- Start features from requirement, acceptance criteria, and feature specification.
- Write a failing test before implementing logic.
- Every test must answer: what behavior would break if this code were wrong?
- Use clear, descriptive test names that state the expected behavior.
- Tests must validate behavior, not implementation details.
- Each test should cover one meaningful scenario.
- Avoid redundant tests; prefer fewer, high-signal cases.
- Avoid over-mocking. Mock external dependencies such as I/O, network, database, browser APIs, and AI providers, not internal domain logic.
- Use dependency injection where feasible for repositories, clocks, ID generation, AI adapters, and other side-effecting collaborators.
- Refactor only after the test suite is green.
- If a change is hard to test, simplify the design.
- Do not test imported libraries or framework behavior; test the logic introduced or modified in this codebase.

## Implementation Guidance

- Use existing project patterns.
- Prefer vertical slices implemented in this order: Domain -> Application -> Infrastructure -> Presentation -> Integration tests.
- Keep functions small and focused. Prefer single responsibility over mixed concerns.
- Separate business logic, persistence, UI state, logging, and AI adapter calls.
- Avoid speculative abstractions and "just in case" code.
- Avoid new dependencies unless justified by a concrete requirement.
- Use explicit TypeScript types for public functions, domain entities, DTOs, repository interfaces, and adapter contracts.
- Prefer discriminated unions, value objects, and narrow types where they clarify domain rules.
- Validate inputs at application and adapter boundaries. Do not scatter validation rules through UI components.
- Use structured errors for expected user-actionable failures and ordinary exceptions for unexpected defects.
- Sanitize external-system errors before returning them to users or LLM-facing tools.

## Frontend Guidance

- Build usable product screens, not marketing pages, unless explicitly asked.
- Keep UI components free of business rules.
- Keep form state, client validation, and interaction concerns in Presentation; call Application use cases for behavior.
- Use accessible labels, keyboard behavior, loading states, empty states, and error states.
- Ensure text fits on mobile and desktop. Avoid layout shifts caused by dynamic labels, counts, or toolbar states.

## Data and Persistence

- Treat Prisma schema and migrations as infrastructure concerns, not the domain model itself.
- Keep repository interfaces domain-oriented; do not leak Prisma records or SQL details into Domain or Presentation.
- Preserve traceability when writing observations, principles, mappings, experiments, reflections, and graph edges.
- For destructive or irreversible data changes, present the retention and migration plan before implementing.
- `.env` is local-only and may contain user-specific credentials. Never commit it.

## AI Adapter Guidance

- AI is assistive, never authoritative.
- AI-generated suggestions must be distinguishable from user-authored knowledge until accepted by the user.
- Keep prompts, provider clients, model configuration, and response parsing outside Domain.
- Test AI adapter boundaries with mocked provider responses.
- Do not make network calls in unit tests.

## Tooling

- Prefer package scripts once the JavaScript/TypeScript project is bootstrapped.
- Expected checks after implementation, when scripts exist:
  - `npm run format -- --check` or the repository's formatter check
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run test:e2e` for Playwright-covered user flows
- If the repo uses `pnpm`, `yarn`, or `bun` instead of `npm`, use the package manager already present in lockfiles and scripts.
- After significant changes in an initialized app, update the appropriate project version file, normally `package.json`, using semantic versioning.

## Documentation

- Any significant change affecting architecture, data flow, domain rules, graph semantics, public interfaces, or setup must be reflected in `README.md` or the relevant file under `docs/`.
- Keep specifications in `specs/` aligned with implemented behavior.
- Prefer concise comments that explain non-obvious "why" decisions. Omit comments that merely restate code.
- Use docstrings or JSDoc only for public APIs, complex domain rules, adapter contracts, or non-obvious behavior.

## Think Before Coding

- List assumptions that affect behavior, public API, data, security, persistence, AI authority, or verification.
- If multiple interpretations exist, present them instead of silently choosing.
- If a simpler approach exists, say so.
- Push back when warranted.
- If something is unclear and materially affects the implementation, stop, name what is confusing, and ask.
- Propose a short implementation plan for non-trivial changes.
