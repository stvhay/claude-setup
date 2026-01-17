---
name: hot-tub-maintenance
description: >
  Expert hot tub maintenance and water chemistry for Hotspring Flair with FreshWater Salt System.
  Triggers on any spa or hot tub question. Capabilities include calculating chemical additions
  for drain/refill or corrections, diagnosing water issues via guided interview, tracking readings
  and treatments and events in persistent log, and presenting dashboard automatically on load.
  Installation is 335 gal Flair in Berkeley Springs WV on outdoor deck with well water and softener.
---

# Hot Tub Maintenance - Hotspring Flair (Salt System)

**Skill Version:** 3.10 | **Dashboard:** v3.10 | **Design Basis:** v1.2

## Behavior on Load

**ALWAYS present the dashboard from `assets/dashboard.jsx` at the start of any conversation involving this skill.** Load it immediately without asking.

After presenting the dashboard:
- **Routine operations** (logging readings, checking status): Let user use dashboard; respond briefly or not at all.
- **Consultative requests** (diagnosis, procedure, explanation): Respond conversationally.

## Dashboard vs Agent Protocol

Dashboard handles deterministic operations. Agent handles judgment, diagnosis, and explanation.

### Dashboard Handles
- View status, log readings, see recommendations, log treatments
- Track aeration, maintenance reminders
- Log drain/fill and cartridge replacement
- Export/import data, view history

### Agent Handles
- Diagnosis when readings confusing or unexpected
- Troubleshooting from symptoms → See `references/troubleshooting.md`
- Step-by-step procedures → See `references/maintenance-procedures.md`
- Educational explanations, equipment issues, judgment calls

### Consultative Triggers
Respond conversationally when message contains:
- Questions: "Why", "How", "What does", "Should I", "Is it normal"
- Problems: "cloudy", "smells", "foam", "not working", "error"
- Procedures: "walk me through", "how do I", "step by step"

### Storage Context
Before consultative responses, read from storage for context:
```javascript
const readings = await storage.get('hottub:readings');
const treatments = await storage.get('hottub:treatments');
const events = await storage.get('hottub:events');
const meta = await storage.get('hottub:meta');
```
Reference data conversationally: "I see your pH has been 8.0+ for the last three readings..."

## Installation Constants

| Parameter | Value |
|-----------|-------|
| Model | Hotspring Flair (FLR) |
| Volume | 335 gallons |
| Location | Berkeley Springs, WV |
| Water source | Well with softener @ 2-3 gpg |
| Salt system | FreshWater, output level 6 recommended |

Actual maintenance dates stored in `hottub:meta`.

## Target Ranges (per FreshWater Salt System Manual)

| Parameter | Target | Range | Unit | Source |
|-----------|--------|-------|------|--------|
| Salt | 1,750 | 1,500–2,000 | ppm | Manual |
| pH | 7.4 | 7.2–7.8 | — | Manual |
| TA | 80 | 40–120 | ppm | Manual |
| FAC | 4 | 3–5 | ppm | Manual |
| CC | <0.5 | 0–0.5 | ppm | Industry std |
| CH | 50 | 25–75 | ppm | Manual |
| CYA | 0 | 0–50 | ppm | Dealer FAQ |
| Phosphates | <150 | 0–300 | ppb | Manual |
| Temp | — | —–104 | °F | Manual (max) |

**CYA Note**: Per Hotspring Dealer FAQ, **zero is preferred** for salt systems. CYA up to 50 ppm is acceptable. Above 100 ppm causes "chlorine lock" — partial drain required. CYA only decreases by dilution.

**Temperature Note**: Max 104°F is safety limit per manual. Lower temps are informational only.

For dosing formulas and derivations, see `references/chemistry-quick-ref.md` and `references/design-basis.md`.

## Reference Lookup

1. `references/chemistry-quick-ref.md` — targets, dosing formulas
2. `references/design-basis.md` — first-principles chemistry derivations
3. `references/troubleshooting.md` — decision trees, error codes
4. `references/maintenance-procedures.md` — drain/refill, filter, winterizing
5. `references/testing-procedures.md` — test equipment instructions
6. `references/ux-requirements-v3.md` — dashboard design spec, gap analysis
7. `references/REQUIREMENTS.md` — formal testable requirements

**PDFs** (only for content NOT in markdown):
- Warranty: `freshwatersaltsystemownersmanual.pdf`
- Electrical specs: `hotspringspaslimelightpredeliveryinstructions.pdf`
- Parts diagrams: Owner's manual PDFs

## Chemical Compatibility

**NEVER USE**: Trichlor, bromine/BCDMH, calcium hypochlorite, tablets/floaters, scented bleach, muriatic acid

**Compatible**: Sodium dichlor ✓, liquid sodium hypochlorite ✓, MPS oxidizer ✓

## Storage Keys

- `hottub:readings` — {date, pH, TA, CH, salt, FAC, TAC, ...}
- `hottub:treatments` — {date, chemical, amount, unit, notes}
- `hottub:events` — {date, type} (aeration, drain, cartridge)
- `hottub:meta` — {lastDrain, cartridgeInstall, cumulativeCYA}
- `hottub:conversations` — session summaries
- `hottub:lessons` — improvement tracking

**CYA Tracking**: Dashboard sums dichlor treatments after lastDrain (0.9 ppm/tsp). Resets on drain.

## Logging Protocol

- User provides readings → record to `hottub:readings`
- User reports treatment → record to `hottub:treatments`
- Maintenance performed → record to `hottub:events`
- Conversation end → summarize to `hottub:conversations`

## Diagnostic Interview

When user reports a problem:
1. **Symptoms**: What are you observing?
2. **Timeline**: When did it start? What changed?
3. **Readings**: pH, FAC, TAC, TA, salt
4. **Recent treatments**: What added in last 48h?
5. **Usage**: How many bathers? Shower before?

Then apply troubleshooting tree from `references/troubleshooting.md`.

## Continuous Improvement

Track mistakes, gaps, improvements in `hottub:lessons`.

**At session end**: Ask for feedback, log to lessons, summarize conversation.

**When 3+ open lessons**: Present to user, propose SKILL.md updates.

## Dashboard Development

**On dashboard changes**: Invoke jsx-dev skill (architect → player → coach), then tsx-simplifier for review.

Design direction: Utilitarian/industrial, 44px touch targets, mobile-first (2-col base grid), system dark/light mode.

See `references/ux-requirements-v3.md` for full spec.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-01 | Dashboard v3 restructure |
| 3.1 | 2026-01 | User testing fixes batch 1 |
| 3.2 | 2026-01 | Interaction states, coach review |
| 3.3 | 2026-01 | Technical scrub: CYA/FAC/temp aligned to manual, design-basis.md added |
| 3.4 | 2026-01 | Projection model: TAC tracks with FAC, recommendations use projected values |
| 3.5 | 2026-01 | Dashboard v3.8-3.9: Modal safety, multi-step fixes, clipboard backup |
| 3.10 | 2026-01 | Test sync, accessibility (focus traps, ARIA), history pagination, DRY refactor |
