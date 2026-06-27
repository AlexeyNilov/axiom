Feature: Principle Mapping

Scenario: Derive principle
  Given observations exist
  When a principle is created
  Then every principle references at least one observation

Scenario: Map principle
  Given a principle exists
  When it is mapped to a software concept
  Then rationale is required