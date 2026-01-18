# UX Skills Integration Design

## Goal

Integrate 7 UX-focused skills into the superpowers skillset without breaking existing architecture and orchestration principles.

## Architecture

### Skills to Integrate

| Skill | Type | Purpose |
|-------|------|---------|
| **ux-design-agent** | Workflow | Entry point. Requirements archaeology, user modeling, modality selection. |
| **delegation-oversight** | Workflow | Human-AI handoff patterns for agentic systems. |
| **approval-confirmation** | Workflow | Approval UI design for agentic systems. |
| **failure-choreography** | Workflow | Graceful degradation and failure handling. |
| **trust-calibration** | Technique | Confidence communication (invoked by workflow skills). |
| **ux-writing** | Reference | Interface copy patterns (invoked by workflow skills). |
| **design-principles** | Reference | GUI visual design system. |

### Integration with Existing Skills

```
brainstorming
├── Explore idea, propose approaches, validate design
│
├── Evaluate UX design need (NEW)
│   │
│   ▼
│   "This involves [user-facing interface / agentic behavior].
│    Would you like detailed UX design?"
│   │
│   ├── YES → ux-design-agent
│   │         ├── Requirements archaeology
│   │         ├── User modeling
│   │         ├── Modality selection
│   │         │       │
│   │         │       ├── GUI → design-principles
│   │         │       ├── Agentic → delegation-oversight
│   │         │       │              ├── approval-confirmation
│   │         │       │              └── failure-choreography
│   │         │       └── CLI/Voice → (document requirements)
│   │         │
│   │         └── OUTPUT: Structured requirements
│   │
│   └── NO → (use loose design directly)
│
└── writing-plans → execution workflow
```

### Skill Relationships

**Workflow skills** (sequential pipeline):
- ux-design-agent → delegation-oversight → approval-confirmation → failure-choreography

**Technique skills** (invoked within workflow skills):
- trust-calibration: Confidence framing in communications
- ux-writing: Copy refinement for interfaces

**Reference skills** (consulted during implementation):
- design-principles: GUI visual design patterns

### Handoff Protocol

Using existing superpowers pattern: `REQUIRED SUB-SKILL: Use [skill-name]`

No formal YAML contracts. Natural language references between skills.

## Key Design Decisions

### 1. Entry Point

brainstorming recommends ux-design-agent when criteria met, with explicit user confirmation.

**Criteria for UX design:**
- User-facing interface (GUI, CLI, voice)
- Agentic system (AI acts on user's behalf)
- User model not obvious
- Complex interaction flows

### 2. No Separate Orchestrator

ux-design-agent serves as entry point AND coordinator. The UX flow is a pipeline, not a loop—simpler than subagent-driven-development's review cycles.

Future option: Add ux-research-agent or ux-testing-agent that orchestrates iterative feedback cycles on top.

### 3. Description Compliance

All descriptions follow CSO (Claude Search Optimization) from writing-skills:
- Trigger conditions only ("Use when...")
- No workflow summaries
- Under 200 characters

### 4. Artifact Compatibility

ux-design-agent outputs structured requirements to `docs/plans/YYYY-MM-DD-<feature>-requirements.md`

writing-plans accepts both:
- Loose design (from brainstorming)
- Structured requirements (from ux-design-agent)

### 5. Reference Files

Skills with heavy reference content keep separate files:
- approval-confirmation/references/
- failure-choreography/references/
- trust-calibration/references/
- ux-writing/references/, templates/

## Files to Create

### New Skills

```
.claude/skills/
├── ux-design-agent/
│   └── SKILL.md
├── delegation-oversight/
│   └── SKILL.md
├── approval-confirmation/
│   ├── SKILL.md
│   └── references/
│       ├── preview-patterns.md
│       ├── stakes-patterns.md
│       ├── consequence-patterns.md
│       ├── modification-patterns.md
│       ├── batch-patterns.md
│       └── timeout-patterns.md
├── failure-choreography/
│   ├── SKILL.md
│   └── references/
│       ├── partial-success-patterns.md
│       ├── state-preservation.md
│       ├── failure-explanation.md
│       ├── recovery-patterns.md
│       └── handoff-patterns.md
├── trust-calibration/
│   ├── SKILL.md
│   └── references/
│       ├── confidence-patterns.md
│       ├── uncertainty-patterns.md
│       ├── evidence-surfacing.md
│       ├── track-record.md
│       └── failure-recovery.md
├── ux-writing/
│   ├── SKILL.md
│   ├── references/
│   │   ├── accessibility-guidelines.md
│   │   ├── voice-chart-template.md
│   │   ├── content-usability-checklist.md
│   │   └── patterns-detailed.md
│   └── templates/
│       ├── error-message-template.md
│       ├── empty-state-template.md
│       └── onboarding-flow-template.md
└── design-principles/
    └── SKILL.md
```

### Modified Skills

```
.claude/skills/brainstorming/SKILL.md
└── Add "Evaluating UX Design Need" section
```

## Constraints

- Follow existing superpowers style (compact descriptions, flowcharts for decisions, "REQUIRED SUB-SKILL" pattern)
- No YAML handoff specifications
- No repeated team workflow diagrams (single source of truth in ux-design-agent)
- Reference files for heavy content only

## Success Criteria

1. All 7 skills pass writing-skills best practices review
2. brainstorming correctly recommends ux-design-agent when criteria met
3. ux-design-agent correctly routes to modality-specific skills
4. Agentic modality path flows through delegation → approval → failure
5. All paths terminate at writing-plans
6. Existing skill behavior unchanged
