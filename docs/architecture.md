# Architecture

## Layers

Presentation

↓

Application

↓

Domain

↓

Infrastructure

---

## Rules

Domain never depends on UI.

Domain never depends on AI.

Infrastructure depends on Domain.

Presentation depends on Application.

AI adapters are plugins.

---

## Suggested Stack

Frontend
- Next.js
- React
- TypeScript

Backend
- Next.js

Database
- SQLite for local-first MVP persistence.
- PostgreSQL remains a later migration option through Prisma and repository
  interfaces.

ORM
- Prisma

Testing
- Vitest
- Playwright

Graph

Initially relational.

Graph abstraction behind repository interfaces.

Later migration to Neo4j or RDF should not affect domain logic.
