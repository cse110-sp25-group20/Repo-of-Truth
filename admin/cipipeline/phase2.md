# Phase 2 Status
In this phase, we enhanced the foundation of our CI/CD pipeline with a focus on documentation generation and coverage of our testing. Below is a summary of what has been implemented.

---

## Code Coverage via Automation

We implemented automated code coverage checks using **Jest**. This step ensures that each test run includes a measurement of how much of the codebase is covered by tests. A global coverage threshold of **70%** was enforced. If coverage falls below that level, the pipeline fails automatically, preventing untested code from being merged into `main`.

### Functional
- Code coverage runs on every push and pull request to `main`
- Jest generates detailed reports in the `coverage/` directory
- Global coverage threshold of 70% is enforced
- GitHub Actions pipeline fails if coverage drops below threshold

### Planned/In Progress
- Consider integrating a visual dashboard such as [Codecov](https://codecov.io/)
- Increase coverage threshold to 80% in future to align with industry requirements

---
## Documentation Generation via Automation

We implemented automated documentation generation. it parses inline comments in our JavaScript files and produces HTML documentation, which is committed to the repository automatically under `.github/docs`.

### Functional
- It is set up and generates HTML documentation from code comments
- A GitHub Actions workflow runs on push and updates documentation in `.github/docs`
- Generated documentation is up to date with the codebase

---


