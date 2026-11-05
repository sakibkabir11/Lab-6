# Feature Specification: SplitSmart

**Feature Branch**: `001-splitsmart`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Read UserRequirement.md in this workspace as the authoritative customer requirements. Write a testable SplitSmart feature specification: actors, user scenarios, functional and non-functional requirements, acceptance criteria, requirement IDs (FR-001, etc.), and open questions. Preserve all original customer features in the requirements inventory; label the Java Swing MVP subset separately. Do not write Java code. Do not edit UserRequirement.md."

## Actors

- **Individual User**: A person who creates an account, joins groups, creates expenses, records payments, and reviews personal balance information.
- **Group Member**: A user participating in a shared group whose expenses and balances are tracked collectively.
- **Approver**: A user or designated reviewer responsible for approving or rejecting a newly created expense before it affects balances.
- **System**: The application that validates input, computes balances, sends notifications, and produces reports.

## Clarifications

### Session 2026-10-29

- Q: Who is the payer for a shared expense, and how should the system calculate balances when some users participated but another user paid the bill? → A: Each expense has one explicit payer and one or more participants; the system calculates each participant’s share relative to the payer and tracks who owes whom.
- Q: How should percentage-based splitting behave when the percentages entered for a single expense do not add up to 100%? → A: Reject the expense and require the user to correct the percentages until they total 100%.
- Q: What is the required rule for an invalid amount or a zero/negative value in a new expense? → A: Reject the expense unless the amount is a positive value greater than zero.
- Q: How should the system treat group membership and participant selection when a user is not a member of the selected group or when the payer is not included in the participant list? → A: Reject the expense unless all selected users are current group members, and the payer is valid for that expense.
- Q: How should the system handle notifications and approval when a new expense is created—must the creator or only the group be notified, and does approval require a single reviewer or multiple reviewers? → A: Notify all current group members and require at least one designated approver before the expense can affect balances.
- Q: How should the system treat a payment that settles only part of a balance or is recorded before the balance is final? → A: Partial payments are allowed and reduce the outstanding balance while preserving the original obligation record.
- Q: What is the expected authentication model for user access, and do we treat login as a required feature of the SplitSmart core or only the Java Swing MVP? → A: Authentication is required in the core product, and the Java Swing MVP includes a simplified login flow consistent with the same access-control rules.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and manage personal account (Priority: P1)

A new user creates an account and logs in to access their own expense and balance information without seeing other users' private data.

**Why this priority**: Account setup and identity are foundational to every other SplitSmart action. Without a user identity, no group membership or expense tracking can be trusted.

**Independent Test**: A user can create a profile, sign in, and view only their own account details and balances.

**Acceptance Scenarios**:

1. **Given** a new person has not yet created an account, **When** they register with valid information and sign in, **Then** they receive an account that can be used to access only their own data.
2. **Given** an authenticated user, **When** they view their account dashboard, **Then** they can see their personal balances and expense-related information only for their own membership context.

---

### User Story 2 - Create and manage a group (Priority: P1)

A user creates a group for roommates, travelers, coworkers, or family members and can manage who belongs to it.

**Why this priority**: Groups are the structure that enables shared expenses and settlement tracking. This is central to the value proposition of SplitSmart.

**Independent Test**: A user can create a group, add participants, and confirm that later expenses are associated with the group.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a group with a name and selected members, **Then** the group is created and visible in their group list.
2. **Given** an existing group, **When** a member is invited or added, **Then** the members list updates and future expenses can include the new participant.

---

### User Story 3 - Create and review shared expenses (Priority: P1)

A user adds a shared expense with amount, date, description, split method, involved users, and optional receipt image. The expense is then reviewed and approved before it affects balances.

**Why this priority**: Expense creation is the core transaction in the product and drives balance adjustments, notification flows, and reporting.

**Independent Test**: A user can create a valid shared expense, see it in the review flow, and confirm that it impacts balances only after approval.

**Acceptance Scenarios**:

1. **Given** a user is in a group with other members, **When** they create an expense with a valid amount, description, date, and participants, **Then** the expense is stored in the review queue for approval.
2. **Given** an expense in review, **When** the designated approver approves it, **Then** the expense is accepted and the balances are updated for the involved users.
3. **Given** an expense with invalid or incomplete data, **When** the user attempts to submit it, **Then** the system rejects it and prompts for corrections.

---

### User Story 4 - Receive notifications and handle approvals (Priority: P2)

Group members are notified when a new expense is created and can review or approve it according to the approval process.

**Why this priority**: Approval and notification support accountability and prevent unauthorized or mistaken expense entries from changing balances.

**Independent Test**: A new expense triggers a notification to relevant users and the approval state is visible until reviewed.

