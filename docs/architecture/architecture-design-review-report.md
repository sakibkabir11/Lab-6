# SplitSmart Architecture & Design Review Report

**Repository:** [sakibkabir11/Lab-6](https://github.com/sakibkabir11/Lab-6)  
**Branch reviewed:** `main`  
**Current HEAD at review:** `102b55b733e02f9e2b5993db9afb2970d58922a2`  
**Shared proposal baseline:** `11aa9462114cb4eb1cbe14b6f053a0930781b974`

## A. Executive verdict

**Both proposals are acceptable with changes. Neither is ready to authorize implementation.**

- **Spec Kit:** stronger overall documentation package: detailed plan, domain model, UI contract, quickstart, diagrams, and granular requirement-to-test matrix.
- **Codex:** strong independent proposal, with useful decision questions, risk analysis, error/security considerations, and separation of requirements from design decisions.

**Recommendation:** use Spec Kit as the primary architecture baseline. Incorporate Codex's decision register, error-handling guidance, security caveats, and warnings about treating a simplified login as sufficient security.

## B. Baseline and evidence audit

The current architecture commit's parent is the shared proposal baseline. Both proposals identify commit `11aa946`, supporting the conclusion that they used the same repository snapshot. The review cannot independently prove the tools' execution chronology.

The repository contains:
- `.specify/memory/constitution.md`
- `UserRequirement.md`
- `specs/001-splitsmart/spec.md`
- Spec Kit planning/design artifacts under `specs/001-splitsmart/`
- Codex proposal and diagrams under `docs/architecture/`

The repository did not contain a `README`, `pom.xml`, Java application source, or Java test source at review time. Thus neither proposal could validate package choices against an implementation, run Maven tests, or confirm runtime behavior.

The only specification is [`specs/001-splitsmart/spec.md`](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/spec.md). It includes a Clarifications session dated 2026-10-29 and a completed requirements quality checklist, but still says `Status: Draft`. It is likely post-Clarify, but should not be called formally approved without confirmation.

One source-inventory difference: Spec Kit's `input-baseline.md` says it extracted `Lab_6_Requirement.docx`; Codex says it did not parse that file. Both read `UserRequirement.md`, which the constitution identifies as authoritative for customer needs. The DOCX mentions Android/iOS in addition to web; Spec Kit records the discrepancy and Codex flags it as unverified.

**Fairness conclusion:** same code/spec baseline and substantially the same authoritative inputs, with a limited source-inventory difference concerning the assignment DOCX. The proposals are comparable.

References: [baseline commit](https://github.com/sakibkabir11/Lab-6/commit/11aa9462114cb4eb1cbe14b6f053a0930781b974) · [architecture commit](https://github.com/sakibkabir11/Lab-6/commit/102b55b733e02f9e2b5993db9afb2970d58922a2) · [input baseline](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/input-baseline.md)

## C. Side-by-side comparison

| Area | Spec Kit | Codex | Assessment |
|---|---|---|---|
| Architecture | Layered UI, application, domain, infrastructure | Layered architecture with ports/adapters | Equivalent; retain a simple layered design, not microservices. |
| Packages | Concrete `splitsmart.ui/application/domain/infrastructure` | Generic root with domain/application/presentation/adapter | Spec Kit is more concrete; finalize one root package. |
| Domain model | User, Group, Membership, Expense, SplitAllocation, ApprovalDecision, Obligation, Payment, Balance, ReportQuery/Result | Similar concepts plus BalanceCalculator | Combine: calculator produces a derived balance read model; avoid a separately mutable balance source of truth. |
| Use cases | Registration, groups, expense submission/review, payments, reports | Same, with explicit authorization/orchestration | Equivalent; Spec Kit's workflow documentation is easier to navigate. |
| Financial rules | BigDecimal; currency/scale/rounding/remainder remain open | Same, with explicit Q-02–Q-08 questions | Reuse Codex's decision register. |
| Swing separation | Explicit boundaries and UI contract | Explicit separation and application use cases | Equivalent; retain Spec Kit's UI contract. |
| Persistence | Ports/adapters; technology unselected | Repository ports; technology unselected | Equivalent; decide after platform/deployment scope. |
| Error handling | Expected outcomes and failures in UI contract | More detailed validation, authorization, missing-record, workflow, infrastructure failures | Codex is stronger; add its guidance to Spec Kit. |
| Security | Application authorization and group data protection | Adds credential/session and sensitive logging caveats | Codex is stronger; retain these caveats. |
| Testing | JUnit 5 and granular test IDs | JUnit 5 scenarios | Spec Kit has stronger traceability; enrich it with Codex scenarios. Neither has executed tests. |
| Diagrams | Component, domain, approval sequence | Context/component, domain, approval sequence | Spec Kit component diagram communicates adapter boundary more clearly. Neither was rendered/PlantUML-validated. |
| Traceability | Detailed FR/MVP/NFR/SC matrix with proposed test IDs | Same categories, more grouped | Spec Kit is more actionable. |
| Questions/risks | Research decisions and risk register | Explicit A/Q identifiers and prioritized decisions | Codex has clearer decision register; merge it into Spec Kit. |

### Recommended logical structure

```text
presentation.swing
        |
        v
application (use cases, authorization, coordination)
        |
        v
domain (entities, policies, calculations)
        ^
        |
application ports <--- infrastructure adapters
```

The domain must not depend on Swing or persistence technology. Application workflows coordinate the domain and outbound ports; infrastructure implements those ports.

Refinements:
1. Keep `BalanceCalculator` as a domain service/policy and expose calculated balances as a read model.
2. Treat approval and obligation creation as one consistent application operation. Spec Kit's sequence diagram makes persistence of approval and obligations more explicit than Codex's.

References: [Spec Kit plan](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/plan.md) · [Codex proposal](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/codex-architecture-design.md)

## D. Requirement coverage matrix

Statuses evaluate **design coverage**, not implementation completion. Satisfied means addressed at design level; partial means a policy, adapter, or verification detail remains open.

### Functional requirements

| Requirement | Spec Kit / Codex coverage | Status and required correction |
|---|---|---|
| FR-001 Accounts/authentication | User, registration, authentication workflows | Partial — decide identity, credentials, sessions, recovery. |
| FR-002 Group management | Group and membership workflows | Satisfied — clarify invitation/removal permissions. |
| FR-003 Expense and receipt | Expense and optional receipt boundary | Partial — receipt storage, file constraints, access. |
| FR-004 Equal/percentage splits | Split allocation and validation | Partial — rounding and remainder rules. |
| FR-005 Payer/participants | Payer, participant, obligation relationships | Partial — payer participation and own share. |
| FR-006 Notifications | Notification port/gateway | Partial — channel, delivery, retry, failure behavior. |
| FR-007 Approval | Approval decision and authorization | Partial — self-approval, multiple approvers, rejection/resubmission, reversal. |
| FR-008 Pairwise balances | Derived balances / BalanceCalculator | Partial — cross-group netting and allocation. |
| FR-009 Partial payments | Payment/settlement records | Partial — payment allocation and overpayment. |
| FR-010 Balance/history update | Preserve obligations and append payments | Satisfied conceptually; settlement policy still open. |
| FR-011 Reports | Report query/result | Satisfied conceptually; report semantics need detail. |
| FR-012 Date/filtering | Report query filters | Partial — filters and date boundaries. |
| FR-013 Approval before balance impact | Approval gate | Satisfied — atomic persistence and duplicate prevention required. |
| FR-014 History | Linked records and repository boundaries | Partial — durable storage, audit fields, retention. |
| FR-015 Data access/privacy | Application authorization | Partial — complete authorization and trust boundary. |
| FR-016 Multiple groups | Group membership model | Satisfied — cross-group reporting/netting open. |
| FR-017 Invalid expense rejection | Domain validation | Satisfied for known required-data/positive-amount checks. |
| FR-018 Current members/valid payer | Membership and payer validation | Partial — payer/participant relationship. |
| FR-019 Payment lifecycle | Payment records in balance lifecycle | Partial — timing, overpayment, allocation, reversal. |

### Java Swing MVP requirements

| Requirement | Coverage | Status |
|---|---|---|
| FR-MVP-001 Login | Swing sign-in/login use case | Partial — security policy undefined. |
| FR-MVP-002 Group creation/selection | Group views/use cases | Satisfied at design level. |
| FR-MVP-003 Expense entry | Expense form/submission use case | Satisfied at design level; include payer and full expense data. |
| FR-MVP-004 Approval queue | Pending approval view | Satisfied at design level. |
| FR-MVP-005 Balance display | Balance view/calculator | Satisfied at design level; calculation policies open. |
| FR-MVP-006 Payment entry | Payment form/use case | Satisfied at design level; settlement policies open. |
| FR-MVP-007 Summary/report | Report view/query | Satisfied at design level; filter semantics open. |
| FR-MVP-008 UI/domain separation | Explicit layers and UI contract | Satisfied as a design decision; enforce in code review. |

### Non-functional requirements

| Requirement | Coverage | Status |
|---|---|---|
| NFR-001 Usability | Task-oriented Swing and timed usability tests | Partial — needs working UI and user testing. |
| NFR-002 Accurate balances | Derived balance reconciliation | Partial — depends on financial policies. |
| NFR-003 Data protection | Application authorization/security caveats | Partial — identity, credentials, deployment controls. |
| NFR-004 Approval/notification reliability | Approval state and notification port | Partial — failure/retry policy. |
| NFR-005 Maintainability/separation | Layered boundaries | Satisfied at design level. |
| NFR-006 Monetary precision | BigDecimal | Partial — approve scale/rounding. |
| NFR-007 Testability/traceability | JUnit 5 and traceability matrix | Partial — no tests exist or have run. |
| NFR-008 Auditable history | Linked records/persistence boundary | Partial — storage and audit policy. |
| NFR-009 Increased usage | No quantitative scale target | Partial — define workload and measurable target. |
| NFR-010 Reporting/reconciliation | Report query and reconciliation tests | Partial — filters and balance time semantics. |

### Success criteria

| Criterion | Coverage | Status |
|---|---|---|
| SC-001 Onboarding under 3 minutes | Timed usability test planned | Partial — approved login flow and test needed. |
| SC-002 Correct balance updates | Balance tests planned | Partial — allocation/settlement policies block final expected results. |
| SC-003 Payment entry under 2 minutes | Timed usability test planned | Partial — working UI and usability evidence needed. |
| SC-004 95% of core scenarios pass | Acceptance suite planned; denominator undefined | Missing — define scenario set, weighting, measurement point. |
| SC-005 Report totals reconcile | Reconciliation planned | Satisfied as a plan, not demonstrated. |
| SC-006 No unapproved expense affects balances | Approval gate/tests planned | Satisfied as a design rule, not yet tested in running code. |

The [Spec Kit traceability matrix](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/requirements-traceability.md) is the best working checklist. See [Codex proposal §11](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/codex-architecture-design.md) for its corresponding matrix.

## E. Constitution compliance audit

| Constitution principle | Spec Kit | Codex | Assessment |
|---|---|---|---|
| I. Customer requirement priority | Pass | Pass | Both preserve web-first customer scope and identify Swing MVP as narrower. |
| II. Java 21 and Maven | Pass | Pass | Required stack proposed; no existing Maven project. |
| III. Swing/model separation | Pass | Pass | Domain/workflow logic stays outside Swing. |
| IV. OOP/separation of concerns | Pass | Pass | Clear responsibilities, cohesion, low coupling. |
| V. BigDecimal | Partial | Partial | BigDecimal required, but scale/rounding/allocation deferred. |
| VI. JUnit 5 | Pass | Pass | Real domain tests planned; none exist yet. |
| VII. Traceability/PlantUML | Pass | Pass | Traceability and diagram sources supplied. |
| VIII. Human review | Pass | Pass | Proposals are drafts pending human approval. |

The key caveat is Principle V: explicit scale and rounding rules must match the project's financial rules. The proposals correctly avoid inventing them, but implementation must wait for approval.

[Constitution](https://github.com/sakibkabir11/Lab-6/blob/main/.specify/memory/constitution.md)

## F. Defects, contradictions, and unsupported assumptions

No fundamental architectural contradiction was found. Issues to address:

### High priority

**H-01 — Platform scope unresolved**
- Evidence: `UserRequirement.md` says web-first; constitution requires Swing; spec labels Swing a subset.
- Impact: a Swing desktop application alone does not satisfy the full web-first customer requirement.
- Correction: approve Swing MVP scope and document how the web target is handled.
- Owner: product owner/project owner.

**H-02 — Financial policies incomplete**
- Evidence: Clarifications and FR-004, FR-005, FR-008–010.
- Impact: rounding/allocation choices change obligations and balances.
- Correction: approve currency, scale, rounding, equal-split remainder, percentage allocation, and payer-share behavior.
- Owner: product owner.

**H-03 — Approval/payment lifecycle incomplete**
- Evidence: FR-007, FR-009, FR-013, FR-019 and Edge Cases.
- Impact: invalid sequences or inconsistent outstanding balances.
- Correction: define approver eligibility, self-approval, rejection/resubmission, reversal, payment-before-approval, overpayment, and payment reversal.
- Owner: product owner.

**H-04 — Persistence/security not implementation-ready**
- Evidence: neither proposal selects storage or identity mechanism.
- Impact: history, multi-user access, privacy, notifications, and receipt handling cannot be validated end-to-end.
- Correction: decide deployment scope, then storage, identity, security, and retention.
- Owner: product owner and architect.

### Medium priority

**M-01 — Codex context diagram obscures adapter boundary.** Its prose describes ports/adapters, but the diagram may imply direct infrastructure dependencies. Show infrastructure adapters implementing outbound ports; application depends only on ports.

[Codex context diagram](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/diagrams/context-components.puml)

**M-02 — Balance calculator/read-model distinction.** Make clear that a calculator produces a derived balance view, not a separately mutable ledger.

**M-03 — Approval persistence atomicity.** Document the logical transaction boundary so approval cannot succeed while obligation creation is only partially persisted.

**M-04 — SC-004 denominator undefined.** Define the core-scenario inventory and pass-rate calculation.

**M-05 — NFR-009 capacity target missing.** Specify representative group size, expense volume, and acceptable response time.

### Low priority

**L-01 — Package root not finalized.** Codex uses a placeholder; Spec Kit proposes `splitsmart`. Choose consistently when Maven is initialized.

**L-02 — PlantUML not rendered.** Source inspection is not successful renderer validation. Render and check before acceptance.

## G. Consolidated architecture recommendation

Retain Spec Kit as the base and incorporate Codex's improvements.

### Proposed package structure

```text
splitsmart
├── ui                 # Swing views and event handlers
├── application
│   ├── account
│   ├── groups
│   ├── expenses
│   ├── payments
│   ├── reports
│   └── port
├── domain
│   ├── account
│   ├── groups
│   ├── expenses
│   ├── settlement
│   └── reporting
└── infrastructure     # approved adapters
```

This is a proposal, not an existing repository structure.

### Recommended domain concepts

| Concept | Responsibility |
|---|---|
| User | Account identity and profile |
| Group | Shared expense context |
| GroupMembership | Membership and eligibility |
| Expense | Original expense and workflow state |
| SplitAllocation | Participant shares |
| ApprovalDecision | Approval/rejection record |
| Obligation | Original amount owed |
| Payment | Settlement record |
| BalanceCalculator | Calculates outstanding amounts |
| BalanceView | Derived balance information for display |
| ReportQuery / ReportResult | Report filtering and output |

### Design decisions

1. Start with one Maven application; do not introduce multiple deployables without a demonstrated need.
2. Keep Swing presentation thin. Financial calculations, approvals, and authorization live outside Swing.
3. Use BigDecimal for money; never use floating-point monetary values.
4. Preserve original obligations. Payments are separate records.
5. Pending/rejected expenses do not affect balances.
6. Derive balances from financial records; avoid a second mutable source of truth.
7. Use ports for external dependencies. Choose storage, identity, notification, and receipt adapters only after decisions are approved.
8. Test domain behavior independently with JUnit 5.

Do not adopt microservices, a specific database/ORM, mutable balance ledgers, business calculations in Swing handlers, or invented rounding/overpayment/approval rules.

## H. Diagram and model review

### Spec Kit diagrams
- [splitsmart-components.puml](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/diagrams/splitsmart-components.puml)
- [splitsmart-domain.puml](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/diagrams/splitsmart-domain.puml)
- [expense-approval.puml](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/diagrams/expense-approval.puml)

### Codex diagrams
- [context-components.puml](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/diagrams/context-components.puml)
- [domain-model.puml](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/diagrams/domain-model.puml)
- [expense-approval-sequence.puml](https://github.com/sakibkabir11/Lab-6/blob/main/docs/architecture/diagrams/expense-approval-sequence.puml)

| Diagram | Assessment | Action |
|---|---|---|
| Component architecture | Spec Kit communicates adapter boundary more clearly. | Use Spec Kit version. |
| Domain model | Both show key concepts/relationships. | Combine BalanceCalculator with derived Balance read model. |
| Approval sequence | Spec Kit shows approval/obligation persistence more explicitly. | Use Spec Kit version and add transaction-boundary note. |

**Validation limitation:** source was inspected, but no PlantUML renderer was run. Render and validate before acceptance. Consider adding a payment settlement sequence after payment policies are clarified.

## I. Test and traceability review

The Spec Kit matrix is the stronger starting point because it maps functional, MVP, non-functional, and success criteria to proposed test identifiers.

Recommended test scenarios:

| Area | Scenarios |
|---|---|
| Split calculation | Equal split with remainder; percentage total 100%; invalid totals; decimal precision |
| Payer/participants | Payer included/excluded; payer's share; zero participants; non-member participant |
| Approval | Pending expense has no balance effect; approval posts once; rejection posts nothing; unauthorized approval |
| Payment | Partial/full payment; overpayment; payment before approval; reversal |
| Balance | Pairwise obligations; multiple expenses/payments; group separation |
| Authorization | No access to another user's private data or unrelated group data |
| Notifications | Current members receive requests; delivery failure/retry |
| Reports | Date boundaries; no matches; totals reconcile with expenses/payments |
| History | Expense, approval, obligation, and payment remain linked/auditable |

Do not invent expected results for unresolved policies. Obtain product decisions first, then encode them in tests.

Test IDs in both proposals are **planned tests**, not evidence that tests exist. There is no `pom.xml` or Java test tree at review time.

## J. Product-owner questions

Resolve before implementation:

1. **Platform:** Is the deliverable only the Java Swing MVP, or must it ultimately satisfy the web-first requirement? Is Android/iOS in scope?
2. **Currency:** One currency per group, or multiple currencies?
3. **Rounding:** What scale and rounding mode should calculations use?
4. **Equal splits:** How are leftover cents allocated?
5. **Payer:** Must payer be a participant? How is the payer's share represented?
6. **Approval:** Can creator self-approve? Is one approval enough when several approvers are designated?
7. **Rejection:** Can rejected expenses be edited/resubmitted? Can approval be reversed?
8. **Payments:** Can payment exceed outstanding amount? Can one payment settle multiple obligations?
9. **Payment timing:** Can payment be recorded before expense approval?
10. **Membership:** What happens to existing obligations when a user leaves/is removed?
11. **Notifications:** In-app, email, or both? Does delivery failure block submission?
12. **Persistence/security:** Local-only or shared across users/devices? What security and retention controls apply?
13. **Reports:** Current-state summaries or historical snapshots? Which filters?
14. **Acceptance:** What workload target applies to NFR-009, and what counts toward SC-004's 95%?

The first five can change the domain model and financial calculations.

## K. Action plan

| Order | Priority | Responsible | Action / exit criteria |
|---:|---|---|---|
| 1 | Critical | Product owner | Confirm platform and delivery scope; record approved decision. |
| 2 | Critical | Product owner | Approve currency, rounding, split allocation; financial rules testable and unambiguous. |
| 3 | High | Product owner | Resolve payer, approval, and payment lifecycle; domain lifecycle approved. |
| 4 | High | Architect | Consolidate proposals; no contradictory diagrams or class responsibilities. |
| 5 | High | Architect | Add Codex error/security guidance to Spec Kit UI/application design. |
| 6 | High | Architect | Define persistence, identity, notification, receipt boundaries after scope decision. |
| 7 | Medium | Product owner/architect | Define NFR-009 capacity and SC-004 denominator. |
| 8 | Medium | Architect | Render/validate PlantUML and correct diagrams. |
| 9 | Medium | Human reviewer | Approve consolidated architecture and traceability matrix. |
| 10 | After approval | Development team | Create Java 21 Maven project and begin implementation with JUnit 5. |

## L. Final recommendation

**Recommended baseline: Spec Kit.**

Primary artifacts:
- [Spec Kit architecture plan](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/plan.md)
- [Spec Kit domain model](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/data-model.md)
- [Spec Kit traceability matrix](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/requirements-traceability.md)
- [Spec Kit research and decisions](https://github.com/sakibkabir11/Lab-6/blob/main/specs/001-splitsmart/research.md)

Adopt from Codex:
- Prioritized Q-01–Q-08 decision register.
- Explicit security, authorization, and error-handling guidance.
- Warning that a simplified login is not a complete security design.
- Preservation of obligations and derived balances.
- Warnings about undefined scale and acceptance criteria.

**Is SplitSmart ready for implementation? Not yet.** Platform scope, financial rules, approval/payment lifecycle, and deployment/security decisions still need human approval. Consolidate the documents and resolve critical product questions first; then approve the architecture and proceed to implementation planning.

### Human approval checklist

- [ ] Confirm Swing MVP versus web/mobile scope.
- [ ] Approve currency, scale, rounding, and split allocation.
- [ ] Approve payer and participant behavior.
- [ ] Approve approval and payment lifecycle.
- [ ] Approve persistence, authentication, and notification direction.
- [ ] Approve consolidated diagrams and domain model.
- [ ] Approve requirement-to-design-to-test matrix.
- [ ] Authorize implementation only after decisions are documented.

---

*Review note: This report reflects the repository state inspected during the review. Re-run baseline and artifact checks if the repository changes before using this report as an implementation approval record.*
