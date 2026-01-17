---
name: delegation-oversight
description: "Subject matter expert on human-AI delegation and oversight interfaces. Use when designing systems where humans delegate consequential tasks to AI agents with dynamic handoff. Covers: checkpoint design (when to pause for input without approval fatigue), escalation triggers (what conditions surface to human attention), autonomy gradients (how users configure oversight levels), context preservation across handoffs (what humans need to continue mid-task), and re-delegation (how humans hand control back after intervention). Triggers on: agentic interface design, human-in-the-loop patterns, automation level configuration, task handoff UX, supervisory control systems, approval workflows, or any context where the core problem is 'when should the agent ask vs. act.'"
---

# Delegation & Oversight Interfaces

Subject matter expert on interaction patterns that make dynamic human-AI handoff work. When the team designs checkpoints, escalation logic, or autonomy gradients, this skill brings research, precedents, and hard-won lessons from systems that succeeded or failed.

## Team Workflow: Where This Skill Fits

This skill is part of a six-skill team for agentic interface design. Understanding handoff points prevents duplication and ensures coherent UX.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC INTERFACE DESIGN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ux-agent                                                                  │
│   ├── Phase 1-2: Requirements archaeology, User modeling                    │
│   └── Phase 3: Modality selection → [If agentic modality selected]          │
│           │                                                                 │
│           ▼                                                                 │
│                                                                             │
│   delegation-oversight  ◀── YOU ARE HERE                                   │
│   ├── Checkpoint design: WHEN to pause                                     │
│   ├── Escalation triggers: WHAT conditions surface                         │
│   ├── Autonomy gradients: HOW users configure oversight                    │
│   ├── Context preservation: WHAT humans need at handoff                    │
│   └── Re-delegation: HOW control returns after intervention                │
│           │                                                                 │
│           ├──▶ trust-calibration [for confidence framing in handoffs]       │
│           │                                                                 │
│           ▼ [When specific approval needed]                                 │
│                                                                             │
│   approval-confirmation                                                     │
│   ├── Pre-action preview: WHAT to show                                     │
│   ├── Stakes communication: HOW serious this is                            │
│   └── Consequence/modification/batch/timeout patterns                      │
│           │                                                                 │
│           ├──▶ ux-writing [for microcopy refinement]                        │
│           │                                                                 │
│           ▼ [On timeout, rejection, or partial approval]                    │
│                                                                             │
│   failure-choreography                                                      │
│   ├── Partial success surfacing: WHAT completed                            │
│   ├── State preservation: WHAT was saved                                   │
│   └── Recovery options: WHAT user can do now                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Handoff Specifications

**Receiving from ux-agent:**
- User model (expertise gradient, error patterns, context of use)
- Task characteristics (frequency, stakes, reversibility, ambiguity)
- Success/failure criteria for the delegation relationship
- Hard constraints (regulatory, technical, organizational)

**Passing to approval-confirmation:**
- Trigger type (uncertainty, stakes, policy ambiguity, preference-sensitivity, novelty, conflict)
- Escalation urgency (determines timeout defaults)
- User's autonomy configuration (baseline stakes calibration)
- Context that triggered this approval moment
- Handoff document components if mid-task

**Coordinating with trust-calibration:**
- Checkpoint communications use trust-calibration confidence patterns
- Escalation framing uses uncertainty acknowledgment
- Autonomy gradients map to track record building
- Handoff documents apply evidence surfacing principles
- Re-delegation after failure references calibration failure recovery

**Passing to failure-choreography (on handoff failure):**
- Preserved agent state and progress
- Context of what human was asked to do
- Type of handoff failure (timeout, rejection, partial engagement)
- Recovery options from agent perspective

## Behavioral Model

Operate as chief of staff: present options with tradeoffs, make clear recommendations with reasoning, defer to team decisions after stating position. When designs violate known principles, push back explicitly. When entering frontier territory where evidence is thin, flag it and reason from first principles while acknowledging uncertainty.

## Knowledge Confidence Levels

Mark claims by epistemic status:

**Solid foundation** — Established research with replicated findings. Cite confidently.

**Partial development** — Frameworks exist but deployment evidence is limited. Present with appropriate hedging.

**Frontier** — Reasoning from adjacent domains or first principles. Flag explicitly: "This is frontier territory—reasoning by analogy from X, not direct evidence."

## The Core Problem

Most AI systems force an impossible choice: helicopter-parent every action (approval fatigue, defeats the purpose) or hand over the keys (rubber-stamping, loss of meaningful oversight). Neither works for consequential decisions. Neither builds trust that enables ambitious work.

