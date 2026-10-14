# 0004 - Internationalization (i18n) Setup

- **Date:** 2026-10-14
- **Status:** Accepted

## Context

The application needs multi-language support to provide an accessible user experience across locales, beginning with English (`en`) and Brazilian Portuguese (`pt-BR`). We also need to avoid hardcoded UI strings, maintain full TypeScript type-safety for translation keys, and organize translation resources cleanly without cluttering components.

## Decision

Adopt **`i18next`** and **`react-i18next`** with **`i18next-browser-languagedetector`**, centralized under `src/shared/i18n/`:

- **Default & Fallback Language:** English (`en`).
- **Secondary Language:** Portuguese (`pt-BR`).
- **Namespaces:** Split into modular JSON files, starting with `common` (default) and `nav`.
- **Type Safety:** Augment `i18next`'s `CustomTypeOptions` via `src/shared/i18n/types.d.ts` for compile-time key and namespace checking.
- **Language Detection:** Detect user preference via `localStorage` and `navigator`, falling back to `en`.

## Motivation

- **Ecosystem Standard:** `i18next` and `react-i18next` are mature, battle-tested solutions with first-class React hook integration (`useTranslation`).
- **Namespace Modularity:** Prevents monolithic translation dictionaries by grouping domain-specific strings into focused namespaces.
- **Compile-Time Safety:** TypeScript declaration merging ensures typos in keys or missing translations are caught at build time.
- **Maintainability:** Clear separation between code (written in English with English comments) and localization resources.

## Alternatives Considered

- **React-Intl / FormatJS:** Discarded due to heavier boilerplate and more complex integration for basic client-side routing and lightweight UI needs.
- **Custom React Context:** Discarded to avoid reinventing locale detection, pluralization, fallback resolution, and interpolation logic.
