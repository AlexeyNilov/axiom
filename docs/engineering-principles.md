This document acts as a guardrail against architectural drift as the project grows.

- Domain-first architecture.
- AI as an adapter, never part of the domain model.
- All user knowledge is immutable and traceable.
- Every graph edge has explicit semantics.
- Features are implemented vertically (domain → application → UI) in small increments.
- Every new capability starts with a failing specification and accompanying tests.