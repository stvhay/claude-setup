# Skill Porting Design: Research & Security Stack

**Date:** 2025-01-27
**Status:** Draft - Pending Approval

---

## Objective

Port 5 skills from PAI Packs to superpowers, creating a coherent research and security capability stack.

## Skills to Port

| Skill | Purpose | Source |
|-------|---------|--------|
| council | Multi-agent debate for decision-making | pai-council-skill |
| redteam | Adversarial analysis with multiple perspectives | pai-redteam-skill |
| research | Multi-source parallel research | pai-research-skill |
| osint | Open source intelligence with ethical framework | pai-osint-skill |
| recon | Security reconnaissance (passive/active) | pai-recon-skill |

## Capability Flow

```
research → osint → recon → council → redteam
   │         │        │        │         │
   │         │        │        │         └── Attack the conclusion
   │         │        │        └── Debate the findings
   │         │        └── Map infrastructure
   │         └── Investigate entities
   └── Gather information
```

## Adaptation Strategy

### Drop (PAI-specific)
- Voice notifications (`curl localhost:8888/notify`)
- PAI directory structure (`~/.claude/skills/CORE/...`)
- Customization paths (`SKILLCUSTOMIZATIONS/`)
- PAI-specific tool references

### Keep (Core value)
- Workflow methodology (phases, quality gates)
- Reference documentation (tool lists, ethical frameworks)
- Parallel agent patterns
- Authorization requirements

### Adapt (Memory)
Use project-local memory instead of global `~/.claude/MEMORY/`:

```
.superpowers/
├── research/           # Research findings
│   └── YYYY-MM-DD-topic/
├── investigations/     # OSINT work products
│   └── YYYY-MM-DD-target/
├── recon/             # Reconnaissance data
│   └── YYYY-MM-DD-domain/
└── scratch/           # Iterative work artifacts
```

**Future upgrade path:** When hook-based memory system is ported, these paths become symlinks or the skills detect and use global memory.

## Skill Structure (Per Skill)

```
.claude/skills/{skill-name}/
├── SKILL.md           # Main routing + triggers
├── references/        # Supporting documentation
│   └── *.md
└── workflows/         # Step-by-step procedures
    └── *.md
```

No TypeScript tooling in initial port - focus on methodology.

## Porting Approach Per Skill

### 1. council
**Source files:**
- `src/skills/Council/SKILL.md`
- `src/skills/Council/CouncilMembers.md`
- `src/skills/Council/RoundStructure.md`
- `src/skills/Council/OutputFormat.md`
- `src/skills/Council/Workflows/Debate.md`
- `src/skills/Council/Workflows/Quick.md`

**Adaptations:**
- Remove voice notification blocks
- Update output paths to `.superpowers/`

### 2. redteam
**Source files:**
- `src/skills/RedTeam/SKILL.md`
- `src/skills/RedTeam/Philosophy.md`
- `src/skills/RedTeam/Integration.md`
- `src/skills/RedTeam/Workflows/ParallelAnalysis.md`
- `src/skills/RedTeam/Workflows/AdversarialValidation.md`

**Adaptations:**
- Remove voice notification blocks
- Simplify agent references (no PAI agent factory)

### 3. research
**Source files:**
- `src/skills/Research/SKILL.md`
- `src/skills/Research/QuickReference.md`
- `src/skills/Research/UrlVerificationProtocol.md`
- `src/skills/Research/Workflows/*.md` (multiple)

**Adaptations:**
- Remove voice notifications
- Remove Fabric pattern references (or port separately)
- Update memory paths
- Simplify to core research modes (quick/standard/extensive)

### 4. osint
**Source files:**
- `src/skills/OSINT/SKILL.md`
- `src/skills/OSINT/EthicalFramework.md`
- `src/skills/OSINT/Methodology.md`
- `src/skills/OSINT/PeopleTools.md`
- `src/skills/OSINT/CompanyTools.md`
- `src/skills/OSINT/EntityTools.md`
- `src/skills/OSINT/Workflows/*.md`

**Adaptations:**
- Remove voice notifications
- Update memory paths for investigation artifacts
- Keep ethical framework intact (critical)

### 5. recon
**Source files:**
- `src/skills/Recon/SKILL.md`
- `src/skills/Recon/Workflows/PassiveRecon.md`
- `src/skills/Recon/Workflows/DomainRecon.md`
- `src/skills/Recon/Workflows/IpRecon.md`
- `src/skills/Recon/Workflows/NetblockRecon.md`
- `src/skills/Recon/Workflows/BountyPrograms.md`

**Adaptations:**
- Remove voice notifications
- Skip TypeScript tools initially (BountyPrograms.ts, etc.)
- Keep authorization model (passive vs active)
- Update output paths

## Implementation Order

1. **council** - Standalone, no dependencies on other ported skills
2. **redteam** - Standalone, pairs with council
3. **research** - Foundation for osint
4. **osint** - Uses research patterns
5. **recon** - Uses osint for entity context

## Success Criteria

- [ ] Each skill has SKILL.md that routes correctly
- [ ] Workflows reference `.superpowers/` for artifacts
- [ ] No broken PAI references remain
- [ ] Skills appear in available skills list
- [ ] Basic invocation works (manual test each)

## Future Work (Deferred)

1. **Hook-based memory system** - Auto-capture research artifacts
2. **TypeScript tooling** - Port CLI tools for recon, research
3. **Fabric patterns** - 242 specialized prompts (large undertaking)
4. **Agent factory** - Dynamic agent composition

## Open Questions

1. Should we create a `memory-conventions.md` reference doc that skills can include?
2. Do we want to namespace these under `security/` or keep flat?

---

## Appendix: Memory System (Future)

When ready to port full memory:

```
Phase 1: Hook Infrastructure
- Port pai-hook-system
- Create ~/.superpowers/memory/ structure

Phase 2: Basic Capture
- AutoWorkCreation hook
- Research artifact capture

Phase 3: Learning System
- Session harvesting
- Pattern synthesis
```

Estimated: 2-3 sessions focused work.
