<!--
Sync Impact Report
- Version change: 0.0.0 -> 1.0.0
- Modified principles: Customer Requirement Priority, Java 21 + Maven Baseline, Swing + OOD + Separation of Concerns, Financial Correctness, Testing and Traceability, Human Review of AI Output
- Added sections: Customer Requirements vs Implementation Decisions, Technical Constraints, Development Workflow
- Removed sections: template placeholders
- Follow-up TODOs: none
-->

# SplitSmart Constitution

## Core Principles

### I. Customer Requirement Priority
The project shall treat the statements in [UserRequirement.md](UserRequirement.md) as the authority for what the customer needs. Customer requirements are the problem definition: users, groups, expenses, approvals, notifications, balances, payments, and reporting. Implementation decisions are the chosen way to satisfy those needs, such as Java 21, Maven, Java Swing, JUnit 5, PlantUML, and specific architectural patterns.

The team must not rewrite the customer request as a technical preference. If a design choice is made, it must be traceable to a customer need and documented as a decision, not as a requirement itself.

### II. Java 21 and Maven Standard
The application shall target Java 21 as the language and runtime baseline and use Maven as the build, dependency, and project lifecycle tool. This is a technical decision that supports a modern Java platform and repeatable build automation.

All code, build configuration, and dependency management must be compatible with the Java 21 toolchain. Maven must be used for compiling, testing, packaging, and dependency resolution so the project remains reproducible and reviewable.

### III. Java Swing and Model-View Separation
The user interface shall be implemented using Java Swing, but Swing is not the business domain itself. The UI layer must remain focused on display, interaction, and user input/output, while the domain and workflow logic must remain in separate classes and components.

This separation prevents the GUI from becoming the source of business rules. Validation, calculations, approval logic, balance computations, and payment tracking must be modeled as domain logic that can be tested independently of UI behavior.

### IV. Object-Oriented Design and Separation of Concerns
The system shall use object-oriented design principles to model real-world concepts such as User, Group, Expense, Approval, Payment, and Balance. Classes must have clear responsibilities, stable abstractions, and well-defined collaboration boundaries.

The architecture must favor cohesion and low coupling. Responsibilities must not be mixed arbitrarily across unrelated classes. When a concept belongs to the business domain, it should be represented in domain classes rather than embedded inside a Swing form or controller component.

### V. Financial Correctness with BigDecimal
All monetary values shall be represented using BigDecimal, never float or double. This includes amounts, payments, balances, and any computed totals. Monetary operations must use explicit scale and rounding rules that match the project’s financial rules.

The system must avoid precision loss in expense totals, settlement amounts, and reports. Money must be treated as exact value, not approximate numeric data.

### VI. Testability and Verification with JUnit 5
The project shall use JUnit 5 for automated verification. Business logic, calculations, balance rules, approval logic, and payment processing must be covered by tests that execute independently of Swing components.

Tests must validate real behavior and must not merely assert on mock-only outcomes. The team must prefer tests that exercise the actual domain logic and user-facing requirements whenever feasible. The project must follow a disciplined red-green-refactor cycle for changes to logic and rules.

### VII. Requirement Traceability and Design Transparency
Every major requirement in the customer request shall be traceable to implementation artifacts, tests, and design documentation. The project must maintain a clear relationship between the requirement, the class or module that satisfies it, and the verification evidence that proves it works.

This includes user-facing features, approval workflow rules, reporting needs, and balance calculations. Where possible, diagrams and documentation shall make that traceability explicit. PlantUML is the preferred notation for architecture and behavior diagrams because it is text-based, reviewable, and suitable for version control.

### VIII. Human Review of AI Output
AI-generated content, including code, design suggestions, tests, and documentation, shall not be accepted without human review. AI output may accelerate work, but humans remain responsible for correctness, quality, and alignment with the customer request.

Reviewers must check for logic errors, architectural drift, false assumptions, missing requirements, and non-traceable decisions. AI-generated output shall be treated as a draft, not as final authority.

## Additional Constraints

### Customer Requirements vs. Implementation Decisions
Customer requirements are the statements users need from the product. They come from the business problem and are not changed by implementation preference. Implementation decisions are the chosen technologies, patterns, and structural choices used to satisfy those requirements.

Examples:
- Customer requirement: users can create and manage groups and expenses.
- Implementation decision: use Java Swing for the desktop interface and Java 21 with Maven for the toolchain.
- Customer requirement: balances must be tracked accurately.
- Implementation decision: use domain classes and BigDecimal for financial calculations.

### Technology and Documentation Standards
- Java 21 is the required platform baseline.
- Maven is the required build and dependency management tool.
- Java Swing is the required GUI framework.
- JUnit 5 is the required automated testing framework.
- PlantUML is the required notation for architecture and process diagrams when visual modeling is needed.
- OOP and separation of concerns are required design principles.
- Business logic must be separated from GUI code.
- Money must be handled with BigDecimal rather than floating-point types.

## Development Workflow

1. Start with the customer requirement and classify it as either a requirement or a technical decision.
2. Document the design and traceability path from requirement to implementation artifact.
3. Create or update tests for business behavior before implementation changes are considered complete.
4. Implement code using the agreed technical stack while preserving separation of GUI and business logic.
5. Use PlantUML when a diagram is needed to communicate architecture, workflows, or ownership boundaries.
6. Perform human review of AI-generated output before merging or accepting changes.
7. Verify that every feature is mapped to a requirement and supported by evidence.

## Governance

This constitution governs the SplitSmart project and supersedes informal assumptions. Any change to the project’s principles, technology decisions, or review process must be documented, justified, and traceable to an approved requirement or agreed architecture rationale.

All work must be checked against this constitution. A change is compliant only when it is aligned with the customer requirements, the chosen implementation standards, and the review expectations stated here.

**Version**: 1.0.0 | **Ratified**: 2026-10-29 | **Last Amended**: 2026-10-29
