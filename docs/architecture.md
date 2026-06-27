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
- Next.js API or FastAPI

Database
- PostgreSQL

ORM
- Prisma

Testing
- Vitest
- Playwright

Graph

Initially relational.

Graph abstraction behind repository interfaces.

Later migration to Neo4j or RDF should not affect domain logic.