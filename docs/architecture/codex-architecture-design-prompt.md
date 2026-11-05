# Codex Architecture & Design Prompt

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

## 2. Prompt for Codex

Run Codex independently from the same frozen baseline used by Spec Kit. Do not expose Spec Kit's generated architecture/design files to Codex until Codex has completed and reported its own proposal. If both tools must share a working tree, use separate worktrees or branches so their outputs cannot contaminate each other.

### CODEX PROMPT — independently generate Architecture and Design proposal

Act as a senior software architect and Java desktop-application designer. You are working in the SplitSmart repository `sakibkabir11/Lab-6`.

**Task**  
Independently analyze the project and create an architecture and detailed design proposal. This is not an implementation task. Your proposal will later be compared with a separate Spec Kit proposal, so make your reasoning, evidence, assumptions, and trade-offs explicit.

**Start by establishing the baseline**
- Record current branch and commit SHA.
- Read `.specify/memory/constitution.md` completely.
- Locate and read the latest clarified `spec.md` completely. Verify it is the post-Clarify source of truth, not a template or stale duplicate.
- Read `UserRequirement.md` if present, referenced documents, README/build configuration, `pom.xml`, all relevant source files, tests, and existing design documentation.
- List the exact paths inspected. If the clarified spec is missing or ambiguous, stop and ask for clarification rather than inventing its contents.
- Treat existing implementation as current-state evidence, not as a substitute for the requirements.

**Non-negotiable project constraints**
- Java 21 and Maven.
- Java Swing for the desktop UI.
- JUnit 5 for automated tests.
- Object-oriented design, high cohesion, low coupling, and separation of concerns.
- Domain/business logic must be independent of Swing presentation classes.
- All money uses `BigDecimal`; never `float` or `double`. Do not invent rounding, currency, or remainder-allocation rules; extract them from requirements or mark them unresolved.
- Requirement traceability from customer need to design element and verification.
- PlantUML is the preferred text-based diagram notation where diagrams add value.
- AI-generated work remains a draft subject to human review.

**Independent reasoning requirements**
Do not imitate a presumed Spec Kit template or optimize for agreement with another tool. Derive the architecture from the actual requirements and codebase. Consider alternatives and explain why the selected option is the best fit. Avoid unnecessary frameworks, layers, patterns, or dependencies.

Analyze:
1. Requirement scope, actors, core workflows, business rules, quality attributes, constraints, acceptance criteria, and requirement ambiguities.
2. System context and external actors/systems; explicitly state when no external system is specified.
3. Architecture style, layers/components, responsibilities, dependency rules, and rationale.
4. Java package and class design compatible with the existing project.
5. Domain model with entities, value objects, relationships, invariants, state transitions, and lifecycle rules.
6. Application services/use cases and end-to-end interactions for every major required workflow.
7. Financial model and correctness: `BigDecimal`, currency, scale, rounding, split arithmetic, remainder handling, and balance invariants. Separate facts from unanswered policy questions.
8. Persistence abstractions and data ownership; do not assume a database or persistence mechanism not grounded in project evidence.
9. Swing UI organization and interaction boundaries; no business rules in views/forms.
10. Validation, error handling, security/privacy, and logging proportionate to requirements.
11. JUnit 5 test architecture and concrete test scenarios, including edge cases and requirement-level coverage.
12. Architectural trade-offs, alternatives rejected, risks, assumptions, and open questions.

**Required outputs**
Create a self-contained architecture/design proposal in a clearly named Codex-specific location, preferably `docs/architecture/codex-architecture-design.md`, plus separate PlantUML `.puml` files in a nearby diagrams directory. Do not overwrite Spec Kit artifacts, the constitution, or the clarified spec. If the repository has a conflicting documentation convention, follow it and explain the location chosen.

The document must include:
- Executive architecture summary and rationale.
- Source/baseline inventory (branch, commit SHA, exact files read).
- Requirements and constraints summary.
- Context and component architecture.
- Package/class design and domain model.
- Use-case interaction flows.
- Financial correctness design.
- UI, persistence, error-handling, and security/privacy boundaries.
- JUnit 5 verification strategy and example test scenarios.
- Requirement-to-design-to-test traceability matrix.
- Alternatives and trade-offs.
- Assumptions, risks, and open questions.
- Explicit human-review checklist.

**Quality and safety checks**
- Cite source paths and requirement IDs/quotes for important design claims.
- Mark each statement as requirement, constitution constraint, observed current-state fact, design decision, assumption, or open question where confusion is possible.
- Never invent requirement IDs, business policies, persistence technologies, or external integrations.
- Check that all required features map to design components and tests.
- Check consistency across prose, diagrams, and class/package descriptions.
- Check all money handling uses `BigDecimal` and no UI class owns domain rules.
- Do not modify application code, tests, constitution, or clarified spec.
- Do not commit, push, merge, or alter the baseline branch.

Finish with the exact list of files created, checks performed, and unresolved decisions. This proposal must remain independent of any Spec Kit output.

---

