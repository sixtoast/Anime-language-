# Arcane Phase 9D — semantic role inventory and mandatory-disambiguation gates

**Status:** Controlled-hybrid design specification candidate; not canon  
**Date:** 2026-10-15  
**Canon changes:** none  
**New Arcane forms:** none  
**Tests executed:** none; semantic cases are specified for later execution

## 1. Purpose and boundary

Phase 9C selected the controlled hybrid as the leading design candidate: a narrow default order for validated simple clauses, with explicit constructions when default order cannot recover the intended roles. This phase defines the semantic role inventory and finite trigger rules that must exist before any surface markers are invented.

The inventory is a **design metalanguage**, not a list of Arcane morphemes. A role name such as RECIPIENT is not a proposed spoken token. The v5 draft lexicon remains evidence for proposed words and glosses only; it does not establish these roles as grammatical categories in historical Arcane.

## 2. Role inventory

### 2.1 Core participant roles

| Role ID | Role label | Operational definition | Example prompt (English only) | Common confusion to prevent |
|---|---|---|---|---|
| R-01 | ACTOR | Participant presented as carrying out or initiating an event | A opens X | Actor is not necessarily a physical cause |
| R-02 | EXPERIENCER | Participant undergoing a perception, feeling, desire or knowledge state | A sees B; A wants X | Experiencer is not automatically an agent |
| R-03 | THEME | Entity or content most directly involved in, perceived by, transferred in, or affected by an event | A sees X; A gives X | Theme is not always a patient that changes |
| R-04 | PATIENT | Participant undergoing a change or direct effect | A damages X | Do not label every object a patient |
| R-05 | RECIPIENT | Intended or actual endpoint of a transfer or communication, according to the chosen predicate frame | A gives X to B | Recipient is not beneficiary |
| R-06 | BENEFICIARY | Participant for whose benefit an event is performed | A gives X for B's benefit | Benefit does not imply receipt |
| R-07 | SOURCE | Origin from which movement or transfer proceeds | A takes X from B; A moves from L | Source is not theme or mere reference point |
| R-08 | GOAL | Intended endpoint or destination of a motion/transfer relation | A goes to L | Goal does not entail arrival |
| R-09 | PATH | Route, trajectory or extended course associated with motion | A travels along P | Path does not entail reaching an endpoint |
| R-10 | LOCATION | Place where a state/event is situated | A is at L | Location is not goal or source |
| R-11 | ADDRESSEE | Participant to whom a message is directed | A says M to B | Addressee is not the message's topic |
| R-12 | MESSAGE | Content communicated by a speaking/signalling event | A says M | Message may be a word, quote or proposition; syntax remains open |
| R-13 | CONTENT | Entity, fact, skill or proposition learned, taught, known or discussed | A learns P | Content is not automatically a syntactic direct object |
| R-14 | EMBEDDED ACTOR | Participant filling a role inside a subordinate event or proposition | A wants B to leave | Embedded actor is not matrix experiencer |
| R-15 | INSTRUMENT | Means/tool used by an actor in an event | A cuts X with tool T | Instrument is not accompaniment |
| R-16 | COMPANION | Participant accompanying another participant | A travels with B | Companion is not instrument or co-agent by default |

These roles are semantically useful distinctions, not a commitment that every role needs a unique marker. The eventual grammar may group roles into constructions, but it must preserve contrasts when the intended meaning requires them.

### 2.2 Event, relation and scope roles

