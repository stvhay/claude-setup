---
name: approval-confirmation
description: "Design patterns for approval and confirmation interfaces in agentic systems. Use when building the moment where an AI agent requests human authorization to act—the UI/UX of the approval request itself. Covers: pre-action preview (showing proposed actions with enough context for informed approval), stakes communication (conveying why this action needs sign-off without crying wolf), consequence visualization (making tangible what happens on approve vs reject), modification options (moving beyond binary yes/no to nuanced approval), batch approval (presenting clustered decisions without overwhelming), and time-bounded approval (handling timeouts, defaults, escalations). Triggers on: approval dialogs, confirmation flows, authorization UI, action preview design, permission request UX, or any context where the core problem is 'how do I present an approval request that enables informed consent rather than rubber-stamping.'"
---

# Approval & Confirmation Patterns

Design approval interfaces that enable informed consent under time pressure. The goal: users who approve know what they're approving, and users who reject know what they're preventing.

## The Core Problem

Two failure modes destroy approval interfaces:

**Rubber-stamping**: User approves without understanding. The approval is theater—liability transfer dressed as oversight. System learns nothing from the approval signal because the signal is noise.

**Approval fatigue**: Every request looks the same. High-stakes buried among trivial. Users either micromanage everything (defeating delegation) or tune out entirely (rubber-stamping).

Both failures share a root cause: the approval request failed to communicate what the user needs to make an informed decision in the time they're willing to spend.

---

## Team Workflow: Where This Skill Fits

This skill is one of six that coordinate on agentic interface design. Understanding the handoff points prevents duplication and ensures coherent UX.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC INTERFACE DESIGN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ux-agent                                                                  │
│   ├── Phase 1-2: Requirements, User Model                                   │
│   └── Phase 3: Modality Selection                                          │
│           │                                                                 │
│           ▼ [If agentic modality selected]                                  │
│                                                                             │
│   delegation-oversight                                                      │
│   ├── Checkpoint design: WHEN to pause                                     │
│   ├── Escalation triggers: WHAT conditions surface                         │
│   └── Autonomy gradients: HOW users configure oversight                    │
│           │                                                                 │
│           ▼ [When approval is needed]                                       │
│                                                                             │
│   approval-confirmation  ◀── YOU ARE HERE                                  │
│   ├── Pre-action preview: WHAT to show                                     │
│   ├── Stakes communication: HOW serious this is                            │
│   ├── Consequence visualization: WHAT happens on approve/reject            │
│   ├── Modification options: HOW to adjust                                  │
│   ├── Batch approval: HOW to handle multiple                               │
│   └── Time-bounded approval: WHAT happens on timeout                       │
│           │                                                                 │
│           ├──▶ trust-calibration [for confidence markers in previews]       │
│           ├──▶ ux-writing [for microcopy refinement]                        │
│           │                                                                 │
│           ▼ [On timeout, rejection, or partial approval]                    │
│                                                                             │
│   failure-choreography                                                      │
│   ├── State preservation: WHAT was saved                                   │
│   ├── Failure explanation: WHY it stopped                                  │
│   └── Recovery options: WHAT user can do now                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Handoff Details

**Receiving from delegation-oversight:**
- Trigger type (uncertainty, stakes, policy ambiguity, preference-sensitivity, novelty, conflict)
- Escalation urgency (determines timeout defaults)
- User's autonomy configuration (determines baseline stakes calibration)
- Context that triggered this approval moment

**Coordinating with trust-calibration:**
- Level 1 (Claim-Level Confidence): Use for artifact preview confidence markers
- Level 2 (Uncertainty Acknowledgment): Use for consequence visualization uncertainty
- Level 3 (Evidence Surfacing): Use for progressive disclosure in complex approvals
- Level 5 (Calibration Failure Recovery): Reference when designing post-timeout recovery

**Handing off to ux-writing:**
- Approval structure (what UI elements exist)
- Stakes level (determines tone: routine vs. critical)
- Button actions (verbs and scope for labeling)
- Consequence statements (what happened/will happen)
- Timeout copy (deadline, default behavior, extension path)

