# Development Process

Development follows SDD and TDD.

Every feature begins with:

1. Requirement
2. Acceptance criteria
3. Feature specification
4. Unit tests
5. Domain implementation
6. Application layer
7. UI
8. Integration tests

Business rules always live inside the Domain layer.

No UI component may contain business logic.

Every entity should be introduced only when required by a failing specification.

Avoid speculative abstractions.

Prefer incremental evolution over premature generalization.