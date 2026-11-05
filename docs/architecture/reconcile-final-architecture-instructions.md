# SplitSmart Final Requirements, Architecture & Design Reconciliation Instructions

**Purpose:** Reconcile the existing Spec Kit and Codex proposals into one coherent, reviewable, implementation-ready requirements and architecture/design baseline for SplitSmart.

**Repository:** `sakibkabir11/Lab-6`  
**Primary baseline:** Spec Kit proposal under `specs/001-splitsmart/`  
**Secondary input:** Independent Codex proposal under `docs/architecture/`  
**Status:** Instructions for reconciliation; not an approval of the resulting design.

---

## 1. Mission and expected outcome

Act as the lead requirements engineer, software architect, domain modeler, and technical documentation editor for SplitSmart.

Produce one consistent final documentation set by:

1. Keeping the **Spec Kit proposal as the primary architecture and design baseline**.
2. Reviewing the Codex proposal independently and adopting only improvements that are demonstrably more complete, precise, maintainable, or faithful to authoritative project inputs.
3. Preserving every customer requirement, including requirements outside the Java Swing MVP.
4. Resolving contradictions only when an authoritative source or explicit human decision supports the resolution.
5. Recording all remaining uncertainties as product-owner questions or architecture decision records (ADRs), with impact and a recommended decision where appropriate.
6. Making requirements, architecture, design, data model, UML, tests, and traceability agree with one another.
7. Producing a complete documentation package that can be reviewed and approved before implementation begins.

This is a **documentation and design reconciliation task**. Do not implement application code, add dependencies, create a Maven project, or change application tests as part of this task.

## 2. Authority, source hierarchy, and evidence rules

Use this order of authority:

1. **Customer requirements:** `UserRequirement.md` is authoritative for customer needs, as required by the constitution.
2. **Project constitution:** `.specify/memory/constitution.md` governs technical constraints and project principles.
3. **Clarified feature specification:** `specs/001-splitsmart/spec.md` is the current structured requirements baseline, subject to confirmation of its Draft status.
4. **Assignment/source documents:** Inspect referenced assignment material, including `Lab_6_Requirement.docx`, where available. Do not silently elevate it above `UserRequirement.md`; identify any discrepancy and ask for a human decision.
5. **Primary design proposal:** Spec Kit artifacts, especially `specs/001-splitsmart/plan.md`, `data-model.md`, `research.md`, `requirements-traceability.md`, and existing diagrams.
6. **Secondary design proposal:** `docs/architecture/codex-architecture-design.md` and its diagrams.
7. **Existing review:** `docs/architecture/architecture-design-review-report.md` is a prior review snapshot and a useful issue register, not a replacement for inspecting current sources.

### Evidence labels

Clearly distinguish the following throughout the deliverables:

- **[REQ]** Explicit customer or product requirement.
- **[CONSTITUTION]** Mandatory project principle or technical constraint.
- **[OBSERVED]** Verified fact about the repository or existing artifacts.
- **[DECISION]** Chosen design decision with rationale and status.
- **[ASSUMPTION]** Temporary premise that is not confirmed.
- **[OPEN]** Question or policy that requires human/product-owner input.
- **[RECOMMENDATION]** Proposed option that is not yet approved.

Cite source paths and exact requirement IDs/sections for material claims. Add line numbers when the tool or source makes them available. Never invent requirements, acceptance criteria, IDs, source content, implementation facts, or approval status.

Before editing, record the current branch, HEAD commit SHA, date, and exact source files inspected. Record the same baseline in the final package. If source documents have changed since earlier proposals or the prior review, use the current repository content and document the differences.

## 3. Non-negotiable constraints

The reconciled package must comply with the current constitution, including:

- Java 21 and Maven as the project toolchain.
- Java Swing for the constitution-required desktop MVP.
- JUnit 5 for automated verification.
- Object-oriented design, high cohesion, low coupling, and clear responsibilities.
- UI/presentation must not own business rules, financial calculations, approval rules, or authorization policy.
- Domain logic must be independently testable and independent of Swing.
- All monetary values and calculations must use `BigDecimal`; never use `float` or `double` for money.
- Explicit financial scale and rounding rules must be used once approved; do not invent them.
- PlantUML is the preferred source notation for architecture and behavioral diagrams.
- Every requirement must be traceable to design and planned verification.
- AI-generated output remains a proposal until reviewed and approved by a human.

