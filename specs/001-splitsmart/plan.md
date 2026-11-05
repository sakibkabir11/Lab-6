# SplitSmart Architecture and Design Proposal

**Status**: Proposal pending human review
**Branch at baseline**: `main`
**Feature directory**: `specs/001-splitsmart/`
**Date**: 2026-11-05
**Specification**: [spec.md](./spec.md)

## Summary

This proposal separates Swing presentation, application workflows, the financial/domain model, and infrastructure boundaries. It covers the constitution-required Java Swing MVP while preserving the clarified specification's broader customer scope as a separate concern. It does not choose a deployment model, storage technology, authentication mechanism, notification channel, or financial rounding policy where the inputs do not decide them.

The customer source says the primary product is web-based; the supplementary Lab 6 assignment text also mentions Android and iOS. The constitution requires Java 21, Maven, and Swing, and the clarified specification labels Swing as an MVP subset rather than a replacement for the web-first scope. Therefore this is a proposal for a Swing MVP architecture, not a claim that Swing satisfies the full web/mobile target. Product-owner approval is required before treating the MVP as the complete product.

## Technical Context

**Language/Version**: Java 21 (constitution requirement; no Java project currently exists)
**Primary Dependencies**: Maven; JUnit 5 for tests. Additional libraries are not selected.
**Storage**: Undecided. Define repository ports; choose an adapter only after product-owner approval.
**Testing**: JUnit 5, with behavior tests that execute real domain logic independently of Swing.
**Target Platform**: Constitution-mandated Swing MVP; primary web target in `UserRequirement.md`; Android/iOS is mentioned in the Lab 6 assignment document. Platform scope is unresolved across these inputs.
**Project Type**: Proposed Java application with a Swing presentation for the MVP; final product topology is undecided.
**Performance Goals**: No quantitative latency, throughput, or capacity target is specified. NFR-009 requires core flows to remain usable as users and expenses increase.
**Constraints**: `BigDecimal` for all money; no `float` or `double` money; UI/domain separation; OOP; Maven; Java 21; JUnit 5; human review. Currency, amount scale, rounding, equal-split remainder allocation, and persistence are undecided.
**Scale/Scope**: Small groups are the stated initial context; no supported user/expense limit is specified. Preserve the full customer requirement inventory separately from the Swing MVP subset.

## Constitution Check

| Principle or constraint                 | Proposal check                    | Evidence / condition                                                                                                                                                                     |
| --------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Customer requirements are authoritative | Pass with scope conflict recorded | Customer features remain mapped in [requirements-traceability.md](./requirements-traceability.md). The web/mobile versus Swing scope mismatch is an open decision, not silently resolved. |
| Java 21 and Maven                       | Pass                              | Proposed toolchain only; there is no existing `pom.xml` or Java source to preserve.                                                                                                    |
| Swing UI separated from model/workflows | Pass                              | Swing is limited to presentation and input; use cases and domain rules are outside UI classes.                                                                                           |
| OOP and separation of concerns          | Pass                              | Responsibilities are split into UI, application, domain, and infrastructure boundaries.                                                                                                  |
| `BigDecimal` for money                | Pass                              | All monetary concepts use `BigDecimal`; currency and rounding policy remain open.                                                                                                      |
| JUnit 5 and real behavior tests         | Pass                              | Planned tests execute domain calculations and workflows, not mock-only outcomes.                                                                                                         |
| Requirement traceability and PlantUML   | Pass                              | Matrix and diagram sources are included in this feature directory.                                                                                                                       |
| Human review of AI output               | Pass as a process condition       | This document is a proposal and must be reviewed before implementation or acceptance.                                                                                                    |

**Gate result**: Architecture direction is suitable for human review, but implementation readiness is **blocked** by the open decisions listed in [research.md](./research.md) and [requirements-traceability.md](./requirements-traceability.md). The proposal does not claim that unresolved financial or platform policies have been decided.

## Architecture Overview

### Context and boundary

The proposed boundary is the application logic needed for the constitution-required Swing MVP. Users interact through Swing forms and views. UI events are translated into application requests; application use cases enforce workflow sequencing and coordinate domain behavior through explicit ports. Domain objects and policies own expense validation, approval eligibility, obligation creation, balance derivation, payment application, and reporting semantics.

External authentication, notification delivery, receipt storage, and durable persistence are not selected. The architecture defines boundaries for these concerns without asserting an API, database, file format, or network topology.

### Components and responsibilities

| Component                                               | Responsibility                                                                                                                                          | Must not own                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Swing presentation (`splitsmart.ui`)                  | Render account/group/expense/approval/balance/payment/report views; collect input; display application outcomes                                         | Split arithmetic, approval rules, authorization decisions, balance mutations |
| Application workflows (`splitsmart.application`)      | Register/sign in, manage groups, submit/review expenses, notify through a port, record payments, query reports; coordinate transactions and permissions | Swing widgets or persistence-specific queries                                |
| Domain (`splitsmart.domain`)                          | User/group membership, expense/split/approval/payment concepts, validation invariants, obligations and balance calculations                             | UI types, database/network libraries, credential or delivery implementation  |
| Outbound ports (`splitsmart.application.port`)        | Describe required persistence, identity, notification, and receipt operations at the application boundary                                               | Vendor-specific details                                                      |
| Infrastructure adapters (`splitsmart.infrastructure`) | Implement approved persistence, identity, notification, and receipt mechanisms                                                                          | Business rules or UI presentation                                            |
| JUnit 5 verification (`src/test/java`)                | Verify domain behavior, use-case workflows, adapter contracts when adapters exist, and requirement scenarios                                            | Replacing behavior assertions with mock-only interaction checks              |

