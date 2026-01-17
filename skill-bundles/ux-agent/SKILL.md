---
name: ux-agent
description: "Orchestrate world-class UX design across all modalities: GUI, CLI, voice, and agentic interfaces. Triggers when user needs to design a user experience, conduct requirements discovery, select interaction modalities, build user models, or create defensibly excellent interfaces with traced rationale. This is a process skill that coordinates with frontend-design, design-principles, and ux-writing for implementation. Use when starting any design project, when requirements are unclear or incomplete, when choosing between interface types, or when design decisions need explicit justification."
---

# UX Agent

Orchestrate design excellence through rigorous requirements archaeology, accurate user modeling, principled modality selection, and defensible design decisions. This skill manages the *what* and *why* of design; delegate the *how* to implementation skills (frontend-design, design-principles, ux-writing).

## Core Workflow

### Phase 1: Requirements Archaeology

Most design fails not from poor execution but from solving the wrong problem. Extract requirements with the precision of a systems engineer and the empathy of a therapist.

**Before any design work, answer:**
1. What problem are we *actually* solving? (Not the stated problem—the real one)
2. Who are the real users? (Not personas—actual behavioral patterns)
3. What does success *feel* like? (Not just metrics—the experiential outcome)
4. What are the hard constraints? (Technical, regulatory, organizational)
5. What would make this a failure even if users say they like it?

See `references/requirements-archaeology.md` for the complete elicitation framework.

### Phase 2: User Modeling

Build behavioral models, not demographic personas. A 25-year-old engineer and a 55-year-old manager may have identical interaction patterns; two 25-year-old engineers may have completely different ones.

**Model these dimensions:**
- Task frequency (daily power user vs. quarterly visitor)
- Expertise gradient (in domain, in interface conventions, in this specific tool)
- Error patterns (where do they get stuck? what do they misunderstand?)
- Context of use (time pressure, concurrent tasks, environmental constraints)
- Recovery needs (what happens when things go wrong?)

See `references/user-modeling.md` for model construction.

### Phase 3: Modality Selection

The right interface for a task might be a dashboard, a voice prompt, a terminal command, or an autonomous agent. Selection criteria:

| Modality | Use When |
|----------|----------|
| **GUI** | Visual scanning, comparison, spatial relationships, complex input, low-frequency tasks, novice users |
| **CLI** | Precision, repeatability, scripting, expert users, batch operations, audit trails |
| **Voice/Aural** | Hands-free, ambient awareness, accessibility, simple confirmations, status updates |
| **Agentic** | User goal is outcome not process, predictable success criteria, low ambiguity, recoverable failures |

**Selection process:**
1. Map each user task to primary modality based on characteristics
2. Identify handoff points where modality should shift
3. Design graceful modality transitions
4. Ensure accessibility fallbacks exist

See `references/modality-selection.md` for decision framework.

### Phase 4: Design with Traced Rationale

Every design decision links to a requirement. This is what makes excellence reproducible—not taste, but rigor.

**Decision documentation format:**
```
Decision: [What was decided]
Requirement: [Which requirement this addresses]
Alternatives considered: [What else could have been done]
Trade-offs: [What we gave up]
Validation: [How we know this is right]
```

Maintain a decision log throughout design. When stakeholders question choices, rationale is retrievable.

### Phase 5: Excellence Execution

Delegate implementation to appropriate skills:
- Visual interfaces → `frontend-design` skill
- Enterprise/SaaS patterns → `design-principles` skill  
- Interface copy → `ux-writing` skill

Excellence criteria differ by modality. See `references/excellence-criteria.md`.

## Quick Reference: The Five Questions

Ask these before any design work. If you can't answer them, you're not ready to design.

1. **What's the job to be done?** (The outcome the user is hiring this interface to accomplish)
2. **What's the current workaround?** (How users solve this today—reveals real needs)
3. **What makes this succeed?** (The single most important success criterion)
4. **What makes this fail?** (Even if metrics look good)
5. **What shouldn't we build?** (The adjacent problems we're explicitly not solving)

## Anti-Patterns

**Requirements theater:** Long requirements documents that no one reads because they don't capture what matters.

**Persona fiction:** Detailed demographic profiles that don't predict behavior.

**Modality defaults:** Using GUI because it's familiar, not because it's right.

**Design by committee:** Incorporating all feedback equally regardless of source quality.

**Excellence by adjective:** Calling something "clean" or "intuitive" without defining what that means for this specific context.

## Workflow Integration

This skill orchestrates. For implementation:

```
UX Agent (this skill)
    │
    ├── Requirements → Captured in structured format
    ├── User Model → Behavioral dimensions documented  
    ├── Modality → Selection justified
    │
    └── Implementation
            ├── GUI → frontend-design, design-principles
            ├── CLI → Direct implementation  
            ├── Voice → Direct implementation
            └── Agentic → Direct implementation
```

For GUI implementations, read the relevant implementation skill *after* completing phases 1-3 of this workflow.