Do not add a database, ORM, web framework, cloud service, authentication provider, notification vendor, receipt-storage technology, network topology, microservice, or deployment model as an established fact unless authoritative project evidence or a human decision supports it. Compare options and document the decision when the choice is unresolved.

## 4. Reconciliation method

### Step 1 — Freeze and inventory the baseline

Inspect the current versions of:

- `.specify/memory/constitution.md`
- `UserRequirement.md`
- `specs/001-splitsmart/spec.md`
- `specs/001-splitsmart/plan.md`
- `specs/001-splitsmart/data-model.md`
- `specs/001-splitsmart/research.md`
- `specs/001-splitsmart/requirements-traceability.md`
- All files under `specs/001-splitsmart/diagrams/`
- `docs/architecture/codex-architecture-design.md`
- All files under `docs/architecture/diagrams/`
- `docs/architecture/architecture-design-review-report.md`
- `Lab_6_Requirement.docx` and any other referenced customer/assignment artifacts available in the repository.

Also inspect the repository tree for other relevant specifications, checklists, ADRs, diagrams, or generated documents.

Create a source inventory table with path, purpose, authority level, current status, baseline commit, and whether it was read completely. Identify missing or inaccessible files instead of assuming their contents.

### Step 2 — Reconcile requirements before architecture

Treat the clarified specification as the structured starting point, but verify it against `UserRequirement.md`.

- Preserve all original customer features and scope.
- Keep the full product requirements separate from the Java Swing MVP subset.
- Retain existing stable requirement IDs where they still describe the same requirement.
- Do not renumber IDs casually. If a requirement must be split or merged, document the old-to-new mapping.
- Identify duplicates, contradictions, vague terms, missing actors, missing preconditions, missing outcomes, and requirements that cannot be tested.
- Convert vague statements into measurable/testable criteria only when the source provides enough information. Otherwise create a clarification question.
- Ensure every functional requirement has a clear actor or system responsibility, trigger, expected outcome, and applicable validation/error behavior.
- Ensure non-functional requirements (NFRs) are measurable or explicitly marked as needing a target.

Do not mark the specification approved merely because it has a Clarifications session or checklist. Its current status is Draft; ask the human owner to confirm whether it is formally clarified/approved and whether the Draft status should change.

### Step 3 — Reconcile Spec Kit and Codex proposals

Use Spec Kit as the default structure and design direction. Compare Codex by topic, not by document length.

Evaluate both proposals against the same evidence:

- Requirement coverage and fidelity.
- Constitution compliance.
- Architecture simplicity, boundaries, cohesion, coupling, and dependency direction.
- Domain model completeness, invariants, and lifecycle correctness.
- Use-case flow and exception/error behavior.
- Financial correctness and auditability.
- Persistence/data integrity boundaries.
- Security and privacy.
- Swing presentation separation.
- Testability and requirement traceability.
- UML correctness and consistency.
- Assumptions, risks, reversibility, and implementation feasibility.

For each Codex improvement, record one disposition:

- **Adopt** — stronger and evidence-supported; incorporate into the primary artifact.
- **Adapt** — useful idea, but revise to fit the primary architecture or requirements.
- **Defer** — depends on an unresolved product/technology decision.
- **Reject** — unsupported, conflicting, unnecessarily complex, or less correct; explain why.

At minimum, explicitly evaluate Codex's decision register, error/security guidance, authentication cautions, and any stronger workflow/data-history details. Do not mechanically merge incompatible models.

Maintain a reconciliation table with columns: topic, Spec Kit proposal, Codex proposal, evidence, disposition, final wording/location, and rationale.

### Step 4 — Resolve scope and business-policy gaps transparently

The known issues below must be explicitly addressed in the final decision/question register. Do not silently decide them.

**Product scope and platform**
- Customer source describes a primary web-based product; constitution requires a Java Swing MVP; assignment material may mention Android/iOS.
- State clearly what the Swing MVP includes and excludes.
- Clarify whether web/mobile are future product targets, concurrent deliverables, or a changed requirement.
- Do not claim Swing satisfies the full web/mobile requirement.

