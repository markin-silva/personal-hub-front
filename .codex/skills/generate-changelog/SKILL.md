---
name: generate-changelog
description: Generates or updates entry logs in CHANGELOG.md adhering strictly to Keep a Changelog standards. Trigger when the user asks to update changelog, add changelog entry, or log changes (e.g., "update changelog", "add to changelog", "generate changelog entry").
---

# Generate Changelog Entry Workflow

This skill automates maintaining the `CHANGELOG.md` file following the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and Semantic Versioning principles.

## Triggering Scenarios

Use this skill when the user mentions:

- "update changelog"
- "add to changelog"
- "generate changelog entry"
- "log change"

## Workflow Steps

### Step 1: Analyze Changes

Examine the uncommitted or recent git changes (`git status`, `git diff`, or recent git commits) to identify the nature of the changes.

### Step 2: Categorize the Changes

Map the identified changes into one or more of the standard Keep a Changelog categories:

- **`Added`**: for new features or capabilities.
- **`Changed`**: for changes in existing functionality.
- **`Deprecated`**: for soon-to-be removed features.
- **`Removed`**: for now removed features.
- **`Fixed`**: for any bug fixes.
- **`Security`**: in case of vulnerabilities.

### Step 3: Format Entry in English

Draft concise bullet points written in **English** focusing on user/developer impact rather than low-level implementation details.

Example format:

```markdown
## [Unreleased]

### Added

- Configured i18n support with English and Portuguese translations (`react-i18next`).

### Fixed

- Resolved parameter properties syntax conflict with `erasableSyntaxOnly`.
```

### Step 4: Update CHANGELOG.md

- Read the current `CHANGELOG.md`.
- Insert the new bullet points under the `[Unreleased]` section under their respective category headers.
- If category headers do not exist under `[Unreleased]`, create them.
- Keep entries clean, concise, and sorted logically.

### Step 5: Validate File Format

Ensure `CHANGELOG.md` remains properly formatted with valid Markdown, runs through Prettier checks if applicable, and contains no raw diff code.