**Acceptance Scenarios**:

1. **Given** a required approval flow is enabled, **When** a newer expense is submitted, **Then** all relevant users are notified and the expense remains pending until approval.
2. **Given** an expense is pending approval, **When** the approver declines or approves it, **Then** the status changes and the system records the decision.

---

### User Story 5 - Track balances and payments (Priority: P1)

Users can see who owes whom, settle balances, and record payments so the system reflects current state accurately.

**Why this priority**: Accurate balance management is the main financial utility of the product and the reason users rely on it.

**Independent Test**: After valid expenses and payments are entered, the system calculates the net owed balance for each user pair.

**Acceptance Scenarios**:

1. **Given** one or more approved expenses, **When** the system recalculates balances, **Then** each user sees the correct amount owed to or by each other person in the group.
2. **Given** a payment has been made to settle a balance, **When** the user records the payment, **Then** the balance is reduced and the updated balance state is visible.

---

### User Story 6 - Review reports and summaries (Priority: P2)

Users view reports and summaries of their expenses, balances, and payments across a selected date range or other filters.

**Why this priority**: Reporting supports clarity, planning, and dispute resolution, especially for recurring group expenses.

**Independent Test**: A user can generate a report for a chosen period and see the relevant summary data.

**Acceptance Scenarios**:

1. **Given** a user has expenses and payments in a date range, **When** they request a report, **Then** the system displays the corresponding activity and totals.
2. **Given** the report filter is invalid or empty, **When** the user requests it, **Then** the system handles the request gracefully and informs the user of the issue.

---

### Edge Cases

- What happens when a user attempts to create an expense without selecting any participants?
- How does the system handle duplicate group names or duplicate user entries?
- What happens when an expense is approved after a payment has already been recorded?
- How does the system behave when a payment exceeds the current outstanding balance?
- What if a receipt image is uploaded but the file type is unsupported?
- What happens when a user requests a report for a date range with no matching activity?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST require authentication so each user can create a unique account and sign in to access their own expense and balance information.
- **FR-002**: The system MUST allow a user to create and manage groups containing multiple people for shared expense tracking.
- **FR-003**: The system MUST allow a user to create an expense containing at least a monetary amount, date, description, split method, payer, involved participants, and optional receipt image.
- **FR-004**: The system MUST support expense splitting by equal share and by percentage allocation, and MUST reject percentage-based splits when the entered percentages do not total exactly 100%.
- **FR-005**: The system MUST store the explicit payer and the set of participants involved in each expense so balances can be adjusted correctly and settlement can be tracked between the payer and the participants.
- **FR-006**: The system MUST notify all current group members when a new expense is created.
- **FR-007**: The system MUST require at least one designated approver before an expense can affect balances, and MUST record the approval result as part of the expense workflow.
- **FR-008**: The system MUST calculate and display the balance owed by each user to each other user based on all approved expenses.
- **FR-009**: The system MUST allow users to record payments used to settle outstanding balances, including partial payments against an outstanding balance.
- **FR-010**: The system MUST update balances after payment records are entered so current balances stay accurate while preserving the original obligation record for settlement tracking.
- **FR-011**: The system MUST provide summaries and reports of expenses, balances, and payments.
- **FR-012**: The system MUST support report filtering by date range and other relevant parameters when provided.
- **FR-013**: The system MUST prevent an expense from altering balances before it has passed the required approval step.
- **FR-014**: The system MUST maintain a clear record of expense, approval, and payment history for each user and group.
- **FR-015**: The system MUST provide a way for a user to view their own group-related financial activity without exposing unrelated users' private information.
- **FR-016**: The system MUST support multiple groups and allow users to participate in more than one group if needed.
- **FR-017**: The system MUST reject invalid expense submissions when required information is missing, malformed, or includes an amount that is not greater than zero.
- **FR-018**: The system MUST reject any expense that includes users who are not current members of the selected group, or a payer selection that is invalid for the group.
- **FR-019**: The system MUST handle payment settlement records as a recognized part of the balance lifecycle.

### Java Swing MVP Subset Requirements

These requirements are the subset of the customer requirements that are explicitly appropriate for a Java Swing-based minimum viable product.

- **FR-MVP-001**: The Java Swing MVP MUST provide a simplified user login flow consistent with the required authentication model for the core product.
- **FR-MVP-002**: The Java Swing MVP MUST allow a user to create and select a group.
- **FR-MVP-003**: The Java Swing MVP MUST allow a user to enter a shared expense with amount, description, date, participants, and split type.
- **FR-MVP-004**: The Java Swing MVP MUST display a pending approval queue for newly created expenses.
- **FR-MVP-005**: The Java Swing MVP MUST show balance information for each user within a group.
- **FR-MVP-006**: The Java Swing MVP MUST allow a user to record a payment against a balance.
- **FR-MVP-007**: The Java Swing MVP MUST provide a basic summary or report view for expenses and balances.
- **FR-MVP-008**: The Java Swing MVP MUST keep the GUI separate from the business logic and calculation layer.

