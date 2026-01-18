# STAMP Control Structure Diagrams

Generate DOT/Graphviz diagrams for STAMP (Systems-Theoretic Accident Model and Processes) analysis.

## When to Use

This guide applies when creating diagrams for:
- STPA (System-Theoretic Process Analysis) - prospective hazard analysis
- CAST (Causal Analysis based on System Theory) - retrospective incident analysis
- STPA-Sec - security-focused control analysis
- Any control structure, feedback loop, or causal scenario diagram

## Quick Reference

| Diagram Type | Layout | Key Convention |
|--------------|--------|----------------|
| Control structure | `rankdir=TB` | Solid=control, dashed=feedback |
| Routing/decision | `rankdir=TB` | Diamond=decision, colored boxes=outcomes |
| Causal scenario | `rankdir=LR` | Octagon=hazard, red=loss |

---

## Control Structure Diagrams

The core STAMP visual. Shows hierarchical controllers, controlled processes, control actions, and feedback paths.

### Conventions

**Layout:**
- `rankdir=TB` — Top-to-bottom hierarchy (higher = more authority)
- `rank=same` — Force horizontal alignment for peer controllers

**Node Shapes:**

| STAMP Concept | DOT Shape | Attributes |
|---------------|-----------|------------|
| Controller (human) | `box` | `shape=box` |
| Controller (automated) | `box, rounded` | `shape=box style=rounded` |
| Controlled process | `ellipse` | `shape=ellipse` |
| Sensor/actuator | `parallelogram` | `shape=parallelogram` |

**Edge Styles:**

| STAMP Concept | DOT Style | Attributes |
|---------------|-----------|------------|
| Control action (↓) | Solid arrow | default |
| Feedback (↑) | Dashed arrow | `style=dashed` |
| Flawed/failed path | Red highlight | `color=red penwidth=2` |

### Minimal Example

```dot
digraph control_structure {
    rankdir=TB;

    // Nodes
    operator [shape=box label="Operator"];
    controller [shape=box style=rounded label="Controller"];
    process [shape=ellipse label="Process"];

    // Control actions (solid, downward)
    operator -> controller [label="setpoint"];
    controller -> process [label="actuate"];

    // Feedback (dashed, upward)
    process -> controller [style=dashed label="sensor"];
    controller -> operator [style=dashed label="display"];
}
```

### Full Example with Nested Subsystems

```dot
digraph control_structure {
    rankdir=TB;
    node [fontname="Arial" fontsize=10];
    edge [fontname="Arial" fontsize=9];

    // Organizational level
    regulator [shape=box label="Regulator"];

    // Company level (nested)
    subgraph cluster_company {
        label="Company";
        style=rounded;
        management [shape=box label="Management"];
        safety_dept [shape=box label="Safety Dept"];
    }

    // Operational level
    subgraph cluster_ops {
        label="Operations";
        style=rounded;
        supervisor [shape=box label="Supervisor"];
        operator [shape=box label="Operator"];
    }

    // Automated control
    controller [shape=box style=rounded label="PLC"];

    // Physical process
    process [shape=ellipse label="Process"];
    sensor [shape=parallelogram label="Sensor"];
    actuator [shape=parallelogram label="Actuator"];

    // Control actions
    regulator -> management [label="regulations"];
    management -> supervisor [label="procedures\nresources"];
    supervisor -> operator [label="instructions"];
    operator -> controller [label="setpoint"];
    controller -> actuator [label="command"];
    actuator -> process [label="force"];

    // Feedback paths
    process -> sensor [style=dashed];
    sensor -> controller [style=dashed label="measurement"];
    controller -> operator [style=dashed label="display"];
    operator -> supervisor [style=dashed label="status"];
    supervisor -> management [style=dashed label="reports"];
    management -> regulator [style=dashed label="compliance"];

    // Safety feedback
    safety_dept -> management [style=dashed label="audits"];
    operator -> safety_dept [style=dashed label="incidents"];
}
```

## Routing/Decision Diagrams

Methodology selection flowcharts for choosing between STPA, CAST, and STPA-Sec.

### Conventions

