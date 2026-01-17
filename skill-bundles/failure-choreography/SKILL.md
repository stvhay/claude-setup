---
name: failure-choreography
description: "Design patterns for graceful degradation in agentic systems. Use when building agent interfaces that handle multi-step tasks with real stakes—where partial failure must surface progress, preserve state, explain what went wrong, offer recovery paths, and hand off to humans with dignity. Triggers on: agent error handling, failure UX, partial completion states, recovery flows, rollback design, degraded mode operation, task handoff protocols, or any context where an agent might fail mid-execution and the failure itself becomes a design surface. Coordinates with trust-calibration for failure communication, ux-writing for failure copy, and receives handoff context from approval-confirmation and delegation-oversight."
---

# Failure Choreography

Graceful degradation turns system failure from betrayal into handoff. When agents fail mid-task on consequential work, the failure surface IS the interface—how it fails determines whether partnership survives.

## Core Philosophy

Most agentic systems treat failure as an edge case: log an error, show "something went wrong," leave the user holding debris. This is architectural malpractice.

**Principle**: Failures in consequential work are first-class design artifacts, not exceptions to apologize for.

A well-choreographed failure:
- Makes completed progress visible and usable
- Draws clear lines between saved and lost state
- Explains what happened at calibrated depth
- Presents recovery as choices, not dead ends
- Transfers control with enough context for human dignity

The goal is not to hide failure—it's to make failure navigable.

---

## Team Workflow: Where This Skill Fits

This skill is one of six that coordinate on agentic interface design. Understanding handoff points prevents duplication and ensures coherent UX.

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
│           ├──▶ [Mid-task handoff needed] ──▶ failure-choreography          │
│           │                                                                 │
│           ▼ [When approval is needed]                                       │
│                                                                             │
│   approval-confirmation                                                     │
│   ├── Pre-action preview: WHAT to show                                     │
│   ├── Stakes communication: HOW serious this is                            │
│   └── Time-bounded approval: WHAT happens on timeout                       │
│           │                                                                 │
│           ▼ [On timeout, rejection, partial approval, OR execution failure] │
│                                                                             │
│   failure-choreography  ◀── YOU ARE HERE                                   │
│   ├── Partial success surfacing: WHAT completed                            │
│   ├── State preservation: WHAT's saved vs lost                             │
│   ├── Failure explanation: WHY it failed                                   │
│   ├── Recovery options: WHAT user can do now                               │
│   └── Human handoff: HOW to transfer control with dignity                  │
│           │                                                                 │
│           ├──▶ trust-calibration [for failure communication calibration]    │
│           └──▶ ux-writing [for failure copy refinement]                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Receiving Context

**From delegation-oversight (mid-task handoff):**
- Task context and goal that was being pursued
- Progress state at handoff trigger
- Reason for handoff (uncertainty, stakes, conflict, user intervention)
- User's autonomy configuration (informs explanation depth)

**From approval-confirmation (timeout/rejection):**
- Original trigger context (why approval was requested)
- Preserved state (what was ready for approval)
- User modifications (if any were made before timeout/rejection)
- Timeout type: `no_response` | `explicit_rejection` | `partial_approval`
- Time elapsed and deadline that was set
- User's partial engagement signals (viewed? edited? started then abandoned?)

### Coordinating with trust-calibration

Apply trust-calibration patterns to failure-choreography outputs:

| Domain | trust-calibration Pattern | Application |
|--------|---------------------------|-------------|
| **Partial success** | Claim-level confidence | Mark completed steps as certain vs. uncertain |
| **State preservation** | Uncertainty acknowledgment | Frame "uncertain" state with specific verification steps |
| **Failure explanation** | Evidence surfacing | Progressive disclosure (L1→L2→L3) |
| **Recovery options** | Track record building | If retry suggested, note prior success rate in this domain |
| **Human handoff** | Calibration failure recovery | If failure was due to agent error, apply full acknowledgment sequence |

**Cross-reference**: Consult `trust-calibration/references/uncertainty-patterns.md` for linguistic calibration of state uncertainty. Consult `trust-calibration/references/failure-recovery.md` for trust repair when agent caused the failure.

### Handing Off to ux-writing

After structuring failure response, hand off to ux-writing for copy refinement.

**Provide:**

