# Requirement-to-Design-to-Test Traceability

Test identifiers below name proposed verification cases; they do not imply tests already exist. Test cases that depend on unresolved policies are marked **decision-gated**.

## Functional requirements

| Requirement | Design coverage | Planned verification |
|---|---|---|
| FR-001 | `User`; account application workflows; identity port; authorization in application layer | T-ACCOUNT-01 registration/sign-in success; T-ACCOUNT-02 user cannot access unrelated private data |
| FR-002 | `Group`, `GroupMembership`; group workflows and repository boundary | T-GROUP-01 create/manage group; T-GROUP-02 membership changes reflected in group context |
| FR-003 | `Expense` and expense submission workflow, including optional receipt reference | T-EXPENSE-01 valid expense enters review; T-EXPENSE-02 required input validation; T-RECEIPT-01 optional receipt boundary (adapter-gated) |
| FR-004 | Equal/percentage split method and `SplitAllocation` validation | T-SPLIT-01 equal split (remainder behavior decision-gated); T-SPLIT-02 exact 100% accepted; T-SPLIT-03 totals below/above 100% rejected |
| FR-005 | Explicit payer and participants; obligations derived from approved allocation | T-BALANCE-01 payer/participant obligation cases (payer participation decision-gated) |
| FR-006 | Expense workflow requests notification of all current group members through notification port | T-NOTIFY-01 notification request includes all current members; delivery-channel tests adapter-gated |
| FR-007 | Designated approver and approval decision; approval gates obligation creation | T-APPROVAL-01 authorized approval creates obligation; T-APPROVAL-02 rejection creates none; self/multi-approver cases decision-gated |
| FR-008 | Derived user-to-user balance read model from approved obligations less payments | T-BALANCE-02 pairwise balance reconciliation; cross-group aggregation decision-gated |
| FR-009 | Partial settlement `Payment` against outstanding balance(s), retaining payment date | T-PAYMENT-01 partial payment leaves positive remainder; mapping one payment to one/multiple obligations decision-gated |
| FR-010 | Preserve obligation and append payment; update derived outstanding balance | T-PAYMENT-02 original obligation remains unchanged after partial settlement; T-PAYMENT-03 balance reflects payment |
| FR-011 | Report query/result summarizes expenses, balances, and payments | T-REPORT-01 report summary matches underlying records |
| FR-012 | Report query supports date range and relevant confirmed filters | T-REPORT-02 boundary dates/filter behavior (specific additional filters decision-gated) |
| FR-013 | Pending/rejected expense does not affect balances; approved transition is the gate | T-APPROVAL-02 pending and rejected expense contributes zero to balances; T-APPROVAL-01 approved expense contributes once |
| FR-014 | Preserve expense, approval, and payment history through repositories | T-HISTORY-01 history links to source expense/group/user; persistence contract gated on storage choice |
| FR-015 | Application authorization restricts financial activity to own account and relevant groups | T-ACCOUNT-02 and T-AUTH-01 unrelated user/group data is denied |
| FR-016 | Group membership permits multiple groups per user | T-GROUP-03 one user participates in multiple groups without cross-group data leakage |
| FR-017 | Expense input validation rejects missing/malformed required values and amount <= 0 | T-EXPENSE-02 missing/malformed; T-EXPENSE-03 zero/negative amount rejected |
| FR-018 | Validate current membership for participants and payer's group eligibility | T-GROUP-04 non-member participant rejected; T-BALANCE-01 invalid payer rejected; payer-in-participant requirement decision-gated |
| FR-019 | Settlement records participate in balance lifecycle | T-PAYMENT-03 settlement updates outstanding balance; T-PAYMENT-04 overpayment/timing behavior decision-gated |

## Swing MVP subset

| Requirement | Design coverage | Planned verification |
|---|---|---|
| FR-MVP-001 | Swing sign-in view calls account use case; access rules remain in application layer | T-UI-01 sign-in input routes to account workflow; behavior also covered by T-ACCOUNT-01/02 |
| FR-MVP-002 | Group selection/creation view calls group workflows | T-UI-02 group actions call application boundary; domain behavior covered by T-GROUP-01/02 |
| FR-MVP-003 | Expense form gathers required data and calls submission workflow | T-UI-03 submitted values map to use-case request; split/validation covered by T-EXPENSE/T-SPLIT tests |
| FR-MVP-004 | Pending approval view displays pending workflow state | T-UI-04 pending queue reflects application query; approval behavior covered by T-APPROVAL tests |
| FR-MVP-005 | Balance view renders balances from application query | T-UI-05 view shows query results; calculations covered by T-BALANCE tests |
| FR-MVP-006 | Payment form invokes payment use case | T-UI-06 payment input routes correctly; settlement covered by T-PAYMENT tests |
| FR-MVP-007 | Summary/report view invokes report query | T-UI-07 report filters/results routed and shown; totals covered by T-REPORT-01 |
| FR-MVP-008 | UI contains no calculation or approval business rules | T-UI-08 boundary test/review verifies UI delegates; domain tests exercise behavior without Swing |

## Non-functional requirements

| Requirement | Design coverage | Planned verification |
|---|---|---|
| NFR-001 | Task-oriented Swing views for small-group expense flows; usability details need human evaluation | T-USABILITY-01 moderated task walkthrough after UI exists |
| NFR-002 | Derived balance reconciliation from approved expenses and payments | T-BALANCE-02 and T-PAYMENT-03 with real domain behavior |
| NFR-003 | Authorization at application boundaries and group context | T-AUTH-01 access denial across accounts/groups |
| NFR-004 | Explicit pending/approved/rejected workflow and approval gate | T-APPROVAL-01/02; notification failures need a decided policy |
| NFR-005 | Layered UI/application/domain/infrastructure boundaries | T-UI-08 plus architecture review |
| NFR-006 | `BigDecimal` for all monetary representations and calculations | T-MONEY-01 exact decimal behavior; source/type review confirms no floating-point money |
| NFR-007 | JUnit 5 behavior tests mapped to requirement IDs | Test inventory review verifies every required behavior has a non-mock-only test |
| NFR-008 | Expense, approval, and payment history linked to source records | T-HISTORY-01; persistence verification after adapter selection |
| NFR-009 | No quantitative capacity target; design keeps storage and calculations replaceable without overbuilding | T-SCALE-01 representative-volume profile after owner supplies expected workload |
| NFR-010 | Reports reconcile with date-filtered underlying transaction records | T-REPORT-01/02 |

## Success criteria

| Criterion | Planned evidence |
|---|---|
| SC-001 onboarding under 3 minutes | Timed usability test T-USABILITY-02 after an approved auth and UI flow exists |
| SC-002 approved expense updates balances correctly in all tested scenarios | T-BALANCE-02 and full approved-expense acceptance scenarios |
| SC-003 payment recording/verifying under 2 minutes | Timed usability test T-USABILITY-03 after payment UI exists |
| SC-004 at least 95% of core scenarios pass | Acceptance suite report; scenario denominator and release threshold process need definition |
| SC-005 report totals match underlying transactions | T-REPORT-01/02 |
| SC-006 no unapproved expense affects balances | T-APPROVAL-02, including pending and rejected cases |

## Source discrepancy

The Lab 6 assignment document includes an Android/iOS app statement not represented as a requirement in the clarified spec's requirements inventory. It is not assigned a fabricated FR ID. Product-owner confirmation is required on whether mobile clients are in scope.
