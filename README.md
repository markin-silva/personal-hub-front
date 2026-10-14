# Personal Hub — Frontend

A modern, mobile-first web client for personal daily tracking and self-management, starting with the **Workout Module** (gym and calisthenics tracking) and built to integrate with a Ruby on Rails REST API backend.

---

## Tech Stack

- **Runtime & Package Manager:** Node.js (v22, defined in `.nvmrc`) + `pnpm`
- **Framework & Bundler:** React 19 + TypeScript + Vite
- **Routing:** React Router DOM (nested layout architecture with mobile navigation bar)
- **Server State & Networking:** TanStack Query + `apiClient` (custom native `fetch` wrapper)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) — mobile-first utility styling
- **Internationalization (i18n):** `i18next` + `react-i18next` + `i18next-browser-languagedetector`
- **Testing:** Vitest + React Testing Library + `@testing-library/jest-dom`
- **Code Quality:** ESLint (Flat Config) + Prettier + TypeScript strict type-checking

---

## Architecture & Principles

1. **Mobile-First by Default:**
   All user interfaces are designed and tested for small mobile viewports (360px–430px) before expanding to larger breakpoints.
2. **Co-location:**
   Code that changes together lives together:
   - Feature-specific pages, components, hooks, and types live inside `src/features/<feature>/` (e.g., `src/features/workouts/`).
   - Globally shared utilities, base components, and configurations belong in `src/shared/`.
   - Route shells and page wrappers live in `src/app/`.
3. **State Separation:**
   - **Remote Server State:** Managed exclusively via TanStack Query (`useQuery`, `useMutation`).
   - **Ephemeral UI State:** Managed via native React hooks (`useState`).
4. **Backend Integration:**
   - Standardized `apiClient` wrapper handles REST communication against the Ruby on Rails API.
   - Base URL configured via `VITE_API_URL` environment variable.
5. **No Premature Abstractions:**
   Generic abstractions (e.g. `BaseForm`, `BaseTable`) are strictly avoided until at least 3 distinct real-world use cases exist.

---

## Internationalization (i18n)

Internationalization is configured under `src/shared/i18n/`:

- **Default & Fallback Language:** English (`en`).
- **Secondary Language:** Brazilian Portuguese (`pt-BR`).
- **Namespaces:** Split into modular domains:
  - `common`: Generic UI actions, global labels, error/loading states, and general page text.
  - `nav`: Navigation item labels.
  - `auth`: Authentication flows (login, register, session management, and validation alerts).
- **Language Detection:** Detects user preference automatically via `localStorage` and `navigator`, persisting selections.
- **Type Safety:** Extended `CustomTypeOptions` ensures compile-time validation for translation keys and namespaces.

---

## Getting Started

### Prerequisites

- Node.js v22 (recommended via `nvm`):
  ```bash
  nvm use
  ```
- Corepack or `pnpm` installed globally:
  ```bash
  npm install -g pnpm
  ```

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Environment Configuration

Create a local environment file from `.env.example`:

```bash
cp .env.example .env
```

Ensure `VITE_API_URL` points to your active backend server instance (e.g., `http://localhost:3000/api/v1`).

---

## Available Scripts

| Command             | Description                                                       |
| :------------------ | :---------------------------------------------------------------- |
| `pnpm dev`          | Starts Vite local development server with HMR                     |
| `pnpm build`        | Typechecks with `tsc -b` and builds production bundle             |
| `pnpm preview`      | Locally previews production build output                          |
| `pnpm test`         | Runs test suite once via Vitest                                   |
| `pnpm test:watch`   | Runs Vitest in interactive watch mode                             |
| `pnpm typecheck`    | Validates TypeScript types across the project (`tsc -b --noEmit`) |
| `pnpm lint`         | Runs ESLint analysis across files                                 |
| `pnpm lint:fix`     | Automatically fixes fixable ESLint issues                         |
| `pnpm format`       | Formats all files with Prettier                                   |
| `pnpm format:check` | Validates formatting adherence with Prettier                      |

---

## Agent & Contributor Guidelines

- **Agent Guide:** Review [`AGENTS.md`](./AGENTS.md) for mandatory workflows, conventions, and pre-commit requirements.
- **Architecture Decisions:** Read accepted architectural decisions in [`docs/decisions/`](./docs/decisions/):
  - [ADR 0001: Adoption of Vite, React, and TypeScript](./docs/decisions/0001-use-vite-react-typescript.md)
  - [ADR 0002: Server State Management via TanStack Query](./docs/decisions/0002-server-state-with-tanstack-query.md)
  - [ADR 0003: Styling Strategy using Tailwind CSS v4](./docs/decisions/0003-styling-strategy.md)
  - [ADR 0004: Internationalization (i18n) Setup](./docs/decisions/0004-i18n-setup.md)
  - [ADR 0005: Frontend Authentication Flow and JWT Handling](./docs/decisions/0005-frontend-authentication-flow.md)
- **Changelog:** Track additions, changes, and fixes in [`CHANGELOG.md`](./CHANGELOG.md).
- **Custom Skills:** Automated workflows are available under [`.codex/skills/`](./.codex/skills/) (`prepare-commit`, `generate-changelog`).
