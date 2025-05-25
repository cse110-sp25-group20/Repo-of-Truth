# Use GitHub Projects and Issues for Backlog and Task Management

## Status
Accepted

## Context and Problem Statement
As the project grew in complexity, managing tasks and responsibilities informally (e.g., via meetings or chat) became inefficient and error-prone. Team members needed a clear system to organize tasks, track progress, and maintain visibility over who is assigned to what.

## Considered Options
- **Google Sheets or external tools:** Flexible but disconnected from our codebase and Lacks automation with GitHub.
- **In-repo Markdown files for task lists:** Version-controlled, but hard to maintain, assign members tasks, and visible status.
- **GitHub Projects and Issues:** Integrated with our codebase, allows for linking issues to pull requests, clear visualization of assigned tasks and their progress, and centralized.

## Decision Outcome
We will use **GitHub Projects** and **GitHub Issues** as our primary backlog and task management system. The rules are:
- All features and bugs must be added as GitHub Issues.
- Issues will be organized into GitHub Project boards with columns such as "backlog", “To Do,” “In Progress,” and “Done.”
- At the start of every sprint we will pull issues to current sprint (todo) column and assign tasks.