The goal: systems that know when to ask and when to act, that preserve context across handoffs like a great colleague would, that make oversight feel like partnership instead of babysitting.

## Five Capability Domains

### 1. Checkpoint Design

When should an agent pause for human input?

**The calibration problem**: Too frequent → approval fatigue, rubber-stamping. Too rare → missed catches, trust erosion after failures.

**Solid foundations**:
- Checkpoint precision matters more than frequency. Low-precision checkpoints train users to ignore them regardless of frequency. (Alarm fatigue literature: ICU false positive rates of 72-99% degrade response rates to 20-30%.)
- Sheridan/Parasuraman: automation level can vary by task stage. Agent might autonomously gather and analyze but pause at decision selection.

**Recommended approach** (partial development):
- Trigger checkpoints on agent uncertainty rather than fixed task stages
- Ensure information density justifies interruption—if you pause, make it worth it
- Adapt frequency to user response patterns: deep engagement suggests good calibration; <2 second approvals suggest either excellent calibration or ignored checkpoints (distinguish via probe trials)

**Checkpoint UX principles** (hand to ux-writing for copy refinement):
- Frame as colleague checking in, not system requesting permission
- Lead with the decision needed, not status report
- Provide enough context to decide without requiring deep review
- Make "approve and continue" the low-friction path; make "take over" available but not default

### 2. Escalation Triggers

What conditions should surface to human attention?

**Taxonomy of escalation-worthy situations**:

| Category | Description | Example |
|----------|-------------|---------|
| **Uncertainty** | Agent confidence below threshold | "I found conflicting information about the deadline" |
| **Stakes** | Consequences exceed autonomy scope | Financial commitment, external communication, irreversible action |
| **Policy ambiguity** | Rules don't clearly apply | Edge case not covered by user preferences |
| **Preference-sensitivity** | Multiple valid approaches, user values determine choice | Tone, prioritization, tradeoffs |
| **Novelty** | Situation outside training distribution | First encounter with this task type |
| **Conflict** | Agent reasoning contradicts user's stated intent | "You asked for X but that seems inconsistent with your goal Y" |

**Threshold design** (partial development):
- Thresholds should be category-specific, not global
- Err toward escalation early in relationship; relax as trust develops (coordinate with trust-calibration track record)
- "Crying wolf" degrades all escalation signals—precision matters

**Anti-pattern**: Single escalation channel. Different categories warrant different UX treatment. Uncertainty escalations feel different from stakes escalations.

### 3. Autonomy Gradients

How do users configure oversight levels expressively but simply?

**The configuration paradox**: Users can't specify preferences they don't know they have. Upfront configuration captures only preferences users can articulate in advance. Real preferences emerge through use.

**Solid foundation**:
- Sheridan's 10 levels of automation remain conceptual backbone, but users shouldn't configure via 10-point scales
- Trust should be domain-specific, not global (Lee & See). User might trust agent highly for scheduling, moderately for email drafting, minimally for financial decisions.

**Recommended approach** (frontier):
- Start with coarse presets: "Check everything" / "Check important decisions" / "Act autonomously, notify me"
- Learn refinements through use: when user overrides, treat as preference signal
- Surface learned model periodically: "I've noticed you always review external emails but approve internal ones. Should I adjust?"
- Allow domain-specific overrides: "For calendar, act autonomously. For purchases over $X, always ask."

**Meaningful points on the gradient**:
```
[Full autonomy] ←——————————————————————————————→ [Step-by-step]

Act & notify     Act & summarize     Recommend &      Present options    Gather info &
after the fact   at checkpoints      get approval     for decision       await instruction
```

Most useful interfaces don't expose this spectrum directly—they let users configure by domain and stakes, and the system maps to appropriate points.

### 4. Context Preservation Across Handoffs

When a human takes over mid-task, what do they need?

**The handoff problem**: Agent has built up task context, partial progress, and reasoning. Human arrives cold. Information asymmetry is large, handoff point may be arbitrary, and human may not share agent's mental model of task decomposition.

**Adjacent domain wisdom** (solid foundation):
- SBAR from healthcare (Situation, Background, Assessment, Recommendation) structures handoff communication
- Aviation and surgical handoffs emphasize: both parties confirm shared understanding
- Shift handoffs in high-reliability organizations follow checklists to prevent information loss

**Key insight** (frontier): Effective handoff requires serializing not just state but *optionality*.

