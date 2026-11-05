# Proposed Domain Model

**Status**: Proposal pending human review. Concepts are drawn from the clarified specification and constitution; details marked open are not decided requirements.

## Concepts

The entities need stable references for relationships and authorization, but no identifier format, generator, or persistence key is selected.

| Concept | Proposed responsibility and relationships | Supported invariants / open details |
|---|---|---|
| `User` | Identified account used to authenticate and associate activity with a person. | Unique account and sign-in are required (FR-001). Credential fields and identity provider are not specified. |
| `Group` | Named shared-expense context with current members and expenses. | Supports multiple groups per user (FR-016). Group naming uniqueness and membership administration rules are open. |
| `GroupMembership` (inferred) | Associates a user with a group and supports the current-member check at expense submission. | Participants must be current group members (clarification, FR-018). Membership history and removal effects are open. |
| `Expense` | Group expense containing amount, date, description, payer, participant set, split method, optional receipt reference, and workflow status. | Amount must be positive (clarification, FR-017). It must not affect balances before approval (FR-013). Empty-participant behavior and payer inclusion are open. |
| `SplitAllocation` (inferred) | Represents the share assigned to each expense participant, with equal or percentage basis. | Percentage shares total exactly 100% (clarification, FR-004). Monetary allocation scale and remainder rule are open. |
| `ApprovalDecision` | Records an approver's decision for an expense. | At least one designated approver is required before an expense can affect balances (FR-007). Decision audit fields, self-approval, multiple-approver semantics, and reversal are open. |
| `Obligation` (inferred) | Records the original amount one user owes another as a result of an approved expense. | Derived from approved expense allocations and payer. Preserve original obligation after partial payment (FR-005, FR-010). Payer-participant treatment and currency are open. |
| `Payment` | Records a settlement transfer, including when it was made, against outstanding balance(s). | Partial settlement is allowed (FR-009); payment history is preserved (FR-010, FR-014). Debtor/creditor direction, allocation across one or multiple obligations, overpayment, and reversals need policy. |
| `Balance` | Read model of outstanding amounts between two users within the relevant group context. | Derived from approved obligations minus recorded settlements; should reconcile to source records (FR-008, NFR-002). Whether cross-group netting is allowed is not specified. |
| `ReportQuery` / `ReportResult` | Application query and user-visible summary over expenses, payments, and balances. | Date filtering and relevant parameters are supported (FR-011, FR-012). Exact filters and empty-result presentation are open. |

## Financial representation

- Every monetary amount, share, payment, obligation, balance, and financial total uses `BigDecimal`. No floating-point money is permitted.
- Percentage values use decimal arithmetic and must sum exactly to 100% for a percentage split.
- Currency is not specified. Do not mix currencies or assume a currency until the product owner establishes a currency rule.
- Amount scale, rounding mode, equal-split remainder allocation, and whether allocated monetary shares must sum to the original amount are unresolved. Do not hide these choices in UI formatting or repository code.
- Percent validation's exact-total rule does not itself settle how monetary cents are allocated after percentage application.

## Expense lifecycle

```text
PENDING_APPROVAL -- designated approver approves --> APPROVED
PENDING_APPROVAL -- designated approver rejects --> REJECTED
APPROVED -- creates/updates obligations and derived balances
REJECTED -- does not affect balances
```

The lifecycle states and transitions are proposed directly from the required pending/review/approved/rejected behavior. Editing, resubmission, cancellation, approval reversal, and duplicate decision behavior are open. They must not be added as facts without product approval.

## Payment lifecycle and balance invariant

A payment is an additional settlement record; it does not mutate or replace the original expense or obligation. A recorded payment date is needed to satisfy payment tracking and reporting. Whether one payment applies to one or multiple obligations is not decided. The intended reconciliation is:

`outstanding obligation = approved obligation amount - valid payments applied to that obligation`

The invariant is conceptual and uses `BigDecimal`. It does not define how to handle a negative outstanding amount, overpayment, disputed/failed payment, or correction; those rules remain open. A derived balance should be explainable from approved expenses and payment history (FR-008 to FR-010, FR-014, FR-019).

## Ownership and boundary

Domain objects own domain validation and transitions. Application workflows authorize actors and coordinate repository/notification/receipt ports. Swing displays input and results only. Persistence records must retain links among group, expense, payer, participants, approval, obligations, and payment history, but no physical schema is selected.
