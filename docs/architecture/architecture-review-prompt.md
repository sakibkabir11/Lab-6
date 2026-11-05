# ChatGPT Architecture & Design Review Prompt

Project: SplitSmart
Repository: sakibkabir11/Lab-6

## Purpose and inputs
Act as an independent architecture/design reviewer. Compare the completed Spec Kit and Codex proposals against the actual project sources. Read:
- Spec Kit proposal and its diagrams (provide exact paths).
- Codex proposal and its diagrams (provide exact paths).
- `.specify/memory/constitution.md`.
- The latest clarified `spec.md` (verify it is post-Clarify and record its exact path).
- `UserRequirement.md`, if present, and all referenced customer requirements.
- Existing source code, tests, Maven configuration, README, and relevant documentation.

If an input is missing or ambiguous, identify the gap; do not claim to have checked it.

## Evidence protocol
1. Verify and compare each proposal's baseline branch, commit SHA, and exact input paths.
2. Read the constitution and clarified specification directly and completely.
3. Support findings with requirement IDs/sections and repository paths; include line numbers when available.
4. Label claims as requirement, constitution constraint, observed code fact, design decision, assumption, or open question.
5. Never invent requirements, business policies, acceptance criteria, or citations. Do not guess at unresolved business rules.
6. Do not alter code, tests, constitution, or clarified specification.

## Evaluation criteria
Evaluate both proposals for:
- Coverage and fidelity to all functional and non-functional requirements.
- Compliance with the constitution.
- Architecture suitability, simplicity, cohesion, coupling, layering, and dependency direction.
- Package/class design and domain model: concepts, relationships, invariants, ownership, lifecycle.
- Use-case and workflow coverage.
- Financial correctness: BigDecimal, currency, scale, rounding, split arithmetic, remainder allocation, and balance invariants.
- Separation of Swing UI from application/domain logic.
- Evidence-based persistence and data design.
- Validation, errors, security/privacy, and logging.
- JUnit 5 testability, edge cases, and requirement traceability.
- Diagram syntax and consistency with prose.
- Maintainability, feasibility, risks, assumptions, and unresolved choices.

## Required report

### A. Executive verdict
Rate each proposal acceptable, acceptable with changes, or not acceptable. Explain the key reasons.

### B. Baseline and evidence audit
Compare branch, commit SHA, source inventory, and missing inputs. State whether the comparison is fair.

### C. Side-by-side comparison
Provide a table covering architecture, layers/components, packages, domain model, use cases, financial rules, UI separation, persistence, errors, tests, diagrams, traceability, assumptions, and risks. Summarize both approaches, assess the evidence, and select one approach or neither for each area.

### D. Requirement coverage matrix
For every requirement, list its ID/section and summary, relevant constitution constraint, Spec Kit coverage, Codex coverage, status (satisfied/partial/missing/conflict/unsupported), and required correction or clarification. Do not fabricate IDs.

### E. Constitution audit
Check customer-requirement priority; Java 21/Maven; Swing/model separation; OOP and separation of concerns; BigDecimal; JUnit 5; traceability/design transparency; and human review. Mark pass/partial/fail/not applicable with evidence.

### F. Defects and assumptions
Group findings by critical/high/medium/low severity. For each, state source, impact, and correction. Identify contradictions with the specification, constitution, or code.

### G. Consolidated architecture recommendation
Combine only evidence-supported ideas. Do not mechanically merge incompatible designs. Explain accepted/rejected decisions and preserve unresolved choices as decision points.

### H. Diagram and model review
Check syntax, completeness, and consistency with the written design. Specify corrections for missing or misleading diagrams.

### I. Test and traceability review
Identify missing scenarios, mock-only tests, untested invariants, and broken requirement-to-design-to-test links. Recommend concrete JUnit 5 cases without implementing them.

### J. Product-owner questions
Prioritize questions that could affect the domain model, financial behavior, persistence, or workflows. Explain the consequence of each unanswered question.

### K. Action plan
List ordered corrections, priority, responsible artifact/person, and exit criteria.

### L. Final recommendation
State which proposal should be the baseline, what to adopt from the other, required corrections, and whether the design is ready for implementation. If neither is ready, say so.

## Review principles
Be critical, fair, and evidence-driven. Do not reward verbosity, complexity, or diagram count. Agreement between AI tools is not proof. Do not alter authoritative requirements to make a proposal appear compliant. Separate mandatory corrections from optional improvements. End with a human-approval checklist and unresolved product decisions.
