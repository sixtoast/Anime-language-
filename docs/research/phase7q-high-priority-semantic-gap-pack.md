# Arcane Phase 7Q — high-priority semantic gap pack

**Status:** Test specification; not canon  
**Date:** 2026-10-15  
**Finding ID:** P7Q-GAPS-01  
**Canon effect:** none  
**Execution status:** Cases authored; not run against a parser or executable grammar.

## 1. Purpose

Phase 7P cross-referenced the Phase 7O contrast matrix with the Phase 7G verb-frame pack and Phase 7K example bank. It found uncovered or only partially covered distinctions that deserve explicit tests. This document adds those cases without duplicating the existing identifiers or pretending that semantic prompts are Arcane sentences.

Role names and example meanings below are metalanguage. All relevant Phase 5 vernacular lemmas remain PROPOSED unless another source explicitly establishes otherwise.

## 2. New gap cases

### GAP-001 — attempted versus completed transfer
**Meaning A:** A successfully gives item X to B.  
**Meaning B:** A attempts to give X to B, but the transfer does not occur.  
**Must distinguish:** completed transfer versus attempted event.  
**Forbidden inference:** the gloss `bul` (“give”) alone does not settle whether completion is entailed.  
**Expected status:** UNRESOLVED until lexical aspect and construction semantics are specified.

### GAP-002 — omitted recipient
**Meaning A:** A gives X to B.  
**Meaning B:** A gives X, with no recipient expressed.  
**Questions:** Is the recipient optional, contextually recoverable, indefinite, or required? Can these readings be distinguished?  
**Must not:** silently invent a recipient from plausibility.  
**Expected status:** UNRESOLVED until omission policy is defined.

### GAP-003 — hearing versus understanding
**Meaning A:** A hears sound S but does not understand it.  
**Meaning B:** A understands message M.  
**Must distinguish:** auditory perception versus comprehension, if both meanings are in scope.  
**Forbidden inference:** hearing a message does not entail understanding it.  
**Expected status:** semantic distinction required; lexical encoding unresolved.

### GAP-004 — learning versus memorising
**Meaning A:** A learns a skill or concept.  
**Meaning B:** A memorises a sequence without necessarily understanding it.  
**Must distinguish:** acquisition/learning versus memorisation if Arcane intends to express both.  
**Forbidden inference:** the proposed gloss `mos` (“learn”) does not establish a memorisation frame or synonymy.  
**Expected status:** UNRESOLVED.

### GAP-005 — approaching versus entering
**Meaning A:** A approaches the boundary of region L but remains outside.  
**Meaning B:** A crosses the boundary and enters L.  
**Must distinguish:** proximity/direction versus boundary crossing.  
**Forbidden inference:** moving toward L does not entail arrival or entry.  
**Expected status:** semantic distinction required; vernacular construction unresolved.

### GAP-006 — desire with a different embedded actor
**Meaning A:** A wants A to leave.  
**Meaning B:** A wants B to leave.  
**Must distinguish:** experiencer of desire versus participant in the desired event.  
**Failure:** grammar forces the desired event's actor to be the subject of `kong` or leaves the actor ambiguous without reporting it.  
**Expected status:** UNRESOLVED.

### GAP-007 — negation scope over desire
**Meaning A:** A does not want to leave.  
**Meaning B:** A wants not to leave / wants to remain.  
**Must distinguish:** negation of wanting versus negative content of the desire, if both are intended readings.  
**Failure:** both receive the same interpretation without an explicit neutralisation rule.  
**Expected status:** UNRESOLVED.

### GAP-008 — negation scope over ability
**Meaning A:** A is not able to leave.  
**Meaning B:** A is able to refrain from leaving.  
**Must distinguish:** inability to perform an action versus ability to perform its opposite.  
**Expected status:** UNRESOLVED until modality and negation scope are defined.

### GAP-009 — contextually omitted participant
**Context:** A and B are discussing a book.  
**Meaning A:** “A saw [the book]”, with the theme omitted.  
**Meaning B:** “A saw [B]”, with a different theme omitted.  
**Questions:** Is omission permitted? If so, how is the referent recovered, and what happens when context supports more than one candidate?  
**Required ambiguity policy:** when context does not determine one referent, report ambiguity rather than guess.  
**Expected status:** UNRESOLVED.

