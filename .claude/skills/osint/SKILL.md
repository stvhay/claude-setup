---
name: osint
description: Open source intelligence gathering. Use when OSINT, due diligence, background check, research person, company intel, investigate entities, or vet organizations.
---

# OSINT Skill

Open Source Intelligence gathering for authorized investigations.

## Workflow Routing

| Investigation Type | Workflow | Context |
|-------------------|----------|---------|
| People lookup | `workflows/PeopleLookup.md` | `references/PeopleTools.md` |
| Company lookup | `workflows/CompanyLookup.md` | `references/CompanyTools.md` |
| Entity/threat intel | `workflows/EntityLookup.md` | `references/EntityTools.md` |

## Trigger Patterns

**People OSINT:**
- "do OSINT on [person]", "research [person]", "background check on [person]"
- "who is [person]", "find info about [person]", "investigate this person"
-> Route to `workflows/PeopleLookup.md`

**Company OSINT:**
- "do OSINT on [company]", "research [company]", "company intelligence"
- "what can you find about [company]", "investigate [company]"
- "due diligence on [company]", "vet [company]", "is [company] legitimate"
-> Route to `workflows/CompanyLookup.md`

**Entity/Threat Intel:**
- "investigate [domain]", "threat intelligence on [entity]", "is this domain malicious"
- "research this threat actor", "check [domain]", "analyze [entity]"
-> Route to `workflows/EntityLookup.md`

## Authorization (REQUIRED)

**Before ANY investigation, verify:**
- [ ] Explicit authorization from client
- [ ] Clear scope definition
- [ ] Legal compliance confirmed
- [ ] Documentation in place

**STOP if any checkbox is unchecked.** See `references/EthicalFramework.md` for details.

## Resource Index

| File | Purpose |
|------|---------|
| `references/EthicalFramework.md` | Authorization, legal, ethical boundaries |
| `references/Methodology.md` | Collection methods, verification, reporting |
| `references/PeopleTools.md` | People search, social media, public records |
| `references/CompanyTools.md` | Business databases, DNS, tech profiling |
| `references/EntityTools.md` | Threat intel, scanning, malware analysis |

## Integration

**Automatic skill invocations:**
- **research** - Parallel researcher agent deployment
- **recon** - Technical infrastructure reconnaissance

**Agent fleet patterns:**
- Quick lookup: 4-6 agents
- Standard investigation: 8-16 agents
- Comprehensive due diligence: 24-32 agents

## File Organization

**Active investigations:**
```
.superpowers/investigations/YYYY-MM-DD_osint-[target]/
```

**Archived reports:**
```
.superpowers/investigations/archive/[target]-osint/
```

## Ethical Guardrails

**ALLOWED:** Public sources only - websites, social media, public records, search engines, archived content

**PROHIBITED:** Private data, unauthorized access, social engineering, purchasing breached data, ToS violations

See `references/EthicalFramework.md` for complete requirements.
