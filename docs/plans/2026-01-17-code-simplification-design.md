# Code Simplification Skill - Design

## Problem Statement

Code accumulates unnecessary complexity during development. Manual simplification is tedious and often skipped. Automated simplification that breaks things erodes trust. This skill provides automated refactoring as a standard pipeline step, with intelligent failure handling and appropriate human oversight.

## User Model

- **Primary user:** Developer using Claude Code in a TDD/verification workflow
- **Context:** Just finished implementing, tests pass, ready to wrap up
- **Expertise:** High domain knowledge (wrote the code), high CLI familiarity, low initial trust in automated refactoring
- **Need:** Clean code without manual effort; reviewable results

## Success Criteria

- Simplifications never break tests (or are reverted if they do)
- User can review all changes at a glance (one-liner summaries)
- Failures provide actionable information, not just "reverted"
- Aggressive opportunities surfaced but not forced
- Trust builds over time through consistent, transparent behavior

## Pipeline Position

```
develop → verify (tests pass) → simplify → re-verify → complete
```

The skill runs automatically after verification passes. It inherits scope from the pipeline—whatever code was just built/modified.

## Core Principles

- No behavior changes (external API unchanged)
- No new features added
- Prefer deletion over modification
- Failures are signals, not just obstacles—analyze before reverting

## Simplification Patterns

### By Risk Level

| Category | Risk | Behavior | Summary Level |
|----------|------|----------|---------------|
| Deletion | Low | Auto-apply | One-liner |
| Flattening | Low-Moderate | Auto-apply | One-liner |
| Derivation | Moderate | Auto-apply | One-liner |
| Consolidation | Moderate-High | Auto-apply, atomic commit | Detailed |
| Structural | High | Flag for approval only | Detailed |

### Pattern Examples

**Deletion (Low):**
- Dead code, unused imports/variables
- Unreachable branches
- Commented-out code

**Flattening (Low-Moderate):**
- Unnecessary wrappers
- Redundant abstractions
- Over-nested conditionals
- Pointless indirection

**Derivation (Moderate):**
- Values stored that should be computed
- Redundant state
- Cached data derivable from source of truth

**Consolidation (Moderate-High):**
- Semantic duplicates
- Copy-paste variations
- Functions serving same intent with different implementations

**Structural (High):**
- Interface changes
- Abstraction redesign
- Architectural simplifications

### Language Adaptation

The skill is language-agnostic at its core. When working in a specific language/framework, it applies relevant refinements (e.g., React-specific patterns in TSX files, Go idioms in Go code). Detection is automatic based on file types in scope.

## Execution Loop

```
For each simplification opportunity (ordered by risk, low first):

  1. APPLY the change

  2. VERIFY (run tests)

  3. If PASS:
     - Keep the change
     - Log summary (one-liner or detailed based on category)
     - If consolidation: commit atomically
     - Continue to next

  4. If FAIL:
     - ANALYZE the failure:
       • Brittle test? → Flag for test improvement
       • Hidden coupling? → Flag as refactor opportunity
       • Inconsistency revealed? → Expand scope, attempt fix

     - If deeper issue found AND within scope:
       → Attempt to address it
       → Re-verify
       → If still fails: revert all, log as blocked, continue

     - If deeper issue exceeds scope (architectural, multi-module):
       → Revert change
       → Escalate for discussion (not just log)
       → Continue

     - If no deeper issue identified:
       → Revert change
       → Log skip reason
       → Continue

After all simplifications attempted:
  - Commit remaining low-moderate changes (if any uncommitted)
  - Present summary
```

### Consolidation Dependency Handling

Before applying each consolidation:
- Check if prior consolidations succeeded
- Check if this consolidation is still valid given prior changes
- If conflict detected: pause, escalate for decision, show both consolidations

## Commit Strategy

- **Low through Moderate:** Grouped in one commit
- **Consolidation:** Each gets its own atomic commit (easier to revert individually)
- **Structural:** Not committed—only surfaced as opportunities

## Output Format

```
## Simplification Complete

Applied 5 changes, blocked 1, skipped 1, 2 opportunities, 1 escalation.

### Applied
- Removed unused `formatTimestamp` import (utils/date.ts)
- Flattened nested conditional in validation logic (api/validate.ts)
- Replaced stored `isValid` flag with derived check (forms/submit.ts)

### Applied (consolidation) [commit: abc123]
- **Consolidated `parseConfig` and `loadConfig`** (config/loader.ts)
  - Before: Two functions with 80% identical logic
  - After: Single `loadConfig` with optional parse step
  - Scope: 2 files, 47 lines removed
  - Impact: 12 call sites updated
  - Confidence: High—identical error handling, same return type

### Blocked
- **Inline `ErrorWrapper` component** (components/Error.tsx)
  - Attempted: Inline trivial wrapper into parent
  - Failure: Test `snapshot.test.ts` relies on component identity
  - Analysis: Test is brittle—tests structure not behavior
  - Action taken: Reverted, flagged test for improvement
  - Recommendation: Refactor test to assert output, then retry

### Skipped
- Remove `debugLog` calls: Would change logging behavior in production

### Opportunities (require approval)
- **Structural:** `DataProcessor` class could be pure functions

### Escalations
- **Hidden coupling in `api/transform.ts`**: Dynamic string lookup
  in plugin system prevents safe removal. Audit needed.
```

### Summary Levels

**One-liner (Low-Moderate):**
- Action + target + location
- Example: "Removed unused `formatTimestamp` import (utils/date.ts)"

**Detailed (Consolidation, Blocked):**
- Before/after description
- Scope (files, lines)
- Impact (call sites affected)
- Confidence level with reasoning
- For blocked: attempted action, failure reason, analysis, recommendation

## Integration with Verification Pipeline

**Entry:** Triggered automatically after verification passes. Receives scope implicitly.

**During:** Each simplification triggers verification. Failures analyzed, not just reverted.

**Exit:** Final verification confirms nothing broke. Summary presented. Only then does completion claim happen.

**Failure mode:** If final verification fails after all simplifications, revert to pre-simplification state, report what went wrong, require human intervention.

## Delegation Design

### Autonomy Boundaries

| Situation | Agent Action |
|-----------|--------------|
| Low-Moderate simplification | Apply automatically |
| Consolidation | Apply automatically, atomic commit, detailed summary |
| Structural opportunity | Flag only, do not apply |
| Consolidation conflict | Pause, escalate for precedence decision |
| Scope expansion needed | Escalate for discussion |
| Deeper issue unaddressable | Surface as escalation in report |

### Escalation Categories

**Opportunities (end of report):**
Structural changes the agent identified but won't apply without approval.

**Escalations (end of report):**
Blockers that need resolution before simplification can proceed. Hidden coupling, architectural issues, test infrastructure problems.

**Inline pauses (during execution):**
Consolidation conflicts requiring precedence decision.

## Deferred to v2

- **Trust calibration:** Track approval/override rates, adapt autonomy based on user behavior
- **Re-delegation learning:** Confirm understanding when user overrides, learn preferences

## File Structure

```
.claude/skills/code-simplification/
├── SKILL.md                      # Main skill definition
└── references/
    ├── patterns-by-language.md   # Language-specific refinements
    └── failure-analysis.md       # How to analyze failures for deeper issues
```
