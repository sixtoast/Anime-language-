# Phase 8CY-Q — P4-T10 Foot-shape reconciliation: kal and mel

**Canon effect:** NONE. **Compiler effect:** NONE. **Execution:** NONE.

## Newly isolated conflict: kal

Phase 4 §3.1 Table 2 describes the Foot as frame + parameter vowel + relation coda, with five relation codas. §3.2 Table 3 assigns:
- m/n to FREM open-loop maintenance;
- ŋ/ng to FREM maintenance under feedback;
- s/sh to SHREN release.

§4 Table 4 gives the wider phonotactic coda inventory m, n, ng, p, t, k, s, sh, l, r. In §10 Table 15, P4-T10 lists `kan, ken, kas, kal, mel` as Foot-shaped.

For `kal`, the frame k and parameter vowel a are in the documented classes, and final l is phonotactically legal. But l is not in the five-member semantic relation-coda inventory. The source does not explain whether P4-T10 uses “Foot-shaped” loosely for a phonotactic CVC pattern, or whether it intends a relation-coda exception. The reviewer now returns `SOURCE-CLASSIFICATION-CONFLICT` for exact `kal`, without assigning l a relation meaning or accepting/rejecting lexical validity.

## Distinct conflict: mel

For `mel`, P4-T10 again says Foot-shaped, but §8 Table 14 parses it as fused reference `me` + anchor coda `l`. In addition, m is not one of the six frame consonants. The reviewer preserves this separate conflict; it does not generalise to other m-initial strings.

## Forms not newly disputed

`kan`, `ken` and `kas` have final codas n/n/s that align with the relation-coda evidence. Their appearance in the worked example does not establish a productive segmentation or macro expansion. The coda meanings are independently source-backed, but the parameter families remain provisional and the mandatory/optional coda discrepancy remains open.

## Implementation and tests

The source-aware reviewer now gives exact conflict classifications for `kal` and `mel`, while continuing to distinguish:
- general phonotactic legality;
- semantic relation-coda membership;
- the broad P4-T10 “Foot-shaped” test label;
- lexical Foot validity.

One morphology regression test and one source-concordance test are added and registered. Both remain non-executable evidence checks. No canon decision is made.


## Test registry correction

The concordance contains 28 claims (the 10 source artefacts are a separate inventory). The source-concordance test now asserts 28 claims. Its unique test identifiers distinguish the new `kal` conflict case from the existing `mel` conflict case. This is a registry/test-integrity correction only; it does not alter the evidence interpretation.

## Preview verification constraint

A preview deployment was requested for the feature-branch commit, but Vercel rejected the deployment API request because the team exceeded its 100-deployments-per-day API limit (retry window 24 hours). No deployment was created for this commit. The project is still on the feature branch; no production deployment was attempted. Tests remain authored, not executed for this increment.