```yaml
failure_copy_request:
  failure_type: timeout | rejection | execution_error | partial_completion
  
  state_summary:
    preserved: ["list of preserved items with locations"]
    lost: ["list of lost items with recreation cost"]
    uncertain: ["list of uncertain items with verification steps"]
  
  explanation_levels:
    L1_summary: "User-facing summary (1-2 sentences)"
    L2_detail: "Actionable detail with probable cause"
    L3_technical: "Full technical trace (expandable)"
  
  recovery_options:
    - name: "Retry"
      action: "what happens"
      when_appropriate: "good if..."
      tone: "confident | cautious"
    - name: "Manual"
      action: "what happens"
      when_appropriate: "good if..."
      tone: "helpful"
  
  handoff_elements:
    situation_summary: "1-3 sentences"
    recommendation: "agent's suggested path"
    continuation_steps: "what happens if user proceeds"
    deadline_pressure: null | "24h inventory hold" | etc.
    
  attribution:
    fault_location: agent | external_service | data_quality | user_input | unknown
    tone_adjustment: "if agent fault, apologetic; if external, matter-of-fact"
```

**ux-writing returns:**
- Polished explanation copy at each level
- Tone-calibrated recovery option descriptions
- Accessible state summaries
- Human-readable artifact descriptions

---

## Domain 1: Partial Success Surfacing

When a 7-step task fails at step 5, steps 1-4 happened. That work has value. Don't let it vanish.

### The Visibility Principle

```
ANTI-PATTERN                      PATTERN
────────────────────────────────────────────────────────
"Task failed."                    "Completed 4 of 7 steps before failure:
                                   ✓ Data extraction (23 records)
                                   ✓ Validation (all passed)
                                   ✓ Enrichment (geocoding complete)
                                   ✓ Format conversion (CSV ready)
                                   ✗ Upload failed at authentication
                                   
                                   Completed work saved to: /output/partial/"
```

### Surfacing Requirements

**For sequential tasks**: Show step completion with concrete outputs.
```
Step 1: Extract → 847 rows extracted → saved to staging/extract.csv
Step 2: Transform → 812 valid rows (35 filtered) → saved to staging/clean.csv  
Step 3: Load → FAILED: connection timeout after 3 retries
```

**For parallel tasks**: Show completion map.
```
Document batch processing (10 files):
├── invoice_001.pdf → ✓ Processed → output/invoice_001_parsed.json
├── invoice_002.pdf → ✓ Processed → output/invoice_002_parsed.json
├── invoice_003.pdf → ✗ FAILED: corrupt PDF (page 3 unreadable)
├── invoice_004.pdf → ⏸ Skipped (stopped after failure)
└── ... (6 more skipped)

Completed: 2/10 | Failed: 1 | Skipped: 7
```

**For nested/branching tasks**: Show tree with branch status.

### Artifact Persistence

Partial work must be retrievable. Implementation requirements:

1. **Checkpoint on step completion**: Don't wait for task end to persist
2. **Named outputs**: `partial_<task>_step<N>_<timestamp>` not temp files
3. **Manifest file**: JSON/YAML recording what completed, what's in each file
4. **Explicit location**: Tell user exactly where partial work lives

See `references/partial-success-patterns.md` for format-specific patterns.

## Domain 2: State Preservation

Users need to know: what's saved, what's lost, what's uncertain?

### The State Boundary

```
┌─────────────────────────────────────────────────────────┐
│                    PRESERVED                            │
│  - Downloaded source files (local copy)                 │
│  - Processed intermediate results (checkpointed)        │
│  - Configuration/parameters used                        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    LOST                                 │
│  - In-flight API call results (not returned)            │
│  - Memory-only computed values (not persisted)          │
│  - Pending webhook registrations (not confirmed)        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    UNCERTAIN                            │
│  - Database transaction (may have committed)            │
│  - Email send (no delivery confirmation received)       │
│  - External API state (request sent, response unknown)  │
└─────────────────────────────────────────────────────────┘
```

### State Communication Pattern

Always surface state in three categories:

**Preserved** (can be reused): List explicitly with locations.

**Lost** (must be redone): List what and estimate cost to recreate.

**Uncertain** (needs verification): List what to check and how to verify.

### Implementation: State Checkpointing

Design principle: **Persist before proceeding**. If step N completes, checkpoint before starting step N+1. Failure during N+1 should never lose N's results.

