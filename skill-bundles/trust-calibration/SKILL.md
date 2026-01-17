---
name: trust-calibration
description: "Design patterns for calibrating user confidence in agentic interfaces. Use when building any interface where users delegate consequential decisions to AI agents, where trust accuracy (not just trust level) determines success. Covers: confidence communication (when to be declarative vs. hedged), uncertainty acknowledgment (surfacing doubt without undermining credibility), evidence surfacing (showing work without overwhelming), track record building (accumulating trust across interactions), and calibration failure recovery (rebuilding trust after errors). Triggers on: agent output design, delegation interfaces, AI confidence displays, uncertainty UX, trust recovery flows, any context where users must decide whether to accept agent recommendations, or when another agentic skill needs confidence calibration for its outputs."
---

# Trust Calibration Patterns

Design systems for accurate user confidence in agentic interfaces. The goal is not maximum trust—it's calibrated trust: users should trust exactly as much as the agent deserves, no more, no less.

## The Core Problem

Two failure modes destroy agentic interfaces:

**Overtrust**: User accepts agent output that's wrong. Burns user once, and they never delegate again. One bad trade recommendation, one missed deadline from flawed scheduling, one incorrect diagnosis—and the relationship is over.

**Undertrust**: User second-guesses correct agent output. Leads to micromanagement that negates the value of delegation. User spends more time checking the agent's work than doing the work themselves.

Both failures stem from the same root: **miscalibrated confidence communication**. The interface failed to give the user accurate signals about when to trust and when to verify.

---

## Team Workflow: Where This Skill Fits

This skill is one of six that coordinate on agentic interface design. Trust-calibration is a *service skill*—it provides calibration patterns that other skills invoke at key moments.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC INTERFACE DESIGN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ux-agent                                                                  │
│   ├── Phase 1-2: Requirements, User Model                                   │
│   │       └──▶ trust-calibration [identify trust-critical touchpoints]     │
│   └── Phase 3: Modality Selection                                          │
│           │                                                                 │
│           ▼ [If agentic modality selected]                                  │
│                                                                             │
│   delegation-oversight                                                      │
│   ├── Checkpoint design ──▶ trust-calibration [confidence markers]         │
│   ├── Escalation triggers ──▶ trust-calibration [uncertainty patterns]     │
│   └── Autonomy gradients ──▶ trust-calibration [track record display]      │
│           │                                                                 │
│           ▼ [When approval is needed]                                       │
│                                                                             │
│   approval-confirmation                                                     │
│   ├── Preview confidence ──▶ trust-calibration [claim-level patterns]      │
│   ├── Consequence uncertainty ──▶ trust-calibration [uncertainty ack]      │
│   └── Evidence depth ──▶ trust-calibration [progressive disclosure]        │
│           │                                                                 │
│           ▼ [On failure or timeout]                                         │
│                                                                             │
│   failure-choreography                                                      │
│   ├── State certainty ──▶ trust-calibration [preserved/lost/uncertain]     │
│   ├── Recovery confidence ──▶ trust-calibration [track record cite]        │
│   └── Agent-fault recovery ──▶ trust-calibration [failure recovery seq]    │
│           │                                                                 │
│   trust-calibration  ◀── YOU ARE HERE (service skill, invoked throughout)  │
│   ├── Level 1: Claim-Level Confidence                                      │
│   ├── Level 2: Uncertainty Acknowledgment                                  │
│   ├── Level 3: Evidence Surfacing                                          │
│   ├── Level 4: Track Record Building                                       │
│   └── Level 5: Calibration Failure Recovery                                │
│           │                                                                 │
│           └──▶ ux-writing [refines copy per calibration patterns]          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Receiving Context

When invoked by another skill, expect:

**From delegation-oversight:**
- Trigger type: `uncertainty | stakes | policy_ambiguity | preference_sensitivity | novelty | conflict`
- Escalation urgency: determines how prominent uncertainty signals should be
- User's autonomy configuration: affects baseline trust assumptions
- Domain: which capability area (for track record lookup)

**From approval-confirmation:**
- Stakes level: `routine | notable | significant | critical` (affects evidence depth)
- Preview elements needing confidence markers
- Consequence statements needing uncertainty framing

