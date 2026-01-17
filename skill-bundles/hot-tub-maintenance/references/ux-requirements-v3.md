# Hot Tub Maintenance Skill — UX Requirements Archaeology

**Version:** 2.0  
**Date:** 2026-01-17  
**Status:** Implementation Complete (v3.9)

**v2.0 Changes:**
- Added feedback items #36-38 (multi-step suppression, shock suppression, clipboard paste)
- CRITICAL FIX: Multi-step recommendations no longer disappear after logging step 1
- Added specification gap #14 (multi-step recommendation lifecycle)

---

## 1. Surface Requirement

"Clean up the hot tub maintenance agent to better fit user operational and maintenance needs."

---

## 2. Underlying Problem

The dashboard was built capability-first: tabs organized by implementation (Log, Calc, History, Status, etc.) rather than user intent. Result: user must reverse-engineer the designer's mental model to find what they need. The 8-tab structure serves the *technical spec*, not the *jobs to be done*.

---

## 3. Jobs to Be Done

| Job | Mode | Primary Surface | Frequency |
|-----|------|-----------------|-----------|
| **Check hot tub status** | Routine | Dashboard | Every session |
| **Log chemistry readings** | Routine | Dashboard | 2-3x/week |
| **Execute a correction** | Routine | Dashboard | After each out-of-spec reading |
| **Verify a correction** | Routine | Dashboard | After each treatment |
| **Diagnose chemistry problem** | Consultative | Conversation | When readings are confusing |
| **Diagnose non-chemistry problem** | Consultative | Conversation | Equipment issues |
| **Walk through procedure** | Consultative | Conversation | Drain/refill, maintenance |

**Key insight:** Dashboard is the executive summary and launching point for all routine operations. Agent handles consultative work requiring judgment, diagnosis, or explanation.

---

## 4. Current Workaround

User runs physical tests (strip + Hanna + meter), then must navigate multiple tabs to log values and see recommendations. When the dashboard doesn't fit the job, user initiates a development cycle to update the skill—which is not sustainable.

The physical workflow:
1. Grab multi-test strip, two Hanna vials, pH meter cap
2. Run tests in parallel (results arrive asynchronously)
3. Need a scratchpad to record values as they come
4. After entry: see status and recommendations

---

## 5. Success Criteria

**Measurable:**
- Time from "I have readings" to "I know what to do" < 60 seconds
- Zero tab-hunting during standard logging flow
- Dashboard loads and is useful within 2 seconds

**Experiential:**
- Dashboard is the "executive summary" of the hot tub at a glance
- "Let me cook" — enter data without interruption or guidance
- Recommendations are specific and actionable ("Add 3 TBSP bisulfate")
- One-tap treatment logging with opportunity to adjust actual vs. recommended
- Clear separation: dashboard = cockpit for routine ops; Claude = expert for diagnostics

---

## 6. Failure Modes

**Would fail even if users say they like it:**
- Dashboard tries to do consultative work (diagnosis, explanation) that Claude does better
- Recommendations are vague ("adjust pH") rather than specific ("add 3 TBSP bisulfate")
- Entry fields ordered by technical spec rather than physical test workflow
- Treatment logging requires navigating away from recommendations
- Maintenance reminders buried rather than surfaced

