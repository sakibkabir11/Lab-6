# Architecture & Design: Spec Kit, Codex, and ChatGPT Prompts

Project: **SplitSmart**  
Repository: `sakibkabir11/Lab-6`  
Purpose: Generate two independent architecture/design proposals (Spec Kit and Codex), then have ChatGPT compare them and perform a requirements/constitution cross-check.

> **Important workflow rule:** Spec Kit and Codex must work independently from the same frozen input baseline. Do not let either tool read the other's generated output before its own deliverables are complete. ChatGPT performs the comparison only after both outputs are available.

---

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

## 3. Prompt for ChatGPT — compare, report, and cross-check

Use this only after both independent proposals are complete. Provide ChatGPT with the repository context or attach/paste the two complete outputs and the authoritative source documents. ChatGPT should inspect the actual files when repository access is available, not rely only on summaries.

### CHATGPT PROMPT — independent comparison and rigorous cross-check

You are the independent architecture/design reviewer for SplitSmart. Two architecture/design proposals have been generated independently:
- Spec Kit proposal: [provide exact path or attach the complete files]
- Codex proposal: [provide exact path or attach the complete files]

Authoritative project inputs:
- `.specify/memory/constitution.md`
- The latest clarified `spec.md` (provide exact path)
- `UserRequirement.md`, if present, and all referenced customer requirements
- Existing source code, tests, Maven configuration, and relevant documentation

**Primary objective**  
Compare the Spec Kit and Codex proposals objectively, determine whether each is correct and complete against the authoritative requirements and constitution, identify omissions and unsupported assumptions, and produce a recommendation. Do not assume either tool is correct. Do not prefer one because it is longer, more detailed, or uses more sophisticated patterns.

**Evidence protocol**
1. Verify the baseline commit SHA and source paths used by both generators. Identify any baseline mismatch that could explain differences.
2. Read the constitution and clarified spec directly and completely. Treat them as authoritative over both proposals.
3. Verify important claims against source requirements and existing code. Cite exact file paths and requirement IDs/sections; include line numbers when available.
4. Distinguish: (a) explicit requirement, (b) constitution constraint, (c) observed codebase fact, (d) design decision, (e) assumption, and (f) open question.
5. Do not resolve unclear business rules by guessing. State what clarification is needed and why it matters.
6. If source files or either proposal are unavailable, identify the gap and do not pretend to have cross-checked them.

**Required review dimensions**
- Completeness and fidelity to every functional and non-functional requirement.
- Compliance with every applicable constitution principle and technical constraint.
- Architecture suitability, simplicity, cohesion, coupling, layering, and dependency direction.
- Domain model correctness: concepts, relationships, invariants, ownership, and lifecycle/state transitions.
- Use-case/workflow coverage and interaction correctness.
- Financial correctness: `BigDecimal`, currency, scale, rounding, allocation/remainder handling, and balance invariants.
- Swing/UI separation from application and domain logic.
- Persistence/data design grounded in evidence rather than assumptions.
- Validation, errors, security/privacy, and logging.
- JUnit 5 testability, meaningful edge cases, and traceability to requirements.
- Diagram accuracy and consistency with the written architecture.
- Maintainability, extensibility, implementation feasibility, and unnecessary complexity.
- Risks, assumptions, open questions, and reversibility of design decisions.

**Required report structure**

### A. Executive verdict
State whether each proposal is: acceptable, acceptable with changes, or not acceptable. Give the most important reasons and a recommended direction.

### B. Baseline and evidence check
Compare branch/commit SHA, source files read, and any missing or inconsistent inputs. Explain whether the comparison is fair.

### C. Side-by-side comparison
Use a table with rows for architecture style, layers/components, package structure, domain model, use cases, financial rules, UI separation, persistence, error handling, testing, diagrams, traceability, assumptions, and risks. For each row state:
- Spec Kit approach
- Codex approach
- Evidence-based assessment
- Preferred approach or “neither”
- Reason

