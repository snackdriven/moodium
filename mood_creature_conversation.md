# Creature Companion Mood Check-In — Full Feature Conversation

This file is an export of the collaborative design and implementation discussion between the user and ChatGPT (GPT‑5). It captures the full design reasoning, feature spec, and implementation snippets for the neurodivergent‑friendly mood logging system.

---

## 1. Objective and Context

Create a low-pressure, sensory-based mood check-in led by a friendly animated Creature Companion. The flow replaces emotion naming with sensory metaphors and cozy imagery, designed for ADHD, autism, and alexithymia accessibility.

(Full text of the feature spec, goals, problem statement, user flow, data structure, tone cube, archetypes, logic layer, TypeScript/JSON seed bundle, and Next.js integration were detailed in this conversation.)

---

## 2. Core Deliverables

### • Detailed Feature Specification
- Objectives, success metrics, UX flow, accessibility criteria, data schema.
- 6×6×6 Tone Cube of adjectives for Energy, Focus, Social axes.
- Archetype layer: Recharge, Gather, Flow, Scatter, Bloom, Focus Forge, Fog Pulse, Equilibrium.
- Sentence Logic Engine pseudocode and tone template categories.

### • JSON + TypeScript Bundle
`tone_bundle.json` and `tone_engine.ts` implementing:
- Tier thresholds, archetypes, flavor packs.
- Sentence generation logic with template pools.
- Example Drizzle schema.

### • Next.js Integration Guide
- Supabase + Drizzle + Next 14 setup.
- Route Handler `/api/mood` inserting generated entries.
- Minimal UI with accessible sliders.
- RLS SQL policies and schema migrations.

---

## 3. Design Principles

- Low cognitive load: three prompts maximum.
- Predictable rhythm: creature → three metaphors → summary → farewell.
- Accessibility-first: literal tooltips, ARIA labels, `prefers-reduced-motion`.
- Playful yet grounded tone: cozy, spooky, warm.
- Emotional neutrality: reflection without evaluation.

---

## 4. Example Output

> **Prompt Sequence:**  
> “Are you more ☁️ low‑tide or ✨ starlit today?”  
> “Is your mind more like misty clouds or a clear shelf?”  
> “Would you rather curl up in your fort or dance in the kitchen?”  
>
> **Generated Summary:**  
> “We’re steady, thoughts gathering, heart tucked‑in.”  
>
> **Stored Data:**  
> `energy=42`, `focus=58`, `social=33`, `archetype="Gather"`

---

## 5. Technical Stack Summary

- **Frontend:** Next.js 14 App Router, Tailwind, Radix UI, TanStack Query.  
- **Backend:** Drizzle ORM (for Supabase Postgres).  
- **Auth & Realtime:** Supabase.  
- **Data:** `mood_entries` table with JSON fields and summaries.  
- **Seed:** tone bundle and generator imported from `/src/tone`.

---

## 6. Implementation Artifacts

Contained files in the accompanying ZIP:

```
mood_tone_bundle/
 ├── tone_bundle.json      // tone cube & archetype data
 ├── tone_engine.ts        // generator logic
 ├── schema.ts             // Drizzle schema excerpt
 ├── mood_creature_conversation.md  // this document
```

---

## 7. Reflection

The Creature Companion module is designed as a gentle daily ritual: minimal steps, sensory metaphors, soft animations, and language variety powered by the Tone Cube and Archetype engine. The combination of Supabase RLS security and Drizzle type safety ensures a scalable foundation for future expansions (voice check‑ins, seasonal flavor packs, custom metaphor themes).

---

© 2025 — Design conversation compiled by ChatGPT for project documentation.
