# Issue tracker: Local Markdown

Issues and PRDs for this repo live as markdown files in a local planning-doc directory.

## Conventions

- One feature per directory in the local planning-doc area
- The PRD lives beside the feature's issue drafts
- Implementation issues are numbered from `01`
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under the feature's local planning-doc directory (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.
