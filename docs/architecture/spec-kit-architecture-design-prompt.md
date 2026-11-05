# Spec Kit Architecture & Design Prompt

Project: **SplitSmart**
Repository: `sakibkabir11/Lab-6`

## 0. Shared preparation and ground rules

Before either generator runs:

1. Work from the repository's current target branch and record its commit SHA.
2. Read the complete project constitution at `.specify/memory/constitution.md`.
3. Locate and read the **latest clarified feature specification** (the `spec.md` that has already completed the Clarify step). Do not assume its path or select an obsolete/template copy. If more than one candidate exists, list them and identify the authoritative one from project structure, feature directory, references, and modification history; ask the user if ambiguity remains.
4. Read relevant existing project artifacts, including customer source requirements (notably `UserRequirement.md` if present), README/build files, existing code, tests, and any existing architecture/design documents. Do not invent missing inputs.
5. Create an input-baseline note containing: branch, commit SHA, exact paths read, and any missing/ambiguous inputs.
6. Treat the constitution and clarified customer specification as authoritative. Existing code is evidence of current state, not permission to silently change requirements.
7. Distinguish **customer requirements**, **technical constraints mandated by the constitution**, **design decisions**, **assumptions**, and **open questions**. Every nontrivial design decision must include its rationale and requirement/constitution traceability.
8. Do not implement application code, modify the specification or constitution, add dependencies, or commit/merge anything during architecture/design generation.
9. Do not fabricate requirements, APIs, data fields, business rules, acceptance criteria, or technology choices. If information is absent, mark it as an explicit question or assumption and explain the impact.
10. Preserve financial correctness: monetary values use `BigDecimal`, never `float` or `double`; define scale, rounding, currency, and allocation behavior only where supported by requirements, otherwise raise questions.
11. Keep Swing UI concerns separate from domain/business logic. Use Java 21, Maven, JUnit 5, OOP, separation of concerns, and PlantUML where diagrams are useful, as required by the constitution.
12. Human review is mandatory. Label generated artifacts as proposals pending review.

---

## 1. Prompt for Spec Kit

Paste this into the Spec Kit workflow after confirming that the repository is at the intended baseline. If using the standard Spec Kit command workflow, invoke the planning step (for example, `/speckit.plan`) with this instruction as its task context. Follow the installed Spec Kit command conventions; do not invent unsupported slash commands.

### SPEC KIT PROMPT — generate Architecture and Design proposal

You are the architecture/design analyst for the SplitSmart project in this repository.

**Objective**
Produce a complete, internally consistent, traceable architecture and design proposal based strictly on the current repository's constitution and the latest clarified `spec.md`. This is a planning/design task only. Do not implement code.

**Mandatory input discovery**

- Read `.specify/memory/constitution.md` in full.
- Find and read the latest clarified `spec.md` in full. Verify that it is the post-Clarify version; do not use a template, stale copy, or similarly named document without checking.
- Read `UserRequirement.md` if present and all referenced source requirements.
- Inspect the existing Maven project structure, `pom.xml`, Java sources, tests, and relevant documentation. Report what exists; do not assume an empty project.
- Record the branch, baseline commit SHA, and exact input paths.
- If a critical input cannot be found or two candidate specifications conflict, stop and report the ambiguity rather than silently choosing.

**Authority and constraints**

- The customer specification defines what the product must do.
- The constitution defines project principles and mandatory technical constraints.
- Do not turn implementation preferences into customer requirements.
- Respect Java 21, Maven, Java Swing, JUnit 5, OOP, separation of concerns, testability, requirement traceability, and PlantUML where diagrams are appropriate.
- All monetary data and calculations must use `BigDecimal`; never propose `float` or `double` for money.
- Keep UI, application/workflow, domain, and infrastructure/persistence responsibilities clearly separated. Choose the simplest architecture that satisfies the actual requirements; justify layers, packages, interfaces, and patterns rather than applying patterns by default.
- Do not invent persistence technology, authentication, network services, concurrency, deployment model, or external integrations unless the specification or existing project establishes them. If undecided, compare viable options and list a decision question.
- Human review of AI-generated output is required.

**Required analysis**

1. Extract functional requirements, non-functional requirements, business rules, actors, workflows, domain concepts, constraints, and acceptance criteria from the clarified specification.
2. Identify ambiguities, contradictions, omissions, and risks that materially affect architecture. Do not resolve business-rule ambiguity by guessing.
3. Propose a high-level architecture and explain component responsibilities, dependencies, boundaries, and allowed dependency direction.
4. Propose a Java package/module structure aligned with the architecture and existing codebase.
5. Define the domain model: entities/value objects, identifiers, relationships, invariants, lifecycle/state transitions, and ownership. Include only concepts supported by requirements; mark inferred concepts.
6. Describe key application use cases and their interaction sequences, including validation, errors, approvals, notifications, expense sharing, balance calculation, payments, and reporting only to the extent those are required by the clarified spec.
7. Specify financial rules precisely where the requirements permit: `BigDecimal`, scale, rounding, currency handling, split/allocation remainder behavior, and balance invariants. Otherwise record the unresolved rule and its impact.
8. Describe persistence/repository boundaries and data integrity needs without selecting an unsupported database or storage mechanism.
9. Describe Swing presentation structure and UI-to-application interaction while ensuring business rules do not live in Swing forms.
10. Define validation, exception/error handling, logging, and security/privacy considerations proportionate to the stated requirements. Distinguish required controls from recommendations.
11. Define a JUnit 5 verification strategy covering domain logic, calculations, workflows, integration boundaries, and requirement-level acceptance tests. Avoid tests that only assert mock behavior.
12. Identify architectural risks, trade-offs, assumptions, open questions, and decisions that require human approval.
13. Build a traceability matrix linking each requirement ID (or stable quoted requirement identifier) to components/classes, design elements, and planned tests. Never fabricate requirement IDs; assign clearly marked local IDs only if the spec has none.

**Deliverables**
Create or update the standard Spec Kit planning artifacts appropriate to this repository. At minimum, produce:

- An architecture overview with context/boundary, components, responsibilities, dependency direction, and rationale.
- A detailed design section covering package structure, domain model, use-case flows, interfaces/boundaries, data/persistence approach, UI structure, error handling, and test strategy.
- PlantUML source for useful diagrams (at minimum component/container-level and domain/class-level; add sequence/state diagrams where they clarify important workflows). Ensure diagrams are syntactically plausible and consistent with the written design.
- A requirement-to-design-to-test traceability matrix.
- An assumptions, risks, and open-questions register.
- An input-baseline note with commit SHA and source paths.

Use the repository's established Spec Kit artifact locations and naming conventions. Do not overwrite the constitution or clarified feature specification. If the standard plan artifact already exists, inspect it and follow the repository workflow rather than destroying prior work; explain any replacement or versioning decision.

**Quality gates before finishing**

- Verify every requirement is either addressed, explicitly deferred, or listed as unresolved.
- Verify every mandated constitution constraint is reflected in the design.
- Check for internal contradictions between diagrams, package structure, domain model, and prose.
- Check that no unsupported technology or business rule has been introduced as fact.
- Confirm that money never uses floating-point types.
- Confirm that Swing is not responsible for business/domain rules.
- Confirm that the proposed tests exercise real domain behavior and map back to requirements.
- Summarize files created/changed and validation performed.
- Do not commit, push, merge, or implement code.

Return a concise decision summary, followed by the artifacts and a list of unresolved decisions requiring human input.

---