**Non-negotiable constraints:**
- Deterministic calculations stay in dashboard (fast, reliable, no API latency)
- Dashboard must work with wet hands outdoors (44px+ touch targets)
- Dark mode for evening use
- Persistent storage (survives sessions)
- Dashboard ALWAYS presented on skill invocation (it's the home base)

---

## 7. User Segments

| Segment | Frequency | Expertise | Key Need |
|---------|-----------|-----------|----------|
| Owner (primary) | 2-3x/week | Expert in chemistry, built the skill | Fast data entry, deterministic recs |
| Household member | Occasional | Novice | Clear status, guidance on request |
| Future self | After gap | Expert but rusty | Procedure reference, history lookup |

---

## 8. Scope Boundaries

**IN:**
- Dashboard restructure to match jobs (3-view architecture)
- Full 16-parameter test strip support
- Entry field groupings matching test workflow
- Inline treatment logging on recommendations
- Maintenance reminders surfaced (drain due, cartridge age)
- Agent/dashboard interaction protocol

**OUT:**
- New chemistry calculations (existing solver is correct)
- Mobile app (staying in artifact/web)
- Multi-user support

**ADJACENT (deferred):**
- Trend visualization / time-series charts
- Predictive alerts ("CYA will hit 80 in ~4 weeks")
- Calibration workflows for extended parameters

---

## 9. Test Parameters (Full List)

### 16-Way Test Strip Parameters

| Parameter | Unit | Frequency | Notes |
|-----------|------|-----------|-------|
| pH | — | Every test | Primary, also via Apera meter |
| Total Alkalinity | ppm | Every test | Primary |
| Free Chlorine | ppm | Every test | Primary, also via Hanna |
| Total Chlorine | ppm | Every test | Primary, also via Hanna |
| Total Hardness | ppm | Every test | Primary |
| Cyanuric Acid | ppm | Weekly | CYA tracking |
| Carbonate | ppm | Infrequent | Related to TA |
| Nitrate | ppm | Infrequent | Contamination indicator |
| Nitrite | ppm | Infrequent | Contamination indicator |
| Bromine | ppm | Infrequent | Not used in salt system |
| MPS | ppm | Infrequent | After MPS treatment |
| Copper | ppm | Infrequent | Metal contamination |
| Iron | ppm | Infrequent | Metal contamination |
| Lead | ppm | Infrequent | Metal contamination |
| Nickel | ppm | Infrequent | Metal contamination |
| Sulfite | ppm | Infrequent | Rare |

### Precision Instruments

| Parameter | Unit | Source | Notes |
|-----------|------|--------|-------|
| FAC | ppm | Hanna HI701 | High precision |
| TAC | ppm | Hanna HI711 | High precision |
| pH | — | Apera PH60 | High precision |
| Temp | °F | Apera / other | Environmental |
| Salt | ppm | Taylor K-2006-SALT | Titration |
| Phosphates | ppb | Taylor kit | Algae/salt system inhibitor |

---

## 10. Open Questions

~~1. Test result sequence — RESOLVED: User fills as results arrive; dashboard accepts any order~~

~~2. 16-parameter strip — RESOLVED: Full list captured above~~

~~3. Household member onboarding — RESOLVED: Dashboard provides clear status; Claude provides guidance on request~~

**Remaining:**
- Parameter groupings for entry form: confirm which infrequent parameters to show by default vs. collapse

---

# Proposed Design Direction

## Information Architecture

**Replace 8 tabs with 3 views:**

| View | Purpose | Contents |
|------|---------|----------|
| **Status** | Executive summary + routine ops | Current readings, staleness, aeration status, recommendations with treatment logging, maintenance alerts |
| **History** | Time-series reference | Past readings, treatments, events |
| **Settings** | Rarely-accessed admin | Export/import, clear data, cartridge/drain date management |

**"Status" is the default and always-visible view.** Dashboard ALWAYS presented on skill invocation. User lands here, sees current state, enters new readings, executes and logs treatments.

## Status View Components

### 1. Current State Summary
- All chemistry readings with last-tested timestamp
- Color-coded status (green/yellow/red)
- Stale readings visually flagged (>X days old)

### 2. Aeration Status (when active)
- Timer showing duration
- pH drift projection based on calibration
- "Stop Aeration" with logging flow

### 3. Recommendations Panel
- Specific, actionable: "Add 3 TBSP sodium bisulfate"
- Each recommendation has "Did it" button
- On click: modal to confirm or adjust actual amount
- Treatment logged to history automatically

### 4. Maintenance Alerts
- Days until recommended drain
- Salt cartridge age / days remaining
- Filter cleaning reminder

### 5. Reading Entry (expandable or always visible)
- Grouped input fields matching test workflow
- Save button → updates status, triggers recommendations recalc

## Entry Field Groupings

| Group | Parameters | Source | Default Visibility |
|-------|------------|--------|-------------------|
| **Primary** | pH, TA, FAC, TAC, CC*, CH, Salt | Strip + Hanna + Meter | Always shown |
| **Stability** | CYA, Carbonate, Phosphates | Strip + Taylor | Always shown |
| **Contaminants** | Nitrate, Nitrite, Copper, Iron, Lead, Nickel | Strip | Collapsed, expand on demand |
| **Unused** | Bromine, MPS, Sulfite | Strip | Collapsed |
| **Environmental** | Temp | Meter / thermometer | Always shown |

*CC (Combined Chlorine) is derived: CC = TAC - FAC. Auto-calculated and displayed when both values present. Target: 0, Max: 0.5 ppm. Above 0.5 triggers shock recommendation.

User can expand "Contaminants" and "Unused" groups when testing those parameters. Primary and Stability groups always visible.

## Dashboard/Agent Interaction Protocol

**Dashboard ALWAYS presented on skill invocation.** It is the home base.

**Dashboard responsibility:**
- Current state display (all readings, staleness, status colors)
- Data entry and storage
- Deterministic recommendations with specific doses
- Treatment logging (actual vs. recommended)
- Aeration tracking with pH drift projection
- Maintenance reminders

**Agent responsibility:**
- Diagnosis when readings are confusing or unexpected
- "Something is wrong and I don't know what" scenarios
- Procedure walkthroughs on request (drain/refill, filter cleaning, cartridge replacement)
- Explaining *why* (chemistry concepts, troubleshooting logic)
- Handling equipment/non-chemistry issues

**Interaction flow:**
1. User invokes skill → Dashboard presented
2. User performs routine ops in dashboard (log readings, execute treatments)
3. User asks Claude when something is off-script: "Why is my pH not responding?" / "Walk me through a drain" / "The water looks cloudy"
4. Claude responds conversationally, can reference dashboard data from storage
5. User returns to dashboard for routine ops

## Recommendation → Treatment Logging Flow

```
[Recommendation Card]
┌─────────────────────────────────────────┐
│ pH: 7.9 (high)                          │
│ TA: 85 (OK)                             │
│                                         │
│ Recommendation: Add 3.5 TBSP bisulfate  │
│ → Expected: pH 7.2, TA 67               │
│                                         │
│ [Did it ▼]                              │
└─────────────────────────────────────────┘

[On "Did it" click → Modal]
┌─────────────────────────────────────────┐
│ Log Treatment                           │
│                                         │
│ Chemical: Sodium Bisulfate              │
│ Recommended: 3.5 TBSP                   │
│ Actual: [3.5    ] TBSP  ← editable      │
│ Notes: [________________]               │
│                                         │
│ [Save]  [Cancel]                        │
└─────────────────────────────────────────┘
```

On Save:
- Treatment logged to `hottub:treatments`
- Reading marked as "treated" (visual indicator)
- Recommendation updates to show "Awaiting verification" state

---

# Implementation Phases

## Phase 1: Requirements Validation ✓
- User confirmed 3-view architecture
- Full 16-parameter list captured
- Dashboard-as-home-base model confirmed
- Recommendation → treatment logging flow defined

## Phase 2: Dashboard Restructure
- Collapse to 3-view architecture (Status, History, Settings)
- Implement Status view components:
  - Current readings with staleness indicators
  - Aeration status with pH projection
  - Recommendations panel with inline treatment logging
  - Maintenance alerts
- Entry field groupings (Primary, Stability, Contaminants collapsed, Environmental)
- Preserve existing calculation logic (solver, dosing)

## Phase 3: Agent Behavior Update
- Update SKILL.md: "ALWAYS present dashboard on load" (confirmed, no change needed)
- Define consultative triggers (when user asks diagnostic/procedural questions)
- Ensure agent can read from dashboard storage for context
- Remove procedural UI from dashboard (Fill wizard → conversational)

## Phase 4: Skill Coach Review
- Validate instruction adherence
- Check for conflicts between dashboard and agent responsibilities
- Confirm triggering description still accurate
- Verify storage key consistency

---

# Appendix: Current vs. Proposed Tab Mapping

| Current Tab | Disposition | New Location |
|-------------|-------------|--------------|
| Status | Merge | Status view (current readings + status cards) |
| Test | Eliminate | Agent handles test procedures conversationally |
| Fill | Eliminate | Agent handles drain/refill conversationally |
| Calc | Merge | Status view (embedded in recommendations) |
| Log | Merge | Status view (entry form + treatment logging) |
| History | Keep | History view |
| Lessons | Eliminate | Agent handles via conversation + storage |
| Data | Rename | Settings view |

---

# Appendix: Status View Wireframe (Text)

```
┌──────────────────────────────────────────────────────────────┐
│  🛁 Hot Tub Status                    [☀️/🌙] [History] [⚙️]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ READINGS ──────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │  pH      7.4  ✓   TA     85  ✓   FAC   3.1  ✓          │ │
│  │  2h ago          2h ago          2h ago                 │ │
│  │                                                         │ │
│  │  TAC     3.3  ✓   CC    0.2  ✓   CH     48  ✓          │ │
│  │  2h ago          (calc)          5d ago                 │ │
│  │                                                         │ │
│  │  Salt   1720  ✓   CYA    42  ✓   Phos  120  ✓          │ │
│  │  5d ago          12d ago         12d ago                │ │
│  │                                                         │ │
│  │  Temp    101  ✓                                         │ │
│  │  2h ago                                                 │ │
│  │                                                         │ │
│  │  [▶ Contaminants]  [▶ Other]                           │ │
│  │                                                         │ │
│  │  [+ Log New Readings]                                   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ AERATION ──────────────────────────────────────────────┐ │
│  │  Not aerating                              [Start]      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ RECOMMENDATIONS ───────────────────────────────────────┐ │
│  │                                                         │ │
│  │  ✓ All parameters in range                              │ │
│  │                                                         │ │
│  │  (When out of spec:)                                    │ │
│  │  ┌───────────────────────────────────────────────────┐  │ │
│  │  │ pH 7.9 (high) • TA 85 (OK)                        │  │ │
│  │  │ Add 3.5 TBSP sodium bisulfate                     │  │ │
│  │  │ → Expected: pH 7.2, TA 67                         │  │ │
│  │  │                                    [Did it ▼]     │  │ │
│  │  └───────────────────────────────────────────────────┘  │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ MAINTENANCE ───────────────────────────────────────────┐ │
│  │  Cartridge: 45 days remaining                           │ │
│  │  Last drain: 23 days ago (339 until recommended)        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Hotspring Flair • 335 gal • FreshWater Salt • v3.0        │
└──────────────────────────────────────────────────────────────┘
```

---

# Appendix: Storage Schema Updates

No changes to storage keys required. Existing schema supports:
- `hottub:readings` — will include all 16 parameters (nulls for untested)
- `hottub:treatments` — treatment logging with actual amounts
- `hottub:events` — aeration events, maintenance events
- `hottub:meta` — cartridge install, last drain, etc.

New fields in readings to support extended parameters:
```javascript
{
  date: ISO8601,
  // Primary (entered)
  ph: number | null,
  ta: number | null,
  fac: number | null,
  tac: number | null,
  ch: number | null,
  salt: number | null,
  // Primary (derived, not stored)
  // cc = tac - fac (calculated on display)
  // Stability
  cya: number | null,
  carbonate: number | null,
  phosphates: number | null,  // ppb, Taylor kit
  // Environmental
  temp: number | null,
  // Contaminants
  nitrate: number | null,
  nitrite: number | null,
  copper: number | null,
  iron: number | null,
  lead: number | null,
  nickel: number | null,
  // Unused (but trackable)
  bromine: number | null,
  mps: number | null,
  sulfite: number | null
}
```

---

# User Testing Results (v3.3)

User testing of v3.0 implementation revealed 21 feedback items. Additional testing of v3.2 revealed 3 specification gaps. All have been addressed.

## Feedback Resolution

| # | Issue | Resolution | Version |
|---|-------|------------|---------|
| 1, 12 | No drain/fill or cartridge actions on dashboard | MaintenancePanel with action buttons and modals | v3.1 |
| 2 | Treatment logging didn't update display | `hasPendingTreatment` derived state; "awaiting verification" banner | v3.1 |
| 3 | Unclear if projections were individual or combined | Clarified: "After all additions: pH X, TA Y" | v3.1 |
| 4 | Match maintenance workflow to recommendations | Inline action buttons on maintenance panel | v3.1 |
| 5 | Mobile responsiveness broken | `grid-cols-2 sm:grid-cols-4 md:grid-cols-5` | v3.1 |
| 6, 7, 8 | No recommendations for CC/CYA out of spec | Added: CC shock, CYA info/warning/drain-required | v3.1 |
| 9 | Aeration workflow oversimplified | Start modal with optional pH; stop modal captures end pH | v3.1 |
| 10 | Dark/light header inconsistency | Header follows theme | v3.1 |
| 13 | History not truly chronological | Unified history: readings + treatments + events sorted by date | v3.1 |
| 14 | Drain/fill and cartridge not in history | Events logged to `hottub:events` with type indicator | v3.1 |
| 15 | Redundant model display | Footer only | v3.1 |
| 16 | Units missing in readings log | Units shown in history and entry panels | v3.1 |
| 17 | Date format preference | YYYY/MM/DD HH:MM AM/PM | v3.1 |
| 18 | Export/clear no feedback | Status indicators added | v3.1 |
| 19 | Click interaction guidelines not implemented | 150ms transitions, cubic-bezier easing, active scale, focus-visible rings, modal fade | v3.2 |
| 20 | Contaminants/Other layout squashed | Block containers for collapsible sections | v3.1 |
| 21 | Bright blue buttons on light theme | Changed to slate-700 | v3.1 |
| 22 | CYA card shows "—" when estimate available | CYA displays `estimatedCYA` with "~est" label when no tested value | v3.3 |
| 23 | Aeration stop gives no immediate feedback | Aeration panel shows last event (time ago, duration, pH change) | v3.3 |
| 24 | Treatment logging doesn't show projected values | Reading cards show projected values with strikethrough + blue ring + "⏳ projected" | v3.3 |
| 25 | CYA target range incorrect (showed 0 as red) | Corrected per Hotspring: 0 preferred, 0-50 acceptable, >100 chlorine lock | v3.4 |
| 26 | FAC target/min incorrect (1-5 instead of 3-5) | Corrected per Hotspring: target 4, min 3, max 5 ppm | v3.5 |
| 27 | Low temperature flagged as warning | Temperature is informational; only >104°F (safety) triggers red | v3.6 |
| 28 | Log button persists after treatment logged | Recommendations use projected values; auto-suppress when projected in-spec | v3.7 |
| 29 | Dichlor doesn't update TAC projection | TAC projection added (TAC = FAC + CC; both rise equally with dichlor) | v3.7 |
| 30 | Shock dichlor doesn't update projections | Same chemicalId='dichlor' handles shock; projection now includes TAC | v3.7 |
| 31 | "+ Log New" button visual inconsistency | Changed to chevron indicators (▼/▲) with hover state for toggle affordance | v3.8 |
| 32 | Dichlor SHOCK not projecting FAC/TAC | Fixed chemicalId lookup to match base name ("Dichlor") not full name | v3.8 |
| 33 | Click outside modal logged treatment | All modals now cancel on backdrop click; content area stops propagation | v3.8 |
| 34 | Clear All Data not clearing | Enhanced with explicit storage.set, error handling, and status feedback | v3.8 |
| 35 | Export destination unclear | Split into Download + Copy to Clipboard buttons with explicit status messages | v3.8 |
| 36 | Step 2 of multi-step recommendations disappears | Solver now triggers when TA >5 below target (threshold 75), not >10 (threshold 70) | v3.9 |
| 37 | Shock recommendation persists after shock logged | Tracks `_shockLogged` flag; suppresses when shock already in pending treatments | v3.9 |
| 38 | Copy to clipboard needs paste import | Added "Paste" button symmetric with "Copy" for clipboard-based backup flow | v3.9 |
| 39 | Clear All Data immediately shows "Cancelled" | window.confirm() blocked in sandbox; replaced with custom confirmation modal | v3.9 |

## Specification Gaps Discovered

User testing revealed requirements not fully captured in original spec:

### 1. CYA Tracking Logic
**Original**: CYA accumulates from all dichlor treatments.  
**Correction**: CYA accumulator resets on drain. Implementation filters treatments to only those after `meta.lastDrain`.

### 2. Unified History
**Original**: "Past readings, treatments, events" — implied but not explicit.  
**Clarification**: Single unified list sorted by date descending, with type indicators (📊 Reading, 💊 Treatment, 🔧 Maintenance, 💨 Aeration).

### 3. Maintenance as Dashboard Actions
**Original**: Maintenance section shows alerts; Settings has date inputs.  
**Clarification**: Maintenance section MUST include action buttons for common operations with modal flows.

### 4. Aeration Calibration Flow
**Original**: Aeration panel with timer and pH projection.  
**Clarification**: Start MUST allow optional starting pH input for accurate calibration.

### 9. Recommendation Suppression After Treatment
**Original**: "Awaiting verification" banner shown when treatment logged.  
**Gap**: Recommendations regenerated from `latestReading` on every render; did not account for projected values. Result: Log button persisted on recommendation cards even after treatment logged, confusing user about whether additional action needed.

**Decision**: Recommendations use projected values when available. If projected value is in-spec, recommendation is suppressed.

**Requirement**: PROJ-007 states "Adjustment recommendations SHALL account for projected values." Implementation gap: recommendations were computed from raw `latestReading`, not from projected post-treatment state.

**Resolution**: 
- `getValue()` helper returns projected value if available, otherwise latest reading
- Recommendation generation uses `getValue()` for all threshold checks
- FAC/CC/pH/TA/salt recommendations auto-suppress when projected values are in-spec

**Trade-offs**:
- Pro: Clear state machine (out-of-spec → treated → awaiting verification)
- Pro: No confusing duplicate "Log" buttons
- Con: If projection is wrong, user might miss re-treatment need (mitigated by "retest to verify" guidance)

### 10. TAC Projection Completeness
**Original**: Dichlor adds FAC (+1.2 ppm/tsp) and CYA (+0.9 ppm/tsp).  
**Gap**: TAC was not projected. User reported "CC and TAC do not update" after logging dichlor.

**Chemistry clarification**: TAC = FAC + CC. When dichlor is added, all added chlorine is initially free available chlorine (FAC). Therefore TAC must increase by the same amount as FAC. CC is unchanged by dichlor addition; CC only increases when FAC reacts with contaminants to form chloramines.

**Resolution**: Dichlor projection now includes +1.2 ppm TAC per tsp alongside FAC.

**Note on CC**: CC not updating is *correct behavior*. Dichlor adds free chlorine, not combined chlorine. However, the shock scenario is chemically more complex—shocking oxidizes combined chlorine to nitrogen gas, which *should* reduce CC. This is a known model limitation documented in design-basis.md.

### 11. Modal Dismissal Semantics
**Original**: Modals have Cancel button and Escape key handler.  
**Gap**: Clicking backdrop outside modal content was not handled. In TreatmentModal, this triggered a React re-render that could cause unexpected state changes.

**Decision**: All modals cancel on backdrop click. Modal content area calls `e.stopPropagation()` to prevent accidental dismissal.

**Requirement**: Standard modal behavior—backdrop click = cancel, not confirm.

### 12. ChemicalId Resolution for Recommendation Variants
**Original**: Recommendations specify `chemical` name; TreatmentModal resolves to `chemicalId` for projection matching.  
**Gap**: "Dichlor (SHOCK)" recommendation didn't match "Dichlor (chlorine)" in CHEMICALS array because `includes()` check was in wrong direction.

**Decision**: Match by extracting base chemical name (before parenthetical) and checking if recommendation contains it.

**Resolution**: `const baseName = c.name.split('(')[0].trim().toLowerCase()` then `rec.chemical?.toLowerCase().includes(baseName)`

### 13. Export vs Clipboard Expectations
**Original**: Export button downloads a JSON file.  
**Gap**: User expected data in clipboard after clicking export. Download may not be visible depending on browser/environment.

**Decision**: Split into two explicit actions: Download (file) and Copy (clipboard). Show explicit status feedback for each.

### 14. Multi-Step Recommendation Lifecycle (CRITICAL)
**Original**: Recommendations regenerate from scratch after each treatment is logged.  
**Gap**: When solver returns a 2-step solution (e.g., bisulfate + bicarbonate), logging step 1 causes step 2 to disappear because:
1. Projected values update (e.g., TA drops from 100 to 73)
2. Recommendations regenerate using projected values
3. TA 73 is "in spec" (40-120 range) AND above the trigger threshold
4. Solver isn't called
5. Bicarbonate recommendation never appears
6. User is left with TA 73 instead of target 80

**Root cause**: Initial fix used threshold of 10 below target (80-10=70), but projected TA=73 > 70. The solver's own threshold for recommending bicarbonate is `deltaTa > 5`, so our trigger threshold must match.

**Decision**: Trigger solver when TA is >5 ppm below operational target (threshold = 75).

**Implementation**:
```javascript
const taBelowTarget = ta != null && ta < OPERATIONAL_TARGETS.ta - 5;
// With ta=73: 73 < 75 = true → solver called
// Solver sees deltaTa = 80-73 = 7 > 5 → recommends bicarbonate
```

**Verification**: With starting pH=8, TA=100:
- After bisulfate: pH=7.2, TA=73 (projected)
- Threshold check: 73 < 75 ✓ → solver called
- Solver: deltaTa=7 > 5 → returns bicarbonate 1 TBSP
- Bicarbonate recommendation appears ✓

**Trade-offs**:
- Pro: Step 2 of multi-step solutions now persists until logged
- Pro: Threshold matches solver's internal logic
- Con: May generate TA recommendations when user is content with "close enough"

### 5. Pending Treatment State
**Original**: "Recommendation updates to show 'Awaiting verification' state"  
**Clarification**: General "treatment pending" banner is sufficient.

### 6. Out-of-Spec Recommendations
**Original**: Recommendations for pH/TA/FAC/salt.  
**Clarification**: MUST also provide CC shock recommendation, CYA warnings.

### 7. Projection Display After Treatment Logging

**Original**: "#2 resolved with `hasPendingTreatment` banner showing 'awaiting verification' state."  
**Gap**: Notification pattern addresses *system acknowledgment* but not *state projection*. User expectation: "I added pH down → I expect pH to be lower now (projected), pending verification."

**Decision**: After logging a treatment with calculable effects, reading cards show projected values with "projected" styling until next test.

**Requirement**: Job #4 "Verify a correction" — user needs to know expected outcome to validate that correction worked.

**Alternatives considered**:
- A. Notification only ("treatment logged, retest to verify") — IMPLEMENTED v3.1
- B. Projected values on cards with visual distinction — IMPLEMENTED v3.3
- C. Separate "projected state" panel below readings — rejected (adds navigation)

**Trade-offs**:
- Pro: Immediate feedback closes the action loop
- Pro: Sets expectation for verification test
- Con: Risk of projection/actual confusion
- Con: Projections are estimates; chemistry doesn't always behave linearly

**Validation**:
- Visual distinction (strikethrough + blue ring + "⏳ projected" label) provides clear actual/projected separation
- Projections clear automatically when new reading is logged
- User testing: Does user understand projected ≠ measured?

### 8. CYA Display Source

**Original**: CYA card displayed last tested value; estimatedCYA shown only in Maintenance panel.  
**Gap**: CYA card showed "—" when no tested value existed, even though system had valid estimate from dichlor accumulation.

**Decision**: CYA card displays `estimatedCYA` (accumulated from dichlor since last drain) when no tested value exists, labeled "~est".

**Requirement**: CYA tracking is critical for drain planning (>100 = chlorine ineffective). User needs running estimate between tests.

**Alternatives considered**:
- A. Show "—" when no tested value — PREVIOUS BEHAVIOR
- B. Show estimated value labeled "~est" — IMPLEMENTED v3.3
- C. Show both tested and estimated always — rejected (clutters small card)

**Trade-offs**:
- Pro: CYA card is always actionable (shows best available data)
- Pro: "~est" label prevents confusion with tested value
- Con: Estimated CYA may drift from actual (e.g., splash-out dilution)

**Validation**:
- Estimation math is correct (0.9 ppm CYA per tsp dichlor)
- Label clearly distinguishes from tested values
- User can always test CYA to override estimate

### 9. Aeration Completion Feedback

**Original**: Aeration panel showed timer during aeration; "Not active" when idle. Events logged to history.  
**Gap**: After stopping aeration, no immediate feedback that event was recorded. User must navigate to History to confirm.

**Decision**: Aeration panel shows last completed event (time ago, duration, pH change if calibration) immediately after stopping.

**Requirement**: Job #4 "Verify a correction" — aeration is a treatment; user needs confirmation that event was logged.

**Alternatives considered**:
- A. Toast/notification on stop — rejected (transient, easy to miss)
- B. Event appears in History tab — IMPLEMENTED but requires navigation
- C. Last event shown in Aeration panel — IMPLEMENTED v3.3

**Trade-offs**:
- Pro: Immediate feedback without leaving Status view
- Pro: Shows calibration data (pH change) for learning
- Con: Panel text gets denser

**Validation**:
- Format: "Last: Xd ago (duration) • pH 7.0 → 7.4"
- Only shows if events exist; falls back to "Not active"
- Calibration pH values only shown if both start and end pH captured

### 10. CYA Target Range Data Correction

**Original**: CYA target 40 ppm, range 30-50 ppm (generic pool chemistry advice).  
**Gap**: 0 ppm CYA displayed as red/critical. User questioned why zero—the fresh-fill state—was flagged as a problem.

**Research**: Hotspring FreshWater Salt System Dealer FAQ states: "What is the recommended Cyanuric acid level for use with Salt System? **Zero is a preferred level**, however up to 50 ppm is acceptable."

**Decision**: Correct CYA parameters to match manufacturer specification.

**Corrected values**:
| Field | Old | New |
|-------|-----|-----|
| target | 40 | 0 |
| min | 30 | 0 |
| max | 50 | 50 |
| hardMax | 100 | 100 |

**Rationale** (per Hotspring):
- Hot tub is covered → minimal UV exposure → no UV protection needed
- Salt system generates chlorine continuously → no "stored" chlorine to protect
- CYA inhibits chlorine effectiveness → problematic in high bather-density hot tubs
- High CYA causes "chlorine lock" where chlorine is bound and inactive

**Status colors now**:
- 0-50 ppm: green (acceptable, zero is ideal)
- 51-100 ppm: yellow (elevated, plan drain)
- >100 ppm: red (chlorine lock, drain required)

**Source**: FreshWater Salt System Dealer FAQ (allswimltd.com/pdf/FreshWater-Salt-System-FAQs.pdf)

### 11. FAC Target and Dosing Formula Basis

**Original**: FAC target 3 ppm, min 1 ppm. Dosing formulas undocumented.  
**Gap**: Technical scrub against FreshWater Salt System Owner's Manual revealed FAC spec mismatch and untraced dosing formulas.

**Research**: Manual states "The recommended chlorine level is between 3-5 ppm" with target 4 ppm in startup parameters table.

**Decision**: 
1. Correct FAC to target 4 ppm, min 3 ppm, max 5 ppm per manufacturer spec
2. Create design-basis.md documenting all dosing formulas from first-principles chemistry
3. Mark temperature as informational only (max 104°F from manual, target is user preference)
4. Mark CC threshold as industry standard, not manufacturer-specified

**Corrected FAC values**:
| Field | Old | New |
|-------|-----|-----|
| target | 3 | 4 |
| min | 1 | 3 |
| max | 5 | 5 |

**New document**: design-basis.md provides traceable derivations for:
- Dichlor dosing (1.2 ppm FAC per tsp)
- Bisulfate dosing (0.15 pH, 5 ppm TA per TBSP)
- Carbonate dosing (0.10 pH, 8 ppm TA per TBSP)
- Bicarbonate dosing (7 ppm TA per TBSP)
- Salt dosing (228 ppm per cup)
- CYA accumulation (0.9 ppm per tsp dichlor)

**Source**: FreshWater Salt System Owner's Manual (Part #304652, REV. A)

### 12. Temperature Status Logic and Chemistry Model Verification

**Original**: Temperature used generic status logic (min 80, max 104), flagging low temps as warnings.  
**Gap**: Low temperature is not a problem state—spa may be off, draining, or cooling intentionally. Only >104°F is a safety concern per manual.

**Decision**: Temperature status logic changed to informational:
- Any temp ≤104°F: green (acceptable)
- >104°F: red (safety limit per manual)

**Chemistry Model Verification**:

First-principles verification of dosing formulas revealed bulk density assumptions:

| Chemical | Theoretical | Implemented | Status |
|----------|-------------|-------------|--------|
| Bisulfate TA | 4.9 ppm/TBSP | 5 ppm/TBSP | ✓ Verified |
| Bicarbonate TA | 7.0 ppm/TBSP | 7 ppm/TBSP | ✓ Verified |
| Dichlor FAC | 2.2 ppm/tsp | 1.2 ppm/tsp | ⚠ Empirical |
| Carbonate TA | 5.6 ppm/TBSP | 8 ppm/TBSP | ⚠ Empirical |
| CYA accumulation | 1.8 ppm/tsp | 0.9 ppm/tsp | ⚠ Empirical |

**Analysis**: Discrepancies are consistent with granular chemicals having different bulk densities than assumed (5 g/tsp, 15 g/TBSP). Implemented values are empirically calibrated and produce correct results; derivations use approximate mass assumptions.

**Action**: design-basis.md v1.1 updated with §11 documenting bulk density uncertainty. Future work: measure actual g/tsp for each chemical.

## Implementation Phases — Final Status

| Phase | Status | Deliverable |
|-------|--------|-------------|
| Phase 1: Requirements Validation | ✓ Complete | ux-requirements-v3.md |
| Phase 2: Dashboard Restructure | ✓ Complete | dashboard.jsx v3.0 |
| Phase 2.1: User Testing | ✓ Complete | 21 items identified |
| Phase 2.2: Batch 1 Fixes | ✓ Complete | dashboard.jsx v3.1 |
| Phase 2.3: Batch 2 Fixes | ✓ Complete | dashboard.jsx v3.2 |
| Phase 2.4: Batch 3 Fixes | ✓ Complete | dashboard.jsx v3.3 |
| Phase 2.5: Data Correction | ✓ Complete | dashboard.jsx v3.4 |
| Phase 2.6: Technical Scrub | ✓ Complete | dashboard.jsx v3.5, design-basis.md |
| Phase 2.7: Chemistry Verification | ✓ Complete | dashboard.jsx v3.6, design-basis.md v1.1 |
| Phase 3: Agent Behavior Update | ✓ Complete | SKILL.md v3.2 |
| Phase 4: Skill Coach Review | ✓ Complete | READY verdict |

## Agent Behavior Protocol (from SKILL.md v3.2)

### Dashboard Handles (Routine Operations)
- View current water status
- Log test readings
- See recommendations with specific doses
- Log treatments
- Track aeration
- View maintenance reminders
- Log drain/fill and cartridge replacement
- Export/import data
- View history

### Agent Handles (Consultative Operations)
- Diagnosis when readings confusing or unexpected
- Troubleshooting based on symptoms
- Step-by-step procedure guidance
- Educational explanations
- Equipment/non-chemistry issues
- Judgment calls (should I drain?)

### Consultative Triggers
Questions starting with: Why, How, What does, Should I, Is it normal  
Problem descriptions: cloudy, smells, foam, not working, error  
Procedure requests: walk me through, how do I, step by step

### Interaction Flow
```
User invokes skill → Dashboard presented (ALWAYS)
        ↓
User performs routine ops in dashboard
        ↓
User asks consultative question → Agent responds conversationally
        ↓
User returns to dashboard
```
