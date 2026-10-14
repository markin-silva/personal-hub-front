# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.1.0] - 2026-10-14

### Added

- **Frontend Foundation (Epic 1):**
  - Project setup with Vite, React 19, TypeScript, and `@/` path alias.
  - ESLint (Flat Config), Prettier, and code quality scripts.
  - Mobile-first responsive styling with Tailwind CSS v4.
  - Declarative routing via React Router DOM with a bottom-nav mobile layout shell.
  - Base HTTP client (`apiClient`) over native `fetch` and TanStack Query integration.
  - Unit testing environment configured with Vitest, React Testing Library, and `jest-dom/vitest`.
  - Agent instructions guide (`AGENTS.md`), CHANGELOG, and initial ADRs in English.
  - Continuous Integration workflow via GitHub Actions.
  - Internationalization (i18n) setup with `i18next`, `react-i18next`, and language detector, supporting English (`en`) as default and Portuguese (`pt-BR`) with `common` and `nav` namespaces, full TypeScript type safety, and ADR 0004.
  - Custom agent skills for automated workflow enforcement: `prepare-commit` (pre-commit quality validation & conventional commit generation) and `generate-changelog` (Keep a Changelog maintenance).
