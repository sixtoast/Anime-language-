# Magic System v3.0 — Canonical Specification

**Status:** CANONICAL. Architecture frozen.  
**Source:** User-supplied canonical specification in the Anime project conversation.  
**Implementation status:** Source imported; not an executable validation result.

## 0. Core idea

Magic is the controlled manipulation of a physical mana field to produce physical changes through valid interaction mechanisms.

`Magic = Information + Control + Mana + Coupling + Mechanism + Resources`

None of these components can replace another.

## 1. Fundamental separation

`Information ≠ Mana ≠ Energy ≠ Force ≠ Coupling ≠ Effect`

- **Information** describes organisation.
- **Mana** is the physical field being manipulated.
- **Energy** allows physical work and state changes.
- **Force** changes momentum: `F = dp/dt`.
- **Coupling** determines whether and how mana interacts with something.
- **Effect** is the resulting physical state change.

This separation is the primary anti-cheat rule.

## 2. Mana ontology and properties

Mana is a fundamental physical field `Ψ_M(x,t)`. Vector notation represents internal degrees of freedom such as orientation/polarisation; it does not mean mana is an ordinary electromagnetic vector field. A simplified scalar representation may be used when direction is irrelevant: `Ψ_M = A e^(iφ)`.

Properties can include density, energy density, phase, frequency, coherence, propagation, internal orientation, information structure, flux, and interaction susceptibility. Mana normally exists throughout space near equilibrium. Meaningful magical configurations are organised excitations of the field.

## 3. Mana is not consciousness

Canon: **mana does not understand meaning.** It does not know what a caster wants. The biological system produces a physical control pattern:

`Intent → Neural Representation → Mana Configuration`

The field responds according to physical law.

## 4. Propagation

Mana disturbances propagate finitely: `v_M ≤ c`. The recommended world value remains approximately `c`. Propagation time is `t_prop = d/v_M`. Apparent instantaneous magic may be prepared beforehand, constructed locally, triggered by a local event, or operating from an existing field structure. Magic cannot transmit information arbitrarily fast.

## 5. Spell definition and casting pipeline

A **spell** is a deliberately constructed, physically valid mana-field trajectory. A spell is not a word, element, thought, incantation, circle, or mana itself; those may be interfaces or components.

Deliberate casting pipeline:

`INTENTION → SPECIFICATION → NEURAL REPRESENTATION → INTERFACE ENCODING → MANA STATE → COUPLING → PHYSICAL MECHANISM → EFFECT`

Feedback loop:

`EFFECT → SENSING → FEEDBACK → CORRECTION`

Expertise improves the whole pipeline, not merely mana output.

## 6. Constraints and bandwidth

Serious spells are constrained by some combination of:
- `E`: available energy
- `P`: available power
- `I`: information requirement
- `B_C`: control bandwidth
- `g`: effective coupling
- `S`: stability

Caster factors include `B_N` (neural bandwidth), `B_M` (mana-channel bandwidth), and `T_N` (neural tolerance). Effective control bandwidth is approximately:

`B_effective = min(B_N, B_M, B_C)`

## 7. Capacity is not power

Reject the simplistic RPG equation “more mana means stronger”. Keep distinct: mana capacity `M_capacity`, throughput `Ṁ_throughput`, regeneration `Ṁ_regeneration`, maximum power `P_max`, neural bandwidth `B_N`, control bandwidth `B_C`, coherence `C_M`, and coupling `g`. A person can have large reserves and poor control; another can have modest reserves and extraordinary efficiency.

## 8. Energy and conservation

Mana can carry energy: `E_M = ∫_V u_M dV`, but mana is not free energy.

`E_input = E_useful + E_loss + E_residual`

`η = E_useful / E_supplied`

For a closed system, total energy is conserved (`ΔE_total = 0`); total momentum is conserved (`Δp_total = 0`). Information requires a physical encoding process. Matter must have a source or undergo valid conversion. Mass-energy conversion obeys `E = mc²`; one kilogram corresponds to roughly `9 × 10^16 J`. “Create a kilogram of gold” is not a casual beginner spell.