**Handing off to failure-choreography (on timeout/rejection):**
- Preserved state (what was ready for approval)
- User modifications (if any were made before timeout)
- Timeout type (no response, explicit rejection, partial approval)
- Context for handoff package (original trigger, user's partial engagement)

---

## Six Capability Domains

### 1. Pre-Action Preview

**The presentation problem**: Agent has done work. It knows what it wants to do. User arrives cold. The preview must transfer enough context for a decision without requiring the user to redo the agent's analysis.

**Core principle**: Show the action, not just describe it.

```
✗ "I'd like to send an email to the client."
✓ [Rendered email preview] with [Send] [Edit] [Cancel]
```

**Preview Components**

Every pre-action preview needs:

| Component | Purpose | Example |
|-----------|---------|---------|
| **Action statement** | What will happen in one sentence | "Send this email to 3 recipients" |
| **Rendered artifact** | WYSIWYG of what will be created/changed | Email body, calendar event, document diff |
| **Scope indicator** | What changes, what doesn't | "Updates your calendar. Does not notify attendees." |
| **Trigger context** | Why this is happening now | "Based on your instruction: 'schedule the meeting'" |

**Diff vs. Full State**

For modifications, show the delta—not the entire artifact:

```
✗ [Full 20-page document with changes embedded]
✓ [3 highlighted changes] + "View full document"
```

**Information density rule**: Preview should take <30 seconds to evaluate. If it requires more, you're either showing too much or the action is too complex for single approval (break it up).

**Preview Fidelity Levels**

| Fidelity | Use When | Example |
|----------|----------|---------|
| **Exact** | Final artifact exists | Email preview, document with changes |
| **Representative** | Final form depends on execution | "Will create invoice similar to [example]" |
| **Structural** | Multiple items with pattern | "Will schedule 5 meetings following this template" |

**Trust-Calibration Integration (Preview)**

Apply trust-calibration confidence markers to preview elements:

| Preview Element | trust-calibration Pattern | Example |
|-----------------|---------------------------|---------|
| Source data | Claim-level confidence | "Meeting time from your calendar" (high) vs. "Meeting time inferred from email" (medium) |
| Proposed action | Uncertainty acknowledgment | "Will send" (certain) vs. "Will attempt to send" (uncertain) |
| Expected outcome | Evidence surfacing | Progressive disclosure for complex consequences |

See `references/preview-patterns.md` for implementation details.

### 2. Stakes Communication

**The calibration problem**: Cry wolf and users stop listening. Understate and users miss critical decisions. Stakes communication must be *precisely calibrated* to actual consequence.

**Stakes Taxonomy**

Not all approvals are equal. The interface must communicate which kind this is:

| Stakes Level | Characteristics | Visual Treatment | ux-writing Tone |
|--------------|-----------------|------------------|-----------------|
| **Routine** | Easily reversible, low cost, consistent with established pattern | Minimal friction. Inline approval. | Efficient, direct |
| **Notable** | Reversible but effortful, moderate cost, slight deviation | Standard confirmation. Clear action statement. | Clear, helpful |
| **Significant** | Difficult to reverse, meaningful cost, involves external parties | Elevated prominence. Explicit consequence statement. | Serious, transparent |
| **Critical** | Irreversible or high cost, legal/financial/reputational exposure | Maximum friction. Require explicit acknowledgment. | Cautious, explicit consequences |

**Stakes Signals**

Visual and linguistic markers that communicate stakes level:

**Low stakes (routine)**:
- Inline confirmation ("Send?" with single click)
- No modal interruption
- Quick undo available
- Neutral color treatment

**High stakes (significant/critical)**:
- Modal with dedicated attention
- Explicit irreversibility statement
- Consequence preview
- Confirmation friction (type to confirm, countdown timer, explicit checkbox)
- Warning color treatment

**The Anti-Inflation Principle**

If everything is "important," nothing is. Reserve high-stakes treatment for actions that genuinely warrant it. This requires:

1. Consistent calibration across the system
2. User-configurable thresholds for their context
3. Learning from user behavior (if they always approve X instantly, maybe X isn't high-stakes *for them*)

**Stakes Communication Patterns**

| Stakes | Copy Pattern | Example |
|--------|--------------|---------|
| **Routine** | Action only | "Send email?" |
| **Notable** | Action + scope | "Send email to 47 recipients" |
| **Significant** | Action + consequence | "Send email to 47 recipients. This includes external addresses." |
| **Critical** | Action + consequence + irreversibility | "Send email to 47 recipients including press contacts. This cannot be recalled." |

**ux-writing Handoff (Stakes)**

For each stakes level, provide to ux-writing:
- Button verb (Send / Confirm / I understand, send anyway)
- Consequence framing (neutral / cautionary / warning)
- Reversibility statement (omit / mention / emphasize)

See `references/stakes-patterns.md` for visual and linguistic inventories.

### 3. Consequence Visualization

**The imagination problem**: Users can't evaluate an approval if they can't imagine the consequences. Abstract descriptions don't create understanding—concrete visualizations do.

**Consequence Types to Surface**

| Type | Question Answered | Visualization Approach |
|------|-------------------|------------------------|
| **Immediate** | What happens right now? | Before/after comparison |
| **Downstream** | What does this trigger? | Dependency chain or flow diagram |
| **Reversibility** | Can I undo this? | Explicit reversibility statement + undo path |
| **Rejection alternative** | What if I say no? | What doesn't happen, what the agent does instead |

**Before/After Comparisons**

Most powerful for state changes:

```
┌─────────────┬─────────────┐
│   Before    │   After     │
├─────────────┼─────────────┤
│ Status: Draft │ Status: Published │
│ Visible: You │ Visible: Public │
│ Editable: Yes │ Editable: No │
└─────────────┴─────────────┘
```

**Impact Radius Visualization**

For actions affecting multiple entities:

```
This action affects:
├── Your calendar ✓
├── 3 attendees (will receive notification)
│   ├── alice@company.com
│   ├── bob@company.com
│   └── carol@company.com
└── Shared resource: Conference Room A (will be booked)
```

**Rejection Consequence**

Often overlooked. Users need to know what happens if they say no:

```
If you reject:
• Draft email will be saved (you can edit and send manually)
• Follow-up reminder will trigger in 24 hours
• Agent will not re-attempt without your instruction
```

**Consequence Confidence**

Integrate trust-calibration patterns for consequence certainty:

```
✓ Will send: Email to recipients (certain)
⚠ May trigger: Auto-reply from bob@external.com (likely based on past behavior)
? Unknown: Whether alice@company.com is OOO (no visibility)
```

Map to trust-calibration markers:
- Certain → Declarative framing
- Likely → Hedged framing with source
- Unknown → Explicit uncertainty acknowledgment

See `references/consequence-patterns.md` for visualization templates.

### 4. Modification Options

**The binary trap**: Yes/No is rarely the right answer. Real decisions have nuance: "Yes, but change X." "Yes, but only for Y." "Yes, if Z." Approval interfaces that force binary choice lose information and frustrate users.

**Modification Dimensions**

| Dimension | User Intent | Interface Pattern |
|-----------|-------------|-------------------|
| **Content** | "Change what you're doing" | Inline edit of artifact |
| **Scope** | "Do less than proposed" | Subset selection |
| **Parameters** | "Same action, different values" | Value adjustment controls |
| **Conditions** | "Do this only if..." | Conditional approval |
| **Timing** | "Do this later" | Defer/schedule options |

**Inline Editing**

For artifacts the user might want to adjust:

```
┌─────────────────────────────────────────┐
│ Subject: Q4 Planning Meeting            │ ← Editable
├─────────────────────────────────────────┤
│ Hi team,                                │
│                                         │ ← Editable
│ Let's meet Thursday at 3pm to discuss   │
│ Q4 priorities.                          │
│                                         │
│ Best,                                   │
│ [Your name]                             │
└─────────────────────────────────────────┘
        [Send as-is] [Send with edits] [Cancel]
```

**Scope Modification**

When approval covers multiple items:

```
Proposed: Update permissions for 5 users

☑ alice@company.com   Admin → Editor
☑ bob@company.com     Editor → Viewer
☐ carol@company.com   Admin → Viewer    ← User unchecked
☑ dan@company.com     Viewer → Editor
☑ eve@company.com     None → Viewer

        [Apply selected (4)] [Apply all (5)] [Cancel]
```

**Conditional Approval**

For context-dependent decisions:

```
○ Approve now
○ Approve if [amount] < $500
○ Approve if [recipient] is internal only
● Approve and apply to similar future requests

        [Confirm] [Cancel]
```

**Parameter Adjustment**

When the action is right but values need tuning:

```
Schedule meeting:

Duration: [60 min ▾]  ← Adjustable
Buffer:   [15 min ▾]  ← Adjustable  
Room:     [Auto ▾]    ← Adjustable

        [Schedule] [Cancel]
```

**The Modification Complexity Limit**

If an approval needs extensive modification, the agent's proposal was wrong. Provide escape hatches:

```
[Approve] [Edit] [Start over] [Take over manually]
```

"Start over" = agent tries again with feedback.
"Take over manually" = user does it themselves.

**failure-choreography Connection**

When user chooses "Take over manually," hand off to failure-choreography with:
- What was proposed (the artifact that wasn't right)
- User's signal (explicit takeover, not timeout/error)
- Preserved state (agent's work product, available for manual completion)

See `references/modification-patterns.md` for component specifications.

### 5. Batch Approval

**The clustering problem**: Multiple decisions arrive together. Serial approval is tedious. Single approval for all is dangerous (hides important items). The interface must enable efficient review of related decisions without obscuring critical ones.

**When to Batch**

Batch when items share:
- Same action type (5 emails to send)
- Same trigger (all from one instruction)
- Same consequence class (all low-stakes or all high-stakes)

Do NOT batch when:
- Stakes vary significantly across items
- Actions are unrelated
- Any item requires individual judgment

**Batch Presentation Hierarchy**

```
Level 1: Summary
├── "5 emails ready to send"
├── [Approve all] [Review individually] [Reject all]
│
Level 2: Grouped detail (on expand)
├── Category A: Internal (3 emails) [Approve group] [Expand]
│   ├── To: team@company.com - Weekly update
│   ├── To: manager@company.com - Status report  
│   └── To: hr@company.com - PTO request
│
├── Category B: External (2 emails) [Approve group] [Expand]
│   ├── To: client@external.com - Proposal follow-up
│   └── To: vendor@external.com - Invoice question
│
Level 3: Individual detail (on item expand)
└── [Full email preview]
```

**Mixed-Stakes Batching**

When batch contains varying stakes, surface the variance:

```
7 actions ready for approval:

[Routine - approve with one click]
├── 5 calendar updates

[Requires review]
├── 1 email to external recipient
└── 1 document with edit permissions

        [Approve routine (5)] [Review remaining (2)]
```

**Batch Modification**

Allow partial approval and bulk parameter changes:

```
Scheduling 5 meetings:

☑ Select all (5)

Bulk actions:
├── Set all durations to: [60 min ▾]
├── Set all buffers to: [15 min ▾]
└── Add to all agendas: [____________]

Or modify individually below...
```

**The Batch Size Limit**

Cognitive limits apply. Research suggests:
- 5-7 items: Reviewable in detail
- 8-15 items: Reviewable with grouping
- 15+ items: Summary only; require sampling or filtering

If presenting 15+ items, enable:
- Search/filter within batch
- Random sampling for spot-checking
- Automatic grouping by relevant dimension

See `references/batch-patterns.md` for layout specifications and algorithms.

### 6. Time-Bounded Approval

**The timeout problem**: User doesn't respond. System cannot wait forever. What happens?

This is where most approval systems fail catastrophically—either blocking indefinitely (system halts) or acting without authorization (trust violation).

**Timeout Components**

Every time-bounded approval needs:

| Component | Purpose | User sees |
|-----------|---------|-----------|
| **Deadline** | When approval expires | "Respond by 3pm" or countdown |
| **Default behavior** | What happens if no response | "Will proceed" / "Will cancel" / "Will escalate" |
| **Rationale** | Why there's a deadline | "Client expects response by EOD" |
| **Extension path** | How to get more time | "Need more time?" |

**Default Behavior Design**

The right default depends on stakes and reversibility:

| Stakes | Reversible | Default | Rationale |
|--------|------------|---------|-----------|
| Low | Yes | Proceed | Low cost of wrong action, easy fix |
| Low | No | Cancel | Even low cost is unacceptable if permanent |
| High | Yes | Cancel | User should consciously accept high stakes |
| High | No | Escalate | Never default into irreversible high-stakes action |

**Timeout Communication**

**Before deadline**:
```
┌────────────────────────────────────────────────┐
│ ⏱ Approval needed by 3:00pm (47 minutes)       │
│                                                │
│ [Action preview...]                            │
│                                                │
│ If you don't respond:                          │
│ → Email will be saved as draft                 │
│ → You'll be reminded tomorrow at 9am           │
│                                                │
│ [Approve] [Reject] [Need more time]            │
└────────────────────────────────────────────────┘
```

**At deadline** (if user present):
```
┌────────────────────────────────────────────────┐
│ ⚠ Approval deadline reached                    │
│                                                │
│ Choose now:                                    │
│ [Approve] [Reject] [Extend 1 hour]             │
│                                                │
│ Closing in 30 seconds → Will save as draft     │
└────────────────────────────────────────────────┘
```

**After deadline** (if user absent):
```
Notification: "Approval for [action] expired. 
              Saved as draft. [Open to review]"
```

**Escalation Paths**

When timeout leads to escalation rather than default:

```
You didn't respond to approval request.

Escalated to: manager@company.com
Context shared: [summary of action and deadline]
Your options: [Approve now] [Add input for manager]
```

**Grace Periods and Reminders**

For non-urgent approvals:

```
Timeline:
├── T+0:  Initial request
├── T+4h: First reminder if no response
├── T+8h: Second reminder, escalation warning
├── T+24h: Deadline, default behavior executes
```

**State Preservation**

Critical: if approval times out, don't lose the work.

```
What was preserved:
• Draft email (editable)
• Recipient list
• Your pending edits (if any)
• Context: why this was created

Resume: [Edit and send manually] [Request agent retry]
```

**failure-choreography Handoff (Timeout)**

When approval times out, provide failure-choreography with:

```
ApprovalTimeoutContext:
  trigger: "timeout" | "explicit_rejection" | "partial_approval"
  preserved_state:
    artifact: [the thing that was ready for approval]
    user_modifications: [any edits made before timeout]
    approval_context: [why this approval was requested]
  timeout_details:
    deadline: [when it expired]
    default_executed: [what happened automatically]
    escalation: [if any]
  recovery_suggestions:
    - "Edit and send manually"
    - "Request agent retry with feedback"
    - "Abandon and start fresh"
```

This enables failure-choreography to build its handoff package with full context.

See `references/timeout-patterns.md` for timing algorithms and notification sequences.

---

## Anti-Patterns

### Approval Wall of Text
Information dump that no one reads. User rubber-stamps to escape. Information present but not communicated.
```
✗ [2000 words explaining every aspect of what will happen]
```

### Uniform Severity
Every approval looks identical regardless of stakes. Users can't triage. Everything gets same (low) attention.
```
✗ "Send email?" (for routine internal)
✗ "Send email?" (for external to press list)
```

### Binary Forcing
No modification options. Users approve things they'd rather adjust, or reject things they'd approve with changes.
```
✗ [Approve] [Reject]
   (when user wants "Approve with different subject line")
```

### Hidden Timeout Defaults
System acts on timeout without user knowing what the default was.
```
✗ [Request expires in 24h]
   (but doesn't say what happens on expiry)
```

### Context Amnesia
Approval request lacks trigger context. User sees "Send this email?" but not why the agent wants to send it.
```
✗ "Ready to send?" 
   (user: "...ready to send what? why? to whom?")
```

### Batch Opacity
Batch approval hides individual items. User approves "5 actions" without seeing what they are.
```
✗ "Approve 5 scheduled actions?" [Yes] [No]
```

### Modification Theater
Edit options exist but edits don't persist or aren't reflected in the approval.
```
✗ [User edits email] → [Approves] → [Original version sent]
```

---

## ux-agent Integration: When to Invoke This Skill

When ux-agent reaches Phase 3 (Modality Selection) and selects **agentic modality**, invoke approval-confirmation for any task where:

1. Agent will execute actions with external consequences
2. Actions involve resources the user cares about (time, money, reputation)
3. Errors would be noticed by people other than the user
4. The delegation-oversight analysis identifies checkpoints

**ux-agent should provide:**
- User model (expertise, error patterns, context of use)
- Task characteristics (frequency, stakes, reversibility)
- Success criteria for the approval moment

**approval-confirmation returns:**
- Approval pattern recommendation (which of the six domains apply)
- Stakes calibration for this user/task
- Recommended timeout defaults
- Structure for ux-writing to refine

---

## ux-writing Integration: Copy Handoff Specification

After designing approval structure, hand off to ux-writing for copy refinement.

**Provide:**

```yaml
approval_copy_request:
  stakes_level: routine | notable | significant | critical
  
  action_statement:
    verb: "Send"
    object: "email to 3 recipients"
    
  buttons:
    primary: { action: "send", tone: "confident" }
    secondary: { action: "edit", tone: "neutral" }
    tertiary: { action: "cancel", tone: "neutral" }
    
  consequence_statements:
    immediate: "Email will be delivered"
    downstream: "Recipients may reply"
    reversibility: "Cannot be recalled after sending"
    
  timeout_copy:
    deadline_format: "Respond by [time]" | "[countdown]"
    default_statement: "Will save as draft"
    extension_prompt: "Need more time?"
    
  error_state_copy:  # for failure-choreography handoff
    timeout_notification: "Approval expired"
    rejection_acknowledgment: "Got it, won't send"
```

**ux-writing returns:**
- Polished button labels
- Refined consequence statements at appropriate reading level
- Tone-calibrated timeout copy
- Accessible error messages

---

## Design Checklist

When reviewing approval interfaces, verify:

**Pre-Action Preview**
- [ ] Action statement in one sentence
- [ ] Artifact rendered (WYSIWYG), not just described
- [ ] Scope explicitly bounded
- [ ] Trigger context present
- [ ] Confidence markers match trust-calibration patterns

**Stakes Communication**
- [ ] Stakes level visually distinct from other levels
- [ ] No inflation (routine actions don't look critical)
- [ ] Calibration consistent across system
- [ ] ux-writing tone matches stakes level

**Consequence Visualization**
- [ ] Immediate consequence clear
- [ ] Downstream effects surfaced if significant
- [ ] Reversibility explicitly stated
- [ ] Rejection consequence shown
- [ ] Uncertainty markers from trust-calibration applied

**Modification Options**
- [ ] Editable where appropriate
- [ ] Scope adjustable for multi-item actions
- [ ] Parameters tunable
- [ ] Escape hatches available (start over, take over)
- [ ] Takeover hands off properly to failure-choreography

**Batch Approval**
- [ ] Grouped by meaningful dimension
- [ ] Mixed stakes surfaced
- [ ] Individual review available
- [ ] Partial approval supported

**Time-Bounded Approval**
- [ ] Deadline visible
- [ ] Default behavior explicit
- [ ] Rationale for deadline provided
- [ ] Extension path available
- [ ] State preserved on timeout
- [ ] failure-choreography handoff context complete

**Team Integration**
- [ ] delegation-oversight trigger type documented
- [ ] trust-calibration patterns applied to confidence
- [ ] ux-writing handoff specification complete
- [ ] failure-choreography handoff context complete

---

## References

- `references/preview-patterns.md`: Preview component specifications, fidelity levels, rendering approaches
- `references/stakes-patterns.md`: Visual and linguistic inventory for each stakes level
- `references/consequence-patterns.md`: Visualization templates, impact radius, before/after layouts
- `references/modification-patterns.md`: Edit, scope, parameter, and conditional approval components
- `references/batch-patterns.md`: Grouping algorithms, layout specifications, mixed-stakes handling
- `references/timeout-patterns.md`: Default logic, escalation sequences, state preservation

---

## Changelog

### v2.0.0
- Added "Team Workflow" section showing coordination with all six skills
- Added explicit ux-agent integration (when to invoke this skill)
- Added explicit ux-writing handoff specification (copy refinement)
- Expanded trust-calibration touchpoints throughout domains
- Added detailed failure-choreography handoff context for timeouts
- Added "Team Integration" section to design checklist
- Clarified receiving context from delegation-oversight
