# 0001 - Adoption of Vite, React, and TypeScript

- **Date:** 2026-09-01
- **Status:** Accepted

## Context

We need to structure the frontend application for Personal Hub using a modern, fast development feedback loop and static typing to prevent runtime errors.

## Decision

Adopt **React with TypeScript** using **Vite** as the build tool and development server.

## Motivation

- Vite utilizes native ES Modules during development, offering instant startup and fast HMR (Hot Module Replacement).
- TypeScript establishes clear API contracts between the frontend and the Rails REST backend.

## Alternatives Considered

- Next.js (Discarded: Introduces unnecessary SSR complexity for a client-side API application).
- Create React App (Discarded: Deprecated and unmaintained).