**Layout:** `rankdir=TB` (top-to-bottom flow)

**Node Shapes:**

| Concept | DOT Shape | Attributes |
|---------|-----------|------------|
| Entry point | `ellipse` | `shape=ellipse` |
| Decision | `diamond` | `shape=diamond` |
| Outcome | `box` | `shape=box style=filled fillcolor=<color>` |

**Outcome Colors:**

| Route | Fill Color | Meaning |
|-------|------------|---------|
| STPA | `lightgreen` | Prospective analysis |
| CAST | `lightgray` | Retrospective analysis |
| STPA-Sec | `lightblue` | Security analysis |

### Example: Methodology Router

```dot
digraph routing {
    rankdir=TB;
    node [fontname="Arial" fontsize=10];
    edge [fontname="Arial" fontsize=9];

    // Entry
    entry [shape=ellipse label="Safety/failure\nconcern raised"];

    // Decisions
    timing [shape=diamond label="Has loss already\noccurred?"];
    security [shape=diamond label="Adversarial\nthreat?"];

    // Outcomes
    cast [shape=box style=filled fillcolor=lightgray label="Use CAST\n(retrospective)"];
    stpa [shape=box style=filled fillcolor=lightgreen label="Use STPA\n(prospective)"];
    stpasec [shape=box style=filled fillcolor=lightblue label="Use STPA-Sec\n(security)"];

    // Flow
    entry -> timing;
    timing -> cast [label="yes"];
    timing -> security [label="no"];
    security -> stpasec [label="yes"];
    security -> stpa [label="no"];
}
```

## Causal Scenario Diagrams

Show how unsafe control actions lead to hazards through causal paths.

### Conventions

**Layout:** `rankdir=LR` (left-to-right causal flow: cause → effect)

**Node Shapes:**

| Concept | DOT Shape | Attributes |
|---------|-----------|------------|
| UCA (unsafe control action) | `box` | `shape=box style=filled fillcolor=lightyellow` |
| Causal factor | `box, rounded` | `shape=box style=rounded` |
| Hazard | `octagon` | `shape=octagon style=filled fillcolor=lightcoral` |
| Loss | `doubleoctagon` | `shape=doubleoctagon style=filled fillcolor=red fontcolor=white` |

**Subgraphs:** Use `cluster_` prefix to group related causal factors by category.

### Example: Causal Scenario Chain

```dot
digraph causal_scenario {
    rankdir=LR;
    node [fontname="Arial" fontsize=10];
    edge [fontname="Arial" fontsize=9];

    // Unsafe Control Action
    uca1 [shape=box style=filled fillcolor=lightyellow
          label="UCA-1:\nBrake not applied\nwhen obstacle detected"];

    // Causal factors (grouped)
    subgraph cluster_feedback {
        label="Feedback Failures";
        style=dashed;
        cf1 [shape=box style=rounded label="Sensor\noccluded"];
        cf2 [shape=box style=rounded label="Detection\ndelayed"];
    }

    subgraph cluster_model {
        label="Process Model Flaws";
        style=dashed;
        cf3 [shape=box style=rounded label="Obstacle not\nin model"];
    }

    // Hazard
    h1 [shape=octagon style=filled fillcolor=lightcoral
        label="H-1:\nVehicle enters\noccupied space"];

    // Loss
    l1 [shape=doubleoctagon style=filled fillcolor=red fontcolor=white
        label="L-1:\nCollision"];

    // Causal flow
    cf1 -> cf2 [label="causes"];
    cf2 -> cf3 [label="leads to"];
    cf3 -> uca1 [label="results in"];
    uca1 -> h1 [label="creates"];
    h1 -> l1 [label="leads to"];
}
```

### Example: Multiple UCAs to Single Hazard

