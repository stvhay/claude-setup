---
name: diagramming
description: Use when creating flowcharts, sequence diagrams, ER diagrams, state machines, architecture diagrams, Gantt charts, or any visual diagram. Also use for RDF/ontology visualization, property graphs, or DOT/Graphviz output.
allowed-tools: Read, Write, Edit
---

# Diagramming Skill

Generate professional diagrams with semantic coloring and accessibility compliance.

**Default**: Mermaid. Use DOT/Graphviz for pure network graphs or maximum layout control.

---

## Guide Router

Load **only ONE guide** per request. Match most specific keyword first:

| Priority | Keywords | Guide |
|----------|----------|-------|
| 1 | STAMP, STPA, CAST, control structure, safety control, hazard analysis | 20-STAMP-CONTROL-STRUCTURE-GUIDE.md |
| 2 | DOT, Graphviz, digraph, "pure network" | 19-DOT-GRAPHVIZ-GUIDE.md |
| 3 | RDF, ontology, SHACL, triple, linked data | 17-LINKED-DATA-GUIDE.md |
| 4 | Neo4j, Cypher, property graph | 18-PROPERTY-GRAPH-GUIDE.md |
| 5 | pie, mindmap, journey, C4, sankey, gitGraph | 08-OTHER-DIAGRAMS-GUIDE.md |
| 6 | kubernetes, docker, CI/CD, pipeline | 14-DEPLOYMENT-ARCHITECTURE-GUIDE.md |
| 7 | microservice, system architecture | 12-SOLUTION-ARCHITECTURE-GUIDE.md |
| 8 | async, event-driven, pub/sub, streaming | 13-DATA-FLOW-PATTERNS-GUIDE.md |
| 9 | design pattern, DDD, domain model | 15-TECHNICAL-DESIGN-PATTERNS-GUIDE.md |
| 10 | database, schema, entity, ERD | 06-ER-DIAGRAM-GUIDE.md |
| 11 | API, request/response, HTTP | 03-SEQUENCE-DIAGRAM-GUIDE.md |
| 12 | state machine, lifecycle, workflow state | 05-STATE-DIAGRAM-GUIDE.md |
| 13 | class, interface, inheritance, OOP | 04-CLASS-DIAGRAM-GUIDE.md |
| 14 | gantt, milestone, project schedule | 07-GANTT-GUIDE.md |
| 15 | theme, colors, classDef, accessibility | 09-STYLING-GUIDE.md |
| 16 | configuration, ELK options, layout | 16-CONFIGURATION-REFERENCE.md |
| 17 | flowchart, process, decision tree | 02-FLOWCHART-GUIDE.md |
| 18 | "what diagram should I use" | 10-USE-CASE-SCENARIOS.md |

**If unclear**: Ask user or suggest options from 10-USE-CASE-SCENARIOS.md.

---

## Essential Config

### ELK Layout (>10 nodes or dense connections)

```yaml
---
config:
  layout: elk
  elk:
    mergeEdges: false
    nodePlacementStrategy: BRANDES_KOEPF
---
```

### Theme (required for custom colors)

```yaml
%%{init: {"theme": "base", "themeVariables": {...}}}%%
```

**CRITICAL**: Only `base` theme supports customization. Only hex colors work.

---

## Accessibility

Always include for screen readers:

```mermaid
flowchart LR
    accTitle: Brief title
    accDescr: One-line description
```

---

## Colors

Load **09-STYLING-GUIDE.md** for Cagle semantic palette and classDef templates.

Quick reference: Infrastructure `#E3F2FD/#1565C0` | Service `#E8F5E9/#2E7D32` | Data `#FFF8E1/#F57F17`

---

## Quality Check

Before returning: correct type? ELK if complex? semantic colors? accessibility directives? valid syntax?
