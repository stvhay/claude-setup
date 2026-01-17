# Modality Selection

The right interface type is determined by task characteristics, not designer preference. This framework provides principled selection criteria.

## The Four Modalities

### GUI (Graphical User Interface)

**Strengths:** Visual comparison, spatial relationships, complex input, discoverability, progressive disclosure, error prevention through constraints.

**Weaknesses:** Requires visual attention, interrupts flow, scales poorly for repetitive tasks, opaque to automation.

**Best for:**
- Tasks requiring visual scanning or comparison
- Spatial manipulation (layout, arrangement, drawing)
- Complex multi-field input with validation
- Novice users or infrequent tasks
- When showing relationships matters more than speed
- When preventing errors matters more than efficiency

**Anti-patterns:**
- Using GUI for tasks that should be automated
- Requiring mouse precision for frequent actions
- Hiding power features behind menu archaeology

### CLI (Command Line Interface)

**Strengths:** Precision, composability, scriptability, speed for experts, audit trails, batch operations, remote accessibility.

**Weaknesses:** Discovery requires documentation, error-prone without feedback, learning curve, intimidating to novices.

**Best for:**
- Power users performing repetitive tasks
- Operations requiring exact parameters
- Anything that should be scriptable
- Tasks requiring audit trails
- Batch or bulk operations
- Remote or low-bandwidth contexts
- When precision trumps discoverability

**Design principles for excellent CLI:**
- Consistent flag conventions (`-v` verbose, `-h` help, `-o` output)
- Sensible defaults requiring minimal arguments
- Clear error messages with recovery suggestions
- Progressive disclosure: simple case is simple, complex case is possible
- Machine-readable output options (JSON, TSV)
- Discoverability through `--help`, man pages, examples
- Confirmation for destructive operations
- Idempotency where possible

### Voice/Aural

**Strengths:** Hands-free, eyes-free, ambient awareness, accessibility, natural for simple commands, low attention demand.

**Weaknesses:** No visual feedback, linear information, privacy concerns, ambient noise sensitivity, limited input complexity.

**Best for:**
- Hands-occupied contexts (driving, cooking, assembly)
- Simple commands and confirmations
- Status updates and notifications
- Accessibility requirements
- Ambient awareness (monitoring without watching)
- When interrupting visual focus is costly

**Design principles for excellent voice:**
- Turn-taking: clear whose turn it is to speak
- Disambiguation: graceful handling of misrecognition
- State transparency: user always knows what system heard/understood
- Escape hatches: clear path to human help or GUI fallback
- Progressive disclosure: simple commands work simply
- Confirmation proportional to stakes (destructive actions need explicit confirm)
- Brevity: every word of system speech costs user attention

### Agentic

**Strengths:** User specifies outcome not process, handles complexity invisibly, scales to difficult problems, learns from feedback.

**Weaknesses:** Opacity, trust calibration required, failure modes unclear, user loses skill/understanding.

**Best for:**
- Outcome-oriented goals ("book me a flight" not "search for flights")
- Tasks with clear success criteria
- Problems too complex for manual optimization
- When user expertise in process is irrelevant
- Recoverable failures (can undo or retry)
- Tasks users don't want to understand

**Design principles for excellent agentic:**
- Transparency: show what agent is doing (even if simplified)
- Control: easy to pause, redirect, or cancel
- Trust calibration: agent admits uncertainty, asks when stakes are high
- Graceful degradation: partial success surfaced clearly
- Learning visibility: user understands how agent improves
- Fallback: clear path to manual override
- Scope limits: agent knows what it shouldn't attempt

## Selection Decision Tree

```
                    ┌─────────────────────────────────────┐
                    │  What is the user's primary goal?   │
                    └─────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
           Accomplish outcome              Control process precisely
           (don't care how)                (care about steps)
                    │                                   │
                    ▼                                   │
         ┌──────────────────┐                         │
         │ Clear success    │                         │
         │ criteria?        │                         │
         │ Recoverable if   │                         │
         │ wrong?           │                         │
         └──────────────────┘                         │
            │           │                             │
           Yes          No                            │
            │           │                             │
            ▼           ▼                             ▼
        AGENTIC       GUI            ┌─────────────────────────────┐
                  (with guidance)    │   Task frequency?           │
                                     └─────────────────────────────┘
                                        │                │
                                       Low              High
                                        │                │
                                        ▼                ▼
                               ┌─────────────┐  ┌─────────────────┐
                               │  Hands      │  │  Needs          │
                               │  available? │  │  scriptability? │
                               └─────────────┘  └─────────────────┘
                                  │      │         │          │
                                 Yes     No       Yes         No
                                  │      │         │          │
                                  ▼      ▼         ▼          ▼
                                GUI   VOICE      CLI    GUI (optimized
                                                        for speed)
```

## Modality Combinations

Most systems benefit from multiple modalities serving different user segments or task phases.

**Common patterns:**

**GUI + CLI:** Dashboard for monitoring, CLI for automation. Users start in GUI, graduate to CLI.

**Voice + GUI:** Voice for command, GUI for confirmation. "Send email to John" → GUI shows preview → voice confirms.

**Agentic + GUI:** Agent proposes, user confirms in GUI. Reduces trust burden while preserving automation benefits.

**CLI + Agentic:** CLI invokes agent. `optimize-images --target performance` lets expert user configure agent.

## Transition Design

When users move between modalities, design the handoff:

**State preservation:** User shouldn't lose context crossing modalities.

**Capability parity:** Core tasks possible in all supported modalities (even if awkward in some).

**Signposting:** Clear indication of what's available in each modality.

**Graceful degradation:** If preferred modality unavailable, fallback is obvious.

## Accessibility Considerations

Modality selection isn't just preference—it's accessibility.

**Visual impairment:** CLI and voice become primary, not alternative
**Motor impairment:** Voice and agentic reduce physical demands
**Cognitive load:** GUI with constraints prevents errors better than CLI

Design for the user who *can't* use your preferred modality, not just the one who *prefers* another.