### GAP-010 — attachment of an oblique phrase
**Meaning A:** A tells B a story about C.  
**Meaning B:** A tells B about a story concerning C.  
**Must distinguish:** which constituent the “about C” phrase modifies and whether the content is the story or the telling event.  
**Failure:** a phrase can attach to either clause with no parse distinction or ambiguity report.  
**Expected status:** UNRESOLVED; proposed `buk` (“about”) does not define attachment.

### GAP-011 — alias and version provenance
**Input records:** a historical token and a later preferred form listed as an alias pair.  
**Must preserve:** original token, source/version, preferred form if any, status, and whether normalisation was applied.  
**Forbidden behaviour:** rewriting the original source token in place or treating a preferred form as proof that the historical token never existed.  
**Expected status:** registry/data-integrity test, not a vernacular grammar test.

### GAP-012 — unknown verb frame
**Input:** a proposed verb with a gloss but no established frame, used with three participant phrases.  
**Must return:** unresolved/ambiguous frame, or a documented analysis supported by a source or approved rule.  
**Forbidden behaviour:** borrowing the nearest familiar verb's frame without a declared class rule.  
**Expected status:** ambiguity-policy test.

## 3. Suggested test record for each case

For eventual conversion into an executable fixture, record:

- stable ID (`GAP-001` to `GAP-012`);
- semantic input and contrasting input;
- relevant lexeme and status, if any;
- source references and version;
- register;
- expected interpretation set;
- forbidden inferences;
- whether a unique parse, ambiguity or unresolved result is expected;
- actual observed output, only after execution;
- tool/parser version and execution metadata.

These fields are a proposal for test documentation. They do not assert that the website's current registry supports every field.

## 4. Relationship to earlier suites

| Gap pack case | Related Phase 7G | Related Phase 7K | New value |
|---|---|---|---|
| GAP-001 | VF-001–VF-004 | EX-003–EX-005 | Adds completion versus attempt |
| GAP-002 | VF-001, VF-004, VF-024, VF-026 | EX-003, EX-006 | Makes recipient omission explicit |
| GAP-003 | VF-012 | EX-032 only partially | Separates hearing from comprehension |
| GAP-004 | VF-017 | — | Adds learning/memorisation contrast |
| GAP-005 | VF-005–VF-007 | EX-012–EX-015 | Adds boundary crossing/entry |
| GAP-006 | VF-021 | EX-010, EX-033 partially | Adds embedded actor contrast |
| GAP-007 | VF-021 | EX-024 partially | Adds negation scope over desire |
| GAP-008 | VF-018–VF-020 | EX-024 partially | Adds scope over ability |
| GAP-009 | VF-024, VF-026 | — | Adds context ambiguity policy |
| GAP-010 | VF-014, VF-015, VF-027 | EX-009, EX-019 | Makes attachment ambiguity explicit |
| GAP-011 | Acceptance gate | Source policy | Adds provenance-integrity case |
| GAP-012 | Registry acceptance gate | All unresolved prompts | Makes unknown-frame behaviour testable |

## 5. Acceptance principles

A future grammar or parser should satisfy these principles:

1. **No entailment by gloss alone.** Lexical glosses do not automatically settle event completion, ownership, understanding, arrival or success.
2. **Scope must be testable.** Negation and modality cannot be treated as a bag of independent words; the grammar must define what each operator applies to.
3. **Participants are clause-local.** An embedded participant must not be mistaken for a main-clause participant simply because the same referent appears in both.
4. **Context is evidence, not licence to guess.** Context may resolve omission only under a stated rule; otherwise ambiguity remains.
5. **Historical forms remain historical evidence.** Alias normalisation must not destroy the original token or its source.
6. **Unresolved is a legitimate expected result.** A system that reports a justified ambiguity is better than one that invents a confident parse.
7. **Semantic test prompts are not surface sentences.** Do not label them Arcane translations.

## 6. Result and next action

The gap pack adds twelve targeted requirements without introducing any new lexical items or grammatical rules. The highest-priority language design questions now concern scope, argument omission, embedded clauses, and event entailments—not vocabulary size.

Next, compare the test metadata needed here with the website's current audit/test registry and determine whether a future fixture can be recorded honestly as a semantic prompt, proposed surface form, historical attestation, or executed parser test. Keep the website work subordinate to language research.

## 7. Decision ledger

- **Finding:** P7Q-GAPS-01
- **New gap cases:** 12
- **Existing suite mappings:** Phase 7G and Phase 7K
- **New Arcane forms:** 0
- **New canon rules:** 0
- **Parser tests executed:** 0
- **Next step:** review the existing registry schema and build a language-focused test coverage ledger, without altering website behaviour unless explicitly requested.
