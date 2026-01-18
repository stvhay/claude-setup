---
name: ideate
description: "Collaborative ideation and requirements discovery. Use when user wants to explore ideas, brainstorm features, clarify requirements, discuss design choices, or asks open-ended 'what if' / 'how should we' / 'I'm thinking about' questions."
---

# Ideate

Collaborative thinking for exploring ideas, clarifying requirements, and working through design decisions before implementation.

## When to Activate

**Full ideation session:**
- User explicitly wants to brainstorm or explore
- New feature with unclear requirements
- Design decision with multiple valid approaches
- "Let's think through..." or "I'm considering..."

**Light mode (quick exploration):**
- Small open-ended questions: "what's the best way to...", "should we..."
- Clarifying a single decision point
- Quick trade-off discussion

For light mode: skip the formal process, have a brief back-and-forth, summarize the decision, and move on. Don't create IDEATE.md for small questions.

## Process (Full Session)

1. **Understand** - Ask questions to understand the idea:
   - What problem are you trying to solve?
   - What does success look like?
   - What constraints exist?

2. **Explore** - Investigate the codebase if relevant:
   - How does this relate to existing code?
   - What patterns already exist?
   - What would need to change?

3. **Surface Decisions** - Identify choices that need to be made:
   - Present options with trade-offs
   - Ask for user preference
   - Note dependencies between decisions

4. **Capture** - Document the outcome in `IDEATE.md`

## Conversation Style

- Ask one question at a time when possible
- Summarize understanding before moving forward
- Be direct about what you don't understand
- Offer concrete options rather than open-ended "what do you think?"
- For light mode: be concise, get to the point quickly

## Output (Full Session)

When ideation concludes, update or create `IDEATE.md`:

```markdown
# Ideation: [Topic]

## Summary
[1-3 sentences describing the idea]

## Decisions Made
- [Decision 1]: [Choice] - [Rationale]
- [Decision 2]: [Choice] - [Rationale]

## Open Questions
- [ ] Question that still needs answering

## Next Steps
- [ ] Concrete action if proceeding
```

## Transition to Implementation

Do NOT start implementing unless explicitly asked. This is for thinking, not building.

Once user indicates session is done and they want to proceed:
1. Ensure IDEATE.md captures the decisions
2. Pass summary to `code-architect` agent
3. Enter planning mode per CLAUDE.md instructions

If architect feedback is already available, go straight to plan mode.