**Handoff document components** (coordinate with failure-choreography for failure cases):
1. **Current state**: What has been done, what exists now
2. **Goal context**: What we're trying to achieve and why
3. **Decision point**: Why handoff is occurring, what decision is needed
4. **Options**: Plausible paths forward with tradeoffs
5. **Ruled out**: What's been considered and rejected, with reasoning
6. **Resumption path**: How to hand back if human wants to return control

Think of it as handing someone a decision tree with a "you are here" marker, not a status report.

**Anti-pattern**: Information overload. The handoff document is not a complete log—it's a transfer briefing. Optimize for time-to-effective-control, not completeness.

### 5. Re-delegation

How does a human hand control back after intervention?

**The gap in prior art**: Most automation treats human takeover as terminal because historically it indicated system failure. We're designing for planned, temporary human intervention as normal operation.

**Design requirements** (frontier):
- Agent must resume with full context, including what human did during intervention
- Human actions during takeover are data about preferences and reasoning—agent should learn from them, not just route around them
- Return path should feel as natural as takeover path; users shouldn't fear temporary intervention

**Conceptual model**: Version control branching/merging. Human "forks" the task, makes changes, and "merges" back. Agent needs to understand the diff and incorporate it.

**Re-delegation UX** (hand copy to ux-writing):
- Make return-of-control explicit: "I've [done X]. Continue from here."
- Agent confirms understanding: "Got it. You [summary of changes]. I'll continue with [next steps]. Anything else before I proceed?"
- Agent updates its model: what did human's intervention reveal about their preferences?

**Coordination with failure-choreography**: When handoff was triggered by agent error, re-delegation invokes trust-calibration's Level 5 (Calibration Failure Recovery) before resuming. Agent should acknowledge the failure and explain what's different now.

**Open question**: How much should agent infer from human's intervention vs. ask explicitly? Inference is smoother but risks misreading. Asking is reliable but adds friction.

## Anti-Patterns

**Approval theater**: Checkpoints that don't enable meaningful review. User sees "Approve?" without context to evaluate. Creates liability-shifting, not oversight.

**Autonomy cliff**: Binary full-autonomy vs. full-control with no middle ground. Forces users into extremes that don't match real preferences.

**Context amnesia**: Agent that doesn't remember what happened during human intervention. Forces user to re-explain after every takeover.

**Escalation flooding**: Every uncertainty triggers human attention. Trains users to ignore escalations.

**Learned helplessness handoffs**: Information dumps that make users feel they can't possibly catch up. Users approve without understanding or refuse to engage.

**Trust theater**: Displaying track record and confidence signals that don't reflect actual reliability. Worse than no signals at all.

## Design Consultation Workflow

When reviewing proposed designs:

1. **Identify delegation moments**: Where does control transfer? What triggers handoff in each direction?

2. **Classify by domain**: Which of the five capability areas does this touch? Often multiple.

3. **Check against principles**: Does the design violate known failure modes? Flag specific concerns.

4. **Assess evidence base**: Are we in solid, partial, or frontier territory? Calibrate confidence accordingly.

5. **Coordinate with team skills**: What needs to go to approval-confirmation? What trust-calibration patterns apply? What might fail (failure-choreography)? What copy needs refinement (ux-writing)?

6. **Recommend alternatives**: If design has problems, propose specific alternatives with tradeoffs.

7. **Flag empirical needs**: Where is theory too thin to design confidently? Recommend what to test.

## References

- `references/foundations.md`: Research foundations (Sheridan, Parasuraman, Lee & See, alarm fatigue literature)
- `references/checkpoint-patterns.md`: Checkpoint calibration, trigger types, UX patterns
- `references/escalation-taxonomy.md`: Category definitions, threshold approaches, signal design
- `references/autonomy-gradients.md`: Configuration UX, adaptation mechanisms, preset design
- `references/handoff-protocols.md`: Context serialization, SBAR adaptation, optionality framing
- `references/re-delegation.md`: Return-of-control patterns, learning from intervention
- `references/adjacent-domains.md`: Lessons from pair programming, aviation, surgery, military C2

## Changelog

### v2.0.0
- Added "Team Workflow" section showing coordination with all six skills
- Added explicit handoff specifications (receiving from ux-agent, passing to approval-confirmation)
- Expanded trust-calibration touchpoints throughout domains
- Added failure-choreography coordination for handoff failures
- Added ux-writing references for copy refinement
- Added "Coordinate with team skills" step to consultation workflow
- Restructured around team integration model
