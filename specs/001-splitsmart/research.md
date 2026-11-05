# Research and Design Decisions

**Status**: Proposal; no external technology selected beyond constitution mandates.  
**Inputs**: See [input-baseline.md](./input-baseline.md).

## Decisions

### D-01: Keep the design within the mandated Java 21/Maven/Swing MVP

- **Decision**: Propose Java 21, Maven, Swing, and JUnit 5 as the MVP stack.
- **Rationale**: These are technical constraints in the current constitution, not customer requirements.
- **Alternatives considered**: Web/mobile clients are named in the customer source material. They are not designed here because the constitution requires Swing and the feature spec distinguishes Swing MVP from full product scope.
- **Traceability**: Constitution II, III, VI; FR-MVP-001 through FR-MVP-008.
- **Condition**: Product-owner approval is needed to reconcile the MVP with the web-first and supplementary Android/iOS source statements.

### D-02: Use UI, application, domain, and infrastructure boundaries

- **Decision**: Use one proposed Java project with distinct packages and inward dependency direction; keep the domain independent from Swing and adapters.
- **Rationale**: This supports testability and is the simplest arrangement consistent with OOP, Swing/model separation, and current absence of any codebase.
- **Alternatives considered**: A multi-service or multi-module design is not justified by the sources and would introduce unsupported deployment assumptions.
- **Traceability**: Constitution III, IV, VI; NFR-005, NFR-007; FR-MVP-008.

### D-03: Define ports without choosing adapters

- **Decision**: Represent account, group, expense, approval, and payment storage as application-facing repository boundaries. Define notification and receipt boundaries only where required by an approved workflow.
- **Rationale**: The product requires history, notifications, and optional receipts, but no persistence, delivery, or file technology is given.
- **Alternatives considered**: A database, local files, a cloud service, or direct in-memory storage would each assert an unsupported implementation choice.
- **Traceability**: FR-001, FR-003, FR-006, FR-014, NFR-008.
- **Open question**: Select durable storage and delivery mechanisms after scope and deployment decisions.

### D-04: Keep all money in `BigDecimal`

- **Decision**: Use `BigDecimal` for expense amounts, allocations, payments, obligations, balances, and report totals. Use decimal arithmetic for percentages.
- **Rationale**: Explicit constitution requirement and NFR-006.
- **Alternatives considered**: `float` and `double` are prohibited for monetary values.
- **Traceability**: Constitution V; FR-004, FR-008 to FR-010; NFR-002, NFR-006.
- **Unresolved**: Currency, scale, rounding mode, and equal-split remainder distribution are not chosen. Percentage inputs must total exactly 100% per the clarified specification; the accepted input scale/format is not specified.

### D-05: Make approval a gate before obligation creation

- **Decision**: A submitted expense starts pending; no obligation affects balances until a designated approver approves it. A rejection leaves balances unchanged.
- **Rationale**: The clarification and FR-007/FR-013 expressly require approval before balance changes.
- **Alternatives considered**: Immediate posting followed by reversal is inconsistent with the explicit gate.
- **Traceability**: FR-007, FR-013, NFR-004, NFR-008.
- **Open questions**: Whether the creator may approve, whether any one of multiple designated approvers suffices, how rejection can be corrected/resubmitted, and whether approvals may be reversed.

### D-06: Treat balances as derivable from approved expense obligations and payment history

- **Decision**: Model the original obligation separately from settlement records and derive outstanding balances from both.
- **Rationale**: FR-009/FR-010 require partial payments and preservation of the original obligation; derivation supports reconciliation.
- **Alternatives considered**: Overwriting the obligation amount on each payment would lose settlement history.
- **Traceability**: FR-005, FR-008 to FR-010, FR-014, FR-019; NFR-002, NFR-008.
- **Open questions**: Payment overage, allocation to one or multiple obligations/groups, payment before approval, and payer-participant relationship.

### D-07: Preserve the full requirement scope separately from the MVP

- **Decision**: Trace the customer features, MVP subset, and NFRs separately. Do not equate the Swing MVP with complete product fulfillment.
- **Rationale**: The spec states that the MVP is a narrower subset; `UserRequirement.md` names web as primary, and the Lab 6 source additionally mentions Android/iOS.
- **Alternatives considered**: Treating web/mobile as out of scope without approval would silently discard customer source scope.
- **Traceability**: FR-MVP-001..008; full requirements inventory in `spec.md`; source scope discrepancy in [input-baseline.md](./input-baseline.md).

## Required human decisions before implementation

1. Confirm platform and delivery scope: Swing-only educational MVP, web-primary product, Android/iOS clients, or a staged plan spanning them.
2. Set currency model, decimal scale, rounding mode, and equal-split remainder rule; decide whether allocations must sum exactly to the expense total.
3. Confirm whether payer must be among participants; whether a participant can owe the payer their full share; behavior for zero participants.
4. Define designated approver cardinality, self-approval, rejection/resubmission, and approval reversal.
5. Define payment direction, obligation association, overpayment, payment timing relative to approval, and correction/reversal.
6. Decide group member removal/invitation effects on existing expenses and outstanding balances.
7. Select authentication/security policy, notification channel and failure behavior, receipt storage/type limits, and report filters.
8. Select persistence and deployment only after platform scope is confirmed.

## Risks

| Risk | Impact | Mitigation / decision needed |
|---|---|---|
| Platform requirements conflict | The proposed Swing MVP may not deliver the web-first customer product or the assignment's Android/iOS wording. | Obtain product-owner scope approval; do not treat the MVP as full delivery. |
| Financial rules are incomplete | Different rounding/allocation rules can produce different balances and reports. | Block production calculation behavior until currency, scale, rounding, and remainder policy are approved. |
| Approval semantics are incomplete | Expenses may remain pending or be approved by an unintended party. | Confirm approver selection, self-approval, rejection, and reversal policy. |
| Persistence and delivery are undecided | Audit history, notifications, and receipts cannot be concretely validated end-to-end. | Choose adapters after deployment and privacy needs are approved. |
| Membership lifecycle is unspecified | Historical expense visibility and debt after a member leaves may be inconsistent. | Define membership history and outstanding obligation policy. |
| Authentication/security requirements are broad | Unauthorized access to personal or group financial data may result. | Approve identity, authorization, credential, privacy, and audit controls before implementation. |
