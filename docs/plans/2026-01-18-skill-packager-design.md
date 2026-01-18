# Skill Packager Design

Build script to package `.claude/skills/` directories into `.skill` files for Claude Code web.

## Interface

```
scripts/build-skills.sh [skill-name...]
```

- No args: process all skills
- With args: process only named skills

## Output

```
dist/
  skill-name.skill    # zip packages
  .skill-checksums    # hash manifest (skill-name:sha256)
```

## Change Detection

Content-based hashing with sidecar manifest:

```bash
hash=$(find ".claude/skills/$skill" -type f -print0 \
  | sort -z \
  | xargs -0 sha256sum \
  | sha256sum \
  | cut -d' ' -f1)
```

Compare against stored hash in `.skill-checksums`. Rebuild only if different or missing.

## Packaging

```bash
(cd ".claude/skills/$skill" && zip -r - .) > "dist/${skill}.skill"
```

Clean internal paths (no `.claude/skills/` prefix).

## Orphan Detection

After building, scan `dist/*.skill` for packages without matching source. Prompt interactively:

```
Orphaned: old-skill.skill - delete? [y/N]
```

Default no. Removes from both dist/ and checksums if confirmed.

## Summary Output

```
Built: 3, Skipped: 30, Orphans: 1
```

## Constraints

- Strict mode: `set -euo pipefail`
- Pass shellcheck
- Follow wooledge practices
- Check zip exists before running