**From failure-choreography:**
- Failure attribution: `agent | external_service | data_quality | user_input | unknown`
- State classification request: which items are preserved/lost/uncertain
- Recovery options needing confidence assessment

### Providing to ux-writing

After calibration analysis, hand off to ux-writing for copy refinement:

```yaml
trust_calibration_handoff:
  context: "brief description of what element needs calibrated copy"
  
  confidence_level: 1-5  # from Level 1 (Uncertain) to Level 5 (Definite)
  
  linguistic_requirements:
    certainty_verbs: ["is", "will"] | ["should", "likely"] | ["might", "appears"]
    source_attribution: "authoritative" | "secondary" | "inferred" | "none"
    action_stance: "proceed" | "consider" | "verify_first"
  
  structural_pattern:
    type: "declarative" | "hedged" | "explicit_uncertainty"
    elements: ["conclusion", "evidence", "verification_path"]  # which to include
    
  uncertainty_stack:  # if uncertainty acknowledgment needed
    what: "specific claim that's uncertain"
    why: "source of doubt"
    how: "verification path or fallback"
    
  tone_guidance:
    stakes: "low" | "medium" | "high"
    recovery_context: true | false  # post-failure situation?
    domain_track_record: "strong" | "mixed" | "weak" | "new"
```

---

## Calibration Architecture

Trust calibration operates at five levels. Implementation must address all five.

```
Level 1: Claim      → What confidence does this specific output deserve?
Level 2: Uncertainty → How do we acknowledge what we don't know?
Level 3: Evidence    → How much "work" do we show?
Level 4: Track Record → What's the accumulated trust state?
Level 5: Recovery    → How do we rebuild after failure?
```

---

## Level 1: Claim-Level Confidence

Every agent output carries implicit confidence. Match linguistic confidence to actual confidence.

### The Confidence Spectrum

```
[Declarative] ←————————————————→ [Hedged]

"The meeting is at 3pm."          "I found what looks like a meeting 
                                   at 3pm, but confirm with the calendar."
```

### When to Be Declarative

Use declarative framing when:
- Source is authoritative and unambiguous (structured data, explicit user input)
- Agent has high track record in this specific domain
- Error cost is low or easily recoverable
- User can quickly verify if needed

**Pattern**: State the conclusion. Don't hedge for hedging's sake.

```
✓ "Your flight departs at 2:45pm from Gate B12."
✗ "I believe your flight may depart around 2:45pm, possibly from Gate B12."
```

### When to Hedge

Use hedged framing when:
- Source is ambiguous, incomplete, or potentially stale
- Agent is extrapolating beyond training data
- Error cost is high or irreversible
- This is a domain where agent has shown errors before

**Pattern**: State confidence level explicitly. Provide the evidence. Recommend verification.

```
✓ "Based on the email thread, the deadline appears to be Friday. 
   The last message was 3 weeks ago—I'd verify this hasn't changed."
   
✗ "The deadline is Friday."
```

### Confidence Markers

| Marker Type | High Confidence | Medium Confidence | Low Confidence |
|-------------|-----------------|-------------------|----------------|
| **Certainty** | "is", "will" | "should", "likely" | "might", "appears to" |
| **Source** | "according to [authoritative source]" | "based on [partial evidence]" | "I couldn't find explicit confirmation" |
| **Recommendation** | "Proceed with..." | "Consider..." | "I'd verify before..." |

See `references/confidence-patterns.md` for complete linguistic inventory.

---

## Level 2: Uncertainty Acknowledgment

"I don't know" is one of the most important things an agent can say. But it must be said correctly.

### The Credibility Paradox

Stating uncertainty too often or too weakly undermines confidence in claims that should be trusted. Failing to state uncertainty where it exists causes overtrust and eventual betrayal.

**Solve with specificity**: Don't say "I'm not sure." Say exactly what you're unsure about and why.

### Uncertainty Types

Different uncertainties require different acknowledgment patterns:

**Source uncertainty**: Information may be wrong or outdated
```
"This pricing is from the website as of last month. 
 Prices may have changed—verify current rates before committing."
```