Matter may be rearranged, transformed, chemically modified, nuclearly transformed, or converted to/from energy through valid mechanisms.

## 9. Mechanism completeness

Every physical state transition needs a defined physical mechanism connecting the initial state to the desired state. “Make enemy explode” is incomplete. “Ionise surrounding gas → create plasma instability → rapidly deposit energy → produce an expanding pressure wave” describes a candidate mechanism, which still needs energy, coupling, control, range, and stability checks.

`ASSIGN ≠ CAUSE`  
`DESIRED EFFECT ≠ PHYSICAL MECHANISM`

Specifying a desired state does not specify a route to it.

## 10. Mana–matter coupling and affinity

Coupling pathways may include mechanical, thermal, electromagnetic, chemical, biological, and informational interactions:

`g = (g_mechanical, g_thermal, g_EM, g_chemical, g_biological, g_informational, …)`

A conceptual response equation is `R_M = χ_M Ψ_M`, where `χ_M` represents material mana susceptibility.

**Affinity** is a relatively stable tendency for an individual's biological–mana interface to achieve efficient and reliable control over particular classes of mana–physical interaction. It is biological, statistical, multidimensional, somewhat trainable, and not absolute. It is not an elemental substance stored inside a person.

## 11. NULL and specialist distinction

**NULL** means failure of conventional affinity classification. It does not mean zero mana, anti-magic, secretly infinite affinity, immunity, or omnipotence. The protagonist has an unusually broad/flat coupling profile that conventional classification struggles to describe.

- **Specialist:** high efficiency in a narrow construction region.
- **MC:** broad adaptability across construction regions.
- **Anti-mage:** specialised disruption of other constructions.

The MC should not automatically outperform specialists at their own spells. His different developmental path comes from broader adaptability and unconventional construction.

The MC initially lacks the automatic mappings on which others rely. He must often go through `intention → physical model → construction → mana`, making him slower initially but differently adaptable.

## 12. Biology and interfaces

The biological interface is distributed: brain → neural activity → mana coupling → `Ψ_M`. Relevant factors may include neural organisation, synchronisation, sensory processing, molecular susceptibility, membrane dynamics, development, genetics, plasticity, training, and health. There is no single “magic gene”.

Speech is an interface, not magic: speech → auditory perception → neural pattern → learned motor representation → mana construction.

The same construction may be encoded through speech, sigil, instrument, or potentially internal thought. Silent casting is internalised control, not merely “thinking harder”. Sigils are not inherently magical; they can provide visual specification, guide neural construction, encode a prepared configuration, interact with magical materials, or participate in persistent field structures. A drawing alone is not magic.

## 13. Spell design and grammar

Semantic structure:

`HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL`

A clause may be represented as `C = (H, A₁, …, Aₙ, M₁, …, Mₖ)`.

This spell-design hierarchy and the language surface syntax `HEAD + ARGUMENTS + MODIFIERS` are distinct layers; their mapping remains a documented integration task.

Core operational vocabulary:
- KREN — establish
- TRAK — alter
- FREM — maintain
- SHREN — release
- BRAN — couple
- NES — read
- SIMA — measure
- GAMA — assign
- DAVE — infer
- KWAM — bind
- KWAT — reference
- KWAK — live evaluation
- VARE — prefer

Mathematical vocabulary:
- FRAPA — add
- FRATA — subtract
- FRAKA — multiply
- FRALA — divide
- FRASHA — negate
- DRAN — magnitude
- DREM — dot product
- DRIM — cross product
- DRAL — compare

Fixed arity is intended to prevent precedence-based ambiguity.

## 14. Information, sensing, and targeting

Distinguish `READ ≠ MEASURE ≠ INFER`.
- **READ** retrieves already available information.
- **MEASURE** acquires information through a physical pathway.
- **INFER** constructs a hypothesis from information.

`P(H | O) ≠ 1` merely because an inference is strong.

