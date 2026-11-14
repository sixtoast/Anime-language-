# Phase 8CX — Integrated Incantation reviewer in the website

**Date:** 2026-11-14  
**Canon effect:** NONE. **Spoken forms added:** 0. **Grammar changes:** none.

## Delivery
The Research & Review page now includes a whole-contract reviewer panel backed by `reviewIntegratedIncantation`. The user can edit a JSON contract and run it locally in the browser. The starter record intentionally contains an unresolved target and visibly demonstrates fail-closed review.

## Included sections
Operation arguments, relationship graph, condition declarations, evidence policy and records, temporal contracts, postconditions, lifecycle/interruption records and recovery branches. The panel reports section status, aggregate disposition, operation count, findings, severity and path. It always reports execution NOT-PERFORMED.

## Interaction and safety
- Invalid JSON is shown as an inline error; no stale result is retained after parse failure.
- The reviewer is called only by an explicit user action.
- User-supplied JSON is reviewed in the browser; it is not sent to an executor.
- No external calls, authority decisions, spell parsing, physical simulation, resource consumption or state-changing actions occur.
- The starter is a structural example, not a valid or executable spell.

## Verification
UI wiring and component rendering are authored. No local TypeScript build, browser test or Vitest run is claimed. The Vercel preview is the next build check. No Actions dispatch, merge or production deployment.