| Role ID | Role label | Operational definition | Do not infer |
|---|---|---|---|
| R-17 | DEICTIC CENTRE | Person/place/time relative to which “come”, “here”, “now” or similar expressions are interpreted | That the speaker is always the centre |
| R-18 | REFERENCE OBJECT | Entity/axis/frame used to interpret a spatial relation | Motion, source or arrival |
| R-19 | COMPARATIVE STANDARD | Entity/event against which a property is compared | Source or cause |
| R-20 | REASON | Explanation/reason associated with a proposition or event | Purpose unless explicitly defined |
| R-21 | PURPOSE | Intended outcome for which an action is undertaken | Actual success or physical causation |
| R-22 | TIME | Temporal location or interval of an event | Aspect, duration or completion unless encoded |
| R-23 | DURATION | Length of time an event/state persists | Deadline or endpoint |
| R-24 | DEADLINE / TERMINUS | Temporal boundary by which or until which a relation holds | Duration by itself |
| R-25 | MODAL HOLDER | Participant whose ability/permission/obligation is evaluated | Actual performance of the event |
| R-26 | MODAL BASIS | Source/condition grounding possibility, permission or ability | That all modal meanings are the same |
| R-27 | NEGATION TARGET | Proposition/event/state within the scope of negation | That a negative answer particle negates a full clause |
| R-28 | QUOTE / PROPOSITION BOUNDARY | Boundary and type of communicated content | That quoted words and reported propositions share syntax |

## 3. Core roles versus adjuncts: working policy

For the first designed Vernacular prototype, use the following **semantic classification**, not yet a syntactic case system:

- A role is **frame-core** when the chosen meaning of a particular verb/construction requires it to identify the event or state (for example, the perceiver in a literal “see” event).
- A role is **licensed optional** when the frame permits it to be omitted without changing the core predicate meaning beyond loss of detail.
- A phrase is an **adjunct candidate** when it contributes time, reason, manner, instrument, companion, or other contextual information without filling a verb-specific participant slot.
- A role remains **unclassified** until the frame is specified. Do not label a recipient, source, location or message an adjunct merely because English uses a preposition.

Core/adjunct status is predicate- and construction-sensitive. The same semantic relation can be obligatory in one frame and optional in another. A role inventory alone cannot settle syntactic marking.

## 4. Mandatory-disambiguation gates

These gates are proposed as a finite default policy for the controlled-hybrid experiment. “Mandatory” means that a future surface grammar must use a licensed construction that resolves the distinction; it does **not** mean a particular marker has been chosen.

| Gate | Trigger | Required behaviour | Reason |
|---|---|---|---|
| G-01 | Two participants can plausibly exchange roles | Use a uniquely interpreted construction or report ambiguity | Prevents role reversal from being guessed |
| G-02 | Three or more frame-core participants occur | Independently recover each role | Default two-slot SVO is insufficient |
| G-03 | Recipient and beneficiary both matter, or contrast with each other | Encode them as separate relations | Benefit does not imply receipt |
| G-04 | Source and theme could be confused | Distinguish origin from transferred/moved entity | Prevents “take X from B” role collapse |
| G-05 | Location, source, goal, path or arrival contrast matters | Use distinct licensed spatial constructions | Orientation does not entail motion or arrival |
| G-06 | A message has both addressee and topic, or multiple content roles | Distinguish addressee, topic and message/content | Communication roles are not interchangeable |
| G-07 | Matrix and embedded clauses each contain participants | Establish clause boundaries and role scope | Stops matrix and embedded roles from merging |
| G-08 | Quotation and reported proposition contrast | Mark or structurally delimit the content type | Exact words differ from reported content |
| G-09 | Negation or modality has more than one plausible scope | Resolve scope by rule or report ambiguity | Scope can reverse truth conditions |
| G-10 | Ability, permission and physical possibility contrast | Preserve the modal distinction | English “can” is underdetermined |
| G-11 | Omission leaves two or more plausible referents/roles | Require an expression or report ambiguity | Contextual plausibility alone is not a rule |
| G-12 | Non-default order is used | Preserve role interpretation under an approved rule | Reordering must not silently swap roles |
| G-13 | A form is drawn from another register or historical stratum | Require explicit cross-register approval | Formal forms are not automatic vernacular markers |
| G-14 | A construction implies success, possession, arrival or causation beyond the lexical evidence | Do not infer the result without an explicit semantic rule | Event description and result are distinct |
| G-15 | Existing token has a known lexical/digit/reference collision | Require boundary/slot/register resolution before using it as a marker | Prevents surface ambiguity |

## 5. Cases where explicit marking is not yet mandatory