### Dependency direction

`ui -> application -> domain`. Application workflows may depend on domain types and outbound port abstractions. Infrastructure adapters implement those abstractions and may depend inward on their interfaces and domain data. The domain depends on none of the other layers. UI code does not call infrastructure directly. No framework-specific dependency is proposed inside the domain.

The ports are design boundaries, not a mandate to create a large abstraction set: add only ports needed by an approved use case. Repository interfaces are justified because workflows need storage-independent access and no storage technology is established.

### Proposed package and project structure

No source structure exists yet; this is a proposal, not a report of current files.

```text
pom.xml
src/
├── main/java/splitsmart/
│   ├── ui/                         # Swing views and UI event adapters
│   ├── application/
│   │   ├── account/                # registration and sign-in use cases
│   │   ├── groups/                 # group membership workflows
│   │   ├── expenses/               # submit and review workflows
│   │   ├── payments/               # payment recording workflow
│   │   ├── reports/                # report queries
│   │   └── port/                   # persistence and external-effect interfaces
│   ├── domain/
│   │   ├── account/
│   │   ├── groups/
│   │   ├── expenses/
│   │   ├── settlement/
│   │   └── reporting/
│   └── infrastructure/             # adapters only after their technologies are approved
└── test/java/splitsmart/
    ├── domain/
    ├── application/
    └── infrastructure/
```

Keep the initial application as one Maven project unless implementation evidence demonstrates a separate deployable is needed. This avoids inventing service or module boundaries and does not determine the eventual web/mobile architecture.

## Detailed Design

### Domain model

The candidate model and its invariants are defined in [data-model.md](./data-model.md). It is limited to concepts present in the specification and constitution: `User`, `Group`, membership, `Expense`, split allocation, approval decision, payment, obligation, derived balance, and report query/result. Proposed identifiers and package names are design vocabulary, not new customer requirements.

Money uses `BigDecimal` throughout. Percentage values also use decimal arithmetic. An expense amount must be greater than zero; percentage allocations must total exactly 100% as specified. The inputs do not establish currency, amount scale, rounding mode, equal-split remainder ownership, or whether the payer must be a participant. These remain unresolved and no settlement result should be treated as production-ready until they are decided.

### Use cases and interaction flows

1. **Account access**: UI submits registration/sign-in input to an application use case. The use case validates the request and delegates identity verification/account storage through ports. Authorization is checked in application workflows using the authenticated user and group context. Credential policy and identity adapter are undecided.
2. **Group management**: UI requests group creation or membership changes. The workflow validates the actor and membership operation, updates the group through a repository boundary, and returns a view-ready result. Historical membership effects on existing expenses require a product decision.
3. **Expense submission**: UI sends amount, date, description, split method, payer, participants, and optional receipt to a use case. Application validation checks the selected group and current membership; domain validation checks positive amount and, for percentage splits, exact total. A valid expense enters `PENDING_APPROVAL`; it does not create balance obligations. The notification port is asked to notify all current group members.
4. **Expense review**: An authorized designated approver submits a decision. A valid approval moves the expense to `APPROVED` and causes obligation/balance calculations; rejection moves it to `REJECTED` and leaves balances unchanged. The spec does not define whether the submitter may approve, whether approval can be reversed, or what happens after rejection.
5. **Balance and payment**: A balance query derives user-to-user obligations from approved expenses and recorded payments. Payment recording preserves the original obligation and adds a settlement record; partial payment is supported. Exceeding-balance behavior, payment direction confirmation, and payments recorded before final approval are open questions.
6. **Reporting**: A report query applies the specified date range and any supported filters, then summarizes expenses, payments, and balances from the underlying records. The allowed filters and empty-result presentation need product confirmation.

An expense lifecycle sequence is in [diagrams/expense-approval.puml](./diagrams/expense-approval.puml). The component and domain diagrams are [diagrams/splitsmart-components.puml](./diagrams/splitsmart-components.puml) and [diagrams/splitsmart-domain.puml](./diagrams/splitsmart-domain.puml).

### Persistence and data integrity

Persistence technology is intentionally undecided. Application workflows use repository ports for accounts, groups, expenses, approvals, and payments, plus narrowly scoped ports for receipt references and notifications if those integrations are approved. No table schema, ORM, file layout, or database is proposed.

