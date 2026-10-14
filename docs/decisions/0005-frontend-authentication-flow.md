# 0005 - Frontend Authentication Flow and JWT Handling

- **Date:** 2026-10-14
- **Status:** Accepted

## Context

The Personal Hub frontend needs a secure, seamless authentication system to interact with the Ruby on Rails REST API (Devise-JWT). The frontend must manage user identity, inject JWT tokens into authenticated HTTP requests, intercept expired or invalid tokens (HTTP 401), protect private views, and provide responsive mobile-first login and registration experiences with internationalization support.

## Decision

Implement a React Context-based authentication state manager coupled with HTTP client interceptors and route guards:

1. **Token Persistence & Interception (`src/shared/api/client.ts`):**
   - Store the JWT token in `localStorage` (`personal_hub_token`).
   - Automatically inject `Authorization: Bearer <token>` on all outgoing HTTP requests when a token is present, unless `skipAuth: true` is explicitly passed.
   - On HTTP 401 Unauthorized responses, clear the stored token and dispatch a custom `personal_hub:unauthorized` event to synchronize application state.

2. **Auth Context & Hook (`src/features/auth/context/AuthContext.tsx`, `useAuth.ts`):**
   - Maintain `user`, `token`, `isAuthenticated`, and `isLoading` states.
   - Extract JWT token from the `Authorization` header returned by Devise-JWT during login (`POST /users/sign_in`) and registration (`POST /users`).
   - Handle automatic session restoration from `localStorage` on initial application mount.
   - Listen for 401 events to cleanly reset authentication state.

3. **Route Guards (`src/features/auth/components/`):**
   - `ProtectedRoute`: Protects private application views (`/`, `/workouts`, `/settings`), redirecting unauthenticated visitors to `/login`.
   - `GuestRoute`: Guards authentication views (`/login`, `/register`), redirecting authenticated users to the home dashboard (`/`).

4. **Localization & Namespaces (`src/shared/i18n/`):**
   - Add dedicated `auth` namespace for both English (`en`) and Portuguese (`pt-BR`).
   - Provide localized form titles, field labels, placeholders, submit states, and validation alerts.

## Motivation

- **Security & Consistency:** Centralized token injection and automatic 401 interception prevent stale tokens from leaving the client in an inconsistent state.
- **Standards-Compliant Devise-JWT:** Extracts tokens directly from response headers while maintaining fallback parsing for standard JSON payloads.
- **Mobile-First UX:** Login and registration views are optimized for small touch screens with clear visual feedback, accessible inputs, and error banners.
- **Type Safety & Separation of Concerns:** Route protection is declarative and separated from presentation logic.

## Alternatives Considered

- **Global Redux/Zustand Store:** Discarded to adhere to the project's inviolable principle of avoiding premature global state abstractions when native React Context suffices.
- **Cookie-Only Authentication (HttpOnly):** While ideal for same-origin setups, Bearer token headers via `localStorage` align with our cross-origin Rails API token architecture.
