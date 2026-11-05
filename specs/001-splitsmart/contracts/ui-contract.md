# Proposed Swing UI Interaction Contract

**Status**: Logical interaction contract only; no screen layout or navigation is approved.

## Contract rules

1. A Swing view collects and formats user input, invokes an application use case, and renders its result.
2. Views and event handlers do not calculate splits/balances, decide approval eligibility, or access persistence directly.
3. Application outcomes distinguish successful completion, validation/workflow rejection, access denial, and unexpected infrastructure failure. The UI must not display an error as a successful operation.
4. Account and group-context authorization is enforced by application workflows, even if a view hides unavailable actions.
5. User-facing group financial views return only data the current user is authorized to see.
6. Pending expense submission is visibly distinct from approval and does not imply a balance change.

## User interactions and application boundary

| Interaction | Application request | Result displayed |
|---|---|---|
| Sign in / register | Account workflow request with user-entered values | Authenticated account state or actionable failure |
| Create/select group | Group workflow request | Authorized group summary or validation/access failure |
| Submit expense | Group, amount, date, description, split inputs, payer, participants, optional receipt reference | Pending expense result or field/workflow errors |
| Review expense | Expense identifier and approve/reject decision | Updated workflow status; balances shown only after approval |
| View balances | Authorized user/group query | Pairwise outstanding amounts from application result |
| Record payment | Obligation reference and payment input | Recorded settlement and updated outstanding amount, or policy/validation error |
| View report | Date range and confirmed filters | Summary of authorized expense/payment/balance data |

## Unspecified behavior

This contract intentionally does not choose window composition, navigation, field formats, authentication controls, notification channel, receipt upload behavior, error wording, or policies for unresolved financial edge cases. Those require product-owner decisions and UI review.
