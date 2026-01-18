# STAMP Diagramming Guide Design

## Problem

The diagramming skill generates DOT/Graphviz output but lacks STAMP-specific knowledge. STAMP skills embed Depict syntax, but the rendering pipeline uses DOT. Agents need to generate well-formed DOT diagrams that correctly represent STAMP concepts.

## Solution

Add a new guide to the diagramming skill: `20-STAMP-CONTROL-STRUCTURE-GUIDE.md`

Update the diagramming router to trigger on STAMP/STPA/CAST keywords.

## Scope

### In Scope

1. **Control structure diagrams** — Hierarchical controllers, controlled processes, control actions (down), feedback (up)
2. **Routing/decision diagrams** — Methodology selection flowcharts (STPA vs CAST vs STPA-Sec)
3. **Causal scenario diagrams** — UCA → hazard → loss chains

### Out of Scope

- Changes to STAMP skills (they keep Depict syntax)
- Depict→DOT translation tooling
- Mermaid output for STAMP

## DOT Conventions

### Control Structure Diagrams

**Layout:**
- `rankdir=TB` (top-to-bottom hierarchy matches control authority)
- `rank=same` for horizontal peer alignment

**Node shapes:**

| STAMP Concept | Shape | Rationale |
|---------------|-------|-----------|
| Controller (human) | `box` | Standard convention |
| Controller (automated) | `box, style=rounded` | Distinguishes from human |
| Controlled process | `ellipse` | Visually distinct from controllers |
| Sensor/actuator | `parallelogram` | Interface components |

**Edge conventions:**

| STAMP Concept | DOT Style |
|---------------|-----------|
| Control action (↓) | Solid arrow |
| Feedback (↑) | Dashed arrow (`style=dashed`) |
| Flawed/failed path | Red (`color=red penwidth=2`) |

### Routing/Decision Diagrams

**Layout:** `rankdir=TB`

**Node shapes:**

| Concept | Shape | Fill |
|---------|-------|------|
| Entry point | `ellipse` | none |
| Decision | `diamond` | none |
| Outcome | `box` | by type |

**Outcome colors (existing convention):**

| Route | Fill |
|-------|------|
| STPA (prospective) | `lightgreen` |
| CAST (retrospective) | `lightgray` |
| STPA-Sec (security) | `lightblue` |

### Causal Scenario Diagrams

**Layout:** `rankdir=LR` (left-to-right causal flow)

**Node shapes:**

| Concept | Shape | Fill |
|---------|-------|------|
| UCA | `box` | `lightyellow` |
| Causal factor | `box, style=rounded` | none |
| Hazard | `octagon` | `lightcoral` |
| Loss | `doubleoctagon` | `red, fontcolor=white` |

**Subgraphs:** Use `cluster_` prefix to group related causal factors.

## Guide Structure

```
# STAMP Control Structure Diagrams

## When to Use
## Quick Reference
## Control Structure Diagrams
  - Conventions
  - Minimal example
  - Full example with nested subsystems
## Routing/Decision Diagrams
  - Conventions
  - Template
## Causal Scenario Diagrams
  - Conventions
  - Example
## Common Patterns
  - Horizontal peers
  - Nested subsystems
  - Highlighting failures
  - Bidirectional edges
## Validation Checklist
```

Estimated: ~300-400 lines

## Deliverables

1. `.claude/skills/diagramming/20-STAMP-CONTROL-STRUCTURE-GUIDE.md`
2. Router update in `.claude/skills/diagramming/SKILL.md` (priority 1 for STAMP keywords)

## Integration

Router addition:

```markdown
| 1 | STAMP, STPA, CAST, control structure, safety control | 20-STAMP-CONTROL-STRUCTURE-GUIDE.md |
```
