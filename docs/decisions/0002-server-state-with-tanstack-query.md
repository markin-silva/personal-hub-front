# 0002 - Server State Management via TanStack Query

- **Date:** 2026-09-01
- **Status:** Accepted

## Context

We need to decouple server-side data fetching, caching, and synchronization from local UI state.

## Decision

Use **TanStack Query (React Query)** for server state and native **React `useState`** for local UI state.

## Motivation

- Eliminates the need for complex global state managers (e.g., Redux).
- Provides out-of-the-box caching, revalidation, and declarative loading/error states.
