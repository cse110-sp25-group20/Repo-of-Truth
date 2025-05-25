# UI Design Handling Without External Tools

## Status
Accepted

## Context and Problem Statement
Due to time constraints and the scope of the project, maintaining a full UI design system in Figma became impossible. The team needed a more time-saving and consistent way to handle UI implementation without relying on figma and other external high fidelity ui design tools.
The challenge was to ensure visual consistency while moving quickly in implementation.

## Considered Options
- Continue using Figma (rejected: too time-consuming)
- Abandon centralized UI design control (rejected: leads to inconsistent styling)
- Assign 1–2 team members as UI maintainers and handle coding the ui 

## Decision Outcome
We will not use Figma for UI design. Instead:
- 1–2 team members will be responsible for designing and reviewing the UI
- This ensure that all components will be styled consistently.
- Pull requests affecting the UI must be approved by one of the designated UI leads.


