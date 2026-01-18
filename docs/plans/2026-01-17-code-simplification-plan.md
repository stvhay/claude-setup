# Code Simplification Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Create a skill that automates code simplification after tests pass, with intelligent failure analysis and appropriate human oversight.

**Architecture:** Single SKILL.md file with two reference documents. The skill guides Claude through an incremental apply-verify loop, categorizing simplifications by risk and handling failures as signals for deeper issues.

**Tech Stack:** Markdown skill definition (no code—this is prompt engineering for Claude Code)

---

## Task 1: Create Skill Directory Structure

**Files:**
- Create: `.claude/skills/code-simplification/SKILL.md`
- Create: `.claude/skills/code-simplification/references/patterns-by-language.md`
- Create: `.claude/skills/code-simplification/references/failure-analysis.md`

**Step 1: Create the directory structure**

```bash
mkdir -p .claude/skills/code-simplification/references
```

**Step 2: Verify structure exists**

Run: `ls -la .claude/skills/code-simplification/`
Expected: Empty directory with references/ subdirectory

**Step 3: Commit directory structure**

```bash
git add .claude/skills/code-simplification
git commit -m "chore: create code-simplification skill directory"
```

---

## Task 2: Write Main SKILL.md - Frontmatter and Overview

**Files:**
- Create: `.claude/skills/code-simplification/SKILL.md`

**Step 1: Write the frontmatter and overview section**

```markdown
---
name: code-simplification
description: Use after verification passes to automatically simplify code. Runs as standard pipeline step - applies low-risk changes automatically, flags structural changes for approval, analyzes failures for deeper issues.
---

# Code Simplification

## Overview

Automated refactoring after tests pass. Part of the standard development pipeline.

**Core principle:** Simplification that breaks tests is a signal, not just a failure. Analyze before reverting.

**Announce at start:** "I'm using the code-simplification skill to simplify the code you just verified."

## When to Use

This skill runs automatically after verification-before-completion passes. It operates on whatever code was just built/modified in the current session.

```
develop → verify (tests pass) → simplify → re-verify → complete
```

## Constraints

- No behavior changes (external API unchanged)
- No new features added
- Prefer deletion over modification
- Tests must pass after each change
```

**Step 2: Verify file created**

Run: `head -30 .claude/skills/code-simplification/SKILL.md`
Expected: Frontmatter and overview visible

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/SKILL.md
git commit -m "feat(code-simplification): add skill frontmatter and overview"
```

---

## Task 3: Write SKILL.md - Pattern Categories Section

**Files:**
- Modify: `.claude/skills/code-simplification/SKILL.md`

**Step 1: Append pattern categories section**

```markdown

## Pattern Categories

Simplifications are categorized by risk. Lower risk = more autonomy.

| Category | Risk | Behavior | Summary |
|----------|------|----------|---------|
| Deletion | Low | Auto-apply | One-liner |
| Flattening | Low-Moderate | Auto-apply | One-liner |
| Derivation | Moderate | Auto-apply | One-liner |
| Consolidation | Moderate-High | Auto-apply, atomic commit | Detailed |
| Structural | High | Flag for approval only | Detailed |

### Deletion (Low Risk)

- Dead code (functions/variables never called)
- Unused imports
- Unreachable branches
- Commented-out code

### Flattening (Low-Moderate Risk)

- Unnecessary wrapper functions/components
- Redundant abstraction layers
- Over-nested conditionals (flatten with early returns)
- Pointless indirection (A calls B which just calls C)

### Derivation (Moderate Risk)

- Stored values that should be computed (derived state)
- Redundant state synchronized manually
- Cached data easily derivable from source of truth

### Consolidation (Moderate-High Risk)

- Semantic duplicates (same intent, different implementation)
- Copy-paste variations with minor differences
- Functions that could be unified with a parameter

### Structural (High Risk - Flag Only)

- Interface changes
- Abstraction redesign
- Architectural simplifications
- Changes affecting multiple modules
```

**Step 2: Verify section appended**

Run: `grep -A 5 "## Pattern Categories" .claude/skills/code-simplification/SKILL.md`
Expected: Pattern table visible

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/SKILL.md
git commit -m "feat(code-simplification): add pattern categories with risk levels"
```

---

## Task 4: Write SKILL.md - Execution Loop Section

**Files:**
- Modify: `.claude/skills/code-simplification/SKILL.md`

**Step 1: Append execution loop section**