### Non-Functional Requirements

- **NFR-001**: The system MUST provide a clear and usable experience for users managing shared expenses in small groups.
- **NFR-002**: The system MUST calculate balances accurately and consistently across all approved expenses and payments.
- **NFR-003**: The system MUST protect user account and financial data from unauthorized access within the relevant group context.
- **NFR-004**: The system MUST support the required approval and notification flows without leaving expenses in an ambiguous state.
- **NFR-005**: The system MUST be maintainable through clear separation between user interface logic and business logic.
- **NFR-006**: The system MUST use reliable monetary precision to prevent rounding or floating-point errors.
- **NFR-007**: The system MUST be testable through repeatable verification with clear requirement traceability.
- **NFR-008**: The system MUST preserve an auditable history for expense creation, approval decisions, and payment records.
- **NFR-009**: The system MUST remain usable when the number of users or expenses increases beyond a small group scenario without breaking core flows.
- **NFR-010**: The system MUST support clear reporting for date-based summaries and financial reconciliation.

### Key Entities

- **User**: Represents a person with a unique account, login access, and personal financial activity within groups.
- **Group**: Represents a collection of users sharing expenses and balances.
- **Expense**: Represents a shared cost with amount, date, description, participants, split type, approval status, and optional receipt image.
- **Approval**: Represents the review or authorization state of an expense before balance adjustments are applied.
- **Balance**: Represents the net amount owed by one user to another after approved expenses and payments are considered.
- **Payment**: Represents a recorded settlement of an outstanding balance.
- **Report**: Represents a user-visible summary of expense, balance, and payment data over a chosen period.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a valid account and access their own data in under 3 minutes during a standard onboarding flow.
- **SC-002**: A new approved expense updates the relevant group balances correctly without manual recalculation in 100% of tested scenarios.
- **SC-003**: A user can record a payment and verify the updated outstanding balance in under 2 minutes.
- **SC-004**: At least 95% of core expense and balance scenarios pass a defined acceptance test suite.
- **SC-005**: Users can review report data covering a selected date range and find the same totals shown in the underlying transactions.
- **SC-006**: The approval workflow prevents unapproved expenses from affecting balances in all system-tested cases.

## Assumptions

- Users are managing small-group shared expenses rather than large enterprise-level financial billing.
- The primary platform is web-based, but a Java Swing MVP may be used as a constrained implementation subset for educational or desktop demonstration purposes.
- Each expense is associated with a known set of group members, and each member is expected to be identifiable in the system.
- Expense approval rules may vary by group, but a workflow must exist before balances are adjusted.
- Report generation is expected to support basic date-range filtering and summary views without requiring highly advanced custom analytics.
- User privacy is preserved by limiting account access to each user's own data and relevant group context.

## Open Questions

- What approval model is required for each group: single approver, multiple approvers, or self-approval by default?
- Should notifications be delivered in-app, via email, or both?
- Are users allowed to remove members from a group after expenses have already been created?
- What is the expected behavior when a participant leaves a group with an outstanding balance?
- Are there required security constraints for login, authorization, or audit logs beyond basic account access?
- Should receipt images be stored locally, in a database, or as references to external files?
- Is the system expected to support multiple currencies, or is all money treated as a single currency within a group?
- What level of report customization is required beyond basic date-range summaries?

## Requirements Inventory

### Full Customer Requirements Inventory

1. User accounts with login and personal data access
2. Group creation and management for shared expense scenarios
3. Expense creation with amount, date, description, split method, participants, and optional receipt image
4. Support for equal and percentage-based splitting
5. Notifications when group members create expenses
6. Approval workflow before balances are adjusted
7. Balance tracking by user-to-user owed amounts
8. Payment tracking to settle balances
9. Reporting and summaries for expenses, balances, and payments
10. Primary web-based operating target

### Java Swing MVP Subset Inventory

1. Basic account access and login flow
2. Group creation and selection
3. Expense entry for shared costs
4. Approval queue for pending expenses
5. Balance display and payment recording
6. Summary/report view
7. Business logic separated from Swing UI logic

### Traceability Notes

- The full requirement inventory above derives directly from the original customer request in [UserRequirement.md](../../UserRequirement.md).
- The Java Swing MVP subset is a narrower implementation scope and must not be treated as a replacement for the full customer requirements.
- All functional and non-functional requirements in this spec remain traceable to the original customer request, with the MVP subset labeled separately for implementation planning.