See `references/state-preservation.md` for checkpoint strategies by task type.

## Domain 3: Failure Explanation

The failure message is the interface. Calibrate transparency to audience and stakes.

### The Explanation Spectrum

```
[Raw technical]                                      [Opaque]
Stack trace,                                         "Something
error codes,      ←── CALIBRATE TO CONTEXT ──→       went wrong"
system state
```

Neither extreme serves users. The goal: **explanatory sufficiency**—enough to understand, decide, and act.

### Calibrated Transparency Model

**Level 1 - User-facing summary**: What happened in task terms.
```
"Upload failed: the destination server rejected the connection 
after the file was prepared but before transfer completed."
```

**Level 2 - Actionable detail**: What specifically failed and why.
```
"Authentication to storage.example.com failed. The API key 
may have expired (last successful auth: 3 days ago) or the 
service may be down (3 connection attempts, all timed out)."
```

**Level 3 - Technical trace**: For debugging or escalation.
```
"ConnectionError: HTTPSConnectionPool(host='storage.example.com', port=443)
Max retries exceeded. Last attempt: SSLError(SSLCertVerificationError(1, 
'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed'))"
```

### Presentation Pattern

Default to Level 1+2 visible, Level 3 expandable:

```
Upload failed: server rejected connection after file preparation.

Details: Authentication to storage.example.com failed after 3 attempts.
Possible causes: expired API key (last success: 3 days ago) or service outage.

[Show technical details ▼]
```

### Failure Attribution

Be specific about fault location:

| Attribution | Example |
|-------------|---------|
| **Agent error** | "I incorrectly parsed the date format in your input" |
| **External service** | "The payment processor rejected the request" |
| **Data quality** | "The input file contains corrupted data on page 7" |
| **Configuration** | "The API key in settings has expired" |
| **Environment** | "Network connection dropped during transfer" |

See `references/failure-explanation.md` for calibrated explanation templates.

## Domain 4: Recovery Options

Failure without options is a wall. Failure with options is a fork in the road.

### The Recovery Menu

Present choices, not dead ends. Structure:

```
What would you like to do?

[Retry]     Attempt the failed step again (upload to storage.example.com)
            Good if: temporary network issue, service was briefly down
            
[Rollback]  Undo completed steps and restore starting state
            Reverses: format conversion, data enrichment
            Preserves: original source files (unchanged)
            
[Resume]    Skip failed step, continue with remaining steps
            Skips: upload
            Continues with: notification, logging
            Note: downstream steps may fail without upload result
            
[Manual]    Download partial results, complete manually
            Available: processed_data.csv (812 rows, ready for upload)
            You'll need to: upload via web interface, then trigger notification
            
[Abandon]   Stop task, preserve completed work for later
            Saved to: /output/partial_upload_20240115/
```

### Recovery Option Design

Each option requires:

1. **Clear name**: Verb that describes the action
2. **What it does**: Concrete effect on system state
3. **When appropriate**: Guidance on when this choice makes sense
4. **Consequences**: What changes, what's preserved, what's lost

### Retry Intelligence

Retries should be smart, not stubborn:

- **Exponential backoff**: Don't hammer failing services
- **Retry budget**: Maximum attempts before forcing decision
- **State preservation**: Same checkpoint after each retry attempt
- **Differentiated retry**: Distinguish transient vs persistent failures

See `references/recovery-patterns.md` for option implementation details.

## Domain 5: Handoff to Human

When control transfers back, the human inherits the situation. Handoff quality determines whether they can act with competence.

### The Dignity Threshold

A handoff has dignity when the human can:
1. Understand what happened without interrogating the system
2. Assess the current state without forensic investigation  
3. Decide what to do without guessing at consequences
4. Act without rediscovering context the system already had

### Handoff Package Components

**Situation summary**: 1-3 sentences on what was attempted and what happened.

**Progress inventory**: What completed, what didn't, what's uncertain.

**Artifact manifest**: Where everything is, what's in each file, what format.

**Decision context**: Why the agent stopped, what options exist, what agent recommends.

**Continuation path**: If human wants to proceed, exactly what steps remain.

### Handoff Template