```markdown

## Execution Loop

Process simplifications incrementally, ordered by risk (low first).

```
FOR each simplification opportunity:

  1. APPLY the change

  2. VERIFY (run tests)

  3. IF tests PASS:
     - Keep the change
     - Log summary (one-liner or detailed based on category)
     - If consolidation: commit atomically with detailed message
     - Continue to next

  4. IF tests FAIL:
     - ANALYZE the failure (see @failure-analysis.md):
       • Brittle test? → Flag for test improvement
       • Hidden coupling? → Flag as refactor opportunity
       • Inconsistency revealed? → Attempt expanded fix

     - If deeper issue found AND addressable within scope:
       → Attempt to fix it
       → Re-verify
       → If still fails: revert all, log as BLOCKED, continue

     - If deeper issue exceeds scope (architectural, multi-module):
       → Revert change
       → Log as ESCALATION
       → Continue

     - If no deeper issue identified:
       → Revert change
       → Log as SKIPPED with reason
       → Continue

AFTER all opportunities processed:
  - Commit remaining low-moderate changes (grouped)
  - Run final verification
  - Present summary
```

### Consolidation Dependency Check

Before applying each consolidation, verify it's still valid:

1. Check if prior consolidations succeeded
2. Check if this consolidation conflicts with prior changes
3. If conflict detected: pause, show both, ask for precedence decision

### Ordering Rationale

Low-risk first because:
- Banks easy wins before attempting riskier changes
- Simpler changes are less likely to reveal deep issues
- If a consolidation fails, low-risk changes are already applied
```

**Step 2: Verify section appended**

Run: `grep -A 3 "## Execution Loop" .claude/skills/code-simplification/SKILL.md`
Expected: Section header and first lines visible

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/SKILL.md
git commit -m "feat(code-simplification): add execution loop with failure handling"
```

---

## Task 5: Write SKILL.md - Output Format Section

**Files:**
- Modify: `.claude/skills/code-simplification/SKILL.md`

**Step 1: Append output format section**

```markdown

## Output Format

Present results in this structure:

```
## Simplification Complete

Applied N changes, blocked N, skipped N, N opportunities, N escalations.

### Applied
- [One-liner per low-moderate change]

### Applied (consolidation) [commit: hash]
- **[Title]** (file.ts)
  - Before: [What existed]
  - After: [What it became]
  - Scope: [Files touched, lines changed]
  - Impact: [Call sites affected]
  - Confidence: [High/Medium/Low with reason]

### Blocked
- **[Title]** (file.ts)
  - Attempted: [What was tried]
  - Failure: [What went wrong]
  - Analysis: [Root cause found]
  - Action taken: [Reverted, flagged X]
  - Recommendation: [Next steps]

### Skipped
- [Change]: [Why it was skipped]

### Opportunities (require approval)
- **Structural:** [Description of potential change]

### Escalations
- **[Issue type] in [location]**: [Description and recommended action]
```

### Summary Levels

**One-liner (Low-Moderate):**
Action + target + location. Example: "Removed unused `formatTimestamp` import (utils/date.ts)"

**Detailed (Consolidation, Blocked):**
- Before/after description
- Scope (files, lines)
- Impact (call sites affected)
- Confidence level with reasoning
- For blocked: attempted action, failure, analysis, recommendation
```

**Step 2: Verify section appended**

Run: `grep "## Output Format" .claude/skills/code-simplification/SKILL.md`
Expected: Section header found

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/SKILL.md
git commit -m "feat(code-simplification): add output format specification"
```

---

## Task 6: Write SKILL.md - Delegation and Integration Sections

**Files:**
- Modify: `.claude/skills/code-simplification/SKILL.md`

**Step 1: Append delegation and integration sections**

```markdown

## Delegation Design

### Autonomy Boundaries

| Situation | Agent Action |
|-----------|--------------|
| Low-Moderate simplification | Apply automatically |
| Consolidation | Apply automatically, atomic commit, detailed summary |
| Structural opportunity | Flag only, do not apply |
| Consolidation conflict | Pause, ask for precedence decision |
| Scope expansion needed | Escalate for discussion |
| Deeper issue unaddressable | Surface as escalation in report |

### When to Pause

- Consolidation conflict detected (two changes affect same code)
- Structural change identified (requires approval)
- Final verification fails after all changes (requires investigation)

### When to Escalate (in report)

- Deeper issue found but exceeds simplification scope
- Hidden coupling prevents safe change
- Test infrastructure issues discovered

## Integration

### Pipeline Position

Runs after verification-before-completion, before completion claim.

```
verify → simplify → re-verify → complete
```

### Entry

Triggered automatically. Scope = files modified in current session.

### Exit

- Final verification must pass
- Summary presented
- Only then: completion claim allowed

### Failure Mode

If final verification fails after all simplifications:
1. Revert to pre-simplification state
2. Report what went wrong
3. Require human intervention

## References

- @patterns-by-language.md - Language-specific pattern refinements
- @failure-analysis.md - How to analyze test failures for deeper issues
```

**Step 2: Verify sections appended**