**Money and settlement**
- Currency/currency support.
- Monetary scale and rounding mode.
- Equal-split remainder allocation.
- Percentage allocation to currency minor units, including residual cents.
- Whether payer must be among participants and how payer's own share is treated.
- Whether one expense can have multiple payers (current clarified spec says one explicit payer).
- Payment direction, matching/allocation to obligations, and whether a payment may settle multiple obligations.
- Overpayment, underpayment, failed/disputed payment, correction, reversal, refund, and duplicate payment handling.
- Whether balances are netted only within a group or across groups.
- Whether a payment may be entered before an expense is approved, and how it is reconciled.

**Approval and expense lifecycle**
- Who may be designated as an approver and how designation occurs.
- Whether creator may approve their own expense.
- Whether one approval is sufficient when several approvers are designated.
- Rejection reason, edit/resubmission, cancellation, duplicate decisions, and approval reversal.
- Whether all current group members are notified before or after persistence/commit and how notification failure is handled.

**Identity, membership, privacy**
- Meaning of simplified MVP login and required security level.
- Credential storage/authentication rules; do not store plaintext credentials.
- Group invitation, acceptance, removal, leaving, and historical membership behavior.
- Authorization rules for group/expense/payment/report actions.
- Exact privacy boundary for group-visible information and personal reports.

**Persistence, receipt, notification, reporting**
- Local versus remote persistence and required durability/backup.
- Receipt formats, size limits, validation, storage, access control, and retention.
- Notification channels, delivery guarantees, retry/failure behavior, and user preferences.
- Report filters, date/time zone semantics, empty results, totals, export formats, and historical snapshots.
- Audit/history retention and correction policy.

For each question, state why it matters, which requirements/artifacts are affected, the design alternatives, a recommendation if possible, and whether it blocks implementation.

## 5. Required final documentation package

Keep the existing Spec Kit feature directory as the primary home for the reconciled specification and design. Keep cross-cutting architecture governance/decision documents under `docs/architecture/`. Prefer updating existing artifacts over creating competing copies. Add files only where they provide a distinct, maintainable purpose.

The following is the expected package. If a file already exists, inspect and update it rather than overwriting useful content without explanation.

### A. Requirements baseline

1. **`specs/001-splitsmart/spec.md` — Final feature requirements**
   - Product purpose, scope, actors, assumptions, dependencies, constraints.
   - Complete functional requirements and stable IDs.
   - Complete non-functional requirements and stable IDs.
   - Business rules and validation rules.
   - User stories/use cases, preconditions, triggers, main success flows, alternate/error flows.
   - Testable acceptance criteria.
   - Edge cases and explicit out-of-scope items.
   - Full product scope and Swing MVP subset clearly separated.
   - Clarifications, unresolved questions, and approval/status metadata.

2. **Requirements quality checklist**
   - Keep/update `specs/001-splitsmart/checklists/requirements.md`.
   - Check unambiguous, atomic, feasible, consistent, traceable, and verifiable requirements.
   - Do not mark unresolved items as passed.

3. **Requirements traceability**
   - Update `specs/001-splitsmart/requirements-traceability.md`.
   - Map every FR, NFR, business rule, user story, and acceptance criterion to architecture component, design element, data concept, UML diagram, and planned JUnit/test level.
   - Include status: covered, partial, deferred, unresolved, or not applicable, with rationale.

### B. Architecture and design baseline

4. **`specs/001-splitsmart/plan.md` — Consolidated architecture and detailed design**
   - Executive architecture decision and rationale.
   - System context, scope boundary, actors, and external systems (or explicit absence).
   - Architecture style and layers/components.
   - Component responsibilities and forbidden responsibilities.
   - Dependency direction and allowed/forbidden dependencies.
   - Proposed Java package structure.
   - Application use cases and service boundaries.
   - Domain model overview and invariants.
   - Data/persistence boundaries and transaction consistency needs.
   - Swing UI structure and presentation/application interaction.
   - Authentication, authorization, privacy, validation, logging, and error-handling design.
   - Notification and receipt boundaries without unsupported vendor choices.
   - Reporting/read-model design.
   - Testing strategy and traceability.
   - Alternatives, trade-offs, risks, assumptions, and open decisions.
   - Explicit implementation-readiness verdict and conditions.

