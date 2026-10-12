# Architecture Documentation
See ARCHITECTURE.md for complete system architecture overview.

# Commits
Commits are how I follow what changes in the app. They must help me understand what changes feature-, product- refactor- and
architecture-wise, not how the work was done.
- Commit as you go, in fine-grained commits: one commit per outcome (a feature, a behavior change users will notice,
  an architecture change, a tooling change, a fix...). Neither one commit per file or per step, nor one commit for everything.
- Keep refactors without behavior change separate from changes of behavior.
- Title: start with the area (`Feature:`, `Product:`, `Architecture:`, `Tooling:`, `Fix:`, `Docs:`, `Refactor:`), then what changes, in
  plain words, understandable without reading the diff.
- Body: why, and what it changes for users or for developers. Call out behavior changes for existing users and anything
  that needs an action (migration, deploy, configuration).