Run: `grep -E "## (Delegation|Integration)" .claude/skills/code-simplification/SKILL.md`
Expected: Both section headers found

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/SKILL.md
git commit -m "feat(code-simplification): add delegation design and pipeline integration"
```

---

## Task 7: Write patterns-by-language.md Reference

**Files:**
- Create: `.claude/skills/code-simplification/references/patterns-by-language.md`

**Step 1: Write the language patterns reference**

```markdown
# Patterns by Language

Language-specific refinements for simplification patterns. Auto-detect based on file extensions in scope.

## TypeScript / JavaScript

### Deletion
- Unused imports (check with `tsc --noEmit` or ESLint)
- Unused variables (especially in destructuring)
- Type-only imports that could use `import type`

### Flattening
- Unnecessary `async` on functions that don't await
- Promise chains that could be async/await (or vice versa if simpler)
- Nested ternaries → early returns or switch

### Derivation (React-specific)
- `useState` for values derivable from props or other state
- `useEffect` for synchronous computations (should be inline or useMemo)
- Context for shallow prop drilling (2-3 levels)

### Consolidation
- Duplicate utility functions across files
- Similar React components with minor prop differences
- Repeated validation logic

## Python

### Deletion
- Unused imports (check with `ruff` or `flake8`)
- Variables assigned but never read
- `pass` statements in non-empty blocks

### Flattening
- Nested `if` statements → combined conditions or early returns
- `try/except` blocks that just re-raise
- Unnecessary list comprehensions for simple iteration

### Derivation
- Cached properties that could use `@property`
- Instance variables recomputed from other instance variables

### Consolidation
- Similar functions differing only in one parameter
- Repeated dict/list transformations

## Go

### Deletion
- Unused imports (enforced by compiler, but check for underscore imports)
- Unused struct fields
- Empty `else` blocks

### Flattening
- Nested `if err != nil` → early returns
- Unnecessary type assertions when interface is sufficient

### Derivation
- Struct fields storing derived data that could be methods

### Consolidation
- Similar functions that could be generics (Go 1.18+)
- Repeated error wrapping patterns

## General (All Languages)

### Deletion
- Commented-out code (if >1 week old in git history)
- TODO comments with no issue reference
- Debug print statements

### Flattening
- Functions that just call another function with same args
- Classes with single method (could be function)
- Excessive null checks on values that can't be null

### Derivation
- Caches without invalidation (often a bug source)
- Flags that mirror other state

### Consolidation
- Copy-paste code blocks with minor variations
- Similar error messages that could be templated
```

**Step 2: Verify file created**

Run: `head -20 .claude/skills/code-simplification/references/patterns-by-language.md`
Expected: File header and TypeScript section visible

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/references/patterns-by-language.md
git commit -m "feat(code-simplification): add language-specific pattern reference"
```

---

## Task 8: Write failure-analysis.md Reference

**Files:**
- Create: `.claude/skills/code-simplification/references/failure-analysis.md`

**Step 1: Write the failure analysis reference**

```markdown
# Failure Analysis

When a simplification breaks tests, analyze before reverting. Failures are signals.

## Decision Tree

```
Test fails after simplification
│
├─ Is the test testing implementation details?
│  └─ YES → Brittle test. Flag for test improvement.
│
├─ Does the test rely on something the simplification removed?
│  ├─ Was that reliance intentional/documented?
│  │  └─ YES → Skip simplification. It's not dead code.
│  └─ NO → Hidden coupling. Flag for refactor opportunity.
│
├─ Does the failure reveal inconsistency elsewhere?
│  └─ YES → Expand scope. Attempt to fix inconsistency.
│
└─ None of the above
   └─ Revert and skip. Log the reason.
```

## Brittle Test Indicators

The test is likely brittle if it:

- Asserts on internal function calls (mock call counts)
- Snapshots internal structure rather than output
- Relies on specific execution order when order doesn't matter
- Tests private methods directly
- Breaks when refactoring without behavior change

**Action:** Flag test for improvement. Don't let brittle tests block valid simplifications.

**Report format:**
```
### Blocked
- **[Simplification]** (file.ts)
  - Attempted: [What was tried]
  - Failure: Test `test_name` relies on [internal detail]
  - Analysis: Test is brittle—tests [structure/implementation] not behavior
  - Action taken: Reverted, flagged test for improvement
  - Recommendation: Refactor test to assert [output/behavior], then retry
```

## Hidden Coupling Indicators

Hidden coupling exists if:

- Removing "unused" code breaks distant tests
- Function is called via string lookup / reflection
- Code is used by external consumers not in test suite
- Implicit contract exists (naming convention, file location)

**Action:** Flag as refactor opportunity. The coupling should be made explicit.

**Report format:**
```
### Escalations
- **Hidden coupling in `file.ts`**: `functionName` appears unused but is
  called via [mechanism] in [location]. Recommend: [make explicit / audit].
