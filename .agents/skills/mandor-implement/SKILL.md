---
name: mandor-implement
description: 'Implement a piece of work based on a PRD or set of issues.'
disable-model-invocation: true
---

Implement the work described by the user in the PRD or issues.

Use **mandor-tdd** where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use **mandor-review** to review the work.

Always develop features on a branch prefixed with 'feat/' (e.g., 'feat/<feature-slug>'). Create and switch to this branch if not already on it, and commit your work there.
