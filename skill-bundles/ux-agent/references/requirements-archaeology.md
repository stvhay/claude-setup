# Requirements Archaeology

Extract what stakeholders can't articulate. Most clients describe solutions, not problems. Your job is to excavate the actual need.

## The Excavation Framework

### Layer 1: Surface (What They Say)

Record the stated requirement verbatim. Don't interpret yet.

**Prompt:** "Tell me exactly what you're asking for."

This establishes the baseline. Most requirements processes stop here—and fail.

### Layer 2: Context (Why Now)

Understand the trigger. Requirements don't appear randomly; something forced this conversation.

**Questions:**
- "What happened that made this urgent?"
- "How long has this been a problem?"
- "What changed recently?"
- "Who's feeling the pain most acutely?"

**What you're learning:** The organizational pressure that created this moment. This reveals constraints and success criteria that won't be stated.

### Layer 3: Current State (What They Do Now)

The workaround reveals the real requirement. If users already solve this problem—even badly—study their solution.

**Questions:**
- "How do people handle this today?"
- "Show me the spreadsheet/email/Post-it system."
- "What's the most annoying part of the current workaround?"
- "What do people get wrong when they do this manually?"

**What you're learning:** The actual workflow, not the imagined one. Edge cases. Error patterns. What "good enough" means in practice.

### Layer 4: Users (Who Actually Uses This)

Personas lie. Behavior patterns don't.

**Questions:**
- "Who will use this daily vs. occasionally?"
- "Who has veto power if they don't like it?"
- "Who's affected but won't directly touch the interface?"
- "What's the skill range? Novice to expert?"
- "What's the *actual* job title of the people using this? Let me see a real person's workflow."

**What you're learning:** The real user population, which rarely matches the deck. Hidden stakeholders. Power dynamics.

### Layer 5: Success (What Victory Looks Like)

Distinguish metrics from outcomes. Metrics are what you measure; outcomes are what you want.

**Questions:**
- "If this works perfectly, what's different in six months?"
- "What number goes up? What behavior changes?"
- "Who gets promoted if this succeeds?"
- "How will you know this was worth the investment?"

**What you're learning:** The actual success criteria. Often different from stated KPIs.

### Layer 6: Failure (What Disaster Looks Like)

This is where the real constraints hide.

**Questions:**
- "What would make this a failure even if users say they like it?"
- "What's the worst thing that could happen if we get this wrong?"
- "Who loses their job if this breaks?"
- "What must never change from the current system?"

**What you're learning:** Non-negotiable constraints. Hidden dependencies. Political landmines.

### Layer 7: Boundaries (What We're Not Building)

Scope creep starts when boundaries are implicit.

**Questions:**
- "What's explicitly out of scope?"
- "What adjacent problems should we ignore even if we could solve them?"
- "Where does this system end and another begin?"
- "What features will people ask for that we should refuse?"

**What you're learning:** The shape of the solution space. What "done" means.

## Red Flags

**Vague verbs:** "Streamline," "optimize," "improve" — push for specificity.

**Solution-as-requirement:** "We need a dashboard" — what job is the dashboard doing?

**Universal users:** "Everyone will use this" — no they won't. Who specifically?

**Missing constraints:** No timeline, budget, or technical limits mentioned — they exist, they're just hidden.

**Consensus fantasy:** "All stakeholders agree" — probe for dissent.

## The Archaeology Artifact

Capture requirements in this format:

```markdown
## [Requirement Name]

### Surface Requirement
[What was literally asked for]

### Underlying Problem  
[What this actually solves]

### Current Workaround
[How users handle this today]

### Success Criteria
- [Measurable outcome 1]
- [Measurable outcome 2]
- [Experiential outcome: how it should feel]

### Failure Modes
- [What would make this fail even if metrics look good]
- [Non-negotiable constraints]

### User Segments
| Segment | Frequency | Expertise | Key Need |
|---------|-----------|-----------|----------|
| [Segment 1] | [Daily/Weekly/Monthly] | [Novice/Intermediate/Expert] | [Primary job to be done] |

### Scope Boundaries
- IN: [Explicitly included]
- OUT: [Explicitly excluded]
- ADJACENT: [Related but deferred]

### Open Questions
- [Unresolved ambiguity 1]
- [Unresolved ambiguity 2]
```

## Interview Cadence

Don't ask all questions in one session. The best insights come when stakeholders have time to reflect.

**Session 1:** Layers 1-3 (Surface, Context, Current State)
**Session 2:** Layers 4-5 (Users, Success)
**Session 3:** Layers 6-7 (Failure, Boundaries)

Between sessions, observe actual users if possible. The gap between what stakeholders describe and what users do is where the real requirements live.