5. **`specs/001-splitsmart/data-model.md` — Detailed domain and data design**
   - Entities, value objects, aggregates, identifiers, relationships, ownership, and lifecycle.
   - Attributes and types at the logical level; use `BigDecimal` for money.
   - Primary/foreign key or persistence mapping details only when justified; otherwise label logical identifiers and persistence choices as open.
   - Required/optional fields, uniqueness, referential integrity, and domain invariants.
   - Expense, approval, obligation, payment, membership, and report lifecycles.
   - Audit/history and data retention needs.
   - Derived versus persisted data; identify the financial source of truth.
   - Data validation and consistency constraints.
   - Explicit open financial policies; no invented rounding or allocation behavior.

6. **`specs/001-splitsmart/research.md` — Decision and research register**
   - Record only research that was actually performed.
   - Compare options for unresolved technology or policy choices where useful.
   - Separate evidence from recommendation.
   - Link each question to the affected requirement and ADR.

7. **Architecture decision records**
   - Create `docs/architecture/decisions/` and concise numbered ADRs for significant decisions.
   - Suggested initial topics: platform/scope boundary, architecture style and dependency direction, persistence strategy, identity/authentication, notification/receipt adapters, financial precision/allocation policy, approval lifecycle, and balance/payment ledger semantics.
   - Use statuses such as Proposed, Accepted, Rejected, or Superseded.
   - An ADR must include context, decision, alternatives, consequences, evidence, affected requirements, and approver/date.
   - Do not mark an ADR Accepted without human approval.

### C. UML and architecture diagrams (PlantUML source)

Create/update source files under `specs/001-splitsmart/diagrams/`. Every diagram must be consistent with the final prose and model. Add a short purpose/coverage note in the document that references each diagram.

At minimum, provide:

8. **Use-case diagram** — `use-cases.puml`
   - All relevant actors and system boundary.
   - Account/authentication, group/member management, expense creation, split selection, receipt attachment, notifications, approval/rejection, balance review, payment recording, reports.
   - Distinguish MVP use cases from full-product/future scope where applicable.
   - Do not invent external actors or services.

9. **Component diagram** — `components.puml`
   - Swing presentation, application/use-case layer, domain, ports, and infrastructure adapters.
   - Show dependencies and direction.
   - Show undecided external mechanisms as abstract ports/boundaries, not selected technologies.
   - Make clear that UI does not call persistence adapters directly and domain has no UI/infrastructure dependency.

10. **Detailed class diagrams** — use multiple focused diagrams rather than one unreadable diagram:
   - `domain-classes.puml`: domain entities, value objects, aggregates, associations, multiplicities, and key invariants.
   - `application-classes.puml`: use-case/application services, request/result objects, ports, and dependencies.
   - Add `persistence-classes.puml` only if a concrete persistence design is approved; otherwise show repository interfaces in the application class diagram.
   - Include relevant attributes and operations at a useful design level, not every getter/setter.
   - Label inferred classes and unresolved relationships.

11. **Sequence diagrams** — separate files for important scenarios:
   - `sequence-register-login.puml`
   - `sequence-create-submit-expense.puml`
   - `sequence-approve-reject-expense.puml`
   - `sequence-record-payment.puml`
   - `sequence-calculate-balances.puml`
   - `sequence-generate-report.puml`
   - Show actor, UI, application service, domain, ports/adapters, validation, success, and relevant failure paths.
   - Show that pending/unapproved expenses do not affect balances.
   - Show that partial payments preserve original obligations.
   - Avoid implying an unapproved database or external provider.

12. **State diagrams** — at minimum:
   - `state-expense.puml`: pending approval, approved, rejected, and only evidence-supported transitions; label unresolved edit/resubmit/cancel/reversal behavior as open rather than inventing transitions.
   - `state-payment.puml`: distinguish recorded/settled or other states only if supported by approved policy. If payment lifecycle policy is not decided, diagram the known facts and mark the rest as open.
   - Add membership state only if membership lifecycle rules are sufficiently defined.

13. **Activity diagrams** — at minimum:
   - `activity-submit-expense.puml`: input, authorization, validation, membership/payer checks, split validation, persistence boundary, notification, pending approval.
   - `activity-approve-expense.puml`: approver authorization, decision, approval gate, obligation creation, balance visibility.
   - `activity-record-payment.puml`: payment validation, allocation policy boundary, history preservation, outstanding balance update.
   - Include decision branches and error paths. Never depict a balance change before approval.

