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