Observation chain: World → Signal → Interaction → Sensor → Neural Representation → Interpretation. Every sensing mechanism has range, bandwidth, resolution, noise, coupling, and blind spots. There is no universal “detect everything”.

Targeting is an information problem: candidate targets → criterion → measurement → comparison → selection. Selecting a target does not itself affect it.

## 15. Time, space, healing, and identity

Keep separate:
- rate manipulation ≠ time manipulation ≠ state restoration ≠ prediction
- spatial reference ≠ spatial movement ≠ teleportation

Most apparent “time magic” can be rate manipulation. True spacetime manipulation needs a dedicated mechanism. Teleportation must solve destination, occupancy, identity, spatial transfer, momentum, frame, causal pathway, energy, and stability.

Healing repairs; regeneration rebuilds; reconstruction creates a functional body from stored information/material; resurrection additionally raises identity and continuity problems. Death involves loss of sufficiently organised biological function, and information begins degrading after death, making resurrection harder with time. By default, **copy ≠ original**; causal continuity matters more than superficial similarity. The system intentionally does not settle the metaphysical question by fiat.

## 16. Contracts, curses, anti-magic, and dispel

A magical contract is information + monitoring + condition + enforcement. Conditions must be physically evaluable; “do not betray me” is not automatically executable and needs an operational definition. Loopholes are intentional.

Anti-magic attacks requirements of magic—coupling, coherence, information, control, propagation, absorption, scattering, resonance, or neural interface. It is not metaphysical deletion.

“Dispel” is a macro-category: decohere, decouple, absorb, scatter, oppose, interrupt, or destabilise. **Stopping a spell does not undo its consequences.** If a spell throws a rock, dispelling the spell does not return the rock.

## 17. Gods, life, monsters, and autonomous magic

A god is an extremely stable, high-order physical organism with extraordinary mana coupling. Gods may have enormous reserves, incredible control, distributed cognition, extraordinary sensing, specialised domains, ancient knowledge, and advanced technology. God ≠ omnipotent; god ≠ omniscient. Divine magic is ordinary magic at extraordinary scale and sophistication. Gods can make mistakes, lack information, be surprised, lose resources, suffer damage, and die.

Life is self-maintaining physical organisation, broadly `L = (R, M, E, A, S)`: regulation, metabolism/resource processing, exchange, adaptation, and self-maintenance. Magical organisms may evolve around mana environments. “Monster” is not a fundamental scientific category; it may be ecological, cultural, political, or religious.

Autonomous magic is a control system: sensing → state evaluation → decision → action → feedback. It enables traps, guardians, magical machines, rituals, self-regulating barriers, and potentially magical life, but requires physical resources.

## 18. Logos and the protagonist

Logos is a persistent computational agent coupled to the MC’s biological–mana interface. Total system: `S_total = (N, Ψ_M, L)`. Logos has memory, models, inference, prediction, internal state, goals, and computation, but does not escape physics.

Logos excels at calculation, pattern comparison, formal modelling, signature analysis, prediction, optimisation, spell reconstruction, and countermeasure analysis. The MC excels at intuition, improvisation, embodied movement, creative construction, unconventional solutions, persistence, and exploiting incomplete information. Neither replaces the other.

During possession, Logos controls the MC through the neural interface. `L → N → Ψ_M` competes with `N_MC → Ψ_M`, causing interface conflict and migraines. Logos can be worse at physical combat because it must explicitly calculate movements the MC performs intuitively. Logos excels at formal symbolic structure, while the MC can explore constructions Logos would not initially consider.

**Open specification gap:** Logos’s substrate, memory, energy, bandwidth, and interface costs are not fully specified in the supplied recovery evidence. Do not invent them as canon.

## 19. Environment and ecology

Effective stability depends on environment: mana density, field gradients, background noise, material properties, geometry, temperature, pressure, electromagnetic conditions, boundaries, and existing magical structures. The same spell can behave differently in different environments.

