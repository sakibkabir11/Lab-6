# Input Baseline

**Captured**: 2026-11-05  
**Git branch**: `main`  
**Baseline commit**: `11aa9462114cb4eb1cbe14b6f053a0930781b974`  
**Spec Kit feature branch value**: `001-splitsmart` (from setup script; not the checked-out Git branch)  
**Feature directory**: `specs/001-splitsmart/`

## Authoritative and source inputs read

- `docs/architecture/spec-kit-architecture-design-prompt.md` — full task constraints and deliverables.
- `.specify/memory/constitution.md` — full current constitution.
- `specs/001-splitsmart/spec.md` — full sole `spec.md` candidate. It contains a dated Clarifications section with recorded answers and the adjacent requirements checklist is complete. Its status says Draft; no separate post-Clarify file exists.
- `specs/001-splitsmart/checklists/requirements.md` — full specification quality checklist.
- `UserRequirement.md` — full customer requirements source identified by the spec and constitution.
- `Lab_6_Requirement.docx` — extracted full document text; contains course instructions and a customer-platform statement that additionally mentions Android and iOS.
- `.specify/templates/plan-template.md` — full planning template.
- `.specify/scripts/powershell/setup-plan.ps1` — full setup script; run successfully after explicit user authorization for a per-process execution-policy bypass.

## Other repository context inspected

- `docs/architecture/codex-architecture-design-prompt.md` and `docs/architecture/architecture-review-prompt.md` were identified as other architecture workflow prompts, not existing design proposals.
- The setup script reported `FEATURE_SPEC=specs/001-splitsmart/spec.md`, `IMPL_PLAN=specs/001-splitsmart/plan.md`, `FEATURE_DIR=specs/001-splitsmart`, and `BRANCH=001-splitsmart`.
- No `.specify/extensions.yml` was present; no before/after plan hooks were registered.

## Existing state and modifications

- The working tree was already modified in `.specify/memory/constitution.md` and `specs/001-splitsmart/spec.md` before design work. The current contents were treated as the inputs and neither file was changed by this task.
- The inspected diffs show whitespace-only additions in those two modified files; no substantive post-baseline spec requirement change was observed in the diff.
- `specs/001-splitsmart/plan.md` did not exist before setup. Setup copied the template; this proposal replaces that newly generated template with the design plan.
- Branch and commit values above refer to the pre-design baseline, not to the subsequent documentation changes.

## Existing project inventory

The repository listing contained `.specify/`, `.github/skills/`, `docs/architecture/` prompts, `specs/001-splitsmart/`, `UserRequirement.md`, and `Lab_6_Requirement.docx`.

No `README`, `pom.xml`, Java source, test source, or pre-existing architecture/design proposal was found. There is therefore no application structure, build configuration, test baseline, persistence adapter, or runtime behavior to report.

## Input discrepancy and unresolved scope

`UserRequirement.md` says the primary platform is web-based. The Lab 6 assignment's reproduced customer source says web-based and also an app for Android and iOS. The constitution mandates Swing, while the clarified spec explicitly frames Swing as an MVP subset and preserves the web-first requirement inventory. This proposal treats Swing as the mandated MVP design and does not claim that it delivers the complete web/mobile target. Product-owner clarification is required before implementation scope is final.

## Missing or undecided inputs

- No implementation, build, runtime, tests, README, database, or deployment documentation exists.
- The specification still lists open business questions and does not define currency, monetary scale, rounding, equal-split remainder allocation, overpayment handling, participant-empty behavior, membership-removal effects, notification channel, receipt storage, authentication details, or custom report semantics.
- The clarification that at least one designated approver is required does not determine self-approval, reversal, or post-rejection behavior.
