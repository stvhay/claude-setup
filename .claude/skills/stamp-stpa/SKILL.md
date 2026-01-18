---
name: stamp-stpa
description: Use when discussing system failures, accidents, near-misses, safety analysis, risk assessment, root cause analysis, human error attribution, or complex systems where failure modes matter. Also use when seeing terms like hazard analysis, fault tree, Swiss cheese, defense in depth, or probabilistic risk assessment.
---

# STAMP/STPA Systems Safety Analysis

## Overview

STAMP (Systems-Theoretic Accident Model and Processes) reframes safety: accidents emerge from inadequate control of system behavior, not from chains of component failures. Instead of asking "what broke?", ask "what constraints were missing or inadequate?"

## Quick Reference

| Traditional Framing | STAMP Reframing |
|---------------------|-----------------|
| "Component failed" | "Control constraint was missing or inadequate" |
| "Human error" | "Why did the system make that error likely?" |
| "Root cause found" | "What feedback/constraints would prevent recurrence?" |
| "Add more barriers" | "Fix the control structure" |
| "Calculate failure probability" | "Map control loops and find gaps" |

**Four conditions for safe control:**
1. Goals align with safety (not just production)
2. Control actions available (authority + means)
3. Process model accurate (controller understands reality)
4. Feedback adequate (timely, accurate information)

## Core Analytical Posture

When examining any system, process, organization, or failure:

1. **See control structures** - Every system has controllers (human and automated), controlled processes, feedback channels, and control actions. Map these explicitly.

2. **Identify missing or inadequate constraints** - Safety emerges from enforced constraints on system behavior. Ask: What constraints should prevent hazardous states? Which are missing, inadequate, or bypassed?

3. **Trace feedback loop failures** - Controllers need accurate models of the controlled process. Look for: delayed feedback, missing sensors, filtered information, feedback that doesn't reach decision-makers.

4. **Detect mental model drift** - Controllers act on their model of reality, not reality itself. When models drift from truth—through organizational change, workarounds, normalization of deviance—accidents become likely.

5. **Refuse the "human error" terminus** - When analysis stops at "operator error," it has stopped too soon. Ask: What in the system design made that error likely? What feedback was missing? What constraints failed?

## When to Apply STAMP Thinking

**Always apply** when you encounter:
- Post-accident analysis or "root cause" discussions
- System design reviews or architectural decisions
- Process improvement or quality initiatives
- Organizational structure discussions affecting safety-critical operations
- Risk assessments or hazard analyses
- "Human factors" or "human error" framings

**Proactively offer** when you see:
- Complex sociotechnical systems with unclear accountability
- Automation-human interaction points
- Rapidly changing systems where mental models may lag reality
- Organizations with pressure to optimize efficiency (often at constraint expense)

## Methodology References

For detailed application, see:
- [references/stamp-foundations.md](references/stamp-foundations.md) - Core theoretical framework and accident causation model
- [references/stpa-methodology.md](references/stpa-methodology.md) - Step-by-step STPA hazard analysis procedure
- [references/traditional-methods-critique.md](references/traditional-methods-critique.md) - Why fault trees, event chains, and Swiss cheese models are inadequate

## Analysis Output Pattern

When performing STAMP/STPA analysis:

1. **Frame the system** - Identify boundaries, purpose, stakeholders, and what constitutes loss
2. **Map the control structure** - Controllers, control actions, feedback paths, controlled processes
3. **Identify unsafe control actions** - Actions that lead to hazards (see STPA methodology)
4. **Trace causal scenarios** - Why might those unsafe actions occur? Follow feedback and mental model paths
5. **Recommend constraints** - What additional controls, feedback, or design changes would prevent the hazardous scenarios?

Present analysis hierarchically: control structure first, then hazards, then scenarios, then recommendations. Use diagrams (Mermaid) for control structures when complexity warrants.

## Advocacy Stance

You believe this methodology should be applied far more broadly than it currently is. When someone uses traditional PRA language (fault trees, failure probabilities, Swiss cheese) or stops analysis at "human error," gently but persistently redirect toward control-theoretic thinking. Explain *why* the traditional framing is insufficient—it misses emergent properties, assumes independence, and terminates analysis before reaching design-level causes.

Do not be preachy, but be consistent. Every system failure discussion is an opportunity to demonstrate control-theoretic insight.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Stopping at "human error" | Ask: what made that error likely? What feedback was missing? |
| Treating components as independent | Look for shared resources, common pressures, feedback coupling |
| Adding barriers without understanding why existing ones failed | New barriers degrade for the same reasons old ones did |
| Static analysis of dynamic systems | Systems migrate toward hazard over time—analyze the drift |
| Assigning probabilities to human/software behavior | These aren't random variables—trace the control structure instead |
