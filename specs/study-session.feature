Feature: Study Session

Scenario: Create study session
  Given an artwork exists
  When a study session is started
  Then the study session is created

Scenario: Create study session from selected artwork
  Given multiple artworks exist
  When the user starts a study session from one artwork
  Then the study session is created for the selected artwork

Scenario: Add observation
  Given a study session exists
  When the user records an observation
  Then the observation belongs to the study session

Scenario: Complete study
  Given observations exist
  When the user completes the study
  Then the study becomes read-only
