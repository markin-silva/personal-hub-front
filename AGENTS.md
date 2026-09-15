# AGENTS.md — Agent & Developer Guide

This document outlines the required standards, conventions, and operational workflow for any AI agent or software engineer working on this repository.

## 1. Tech Stack

- **Runtime & Manager:** Node.js (defined in `.nvmrc`) + `pnpm`
- **Framework & Bundler:** React 19 + TypeScript + Vite
- **Routing:** React Router DOM (Nested Layout approach)
- **Server State & I/O:** TanStack Query + `apiClient` (Native Fetch API wrapper)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) — **Mobile-First**
- **Testing:** Vitest + React Testing Library + `@testing-library/jest-dom`

## 2. Inviolable Technical Principles

- **Mobile-First by Default:** All interfaces must be designed and validated for small viewports (360px–430px) before adding desktop responsive styles.
- **No Premature Abstractions:** Do not create generic components or hooks (`BaseForm`, `BaseTable`, `GenericModal`) without at least 3 distinct real-world use cases.
- **Co-location:** Code that changes together stays together. Feature-specific code lives in `src/features/<feature>/`. Globally shared utilities belong in `src/shared/`.
- **State Separation:**
  - Remote API Data -> TanStack Query (`useQuery`, `useMutation`).
  - Ephemeral UI State -> Native React (`useState`).

## 3. Mandatory Pre-Commit Checklist

Before marking any task as complete or proposing a commit, run the full validation suite:

```bash
pnpm format && pnpm typecheck && pnpm lint && pnpm test && pnpm build
```
