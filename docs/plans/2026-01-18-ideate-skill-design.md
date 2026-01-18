# Design: Ideate Skill (Revised)

## Summary

Separate ideation from brainstorming into a distinct upstream skill. Ideate handles divergent exploration of fuzzy problem spaces, producing a network of idea artifacts. Brainstorming-design remains convergent, picking up actionable ideas and producing full designs.

## Scope Boundary

| | ideate | brainstorming-design |
|---|--------|---------------------|
| **Question** | What should we build? | How should we build it? |
| **Explores** | Problem space, opportunities | Implementation approaches |
| **Outputs** | Idea files (the "what") | Full design spec (the "how") |

## Ideate Skill Design

### Purpose

Divergent exploration when:
- Problem space is fuzzy - need discovery to find shape of problem
- Multiple large-scope directions exist - need to sketch several before committing

### Output Format

Files at: `docs/{date}-{slug}-idea-{status}.md`

Where status is:
- `raw` - Just captured, minimal structure
- `refined` - Clear problem/opportunity statement, could benefit from more ideation
- `actionable` - Ready for brainstorming

Example filenames:
```
docs/2026-01-18-caching-layer-idea-raw.md
docs/2026-01-18-api-redesign-idea-refined.md
docs/2026-01-18-dashboard-rethink-idea-actionable.md
```

### File Content

Minimal structure - only what emerged:

```markdown
# Idea: [Short Name]

## Problem/Opportunity
[The core insight - might be all there is]

## Context
[Optional - constraints, related systems, user needs if they emerged]

## Open Questions
[Optional - things to explore further]

Related: [[other-idea-filename]]
```

Context and Open Questions are optional - sometimes you're in unknown-unknowns territory.

### Network of Ideas

Ideas can reference each other via wiki-style links:
```
Related: [[2026-01-18-api-redesign-idea-refined]]
```

This captures when ideas inform, depend on, or are alternatives to each other.

### Session Success

User-determined end, with visibility into what was produced:

> "This session produced 5 ideas: 2 raw, 2 refined, 1 actionable"

No minimum requirements - session ends when user says so.

### What Ideate Does NOT Do

- Make design decisions
- Pick which direction to pursue
- Automatically hand off to brainstorming
- Produce implementation details

## Brainstorming-Design Updates

Minimal change - add awareness of ideation convention:

> "If user references an idea file (`docs/*-idea-*.md`) or mentions prior ideation, read it and any linked ideas for context before proceeding with design."

Not prescriptive, not scanning. Just knows the convention if user points to it.

## Handoff

Manual. User:
1. Runs ideation session, produces idea files
2. Later, invokes brainstorming with reference to an actionable idea
3. Brainstorming reads idea + linked context, then proceeds with design

## Open Questions

- Should ideate have a "light mode" for quick single-idea capture? (Current ideate skill has this)
- File location: `docs/` root vs `docs/ideas/` subdirectory?