**Inference uncertainty**: Agent is reasoning beyond explicit data
```
"Based on his email tone and meeting behavior, he seems opposed to the proposal.
 I can't know his actual position—this is pattern-matching, not fact."
```

**Scope uncertainty**: Agent may be missing relevant information
```
"I found three vendors matching your criteria. 
 There may be others I didn't find—this was based on web search, not industry databases."
```

**Capability uncertainty**: Task may exceed agent competence
```
"I can draft the contract outline, but have a lawyer review any document before signing.
 Legal nuance is outside my reliable competence."
```

### The Uncertainty Stack

When acknowledging uncertainty, stack these elements:

1. **What** you're uncertain about (specific claim)
2. **Why** you're uncertain (source of doubt)  
3. **How** the user should proceed (verification path or fallback)

See `references/uncertainty-patterns.md` for detailed implementation.

---

## Level 3: Evidence Surfacing

Users need to see enough work to trust the output. Show too little → black box. Show too much → learned helplessness.

### The Evidence Tradeoff

```
[Trust without understanding] ←——————————→ [Overwhelm and ignore]

"Here's your analysis."              "Here's your analysis plus 47 sources,
                                      my reasoning chain, confidence scores
                                      for each claim, alternative approaches..."
```

### Evidence Surfacing Principles

**Progressive disclosure**: Lead with conclusions, make evidence available on demand.

```
[Summary]           → What the user needs to decide
[Key evidence]      → 2-3 most important supporting points  
[Full trail]        → Expandable access to complete reasoning
```

**Calibrate to stakes**: Higher stakes = more evidence proactively surfaced.

| Stakes | Evidence Pattern |
|--------|------------------|
| **Low** (scheduling, lookup) | Conclusion only. Source on hover/request. |
| **Medium** (recommendations, analysis) | Conclusion + key supporting evidence. Full trail available. |
| **High** (financial, medical, legal) | Conclusion + evidence + explicit uncertainty + verification recommendation. |

**Match user expertise**: Experts want different evidence than novices.

- Expert users: Raw data, methodology, edge cases
- General users: Summarized findings, key implications, recommended actions

See `references/evidence-surfacing.md` for implementation patterns.

---

## Level 4: Track Record Building

Trust isn't established in single interactions—it accumulates. Interfaces must create connective tissue between good outcomes over time.

### Track Record Components

**Explicit history**: User can see past performance
- Success rate by task type
- Errors acknowledged and corrected
- Improvement over time

**Implicit signals**: Interface reflects accumulated trust
- Reduced confirmation friction for proven domains
- Increased scrutiny for areas with past errors
- Graduated autonomy based on demonstrated competence

### Track Record Patterns

**Domain-specific trust**: Build and display trust per capability, not globally.

```
✓ Email scheduling: 47 successful, 0 errors
✓ Meeting notes: 23 successful, 2 minor corrections  
⚠ Contract review: 3 successful, 1 significant error — recommend verification
```

**Error memory**: Surface past errors when relevant to current task.

```
"Before I schedule this, note: I misread timezone for a similar meeting
 last month. I've triple-checked this one, but verify the 3pm is Pacific."
```

**Improvement signaling**: When agent has improved, communicate it.

```
"I've updated my approach to calendar parsing based on the error last week.
 This should now correctly handle recurring meetings with exceptions."
```

See `references/track-record.md` for implementation patterns.

---

## Level 5: Calibration Failure Recovery

The hardest case: the user trusted, and they got burned. What happens next?

### Recovery Principles

**Acknowledge fully**: Don't minimize. Don't excuse. State what went wrong.

**Explain causation**: Why did this happen? What was the failure mode?

**Show correction**: What specifically changes to prevent recurrence?

**Reset expectations**: What should the user expect from this capability going forward?

### Recovery Sequence

```
1. Immediate acknowledgment → "I got this wrong."
2. Impact recognition      → "This caused [specific harm]."
3. Causal explanation      → "This happened because [specific failure mode]."
4. Correction statement    → "I've [specific change] to prevent this."
5. Expectation reset       → "For this type of task, I recommend [new protocol]."
```

