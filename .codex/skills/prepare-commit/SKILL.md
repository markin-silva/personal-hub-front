---
name: prepare-commit
description: Validates code quality, checks for required documentation updates, and prepares Conventional Commits messages in English. Trigger when the user asks to prepare, review, or generate a git commit (e.g., "prepare commit", "commit changes", "check commit").
---

# Prepare Commit Workflow

This skill ensures that all changes in the repository undergo a strict validation suite before generating a standardized, high-quality commit message following Conventional Commits in English.

## Triggering Scenarios

Use this skill when the user mentions:

- "prepare commit"
- "create commit message"
- "check and commit"
- "commit my changes"

## Workflow Steps

### Step 1: Run Validation Checklist

Execute the full suite of validation scripts in sequence:

```bash
pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

- If any command fails, stop immediately, explain the issue, and suggest fixes.
- Do NOT propose a commit message if there are failing tests or linter/type errors.

### Step 2: Check Documentation & Artifacts

Analyze the git diff and verify if the following require updates:

- **CHANGELOG.md**: Ensure any user-facing features, bug fixes, or architectural changes are recorded under the `[Unreleased]` section.
- **AGENTS.md / docs/decisions/**: Ensure new patterns, conventions, or architectural decisions (ADRs) are documented.

If updates are missing, prompt or update them prior to commit generation.

### Step 3: Analyze Git Diff & Generate Commit Message

Analyze the staged and unstaged changes (`git status` and `git diff`) and format a commit message adhering to Conventional Commits:

- **Format:** `<type>(<scope>): <short description in present imperative tense>`
- **Types:**
  - `feat`: New feature or user-facing functionality.
  - `fix`: Bug fix.
  - `docs`: Documentation changes (AGENTS.md, CHANGELOG.md, ADRs).
  - `refactor`: Code changes that neither fix a bug nor add a feature.
  - `test`: Adding or modifying tests.
  - `chore`: Maintenance tasks, config changes, or dependency updates.
- **Rules:**
  - Must be written strictly in English.
  - All letters in lowercase (except proper nouns).
  - No ending period in the subject line.

### Step 4: Present Summary & Suggest Command

Present the summary of changes, the validation status, and suggest the exact `git commit` command to the user.