### D. Requirement-by-requirement cross-check
Create a matrix with columns:
- Requirement ID/section and concise requirement
- Constitution constraint, if applicable
- Spec Kit coverage (file/section)
- Codex coverage (file/section)
- Finding: satisfied / partial / missing / conflict / unsupported
- Required correction or clarification

Cover every requirement, not just representative examples. Do not fabricate IDs.

### E. Constitution compliance audit
Check every principle and applicable constraint, including customer requirement priority, Java 21/Maven, Swing/model-view separation, OOP/separation of concerns, BigDecimal financial correctness, JUnit 5 verification, traceability/design transparency, and human review. Mark pass/partial/fail/not applicable and cite evidence.

### F. Defects, contradictions, and unsupported assumptions
List issues by severity (critical, high, medium, low). For each, identify the source, impact, and concrete correction. Explicitly call out contradictions between either proposal and the clarified spec, constitution, or existing code.

### G. Consolidated recommended architecture
Synthesize the strongest evidence-supported ideas from both proposals. Do not mechanically merge incompatible designs. Explain accepted/rejected decisions and rationale. Preserve unresolved choices as decision points rather than silently choosing.

### H. Diagram and model review
Check whether diagrams are syntactically valid, complete, and consistent with prose. Identify missing or misleading diagrams and provide precise corrections.

### I. Test and traceability review
Identify missing test scenarios, weak/mock-only tests, untested business invariants, and broken requirement-to-design-to-test links. Recommend concrete JUnit 5 test cases without implementing them.

### J. Open questions for the product owner
Prioritize questions that block architecture or could change the domain model, financial behavior, persistence, or workflows. Explain the consequence of each unanswered question.

### K. Action plan
Provide an ordered list of corrections, with priority, responsible artifact (Spec Kit, Codex, spec, or human decision), and exit criteria.

### L. Final recommendation
State which proposal should be the baseline, which parts should be adopted from the other, what must be corrected, and whether the design is ready for implementation. If neither is ready, say so clearly.

**Review rules**
- Be critical, fair, and evidence-driven.
- Never invent facts, requirements, acceptance criteria, or source citations.
- Do not reward verbosity or diagram count; reward correctness and traceability.
- Do not treat agreement between two AI tools as proof. Independently validate both against source requirements.
- Do not silently modify the constitution or clarified spec to make a proposal appear compliant.
- Do not implement code or commit changes during the review.
- Clearly separate mandatory corrections from optional improvements.
- End with a human approval checklist and a list of unresolved product decisions.

---

## 4. Recommended execution sequence

1. Freeze the baseline: note the target branch and commit SHA.
2. Run Spec Kit with Section 1. Save its outputs in the Spec Kit artifact locations. Record exact paths and commit SHA; do not merge or expose them to Codex yet.
3. Create a separate Codex worktree/branch from the exact same baseline SHA.
4. Run Codex with Section 2. Save its outputs in the Codex-specific location. Record exact paths and commit SHA.
5. Confirm both tools used the same constitution, clarified spec, and baseline code. If not, rerun or explicitly account for the difference.
6. Give ChatGPT Section 3, both complete proposals, and the authoritative source files. Ask it to inspect the actual repository artifacts and produce the full report.
7. Review the report and resolve product-owner questions. Update the selected architecture/design artifacts only after human approval.
8. Only then proceed to implementation planning or code generation.

## 5. Human review checklist

- [ ] Both generators used the same baseline commit and authoritative clarified spec.
- [ ] No generator changed the constitution or customer specification.
- [ ] Every requirement is traceable to design and planned verification.
- [ ] All constitution principles and technical constraints are reflected.
- [ ] Financial policies are explicit or clearly marked as open questions.
- [ ] Domain/business logic is independent of Swing UI code.
- [ ] No unsupported persistence technology or external service was assumed.
- [ ] Diagrams agree with the written design and are maintainable as source.
- [ ] JUnit 5 tests cover real domain behavior and edge cases.
- [ ] Product-owner decisions are resolved or consciously deferred.
- [ ] Human reviewer approves the architecture before implementation begins.