```

## Inconsistency Indicators

Inconsistency exists if:

- Simplification reveals two code paths doing same thing differently
- Removing duplication shows one path handles edge case the other doesn't
- Test failure exposes assumption that should be documented

**Action:** Expand scope. Attempt to fix the inconsistency (make both paths consistent).

**Report format (if fixed):**
```
### Applied
- Fixed inconsistent handling of [case] in [file.ts] (discovered during simplification)
```

**Report format (if unfixable):**
```
### Blocked
- **[Simplification]** (file.ts)
  - Attempted: [What was tried]
  - Failure: Revealed inconsistent handling of [case]
  - Analysis: [Path A] handles [X], [Path B] doesn't
  - Action taken: Reverted, inconsistency exceeds simplification scope
  - Recommendation: Unify handling of [case] before retrying
```

## Scope Expansion Limits

When attempting to fix a deeper issue, stay within scope if:

- Fix is in same file or directly related files
- Fix doesn't require interface changes
- Fix doesn't affect external API
- Fix can be verified by same test suite

Escalate (don't fix) if:

- Fix requires changes across multiple modules
- Fix requires architectural decisions
- Fix would change external behavior
- Fix requires test infrastructure changes

## Analysis Checklist

Before reverting any simplification failure:

1. [ ] Read the failing test—what is it actually asserting?
2. [ ] Is the assertion about behavior or implementation?
3. [ ] Is the "dead" code actually dead, or is there hidden usage?
4. [ ] Does the failure reveal something that should be fixed?
5. [ ] Is fixing it within simplification scope?

If you can't answer these questions, default to SKIP (not escalate).
```

**Step 2: Verify file created**

Run: `head -30 .claude/skills/code-simplification/references/failure-analysis.md`
Expected: File header and decision tree visible

**Step 3: Commit**

```bash
git add .claude/skills/code-simplification/references/failure-analysis.md
git commit -m "feat(code-simplification): add failure analysis reference"
```

---

## Task 9: Final Review and Cleanup

**Files:**
- Review: `.claude/skills/code-simplification/SKILL.md`
- Review: `.claude/skills/code-simplification/references/patterns-by-language.md`
- Review: `.claude/skills/code-simplification/references/failure-analysis.md`

**Step 1: Review complete skill file**

Run: `wc -l .claude/skills/code-simplification/SKILL.md`
Expected: ~150-200 lines

**Step 2: Verify all @ references are valid**

Run: `grep "@" .claude/skills/code-simplification/SKILL.md`
Expected: References to patterns-by-language.md and failure-analysis.md

**Step 3: Verify file structure**

Run: `find .claude/skills/code-simplification -type f`
Expected:
```
.claude/skills/code-simplification/SKILL.md
.claude/skills/code-simplification/references/patterns-by-language.md
.claude/skills/code-simplification/references/failure-analysis.md
```

**Step 4: Read through SKILL.md for consistency**

Verify:
- Frontmatter description matches skill behavior
- Pattern categories match design doc
- Output format matches design doc
- Delegation boundaries match design doc

**Step 5: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore(code-simplification): final review cleanup" --allow-empty
```

---

## Task 10: Update verification-before-completion Integration

**Files:**
- Modify: `.claude/skills/verification-before-completion/SKILL.md`

**Step 1: Read current verification skill**

Review the skill to find the appropriate place to add simplification integration.

**Step 2: Add integration note**

Add a section or note indicating that code-simplification runs after verification:

```markdown
## Integration with Code Simplification

After verification passes, the code-simplification skill runs automatically:

```
verify (this skill) → simplify → re-verify → complete
```

The simplification skill will:
- Apply low-risk changes automatically
- Flag structural changes for approval
- Analyze failures for deeper issues
- Re-run verification after changes

Only after simplification completes and final verification passes can completion be claimed.
```

**Step 3: Commit**

```bash
git add .claude/skills/verification-before-completion/SKILL.md
git commit -m "feat(verification): add code-simplification integration note"
```

---

## Summary

After completing all tasks, the skill will be:

1. **SKILL.md** - Main definition with:
   - Frontmatter (name, description)
   - Overview and constraints
   - Pattern categories with risk levels
   - Execution loop with failure handling
   - Output format specification
   - Delegation design
   - Pipeline integration

2. **references/patterns-by-language.md** - Language-specific refinements for:
   - TypeScript/JavaScript (including React)
   - Python
   - Go
   - General patterns

3. **references/failure-analysis.md** - How to analyze failures:
   - Decision tree
   - Brittle test indicators
   - Hidden coupling indicators
   - Inconsistency indicators
   - Scope expansion limits

4. **verification-before-completion/SKILL.md** - Updated with integration note
