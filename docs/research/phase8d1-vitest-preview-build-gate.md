# Phase 8D1 — Run Vitest in the preview build gate

**Date:** 2026-11-14  
**Canon effect:** NONE · **Language changes:** none

## Change
The package build command now runs `tsc --noEmit`, then the existing `vitest run` suite, then `vite build`. This makes a feature-branch Vercel preview build exercise the repository's configured unit-test suite before emitting the deployable application bundle.

## Why
The earlier preview builds only ran TypeScript and Vite. The test suite existed as an npm script but was not part of the preview gate. This change ensures that the preview's READY state depends on the unit tests passing, not merely compilation.

## Boundaries
- This is a feature-branch build-script change only.
- It does not dispatch GitHub Actions.
- It does not alter production deployment settings.
- Browser Playwright tests are not included; they remain a separate command.
- Vitest results from the next Vercel build must be inspected before claiming test success.
- No test result is claimed in this document.

