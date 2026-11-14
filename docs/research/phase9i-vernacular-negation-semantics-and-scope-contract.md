# Arcane Phase 9I — vernacular negation semantics and scope contract

> **SUPERSESSION NOTICE — Modern Vernacular v1.0 (2026-10-15):** This document is retained as a research/history record. For the bounded Modern Vernacular core, the binding rules are now in [Arcane Modern Vernacular v1.0 — Locked Core Grammar](../canon/arcane-modern-vernacular-v1.0-locked-core.md). Where this document labels SVO, information-question placement, polar-question placement, or clause negation as provisional/open, the v1.0 specification supersedes that status for its defined scope. Historical claims, other verbs, other registers, and explicitly blocked constructions remain outside that lock. Do not copy older candidate rules over the locked specification.



**Status:** Provisional semantic design specification; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Historical vernacular negation recovered:** no  
**Implementation changes:** none  
**Tests executed:** none; fixtures are a design oracle, not parser or speaker results

## 1. Purpose

Phase 8Y compared three possible positions for a future vernacular negation marker but correctly left the choice open. Phase 9H recommends returning to negation as the next substantive grammar blocker. This phase defines what the language must distinguish before any marker or surface position is selected.

The key decision is semantic, not orthographic: English uses related expressions such as *not*, *cannot*, *may not*, *no person*, and *not always*, but these do not all express the same operation. A reliable Arcane construction must not collapse them merely because a short English gloss says “negative”.

This document proposes a **semantic contract** for future design. It does not coin a negation word, select preverbal/postverbal/clause-final placement, or import Formal `GRASH` into Vernacular.

## 2. Source and register boundary

The canonical specification records Formal NOT as `GRAK`, with `GRASH` preferred in the alias registry and `GRAK` preserved as a historical/compatibility form. This is a Formal operator record. It does not establish a Vernacular negation marker, position, inflection, scope, or negative-question answer system.

The proposed Vernacular response `kor` means “no” as a standalone response candidate. It must remain distinct from a clause-negation construction unless an explicit later decision approves a merger and accepts the resulting ambiguity.

Abstract labels such as `NEG`, `MODAL`, `NOT-P`, and `P` in this document are metalanguage placeholders. They are not Arcane words and must not be spoken or pasted into example clauses as if they were forms.

## 3. Semantic contract: meanings to distinguish

| ID | Semantic target | Core interpretation | Must not be silently equated with |
|---|---|---|---|
| N-S01 | Proposition negation | It is not the case that P | Lack of evidence for P |
| N-S02 | Ability denial | Agent lacks ability/capacity to do P | P is false for any reason |
| N-S03 | Permission denial / prohibition | Acting is disallowed | Agent is unable to act |
| N-S04 | Epistemic uncertainty | Speaker does not know whether P | Speaker knows not-P |
| N-S05 | Negative existence/quantification | No individual in a domain satisfies P | One identified individual does not satisfy P |
| N-S06 | Constituent/focus negation | X, rather than Y, is excluded or corrected | Whole proposition is false |
| N-S07 | Predicate negation under aspect/frequency | P does not always occur / P never occurs | One unqualified negation meaning |
| N-S08 | Matrix/embedded scope | Negation applies to the reporting/attitude predicate or embedded content | The two scopes being interchangeable |
| N-S09 | Negative question | Ask about a proposition presented as negated | Positive question plus a negative answer |
| N-S10 | Negative command/request | Request that an action not occur | Prohibition, inability, and ordinary statement all treated alike |

These distinctions are a design target, not a claim that every meaning must have a unique single morpheme. A language may express them through compositional structures, lexical predicates, context, or separate constructions. Arcane must specify which route it uses.

## 4. Scope vocabulary for analysis

Use the following abstract semantic notation in tests:

- **P**: a proposition, such as “the person sees the friend”.
- **NOT(P)**: the proposition P is false.
- **ABLE(agent, P)**: the agent has the relevant ability to bring about P.
- **PERMITTED(agent, P)**: acting in accordance with P is permitted.
- **KNOW(agent, P)**: the agent knows P.
- **EXISTS(x in D : P(x))**: at least one member of domain D satisfies P.
- **ALWAYS(P)** / **SOMETIMES(P)**: frequency or temporal quantification over occurrences.
- **SAY(agent, P)**: the agent says/communicates proposition P.

This notation is for the design team only. It does not dictate the formal Arcane operator inventory or a Vernacular syntax.

### Scope contrasts

1. **NOT(P)** differs from **NOT(ABLE(agent, P))**: “does not do P” is not the same as “cannot do P”.
2. **NOT(PERMITTED(agent, P))** differs from **NOT(ABLE(agent, P))**: prohibited action and impossible action are distinct.
3. **NOT(KNOW(agent, P))** differs from **KNOW(agent, NOT(P))**: uncertainty or ignorance does not establish the opposite proposition.
4. **NOT(SAY(agent, P))** differs from **SAY(agent, NOT(P))**: not saying P differs from saying that P is false.
5. **NOT(ALWAYS(P))** does not entail **ALWAYS(NOT(P))**: “not always” allows some occurrences of P.
6. **NOT(EXISTS(x : P(x)))** differs from “a particular x does not satisfy P”: quantifier scope changes the claim.