To avoid turning the hybrid into unrestricted role marking, the following are eligible for a simple-order pilot **only after their individual frame has been validated**:

1. A single-argument event with no omitted role that changes interpretation.
2. A two-participant predicate whose participant roles are stable and recoverable under the declared default order.
3. A short yes/no question whose question particle and scope have been specified.
4. A standalone interjection or response particle.

Eligibility is not automatic approval. For example, `teshi wish fezo` remains an experimental SVO example because the lexicon gives `wish` = “see” but does not itself establish the surface frame. The question particle `pun` remains a pilot proposal, not a canonical interrogative rule.

## 6. Negative requirements

The future grammar must reject these invalid inferences:

- ACTOR = physical cause in every event.
- THEME = PATIENT in every predicate.
- RECIPIENT = BENEFICIARY.
- SOURCE = THEME or LOCATION.
- GOAL = successful arrival.
- PATH = endpoint.
- ADDRESSEE = TOPIC.
- MESSAGE = exact quotation in every case.
- CONTENT = always a noun phrase or always a clause.
- MODALITY = actual action.
- WANT = NEED.
- TEACHING = successful learning.
- HEARING = understanding.
- INTENTION = physical mechanism or achieved effect.
- A likely omitted participant = a uniquely recoverable participant.
- Formal Arcane marker = valid Vernacular marker without approval.

## 7. Semantic fixture set for the next prototype

Each fixture is an English meaning prompt, not an Arcane translation. The future prototype must provide a surface form only after the relevant construction is specified.

| Fixture | Positive target | Contrast / negative target | Gate |
|---|---|---|---|
| ROLE-01 | A sees B | B sees A | G-01 |
| ROLE-02 | A gives X to B | A gives X for C's benefit | G-03 |
| ROLE-03 | A gives X to B for C's benefit | C receives X | G-03, G-14 |
| ROLE-04 | A takes X from B | B takes X from A | G-01, G-04 |
| ROLE-05 | A is at L | A goes to L | G-05 |
| ROLE-06 | A goes toward L but stops short | A arrives at L | G-05, G-14 |
| ROLE-07 | A says M to B | A says M about B | G-06 |
| ROLE-08 | A quotes exact words | A reports proposition P | G-08 |
| ROLE-09 | A wants B to leave | A wants to leave | G-07 |
| ROLE-10 | A is able to act | A is permitted to act | G-10 |
| ROLE-11 | A can act but does not | A actually acts | G-14 |
| ROLE-12 | A does not want P | A wants not-P | G-09 |
| ROLE-13 | A takes X; source recoverable from a unique stated context | Source could be either B or C | G-11 |
| ROLE-14 | A moves along path P | A reaches endpoint L | G-05 |
| ROLE-15 | Historical token in its original source | Registered alias in a later stratum | G-13, G-15 |

## 8. What this phase does not decide

This inventory does not choose:
- surface role-marker forms or morphology;
- whether markers precede/follow nouns or attach as clitics;
- whether the default SVO order is universal, strict or only a teaching baseline;
- a complete lexicon of verbs and their frame-specific valency;
- quotation or embedded-clause delimiters;
- negative or modal particles;
- formal operator syntax or physical-effect execution semantics.

Those decisions need a separate surface-design experiment after the role inventory has been reviewed for completeness and collision risk.

## 9. Recommendation and next phase

Use this 28-role semantic inventory and 15 fixtures as the baseline for a finite surface-mechanism comparison. Test only a small set of candidate mechanisms—default order, dedicated role particles, adposition-based relations, and controlled hybrid—against the same fixtures. Do not coin new forms until the comparison identifies which distinctions cannot be expressed with already licensed material.

**Finding ID:** P9D-SEMANTIC-ROLE-INVENTORY-AND-GATES-01  
**Evidence level:** design proposal based on prior research; not historical reconstruction  
**Canon promotion:** none  
**New vocabulary:** none  
**Next phase:** surface-mechanism comparison and collision audit, followed by a tiny marked prototype only if a candidate can pass the acceptance criteria.