14. **Diagram quality**
   - Ensure each `.puml` is syntactically plausible PlantUML.
   - Use consistent names, packages, actors, states, and multiplicities across diagrams.
   - Do not include classes or services in diagrams that are absent from the written design unless clearly labeled as proposed.
   - If a renderer/PlantUML validator is available, run it and record the result. If unavailable, state that syntax was reviewed but not tool-validated.
   - Prefer several legible diagrams over a single oversized diagram.

### D. Verification and delivery documents

15. **Test strategy** — include in `plan.md` or a separate `specs/001-splitsmart/test-strategy.md` if the content is substantial:
   - JUnit 5 unit tests for domain invariants and calculations.
   - Application/use-case tests for authorization, orchestration, approval gating, notification invocation/failure, and persistence boundaries.
   - Adapter contract/integration tests when adapters are selected.
   - Swing UI tests only for presentation behavior; do not make UI tests the sole verification of domain rules.
   - Requirement-level acceptance test scenarios.
   - Test data, edge cases, expected outcomes, and traceability IDs.
   - Avoid mock-only tests; exercise real domain behavior.

16. **Decision, risk, and question registers**
   - Maintain one consolidated open-question register or link the ADRs clearly.
   - Prioritize blockers, owner, affected requirements, consequence, recommendation, status, and resolution evidence.
   - Maintain risk entries with probability/impact and mitigation where meaningful.

17. **Documentation index**
   - Add/update `docs/architecture/README.md` or an index section in the feature documentation listing each artifact, purpose, status, and relationship.
   - Ensure links are relative and valid.

## 6. Required domain and financial design checks

The final design must explicitly model, at the appropriate level:

- User/account and authentication boundary.
- Group and membership, including current membership checks.
- Expense, payer, participants, split method, and split allocations.
- Approval decision and designated approver.
- Original obligations created only after approval.
- Payments as separate records that do not erase original obligations.
- Derived balances and report/query models.
- Optional receipt reference and notification boundary.

Financial invariants and known rules:

- Every monetary amount, allocation, payment, obligation, balance, and total uses `BigDecimal`.
- Expense amount must be greater than zero.
- Percentage inputs must total exactly 100%, per the clarified requirement.
- Expense participants must be current group members and payer selection must satisfy the confirmed payer rule.
- An expense must not affect balances before required approval.
- Partial payments reduce outstanding obligations while preserving the original obligation record.
- Derived balances must be reconcilable to approved obligations and valid payment records.
- Do not assume that percentage total validation resolves monetary rounding or minor-unit allocation.
- Do not assume a currency, scale, rounding mode, equal-split remainder algorithm, or overpayment rule without approval.

Keep the source of truth explicit. Avoid independently mutable balance totals that can drift from expense/obligation/payment history unless a justified consistency strategy is documented.

## 7. Non-functional requirements: required coverage

Review every NFR in the current specification and preserve its ID. Do not create arbitrary performance/security targets. Where the current NFR is qualitative, propose a measurable target only as a recommendation and mark it pending product-owner approval.

At minimum, ensure the NFR set addresses all applicable dimensions evidenced by the requirements:

- Security: authentication, authorization, credential handling, and protection against unauthorized access.
- Privacy: users see only authorized personal and group-related information.
- Financial integrity: exact decimal arithmetic, consistent obligations/balances, and auditable changes.
- Reliability/data integrity: no partial or contradictory state across expense approval, obligation creation, and payment recording.
- Usability/accessibility: clear feedback, understandable expense/approval/payment state, and usable Swing MVP workflows.
- Performance/scalability: define measurable response-time and capacity targets only after expected data volume and usage are known.
- Maintainability: clear boundaries, readable design, and separation of concerns.
- Testability: domain behavior verifiable independently from Swing and infrastructure.
- Portability/compatibility: Java 21 and supported runtime/build constraints.
- Auditability/traceability: preserve relevant expense, approval, and payment history and link requirements to verification.
- Availability/recovery/backup: include only if the product scope and deployment model establish a need; otherwise record as a question.

For each NFR include: ID, statement, rationale, measurement/verification method, target or explicit TBD, priority, affected components, and linked tests. Make the distinction between an NFR and a design choice clear.

## 8. Test and traceability requirements

Build a complete requirement-to-design-to-test matrix. It must include every functional and non-functional requirement and map each to:

