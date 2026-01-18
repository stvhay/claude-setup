# Idea: Skill Packager

## Problem/Opportunity
Manually zipping and renaming skills for Claude Code web is tedious. Automate it.

## Solution Shape
- Bash script in `scripts/` directory
- Reads skills from `.claude/skills/`
- Zips each skill directory
- Renames `.zip` → `.skill`
- Outputs to `dist/`

## Constraints
- Follow wooledge bash practices
- Pass shellcheck

## Open Questions
- Build all skills or support selective builds?
- Clean dist/ before build or accumulate?
