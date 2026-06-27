# Domain Model

## Entities

### Artwork

Represents one visual artwork.

Fields

* id
* title
* artist
* year
* movement
* imageUrl
* sourceUrl

---

### StudySession

Owns an analysis of one artwork.

Fields

* id
* artworkId
* startedAt
* completedAt

---

### Observation

Represents an objective observation.

Fields

* id
* studySessionId
* text
* tags

---

### Principle

Generalized design knowledge.

Fields

* id
* text
* observationIds

---

### SoftwareConcept

Represents reusable software topics.

Examples

* Modularity
* Encapsulation
* Domain Model
* UX
* API Design

---

### Mapping

Connects one Principle to one SoftwareConcept.

Fields

* rationale
* confidence
* notes

---

### Experiment

Represents a software experiment.

Fields

* hypothesis
* task
* status
* outcome

---

### Reflection

Captures learning after experimentation.