- User story/use case and acceptance criterion.
- Domain entity/value object or business policy.
- Application use case/service.
- Architecture component/package.
- Data concept or persistence constraint.
- Relevant UML diagram(s).
- Planned JUnit 5 test(s) or acceptance test.
- Status and evidence.

Test scenarios must include, where requirements support them:

- Registration/sign-in and unauthorized data access.
- Group creation and membership validation.
- Positive amount and required-field validation.
- Equal and percentage split validation, including non-100% rejection.
- Payer/participant and membership rules.
- Expense pending state and no balance impact before approval.
- Approval/rejection and audit history.
- Notification of current group members and failure handling once policy is decided.
- Balance calculation across approved expenses.
- Partial payment and preservation of original obligation.
- Overpayment/early-payment cases as pending tests until rules are approved.
- Report date filters, empty result, and privacy boundaries.
- Receipt validation/storage behavior once receipt policy is decided.
- Data consistency and duplicate submission/decision behavior once those policies are decided.

Never label a planned test as executed. Distinguish test design from implementation and passing test evidence.

## 9. Consistency and quality gates

Before declaring the package ready for human review, verify all of the following:

### Requirements gates
- Every original customer feature is preserved or explicitly dispositioned with owner approval.
- Every FR/NFR ID is unique, stable, and traceable.
- Full product scope and Swing MVP subset are distinct and non-contradictory.
- Acceptance criteria are testable and cover normal, alternate, and error flows.
- Ambiguities are recorded rather than silently resolved.

### Architecture/design gates
- The design is the simplest architecture that satisfies the requirements.
- Responsibilities and dependency directions are explicit.
- Swing does not contain domain/business rules.
- Domain rules are independently testable.
- No unsupported technology or external integration is represented as selected.
- Domain, application, data, and UI design agree.

### Financial/data gates
- No floating-point type is used for money.
- All known financial rules are represented accurately.
- Unresolved rounding, currency, remainder, payer, and payment policies remain visible.
- Original obligations and payment history remain auditable.
- Balances are derived/reconciled consistently.

### UML gates
- All requested diagram categories exist.
- Diagrams match the text, requirements, package names, classes, and workflows.
- Approval gate and partial-payment semantics are correctly shown.
- Unresolved lifecycle transitions are visibly marked open.
- PlantUML validation status is honestly reported.

### Verification/traceability gates
- Every requirement maps to one or more design elements and planned tests.
- Tests exercise actual domain behavior, not only mocks.
- Test cases cover high-risk edge cases.
- No unexecuted test is described as passing.

### Governance gates
- Human decisions are clearly separated from AI recommendations.
- No constitution or customer requirement is changed to make a proposal appear compliant.
- No ADR is marked Accepted without human approval.
- The final readiness verdict reflects unresolved blockers.

## 10. Human review and approval process

The final package must end with a concise human approval checklist covering:

1. Product platform and MVP scope.
2. Requirement completeness and NFR targets.
3. Currency, rounding, split remainder, payer, and settlement policies.
4. Approval authority and expense lifecycle.
5. Authentication, authorization, privacy, and membership lifecycle.
6. Persistence, receipt, and notification decisions.
7. Reporting semantics and audit/history.
8. Architecture boundaries, package structure, and UML consistency.
9. Test strategy and requirement traceability.
10. Approval of each ADR and readiness to begin implementation.

Provide an explicit status for each decision: Approved, Rejected, Deferred, or Still Open. Include approver and date only when actually supplied.

## 11. Execution boundaries and final response

- Modify documentation artifacts only.
- Do not modify `UserRequirement.md` or `.specify/memory/constitution.md`.
- Do not implement Java code, tests, build files, or infrastructure.
- Do not delete the independent Codex proposal; retain it as historical input.
- Do not overwrite the prior architecture review report; the reconciled package is a new design baseline.
- Prefer direct, reviewable updates in the existing feature directory.
- Summarize all created/updated files, reconciliation choices, validation performed, unresolved blockers, and the final implementation-readiness verdict.
- State explicitly whether the package is ready for **human review** and whether it is ready for **implementation**. These are different gates.

**Expected outcome:** One coherent, traceable SplitSmart requirements and architecture/design baseline, with complete PlantUML source, explicit decisions and open questions, and enough detail for a human reviewer to approve or request changes before implementation.
