# Phase 8D2 — Correct first full-suite regression findings

**Date:** 2026-11-14  
**Canon effect:** NONE · **Construction grammar changes:** none · **Execution:** none

## Preview test evidence
The first Vercel build with Vitest enabled executed 1,293 tests: 1,288 passed and 5 failed across five test files. The logs exposed these specific assertion problems:
- Hand-flame surface audit accepted leading/trailing whitespace because it compared a trimmed input.
- Lexical occurrence lookup correctly found three occurrences of `za` in the entire six-phrase fixture (two in phrase 2 and one in phrase 5), while the aggregate test incorrectly expected two.
- Foot morphology accepted `paa` as a CVC structural candidate even though its final slot was a vowel already in the parameter-vowel inventory.
- Spatial position fixture validation rejected internally inconsistent component unit labels before the relation operation; the test incorrectly expected the later missing-conversion status.

## Corrections
- Hand-flame surface validation now requires exact string equality.
- Lexical test now expects three whole-fixture `za` occurrences; phrase-specific count remains two.
- CVC shape recognition excludes known parameter vowels from the final consonant slot.
- Spatial regression assertion now expects the existing proposed type rule to reject a position whose axes use inconsistent unit labels. The implementation's validation order is preserved.

## Remaining test failure
The Vercel reporter also marked `constructionGrammarConsolidation.test.ts` as failed, but the available event excerpt did not expose its failing assertion. That failure is deliberately not changed speculatively; the next run must provide its precise assertion before a targeted correction.

## Verification
Corrections are source/test changes derived from actual preview output. The next preview build must be inspected for updated Vitest results. No local test run is claimed. No GitHub Actions dispatch, merge or production deployment.
