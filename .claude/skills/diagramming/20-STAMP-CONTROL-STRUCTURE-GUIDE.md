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

[Content in Task 3]

## Causal Scenario Diagrams

[Content in Task 4]

## Common Patterns

[Content in Task 5]

## Validation Checklist

[Content in Task 6]