A surface marker's position cannot by itself settle these distinctions. Its scope and attachment must be explicitly specified.

## 5. Minimal semantic fixture bank

Each fixture gives a target and an acceptance condition, not an Arcane translation. “Distinct” means the design must preserve the intended semantic difference; it does not require a unique surface word if a clear compositional structure is later specified.

| ID | Target A | Contrast target B | Required outcome |
|---|---|---|---|
| NS-01 | The person does not see the friend | The person cannot see the friend | Ordinary event negation and ability denial remain distinct |
| NS-02 | The person cannot see the friend | The person is forbidden to see the friend | Ability and permission remain distinct |
| NS-03 | The person does not know whether the friend came | The person knows the friend did not come | Ignorance is not converted into negative knowledge |
| NS-04 | The person does not say that the friend came | The person says that the friend did not come | Matrix and embedded negation remain distinct |
| NS-05 | Not every person sees the friend | No person sees the friend | Existential/frequency scope remains distinct |
| NS-06 | The person does not always see the friend | The person never sees the friend | `NOT(ALWAYS(P))` is not equated with `ALWAYS(NOT(P))` |
| NS-07 | The person sees the friend, not the mage | The person does not see the friend | Focus correction is distinct from whole-proposition negation |
| NS-08 | The person may not go (uncertain whether they will) | The person may not go (permission withheld) | Epistemic and deontic readings must be distinguished or explicitly declared context-dependent |
| NS-09 | Does the person see the friend? | Does the person not see the friend? | Positive and negative question constructions differ |
| NS-10 | The person does not see who? (echo/clarification reading) | Who does not see the friend? | Questioned role and negation scope do not collapse |
| NS-11 | Do not go (request) | You are prohibited from going | Request force and deontic prohibition are not assumed identical |
| NS-12 | No evidence establishes P | Evidence establishes NOT(P) | Epistemic evidence status differs from truth-functional negation |

**Status:** all twelve are unrun design fixtures. No surface strings or passing results are supplied.

## 6. How the fixture bank informs marker architecture

The fixture bank does not yet justify selecting preverbal, postverbal, or clause-final placement. Each candidate architecture can express these meanings in principle, but each still needs explicit scope rules.

| Design question | Why it matters | Minimum answer required before teaching |
|---|---|---|
| What does the marker negate by default? | Avoids guessing between verb, proposition, modal and constituent scope | One stated default plus licensed exceptions |
| How is scope over a modal encoded? | Separates “not able” from “not allowed” and “not doing” | Explicit bracketing/ordering or construction rule |
| How does negation interact with embedded clauses? | Prevents matrix/embedded scope collapse | Clause-boundary rule |
| How does negation interact with aspect/frequency? | Avoids confusing “not always” with “never” | Scope and ordering rule |
| How are negative questions formed and answered? | Bare “yes/no” can be ambiguous across languages | Question formation and response interpretation rule |
| Is double negation licensed? | Prevents accidental cancellation or emphasis | Explicit policy: licensed meaning, emphatic use, or rejection |
| What is the imperative/request construction? | A negative declarative is not automatically a prohibition | Construction and pragmatic force rule |

Only after these decisions are answered should a surface form and position be proposed. If the design cannot state the scope clearly, it is not ready for a learner sentence.

## 7. What this phase does not decide

- No vernacular negative lexeme or particle is proposed.
- No choice is made among NEG-A (preverbal), NEG-B (postverbal), or NEG-C (clause-final).
- No claim is made that `kor` can negate a clause.
- No negative question is translated into Arcane.
- No formal operator spelling is changed or repurposed.
- No spell execution, physical effect, or parser behaviour is inferred from the semantic fixtures.

## 8. Next phase

Phase 9J should use the semantic contract to audit the existing source material for any explicit Vernacular negation evidence. If no reliable source example exists, document that absence as a bounded finding and compare the three surface architectures against the same fixtures, with separate ratings for scope clarity, ambiguity, teachability and compatibility with existing pilot conventions.

The architecture choice must remain a proposal until the language owner approves it. A proposed marker must then be checked against the existing lexicon, aliases, phonology, and collisions before it is used in a learner clause.

## 9. Decision record

- **Finding ID:** P9I-NEGATION-SEMANTIC-CONTRACT-01
- **Purpose:** define semantic distinctions required before choosing surface negation
- **Source evidence:** Formal NOT exists; no Vernacular clause-negation rule recovered in the reviewed records
- **New vocabulary:** none
- **Architecture selection:** none
- **Canon changes:** none
- **Tests executed:** none; twelve semantic design fixtures defined
