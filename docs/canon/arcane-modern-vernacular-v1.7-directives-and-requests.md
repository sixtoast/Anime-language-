# Arcane Modern Vernacular v1.7 — Directives, Requests, Advice and Instructions

**Status:** LOCKED DESIGN CANON for the bounded Modern Vernacular layer  
**Version:** 1.7  
**Depends on:** Modern Vernacular v1.0–v1.6  
**Historical status:** The directive markers in this specification are modern design coinages unless later primary-source evidence establishes otherwise.  
**Validation status:** Exact-form collision check against the inspected v5 draft lexicon and specification-level review completed. Parser execution and independent-speaker validation are not claimed.

## 1. Purpose

This version adds four distinct directive functions without treating them as synonyms:

- **dema** — direct command/directive;
- **sori** — request: ask the addressee to perform an action;
- **mira** — advice or recommendation;
- **toku** — procedural instruction: specify an action as a step in a procedure.

These markers classify the speech act. They do not change the lexical meaning or argument structure of the action verb. They do not establish that the speaker has authority, that the addressee agrees, or that the action succeeds.

The v5 draft lexicon contains **vanu** as a Formal entry glossed “velocity”, so vanu is deliberately not used as an advice marker. Exact searches of the inspected v5 draft lexicon found no entries for dema, sori, mira or toku. This is a bounded collision check, not proof that uninspected historical material lacks these forms.

## 2. Core directive pattern

The directive marker begins the utterance, followed by an already licensed action frame:

**DIRECTIVE MARKER + ACTION VERB + that verb's licensed complements**

The addressee is the person or group being addressed in the current conversational context. In this construction the addressee is also the understood actor of the action. An explicit separate actor is not licensed by this version.

The directive marker is not an ordinary subject and does not occupy the modal slot. It classifies the whole utterance.

### Core examples

| Modern Vernacular | Meaning |
|---|---|
| dema ful tava gezi | Go home! (direct command) |
| sori ful tava gezi | Please go home / I request that you go home. |
| mira ful tava gezi | You should consider going home; advice/recommendation. |
| toku ful tava gezi | Procedure step: go home. |
| dema wish fezo | See the friend! |
| sori nak rawu | Please listen/hear the sound. |
| mira mol gisho | Recommendation: eat food. |
| toku bul li fape ka fezo | Procedure step: give the book to the friend. |
| sori ful tava gezi pun | Is it a request that you go home? — **blocked in v1.7**; see question restriction below. |

The last row is intentionally labelled blocked: the examples above the line illustrate ordinary forms, but directive questions are not licensed in this version. It is retained here as an explicit negative fixture to prevent the apparent presence of pun from being mistaken for a rule.

## 3. Four meanings that must stay distinct

### dema — direct command

Dema directly directs the addressee to perform the action. It does not itself prove that the speaker is entitled to command the addressee, and it does not encode threat, urgency or enforcement.

### sori — request

Sori presents the action as requested from the addressee. It does not guarantee politeness, consent, compliance or a favourable response. Context and tone may affect how the request is received.

### mira — advice or recommendation

Mira recommends considering or performing the action. It is not a command, a need marker, a permission grant or a guarantee that the action is best in all circumstances.

### toku — procedural instruction

Toku presents the action as a step in a procedure, method or ordered task. It does not itself number the step, establish what came before or after, certify safety, or guarantee that the procedure will work. Sequence and dependencies require their own explicit treatment.

## 4. Action frames remain binding

The directive marker cannot repair an invalid action frame. The same argument restrictions apply as in the underlying v1.0–v1.3 construction:

- **dema/sori/mira/toku ful tava gezi** uses the licensed motion goal frame;
- **dema/sori/mira/toku bul li fape ka fezo** preserves the transfer item and recipient roles;
- **dema/sori/mira/toku wish fezo** preserves the perception frame.

No unmarked location becomes a goal, no recipient is inferred without the relevant transfer particle, and no extra participant is licensed merely because the clause is a command or request.

## 5. Scope, negation and questions

Version 1.7 does not combine directive markers with modal operators. It also does not yet license nava, zami, yemi, fam, kong or tek inside a directive utterance. Those combinations would require explicit rules for the scope of a command, request, recommendation or procedural step over ability, desire, permission, need, negation and prohibition.

The following are blocked:

- *dema nava ful tava gezi*;
- *sori nava ful tava gezi*;
- *dema zami ful tava gezi*;
- *dema fam ful tava gezi*;
- *sori yemi ful tava gezi*;
- *mira tek ful tava gezi*;
- any directive marker followed by pun;
- negated or interrogative directive constructions;
- directive clauses with a different unexpressed actor.

To express a plain prohibition, use the already licensed declarative prohibition construction **teshi zami ful tava gezi** (“The person is forbidden to go home”). Do not treat it as equivalent to a negative command; directive negation remains blocked.

## 6. Acceptance and rejection fixtures

These are specification-level targets, not parser or independent-speaker test results.

| ID | Input | Expected status or interpretation |
|---|---|---|
| DIR-01 | dema ful tava gezi | Licensed direct command |
| DIR-02 | sori ful tava gezi | Licensed request |
| DIR-03 | mira ful tava gezi | Licensed advice/recommendation |
| DIR-04 | toku ful tava gezi | Licensed procedural instruction |
| DIR-05 | dema wish fezo | Licensed command over perception frame |
| DIR-06 | sori nak rawu | Licensed request over hearing frame |
| DIR-07 | mira mol gisho | Licensed advice over eating frame |
| DIR-08 | toku bul li fape ka fezo | Licensed procedure step; transfer roles preserved |
| DIR-09 | dema ful tava gezi vs sori ful tava gezi | Distinct speech acts |
| DIR-10 | sori ful tava gezi vs mira ful tava gezi | Request vs advice |
| DIR-11 | toku ful tava gezi | Does not encode step number or sequence by itself |
| DIR-12 | dema ful tava gezi | Does not establish speaker authority or addressee consent |
| DIR-13 | dema nava ful tava gezi | Blocked: directive negation not specified |
| DIR-14 | dema zami ful tava gezi | Blocked: prohibition marker cannot be stacked in directive |
| DIR-15 | dema fam ful tava gezi | Blocked: modal stacking/scope not specified |
| DIR-16 | sori yemi ful tava gezi | Blocked: request plus permission not specified |
| DIR-17 | mira tek ful tava gezi | Blocked: advice plus need not specified |
| DIR-18 | sori ful tava gezi pun | Blocked: directive question construction not specified |
| DIR-19 | dema ful tava gezi | Does not entail action, arrival or success |
| DIR-20 | toku bul li fape ka fezo | Does not guarantee transfer completion or ownership change |

## 7. Change control

Locked decisions for Modern Vernacular v1.7:

1. dema = direct command/directive;
2. sori = request;
3. mira = advice/recommendation;
4. toku = procedural instruction;
5. the marker begins the utterance and scopes over a licensed action frame;
6. the addressee is the understood actor;
7. underlying verb valency and role markers remain binding;
8. modal stacking, directive negation, directive questions and separate unexpressed actors remain blocked;
9. these forms are modern design coinages, not claimed historical forms;
10. no historical or Formal Arcane rule is altered.

When Arcana Mega Pack2 or other older source documents become accessible, check for historical directive forms and meanings. Preserve source provenance and reconcile evidence explicitly rather than silently replacing this modern design.
