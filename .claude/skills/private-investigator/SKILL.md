---
name: private-investigator
description: Ethical people-finding using public data. Use when finding a person, locating someone, reconnecting with lost contacts, skip tracing, reverse lookups, or identity verification.
---

# Private Investigator

Ethical people-finding using only public data sources.

## Ethical Boundaries

### GREEN ZONE (Allowed)
- Search public records (property, court, voter, business)
- Access publicly posted social media content
- Use people search aggregator sites
- Perform reverse lookups on public data
- Google dorking with public search operators

### RED ZONE (Never)
- Access data behind login walls without authorization
- Bypass authentication or security measures
- Use pretexting or impersonation
- Access private databases (credit, financial, medical)
- Stalk, harass, or intimidate subjects
- Access PI-only databases without license

## When to STOP

- Purpose shifts to harassment or stalking
- Subject has clearly opted out of contact
- Investigation requires illegal methods
- Requestor appears to have malicious intent

## Workflow Routing

| Trigger | Workflow |
|---------|----------|
| "find person", "locate someone", "reconnect with" | `Workflows/FindPerson.md` |
| "social media search", "find their profiles" | `Workflows/SocialMediaSearch.md` |
| "public records", "property records", "court records" | `Workflows/PublicRecordsSearch.md` |
| "reverse lookup", "who owns this phone/email" | `Workflows/ReverseLookup.md` |
| "verify identity", "confirm this is the right person" | `Workflows/VerifyIdentity.md` |

## Confidence Scoring

| Level | Criteria | Action |
|-------|----------|--------|
| **HIGH** | 3+ unique identifiers match across independent sources | Safe to contact |
| **MEDIUM** | 2 identifiers match, timeline consistent | Verify before contact |
| **LOW** | Single source or name-only match | Needs more investigation |
| **POSSIBLE** | Partial match, requires verification | Do not act without more data |

## Information Hierarchy

**Tier 1: Foundation Data**
- Full name (and variations/maiden names)
- Approximate age or date of birth
- Last known location
- Context (school, workplace, relationship)

**Tier 2: Primary Research**
- People search aggregators
- Social media presence scan
- Google dorking

**Tier 3: Deep Investigation**
- Public records searches
- Reverse lookups on discovered info
- Cross-platform correlation
- Associate/family network mapping

**Tier 4: Verification**
- Multi-source confirmation
- Timeline consistency check
- Photo verification
- Confidence scoring

## Key Data Sources

### People Search Aggregators
| Service | Type | Best For |
|---------|------|----------|
| TruePeopleSearch | Free | Best free option, fresh data |
| FastPeopleSearch | Free | Basic lookups, no signup |
| Spokeo | Freemium | Social media aggregation |
| BeenVerified | Paid | Comprehensive background |

### Public Records
- Property: County assessor/recorder sites, NETR Online
- Voter: State Secretary of State (varies by state)
- Court: PACER (federal), CourtListener (free), state portals
- Business: Secretary of State business search
- Professional: State licensing boards

### Social Media
- LinkedIn: Google x-ray searches, alumni networks
- Facebook: Mutual friends, groups, tagged photos
- Instagram/X/TikTok: Username patterns, location tags

### Reverse Lookup
- Phone: CallerID, NumLookup, USPhoneBook
- Email: Holehe, Epieos, Hunter.io
- Image: TinEye, Yandex, PimEyes
- Username: Sherlock, WhatsMyName, Namechk

## Examples

**Example 1: Find lost contact**
```
User: "Help me find my college roommate John Smith from Austin, class of 2005"
→ Invokes FindPerson workflow
→ Builds subject profile
→ Launches parallel agents across data sources
→ Cross-references findings
→ Returns report with HIGH/MEDIUM/LOW confidence
```

**Example 2: Reverse phone lookup**
```
User: "Who called from 512-555-1234?"
→ Invokes ReverseLookup workflow
→ Checks CallerID, NumLookup, people search sites
→ Returns owner name, location, carrier
```

**Example 3: Verify identity**
```
User: "I found 3 John Smiths in Austin - which one is my old roommate?"
→ Invokes VerifyIdentity workflow
→ Cross-references age, family, timeline, photos
→ Eliminates candidates, confirms match
```