```
HANDOFF: Invoice Processing Task
════════════════════════════════════════════════════════════

SITUATION
Attempted to process 10 invoices and upload to accounting system.
Completed 2, failed on 3rd (corrupt PDF), stopped to await decision.

PROGRESS
✓ invoice_001.pdf → parsed → output/invoice_001.json
✓ invoice_002.pdf → parsed → output/invoice_002.json  
✗ invoice_003.pdf → FAILED: PDF corruption (page 3 unreadable)
⏸ invoice_004-010.pdf → not attempted

STATE
Preserved: Source files (unchanged), completed parses (in output/)
Lost: Nothing (failure occurred before any state changes)
Uncertain: Nothing (clean failure point)

YOUR OPTIONS
1. Skip invoice_003, continue with remaining 7
2. Provide corrected invoice_003.pdf, retry full batch
3. Process remaining 7, handle invoice_003 manually
4. Abandon and process all manually

RECOMMENDATION
Option 3—process remaining 7 automatically, handle the one 
corrupt file manually. Maximizes automation value.

IF YOU CONTINUE
Remaining steps: Parse 7 files → validate → upload to system
Estimated time: ~2 minutes
Resume command: `agent resume invoice-task-20240115`

ARTIFACTS
/output/invoice_001.json  (parsed, validated, ready for upload)
/output/invoice_002.json  (parsed, validated, ready for upload)
/failed/invoice_003.pdf   (original, corrupt)
/pending/invoice_004-010/ (originals, not yet processed)
```

### Handoff Anti-Patterns

**Context collapse**: "Task failed. See logs." (No usable information)

**Information avalanche**: 500 lines of system state. (Overwhelm, not inform)

**Orphaned artifacts**: Files exist but no explanation of what's in them.

**Missing continuation**: Handoff describes problem but not how to proceed.

**Blame without attribution**: "An error occurred." (Who/what failed?)

See `references/handoff-patterns.md` for domain-specific templates.

---

## Anti-Patterns Summary

| Anti-Pattern | Failure Mode | Correction |
|--------------|--------------|------------|
| **Silent failure** | Error logged, user sees nothing | Surface failure explicitly |
| **Void progress** | Completed work vanishes | Checkpoint and surface partial success |
| **State ambiguity** | User doesn't know what's saved | Explicit preserved/lost/uncertain |
| **Opacity** | "Something went wrong" | Calibrated multi-level explanation |
| **Dead ends** | Failure with no options | Recovery menu with guidance |
| **Abandoned handoff** | Control returns without context | Structured handoff package |
| **Stubborn retry** | Infinite retry without escalation | Retry budget + forced decision |
| **Blame diffusion** | "An error occurred" | Specific attribution |

---

## Quick Reference: Failure Response Checklist

When an agent fails mid-task, the response must include:

- [ ] **Progress**: What steps completed? What concrete outputs exist?
- [ ] **State**: What's preserved? Lost? Uncertain?
- [ ] **Explanation**: Why did it fail? At what level of detail?
- [ ] **Options**: What can the user do now? (Not just "retry or abandon")
- [ ] **Recommendation**: What does the agent suggest?
- [ ] **Artifacts**: Where is everything? What's in each file?
- [ ] **Continuation**: If user proceeds, what happens next?

**Team Integration:**
- [ ] trust-calibration patterns applied to state uncertainty and recovery confidence
- [ ] ux-writing handoff specification complete for failure copy
- [ ] Receiving context from approval-confirmation/delegation-oversight documented
- [ ] Attribution clarity matches trust-calibration failure recovery patterns

---

## References

- `references/partial-success-patterns.md`: Format-specific progress surfacing
- `references/state-preservation.md`: Checkpoint strategies by task type
- `references/failure-explanation.md`: Calibrated explanation templates
- `references/recovery-patterns.md`: Recovery option implementation
- `references/handoff-patterns.md`: Domain-specific handoff templates
- `references/team-coordination.md`: Handoff protocols with sibling skills

---

## Changelog

### v2.0.0
- Added "Team Workflow" section showing coordination with all six skills
- Added "Receiving Context" documentation from delegation-oversight and approval-confirmation
- Added explicit trust-calibration integration table per domain
- Added ux-writing handoff specification for failure copy refinement
- Added "Team Integration" section to design checklist
- Updated description to mention coordination role
- Streamlined core domain content (removed code samples to keep SKILL.md lean)
