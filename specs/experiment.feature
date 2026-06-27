Feature: Experiments

Scenario: Create experiment
  Given a mapping exists
  When a hypothesis is defined
  Then an experiment is created

Scenario: Record outcome
  Given an experiment exists
  When results are recorded
  Then reflection becomes searchable