Mana weather may include gradients, turbulence-like behaviour, resonance bands, field-density fronts, interference regions, depletion zones, and storms, all as physical field behaviour.

Magic → Environment → Evolution → Life → Magic forms an ecological feedback loop.

## 20. Spell lifecycle, research, failures, optimisation, combat

Spell specification:

`S = (Ψ, G, T, B, M, C)`

where `Ψ` is field configuration, `G` geometry, `T` temporal structure, `B` boundaries, `M` mechanism, and `C` control.

Lifecycle: DEFINED → ARMED → TRIGGERED → ACTIVE → SATISFIED. Other outcomes: FAILED, EXPIRED, CANCELLED, COLLAPSED.

Research loop: Question → Hypothesis → Prediction → Prototype → Test → Measurement → Revision → Replication → Optimisation → Standardisation.

Failure categories:
- Physical — mechanism impossible.
- Resource — insufficient energy, mana, or material.
- Coupling — target cannot interact appropriately.
- Information — insufficient information.
- Control — caster cannot control required variables.
- Neural — biological interface overloaded.
- Stability — configuration collapses.
- Temporal — too slow, trigger missed, or prepared state expired.
- Causal — required pathway does not exist.

Optimisation: minimise cost subject to the desired outcome. Cost can include energy, time, neural load, instability, material damage, control complexity, and information requirements. More mana may increase interference, instability, or decoherence; more mana does not necessarily improve a spell.

Combat loop: DETECT → PREDICT → CONSTRUCT → EXECUTE → OBSERVE → ADAPT. Countermagic attacks a dependency of the opponent’s mechanism, such as coherence or coupling, rather than relying on arbitrary rock-paper-scissors rules.

## 21. Absolute anti-cheat and feasibility rules

Every effect should answer:

`REFERENCE → MECHANISM → REQUIREMENT → CONTROL → STATE CHANGE`

If one is missing, the spell is incomplete.

Master feasibility condition:

`F(S) = F_M ∧ F_g ∧ F_E ∧ F_I ∧ F_C ∧ F_T ∧ F_S ∧ F_material`

Relevant terms cover mana, coupling, energy, information, control, temporal/causal feasibility, stability, and material feasibility.

## 22. Explicitly disallowed without a later mechanism

- mana = energy or consciousness
- words or intent directly command/change reality
- free energy, matter, momentum, or information
- arbitrary teleportation or time travel
- perfect future knowledge
- universal mind reading or mind control
- infinite mana or regeneration
- perfect resurrection
- copy automatically equals original
- gods are omnipotent or omniscient
- NULL is secretly limitless
- anti-magic metaphysically deletes magic
- dispel reverses consequences
- elemental types are fundamental mana substances
- “destroy” or “create” are physical primitives

## 23. Allowed, with physical accounting

The system allows enormous energy manipulation, advanced biological manipulation, autonomous magic, magical technology, advanced sensing, powerful gods, portals, cross-world travel, reconstruction, extraordinary regeneration, magical organisms, artificial magical intelligence, powerful contracts and curses, advanced anti-magic, environmental manipulation, experimental magic, and new phenomena—provided each pays its physical costs.

## 24. Storytelling consequence

Conflict is not decided only by mana quantity. A weaker mage may win by exploiting coupling, stability, information, timing, geometry, material response, control bandwidth, or neural limitations. The central question is who understands and adapts to the system faster.

## 25. Canonical architecture and status

Physical universe → mana field → mana configuration → biological/artificial interface → information + control → coupling → physical mechanism → effect → feedback → adaptation.

Surrounding constraints: conservation + causality + information limits + stability.

The supplied specification labels the following architecture areas LOCKED: mana ontology/physics, conservation, matter, energy, information, coupling, affinity, NULL, biology, casting interface, Arcane language architecture, spell grammar, sensing, time, space/teleportation, healing/resurrection, contracts/curses, anti-magic, gods, magical ecology, autonomous magic, Logos, spell discovery, optimisation, failure, combat, and adversarial consistency. The website must distinguish these **source labels** from independently verified implementation status.