The chosen adapter must preserve the relationship among an expense, its approval decision, generated obligations, and subsequent payment records. Approval and balance posting must not leave an expense in a partial state; the implementation must define the atomicity boundary appropriate to the eventual store. Recalculated balances must be reconcilable to approved expense allocations less settlement records. These are integrity needs, not a selection of a transaction technology.

### Swing presentation and UI boundary

The UI interaction contract is in [contracts/ui-contract.md](./contracts/ui-contract.md). A small set of views may cover sign-in, group selection/management, expense entry, pending approvals, balances/payments, and reports. The exact window layout and navigation are not specified.

Views collect input and display validation or workflow outcomes. UI event handlers call application use cases; they do not calculate shares, decide approval eligibility, update balances, or write persistence records. Domain/application results are mapped to user-visible messages without exposing unrelated users' private data.

The Swing MVP is a technical constraint from the constitution, while the customer source names web as the primary platform and the Lab 6 assignment also mentions Android/iOS. Any non-Swing client or shared backend is outside this proposal until the platform scope is confirmed.

### Validation, errors, security, and privacy

- Reject missing/malformed required expense input, non-positive amounts, percentages not totaling 100%, non-member participants, and invalid payers as specified (FR-003, FR-004, FR-017, FR-018 and Clarifications).
- Keep an expense out of balances until its required approval is recorded (FR-007, FR-013).
- Represent expected domain validation/workflow failures explicitly to the application layer; the UI presents actionable correction or access-denied feedback. Unexpected infrastructure failures must not be reported as successful operations.
- Enforce account and group-context authorization in application workflows, not only by hiding Swing controls (FR-001, FR-015, NFR-003). Credential handling, authorization granularity, audit retention, and logging policy require approval.
- Preserve expense, approval, and payment history (FR-014, NFR-008). The exact audit fields and retention are not specified.
- Logging should distinguish operational diagnostics from business audit history. Do not log credentials or receipt contents; select logger, retention, and any sensitive-data policy after security review.
- Required behavior is separated from recommendations: least-privilege access, avoiding sensitive values in logs, and protecting receipt data are recommendations pending a security/privacy policy.
- Notification destination/channel, retry behavior, and failure handling are undecided. A notification failure must not be silently represented as successful delivery; whether it blocks expense submission requires a decision.

### JUnit 5 verification strategy

Planned tests are mapped in [requirements-traceability.md](./requirements-traceability.md). Domain tests cover positive-amount validation, exact percentage totals, allocation behavior after a rounding policy is approved, approval-gated obligation creation, partial payments, preservation of original obligations, and balance reconciliation. Application tests cover authenticated group context, current-member validation, designated approver checks, notification requests, and reporting filters. UI tests should focus on input-to-use-case wiring and display state, not duplicate business rules.

Use real domain objects and deterministic examples. Add adapter contract/integration tests only after a concrete adapter is selected. Do not write tests that merely assert mocks were called. Test payment overage, zero participants, self-approval, and other unresolved scenarios only after product decisions define expected outcomes.

## Requirement Traceability

See [requirements-traceability.md](./requirements-traceability.md) for all FR, MVP, NFR, and success-criterion links to components and planned tests. No requirement ID is invented. The supplementary mobile-platform wording in the Lab 6 assignment is called out as a source discrepancy rather than assigned a fabricated FR identifier.

## Assumptions, Risks, and Open Questions

The complete register is in [research.md](./research.md). Critical decisions include:

1. Whether delivery scope is web-first, Swing MVP only, or includes web and mobile clients; source materials differ.
2. Currency, decimal scale, rounding, equal-split remainder handling, payer participation, and overpayment behavior.
3. Approval rules beyond the confirmed minimum of one designated approver, including self-approval and rejection/reversal.
4. Authentication/authorization detail, notification channel/failure policy, receipt storage, persistence technology, and report filter semantics.
5. Group membership changes and payments entered before an expense is approved.

## Input Baseline

The baseline, exact input paths, observed repository inventory, and missing inputs are recorded in [input-baseline.md](./input-baseline.md). The repository was on `main` at commit `11aa9462114cb4eb1cbe14b6f053a0930781b974`. The working tree already had modifications to the constitution and spec before proposal generation; neither authoritative file was edited by this task.

## Project Structure

### Documentation (this feature)

```text
specs/001-splitsmart/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── input-baseline.md
├── requirements-traceability.md
├── contracts/
│   └── ui-contract.md
└── diagrams/
    ├── splitsmart-components.puml
    ├── splitsmart-domain.puml
    └── expense-approval.puml
```

No application source or test tree existed at the baseline. The Java/Maven layout above is proposed only.

## Complexity Tracking

| Deviation or unresolved constraint                           | Why it remains                                                                                                | Simpler alternative rejected because                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Swing MVP versus web-first (and supplementary mobile) target | Constitution mandates Swing, while customer materials identify web and, in the Lab 6 assignment, Android/iOS. | Claiming Swing fulfills web/mobile would misrepresent the customer scope; designing extra clients without approval would invent scope. |
| Persistence/identity/notification ports                      | Required workflows imply storage and external effects, but no technology is established.                      | Direct concrete dependencies would commit to unsupported mechanisms.                                                                   |
