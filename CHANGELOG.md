# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]


## [0.2.0] - 2026-10-14

### Added

- Complete authentication flow (Context, Login, Register, Protected Routes, and Token Handling):
  - JWT token auto-injection and HTTP 401 interception in `apiClient`.
  - `AuthProvider` and `useAuth` hook managing user session, login, registration, and logout.
  - Route guards: `ProtectedRoute` for private application routes and `GuestRoute` for auth pages.
  - Mobile-first `LoginPage` and `RegisterPage` with pre-submit client-side inline validation, API error handling (401/422), and registration success feedback card with countdown.
  - Logout action and user profile display in `SettingsPage`.
  - Dedicated `auth` namespace for internationalization (`en` and `pt-BR`) including validation errors and success states.
  - Architectural decision record `docs/decisions/0005-frontend-authentication-flow.md`.

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