```dot
digraph multi_uca {
    rankdir=LR;
    node [fontname="Arial" fontsize=10];

    // Multiple UCAs
    uca1 [shape=box style=filled fillcolor=lightyellow label="UCA-1:\nAlarm not provided"];
    uca2 [shape=box style=filled fillcolor=lightyellow label="UCA-2:\nShutdown too late"];
    uca3 [shape=box style=filled fillcolor=lightyellow label="UCA-3:\nWrong valve opened"];

    // Converging hazard
    h1 [shape=octagon style=filled fillcolor=lightcoral label="H-1:\nOverpressure"];

    // Loss
    l1 [shape=doubleoctagon style=filled fillcolor=red fontcolor=white label="L-1:\nExplosion"];

    // Paths
    uca1 -> h1;
    uca2 -> h1;
    uca3 -> h1;
    h1 -> l1;
}
```

## Common Patterns

### Horizontal Peers

Use `rank=same` for parallel controllers at the same authority level:

```dot
digraph peers {
    rankdir=TB;

    management [shape=box label="Management"];

    // Force same rank
    {rank=same; team_a; team_b; team_c}
    team_a [shape=box label="Team A"];
    team_b [shape=box label="Team B"];
    team_c [shape=box label="Team C"];

    process [shape=ellipse label="Process"];

    management -> team_a;
    management -> team_b;
    management -> team_c;
    team_a -> process;
    team_b -> process;
    team_c -> process;

    // Lateral coordination
    team_a -> team_b [style=dotted label="handoff" constraint=false];
    team_b -> team_c [style=dotted label="handoff" constraint=false];
}
```

### Nested Subsystems

Use `subgraph cluster_` for organizational boundaries:

```dot
digraph nested {
    rankdir=TB;

    subgraph cluster_org {
        label="Organization";
        style=rounded;

        subgraph cluster_mgmt {
            label="Management";
            style=dashed;
            exec [shape=box label="Executive"];
            ops_mgr [shape=box label="Ops Manager"];
        }

        subgraph cluster_field {
            label="Field";
            style=dashed;
            supervisor [shape=box label="Supervisor"];
            operator [shape=box label="Operator"];
        }
    }

    process [shape=ellipse label="Process"];

    exec -> ops_mgr;
    ops_mgr -> supervisor;
    supervisor -> operator;
    operator -> process;
}
```

### Highlighting Failures

Use red color and increased pen width for failed control paths:

```dot
digraph failure {
    rankdir=TB;

    controller [shape=box label="Controller"];
    process [shape=ellipse label="Process"];

    // Normal path
    controller -> process [label="command"];

    // Failed feedback (highlighted)
    process -> controller [style=dashed color=red penwidth=2
                          label="sensor\n(FAILED)" fontcolor=red];
}
```

### Bidirectional Control/Feedback

Show both directions on separate edges for clarity:

```dot
digraph bidirectional {
    rankdir=TB;

    operator [shape=box label="Operator"];
    system [shape=box style=rounded label="System"];

    // Separate edges, not bidirectional arrow
    operator -> system [label="commands"];
    system -> operator [style=dashed label="status"];
}
```

Avoid using `dir=both` — separate edges are clearer for STAMP analysis.

## Validation Checklist

Before returning a STAMP diagram, verify:

### Syntax
- [ ] Valid DOT syntax (no unclosed braces, quotes, brackets)
- [ ] All node IDs are valid (alphanumeric, underscores)
- [ ] All attributes use correct DOT syntax (`key=value` or `key="value"`)

### Layout
- [ ] `rankdir` matches diagram type (TB for control/routing, LR for causal)
- [ ] `rank=same` used for horizontal peers
- [ ] `cluster_` prefix on all subgraphs that need borders

### Semantic Styling
- [ ] Controllers use `box` (human) or `box style=rounded` (automated)
- [ ] Processes use `ellipse`
- [ ] Control actions are solid arrows (downward in TB layout)
- [ ] Feedback paths use `style=dashed` (upward in TB layout)
- [ ] Failed/flawed paths use `color=red penwidth=2`
- [ ] Hazards use `octagon` with `lightcoral` fill
- [ ] Losses use `doubleoctagon` with `red` fill and `white` text

### STAMP Semantics
- [ ] Hierarchy reflects authority (higher = more control authority)
- [ ] All feedback paths shown (even if missing/failed — mark with red)
- [ ] Control actions labeled with what is controlled
- [ ] Feedback labeled with what information flows back
