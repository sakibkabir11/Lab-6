# Architecture Proposal Validation Guide

This document describes how a future implementation should be validated. No application code, Maven build, or runnable test suite exists yet, so the commands below are implementation-phase checks rather than commands that currently pass.

## Prerequisites

- Product-owner approval of platform scope, financial rules, identity, persistence, notification, and receipt decisions recorded in [research.md](./research.md).
- Java 21 and Maven installed and selected for the project.
- A Maven project and JUnit 5 tests added during implementation.
- Any concrete storage or notification adapter configured according to its separately approved design.

## Proposed verification sequence

1. Run the domain unit tests for expense validation, percentage totals, approval gating, obligations, partial payments, balance reconciliation, and report totals.
2. Run application workflow tests for group membership checks, approver authorization, notification requests, payment recording, and report filters.
3. Run adapter contract/integration tests after persistence, identity, receipt, or notification technologies are selected.
4. Run UI interaction tests to confirm Swing views delegate to application use cases and render results without implementing business rules.
5. Run requirement-level acceptance scenarios listed in [requirements-traceability.md](./requirements-traceability.md).
6. Review diagram syntax and verify class/component boundaries against [plan.md](./plan.md), [data-model.md](./data-model.md), and the `.puml` files.

Once `pom.xml` and tests exist, the intended Maven test command is:

```text
mvn test
```

Expected outcome after implementation: JUnit 5 tests execute successfully and report each requirement-linked behavior. This guide makes no claim that the command works in the current repository.

## Example end-to-end validation scenario

1. Create/sign in as a user and create a group containing current members.
2. Submit an expense with a positive amount, explicit payer, valid participant set, and valid split.
3. Verify that the new expense is pending and contributes nothing to balances.
4. Approve it as an authorized designated approver; verify the approved allocation contributes to balances.
5. Record a partial payment and verify the original obligation remains while the outstanding balance decreases by the payment amount.
6. Request a date-filtered report and verify its totals reconcile to the expense, approval, and payment records.

Concrete expected amounts for equal splits or percentage allocations must wait until currency, scale, rounding, and remainder behavior are approved.

## Related design

- [UI contract](./contracts/ui-contract.md)
- [Domain model](./data-model.md)
- [Requirement/test matrix](./requirements-traceability.md)