### Post-Failure Trust Gradient

Trust doesn't reset to zero after failure—it resets to a verified state:

```
Pre-failure:  "Here's the analysis."
Post-failure: "Here's the analysis. Given the error last time, I'd recommend 
              verifying [specific vulnerability] before acting on this."
```

The interface should proactively surface increased uncertainty in the failure domain until user explicitly restores trust.

See `references/failure-recovery.md` for detailed recovery patterns.

---

## Anti-Patterns

### Confidence Theater
Sounding confident regardless of actual confidence. Creates overtrust, guarantees eventual betrayal.
```
✗ "The meeting is definitely at 3pm." (when source is ambiguous)
```

### Uncertainty Flooding
Hedging everything equally. Trains users to ignore uncertainty signals.
```
✗ "I think the meeting might possibly be around 3pm, but I'm not entirely sure."
    (when source is the user's own calendar entry)
```

### Evidence Dumping
Overwhelming users with proof. Creates learned helplessness—users stop reading.
```
✗ [47 citations, 3 methodology notes, confidence intervals for every claim]
    (for a simple scheduling task)
```

### Trust Amnesia
Failing to track or surface past performance. Misses the opportunity to build calibrated trust over time.
```
✗ Treating 50th successful interaction identical to first interaction
```

### Minimized Recovery
Glossing over failures to preserve perceived competence. Destroys trust faster than the original error.
```
✗ "There was a small issue with the previous analysis."
    (when the error caused significant user harm)
```

---

## Design Checklist

When reviewing interfaces for trust calibration, verify:

**Level 1: Claim-Level Confidence**
- [ ] Linguistic confidence matches actual confidence
- [ ] Source quality reflected in certainty markers
- [ ] High-confidence claims not over-hedged
- [ ] Low-confidence claims not presented as certain

**Level 2: Uncertainty Acknowledgment**
- [ ] Uncertainties are specific, not generic
- [ ] Each uncertainty includes: what, why, how (verification path)
- [ ] Uncertainty type (source/inference/scope/capability) shapes framing

**Level 3: Evidence Surfacing**
- [ ] Evidence depth matches stakes level
- [ ] Progressive disclosure implemented (summary → detail → full trail)
- [ ] Expert vs. novice evidence needs addressed

**Level 4: Track Record**
- [ ] Domain-specific performance visible
- [ ] Past errors surface when relevant
- [ ] Improvement signals when agent has updated

**Level 5: Recovery**
- [ ] Failures acknowledged fully (not minimized)
- [ ] Causal explanation provided
- [ ] Correction visible
- [ ] Expectations reset explicitly

**Team Integration**
- [ ] Receiving context from delegation-oversight documented
- [ ] approval-confirmation confidence markers applied
- [ ] failure-choreography state classification uses calibration patterns
- [ ] ux-writing handoff specification complete

---

## Quick Reference

| Situation | Pattern |
|-----------|---------|
| High confidence, low stakes | Declarative. Source available on demand. |
| High confidence, high stakes | Declarative + key evidence + verification available. |
| Medium confidence | Hedged + specific uncertainty + evidence. |
| Low confidence | Explicit uncertainty + why + verification recommendation. |
| Past errors in this domain | Surface history + increased verification recommendation. |
| Post-failure | Full acknowledgment + causal explanation + correction + reset expectations. |

---

## References

- `references/confidence-patterns.md`: Complete linguistic inventory for confidence communication
- `references/uncertainty-patterns.md`: Patterns for each uncertainty type
- `references/evidence-surfacing.md`: Progressive disclosure and stakes-based evidence
- `references/track-record.md`: Building and displaying accumulated trust
- `references/failure-recovery.md`: Complete recovery architecture

---

## Changelog

### v2.0.0
- Added "Team Workflow" section showing coordination with all six skills
- Added "Receiving Context" documentation from delegation-oversight, approval-confirmation, failure-choreography
- Added explicit ux-writing handoff specification (YAML format)
- Added "Team Integration" section to design checklist
- Updated description to clarify service-skill role and triggering conditions
- Reorganized Calibration Architecture section for clarity
