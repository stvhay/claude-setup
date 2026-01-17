# Hot Tub Maintenance Skill — Requirements Specification

**Version:** 3.10  
**Status:** Released  
**Last Updated:** 2026-01-17

**v3.10 Changes:**
- TEST-001: Synced test TARGETS to requirements (FAC 4/3-5, CYA 0/0-50)
- UI-029: Modal focus traps (useFocusTrap hook)
- UI-030: ARIA labels for accessibility
- UI-031: History pagination with "Load more"
- CODE-001: Extracted applyTreatmentEffects utility (DRY)
- META-001: Unified version numbering across files

**v3.5 Changes:**
- UI-027: Modal backdrop click cancels (not saves)
- UI-028: Export/Import with clipboard support
- PROJ-009: Multi-step recommendation lifecycle (threshold fix)
- PROJ-010: Shock recommendation suppression after logged
- CHEM-017: Multi-step recommendation labeling ("Step X of Y")

---

## 1. Purpose

This document formally specifies all testable requirements for the hot-tub-maintenance skill. Each requirement has a unique identifier enabling direct traceability to test cases in `tests/test_skill.py`.

---

## 2. Requirement Categories

| Prefix | Category |
|--------|----------|
| INST | Installation Constants |
| TGT | Target Ranges |
| DOSE | Dosing Calculations |
| CYA | Cyanuric Acid Tracking |
| STAT | Status Color Logic |
| STOR | Data Storage |
| UI | Dashboard User Interface |
| WIZ | Fresh Fill Wizard |
| BEH | Agent Behavioral Directives |
| IMP | Continuous Improvement |
| DOC | SKILL.md Structure |
| INT | Skill Integrations |

---

## 3. Installation Constants (INST)

### INST-001: Volume
The spa volume SHALL be 335 gallons for all dosing calculations.

### INST-002: Cartridge Lifespan
Salt cartridge lifespan SHALL be 120 days (4 months).

### INST-003: Drain Interval
Recommended drain interval SHALL be 12 months (salt system extends standard 3-4 month interval).

### INST-004: Output Level
Default salt system output level SHALL be 6.

---

## 4. Target Ranges (TGT)

### TGT-001: Salt
- Target: 1750 ppm
- Range: 1500–2000 ppm

### TGT-002: Calcium Hardness
- Target: 50 ppm
- Range: 25–75 ppm

### TGT-003: Total Alkalinity
- Target: 80 ppm
- Range: 40–120 ppm

### TGT-004: pH
- Target: 7.4
- Range: 7.2–7.8

### TGT-005: Free Available Chlorine (FAC)
- Target: 4 ppm
- Range: 3–5 ppm
- **Source:** FreshWater Salt System Manual (corrected v3.5)

### TGT-006: Combined Chlorine (CC)
- Target: 0 ppm
- Range: 0–0.5 ppm

### TGT-007: Phosphates
- Target: 150 ppb
- Range: 0–300 ppb

### TGT-008: Cyanuric Acid (CYA)
- Target: 0 ppm (zero preferred for covered salt systems)
- Range: 0–50 ppm (acceptable)
- Hard Maximum: 100 ppm (chlorine lock threshold)
- **Source:** Hotspring Dealer FAQ (corrected v3.4)
- **Rationale:** Unlike outdoor pools requiring UV protection, covered hot tubs with salt systems benefit from zero CYA to maximize chlorine efficacy. CYA accumulates from dichlor use and only decreases by dilution.

### TGT-009: Range Consistency
For all parameters: min ≤ target ≤ max.

### TGT-010: pH Efficacy
pH max SHALL be ≤ 7.8 to maintain chlorine efficacy.

### TGT-011: CYA Hard Max Defined
CYA SHALL have a hard_max property set to 100.

---

## 5. Dosing Calculations (DOSE)

All formulas are pre-calculated for 335 gallon volume.

### DOSE-001: Salt
- Effect: 1 cup = +228 ppm
- Fresh fill: ~8 cups to reach 1750 ppm

### DOSE-002: Dichlor (Chlorine)
- Effect: 1 tsp = +1.2 ppm FAC
- Shock: ~4 tsp to reach 5 ppm

### DOSE-003: Dichlor CYA Contribution
- Effect: 1 tsp = +0.9 ppm CYA

### DOSE-004: Sodium Bisulfate (pH Down)
- Effect: 1 TBSP = -0.15 pH
- Secondary: -5 ppm TA

### DOSE-005: Sodium Carbonate (pH Up)
- Effect: 1 TBSP = +0.1 pH
- Secondary: +8 ppm TA

### DOSE-006: Sodium Bicarbonate (TA Up)
- Effect: 1 TBSP = +7 ppm TA
- Minimal pH impact

### DOSE-007: MPS Oxidizer
- Dose: ~5.5 TBSP per treatment (based on 4 TBSP/250 gal)

### DOSE-008: Formula Correctness
Dosing formulas SHALL produce correct values:
- Salt cups = (target - current) / 228
- Dichlor tsp = (target - current) / 1.2
- Bisulfate TBSP = (current_pH - target_pH) / 0.15
- Carbonate TBSP = (target_pH - current_pH) / 0.1
- Bicarbonate TBSP = (target_TA - current_TA) / 7

---

## 6. CYA Tracking (CYA)

### CYA-001: Cumulative Tracking
CYA SHALL be estimated by summing dichlor treatments × 0.9 ppm/tsp.

### CYA-002: Warning Threshold
Dashboard SHALL warn when estimated CYA > 80 ppm.

### CYA-003: Critical Threshold
Status SHALL be red when CYA > 100 ppm (hard max).

### CYA-004: Reset on Drain
CYA estimate SHALL reset to 0 when drain is recorded.

### CYA-005: Typical Usage Safe
16 weeks × 3 tsp/week = 43.2 ppm CYA, which SHALL be < 100.

### CYA-006: Heavy Usage Exceeds
52 weeks × 5 tsp/week = 234 ppm CYA, which SHALL be > 100.

---

## 7. Status Color Logic (STAT)

### STAT-001: Green
Value within [min, max] → green.

### STAT-002: Yellow
Value outside [min, max] but within 20% of bounds → yellow.

### STAT-003: Red
Value beyond 20% of bounds → red.

### STAT-004: Red Override for CYA
CYA > 100 (hard_max) → red, regardless of other thresholds.

### STAT-005: Gray for Missing
Null, undefined, or empty value → gray.

---

## 8. Data Storage (STOR)

### STOR-001: Storage Keys
The following keys SHALL be used:
- `hottub:readings`
- `hottub:treatments`
- `hottub:events`
- `hottub:conversations`
- `hottub:lessons`
- `hottub:meta`

### STOR-002: Key Consistency
Dashboard and SKILL.md SHALL use identical storage keys.

### STOR-003: Readings Fields
Readings SHALL include: date, pH, TA, CH, salt, FAC, TAC, phosphates, temp, CYA.

### STOR-004: Treatments Fields
Treatments SHALL include: date, chemical, amount, reason.

### STOR-005: Events Fields
Events SHALL include: date, type, description.

### STOR-006: Lessons Fields
Lessons SHALL include: date, type, description, status, resolution.

### STOR-007: Meta Fields
Meta SHALL include: installDate, lastDrain, cartridgeInstall, cumulativeCYA.

### STOR-008: Conversations Fields
Conversations SHALL include: date, summary.

---

## 9. Dashboard UI (UI)

### UI-001: View Navigation
Dashboard SHALL have 3 views: Status (default), History, Settings.
View navigation SHALL be in header bar. Status view SHALL be selected by default on load.

### UI-002: Dark Mode Detection
Dashboard SHALL detect `prefers-color-scheme` media query.

### UI-003: Dark Mode Toggle
Dashboard SHALL provide manual dark/light toggle.

### UI-004: Touch Targets
Interactive elements SHALL have min-height 44px.

### UI-005: Responsive Grid
Grid SHALL be 2 columns on mobile, 4 on desktop.

### UI-006: View Navigation Style
View buttons SHALL be in header, styled as toggle buttons.

### UI-007: Offline Detection
Dashboard SHALL detect navigator.onLine status.

### UI-008: Offline Indicator
Dashboard SHALL display "Offline" badge when disconnected.

### UI-009: Export Function
Dashboard SHALL export all data as downloadable JSON.

### UI-010: Import Function
Dashboard SHALL import data from JSON file.

### UI-011: Clear Function
Dashboard SHALL clear all data with confirmation dialog.

### UI-012: Cartridge Days Calculation
Cartridge days = (install_date + 120 days) - today.

### UI-013: Days Since Drain
Display days elapsed since lastDrain date.

### UI-014: CYA Display
Dashboard SHALL display estimated CYA prominently.

### UI-015: Adjustment Recommendations
Dashboard SHALL calculate and show needed adjustments.

### UI-016: Parameter Units Display
Dashboard SHALL display units for all parameters where units exist (ppm, ppb, °F).

### UI-017: Button Press Feedback
Dashboard SHALL provide visual feedback when action buttons are pressed (Save Reading, Save Treatment, etc.).

### UI-018: Maintenance Recommendations
Dashboard SHALL include maintenance recommendations:
- Cartridge replacement when ≤14 days remaining
- Drain/refill when approaching 12 months or CYA >80 ppm

### UI-019: Test Procedures (DEPRECATED in v3.0)
Test procedures moved to conversational agent guidance.
Reference: testing-procedures.md for step-by-step procedures.

### UI-020: Last Tested Display
Dashboard SHALL display when each parameter was last tested:
- Show relative time (e.g., "2h ago", "5d ago") below each reading
- Flag readings older than STALE_THRESHOLD_DAYS (default 7) with ⚠️
- Derived values (CC) show "(calc)" instead of timestamp

---

## 9.5 Projected Chemistry (PROJ)

### PROJ-001: Projection Calculation
For each parameter with a logged reading, dashboard SHALL calculate projected value by summing effects of all treatments logged AFTER the most recent reading of that parameter.

### PROJ-002: Treatment Effects
Projection effects SHALL be:
- dichlor: +1.2 ppm FAC per tsp, +1.2 ppm TAC per tsp (all added chlorine is initially free), +0.9 ppm CYA per tsp
- bisulfate: -0.15 pH per TBSP, -5 ppm TA per TBSP
- carbonate: +0.1 pH per TBSP, +8 ppm TA per TBSP
- bicarbonate: +7 ppm TA per TBSP
- salt: +228 ppm salt per cup

**Rationale (v3.4):** TAC must track FAC because TAC = FAC + CC. When dichlor is added, all added chlorine is initially in free form, so both FAC and TAC increase by the same amount. CC is unchanged by dichlor addition (CC only increases when FAC reacts with contaminants).

### PROJ-003: Projection Display
When projected value differs from measured value, dashboard SHALL display projected value alongside measured value.

### PROJ-004: Condition Resolved Indicator
When measured value is out of spec AND projected value is in spec, dashboard SHALL visually indicate the condition is anticipated to be resolved (green indicator).

### PROJ-005: New Issue Indicator
When measured value is in spec AND projected value is out of spec, dashboard SHALL visually indicate a new issue is anticipated (red/warning indicator).

### PROJ-006: Projection Staleness
Projections SHALL only apply to treatments logged AFTER the most recent reading for each respective parameter. A new reading for a parameter clears projections for that parameter.

### PROJ-007: Recommendations Update
Adjustment recommendations SHALL account for projected values, not just measured values. If a projected value is in spec, no recommendation for that parameter.

### PROJ-008: Multi-Treatment Accumulation
Multiple treatments affecting the same parameter SHALL have their effects summed.

### PROJ-009: Multi-Step Recommendation Lifecycle (NEW in v3.5)
When solver returns a multi-step solution (e.g., bisulfate + bicarbonate), the recommendation trigger threshold SHALL match the solver's internal threshold:
- Solver triggers bicarbonate recommendation when deltaTa > 5
- Dashboard SHALL call solver when TA < (target - 5) = 75, even if TA is "in spec" (40-120)
- This ensures step 2 of multi-step corrections persists after step 1 is logged

**Rationale:** Without this, logging bisulfate (which drops TA from 100 to 73) would cause bicarbonate recommendation to disappear because 73 > 70 (old threshold of target - 10), leaving user with TA 27 below target.

### PROJ-010: Shock Recommendation Suppression (NEW in v3.5)
When a shock treatment is logged (chemicalId='dichlor' AND chemical name contains 'shock'):
- Dashboard SHALL track `_shockLogged` flag in projectedReadings
- CC shock recommendation SHALL be suppressed when `_shockLogged` is true
- Flag clears when new reading is logged

**Rationale:** CC reduction from shocking is not modeled (chemically complex), but recommendation should not persist after user has already performed the shock treatment.

---

## 10. Fresh Fill Wizard (WIZ) — DEPRECATED in v3.0

Fresh fill procedure moved to conversational agent guidance.
Reference: maintenance-procedures.md for step-by-step procedure.

The following requirements are retained for backward compatibility but wizard UI is removed:

### WIZ-001 through WIZ-006: DEPRECATED
Wizard functionality is now delivered conversationally by the agent.
Agent can track progress, guide steps, and offer to update drain date on completion.

---

## 11. Agent Behavior (BEH)

### BEH-001: Present Dashboard
Agent SHALL present dashboard at conversation start.

### BEH-002: Session End Triggers
Agent SHALL recognize: "done", "thanks", "bye", "that's all".

### BEH-003: Feedback Prompt
Agent SHALL ask for feedback at session end.

### BEH-004: Log Conversations
Agent SHALL log conversation summary at session end.

### BEH-005: Log Treatments
Agent SHALL log treatments when user reports them.

### BEH-006: Log Readings
Agent SHALL log readings when user provides them.

### BEH-007: Frontend Design Skill
Agent SHALL invoke frontend-design skill on dashboard changes.

### BEH-008: TSX Simplifier Skill
Agent SHALL invoke tsx-simplifier skill on dashboard changes.

### BEH-009: Skill Coach Review
Agent SHALL spawn coach review before finalizing skill changes.

---

## 12. Continuous Improvement (IMP)

### IMP-001: Lesson Types
Types SHALL be: mistake, gap, improvement, clarification.

### IMP-002: Lesson Statuses
Statuses SHALL be: open, resolved, embedded.

### IMP-003: Open Lesson Threshold
At 3+ open lessons, prompt for review and embedding.

---

## 13. SKILL.md Structure (DOC)

### DOC-001: YAML Frontmatter
SKILL.md SHALL start with `---` and contain name, description.

### DOC-002: Required Sections
SKILL.md SHALL contain:
- Behavior on Load
- Installation Constants
- Target Ranges
- Dosing Formulas
- Drain & Refill Procedure
- Troubleshooting
- Logging Protocol
- Continuous Improvement
- Dashboard Design Protocol
- Skill Coach Protocol

### DOC-003: ALWAYS Directives
SKILL.md SHALL contain ≥5 "ALWAYS" directives.

### DOC-004: Storage Keys Documented
All 6 storage keys SHALL appear in SKILL.md.

### DOC-005: Volume Documented
"335 gal" SHALL appear in SKILL.md.

---

## 14. Skill Integrations (INT)

### INT-001: Frontend Design Reference
SKILL.md SHALL reference "frontend-design" skill.

### INT-002: TSX Simplifier Reference
SKILL.md SHALL reference "tsx-simplifier" skill.

### INT-003: Coach Protocol
SKILL.md SHALL define coach review protocol with READY/NEEDS REVISION verdict.

---

## 15. Test Traceability Matrix

See `tests/test_skill.py` for implementation. Each test method is named `test_<REQ_ID>`.

| Category | Requirements | Test Count |
|----------|--------------|------------|
| INST | 4 | 4 |
| TGT | 11 | 11 |
| DOSE | 8 | 12 |
| CYA | 6 | 6 |
| STAT | 5 | 5 |
| STOR | 8 | 8 |
| UI | 20 | 20 |
| PROJ | 8 | 8 |
| WIZ | 6 | 6 |
| BEH | 9 | 9 |
| IMP | 3 | 3 |
| DOC | 5 | 5 |
| INT | 3 | 3 |
| **Total** | **96** | **100** |

---

## Appendix: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 2026-01-15 | Claude | Initial formal requirements extraction |
## 16. Chemistry Solver (CHEM)

The chemistry solver replaces independent per-parameter calculations with a joint linear algebra approach that accounts for chemicals with multiple effects.

### CHEM-001: Effect Matrix Definition
The dashboard SHALL define a linear effect matrix where each chemical's effects on all parameters are specified:

| Chemical | pH | TA | FAC | CYA | Salt |
|----------|------|------|------|------|------|
| bisulfate | -0.15 | -5 | 0 | 0 | 0 |
| carbonate | +0.10 | +8 | 0 | 0 | 0 |
| bicarbonate | 0 | +7 | 0 | 0 | 0 |
| dichlor | 0 | 0 | +1.2 | +0.9 | 0 |
| salt | 0 | 0 | 0 | 0 | +228 |

Units: pH per TBSP, TA ppm per TBSP, FAC ppm per tsp, CYA ppm per tsp, Salt ppm per cup.

### CHEM-002: Operational Targets
The solver SHALL use operational targets that account for known drift characteristics of saltwater hot tubs:

| Parameter | Operational Target | Rationale |
|-----------|-------------------|-----------|
| pH | 7.2 | Drifts up due to NaOH production and CO₂ off-gassing; start low |
| TA | 80 ppm | Per manufacturer recommendation; provides buffer capacity |
| FAC | 3 ppm | Standard maintenance level |
| Salt | 1750 ppm | Mid-range for FreshWater system |

**Note**: These operational targets are used by the CHEM solver for calculating recommendations. They supersede TGT-004 targets for solver purposes. The TGT targets remain as display targets (what the dashboard shows as "ideal").

### CHEM-003: Parameter Coupling
The solver SHALL recognize coupled parameter groups that must be solved jointly:
- **pH/TA group**: bisulfate, carbonate, bicarbonate all affect both; solve as 2×3 system
- **FAC/CYA group**: dichlor affects both; solve after pH/TA
- **Salt**: independent; solve separately

### CHEM-004: Priority Order
When trade-offs exist, the solver SHALL apply this priority:
1. TA not excessively high (>120 ppm) — impedes pH control
2. pH in range (7.2–7.8) — chlorine efficacy
3. TA not excessively low (<40 ppm) — pH instability risk
4. FAC in range — sanitization

### CHEM-005: Non-Negativity Constraint
All solutions SHALL satisfy x ≥ 0 (cannot add negative chemicals).

### CHEM-006: Joint pH/TA Solution
Given current pH (p₀) and TA (t₀), the solver SHALL solve:

```
ΔpH = -0.15·B + 0.10·C = (7.2 - p₀)
ΔTA = -5·B + 8·C + 7·N = (80 - t₀)
```

Where B = bisulfate, C = carbonate, N = bicarbonate (all in TBSP).

Constraints: B ≥ 0, C ≥ 0, N ≥ 0, and only one of B/C should be non-zero (cannot simultaneously raise and lower pH).

### CHEM-007: Feasibility Detection
Before recommending, the solver SHALL verify the solution is feasible. A solution is infeasible when:
- Required amount of any chemical is negative
- No combination of non-negative chemical additions achieves targets
- Solution requires contradictory actions (e.g., both raise and lower pH)

### CHEM-008: Infeasibility Scenarios and Strategies

| Scenario | Detection | Strategy |
|----------|-----------|----------|
| pH low, TA high | Need C>0 for pH, but C raises TA further | Aeration (see CHEM-009) |
| pH high, TA low | Need B>0 for pH, but B lowers TA further | Two-step: lower pH first (accept TA drop), then raise TA with bicarbonate |
| pH high, TA high | B lowers both — may be solvable | Check if B alone achieves both targets within bounds |

### CHEM-009: Aeration Recommendation
When pH < 7.2 AND TA > 120, the solver SHALL recommend aeration as primary strategy rather than chemicals. Aeration releases dissolved CO₂, which raises pH without affecting TA. No chemical combination can achieve (+ΔpH, -ΔTA) because:
- Bisulfate lowers both pH and TA
- Carbonate raises both pH and TA
- Bicarbonate raises TA only

### CHEM-010: Recommendation Threshold
The solver SHALL only generate recommendations for parameters that are OUT OF SPEC (outside min-max range). Parameters within range but not at target SHALL show "optimal" adjustments as informational only, clearly distinguished from required corrections.

### CHEM-011: Secondary Effect Display
Every recommendation SHALL show ALL parameter effects, not just the target:

```
Recommendation: 5.3 TBSP Sodium Bisulfate + 8.1 TBSP Sodium Bicarbonate
  → pH: 8.0 → 7.2 (target achieved)
  → TA: 50 → 80 ppm (target achieved)
```

### CHEM-012: Projected Final State
The solver SHALL display projected final values for ALL parameters after the full recommendation set, with status indicators (green/yellow/red).

### CHEM-013: Over-Correction Prevention
The solver SHALL NOT recommend amounts that would push ANY parameter outside its acceptable range, even if the primary target would be achieved.

Example: If lowering pH to 7.2 would drop TA below 40 ppm, reduce the bisulfate dose and add bicarbonate compensation.

### CHEM-014: FAC Independence
FAC/CYA SHALL be solved AFTER pH/TA recommendations are generated, using the projected post-pH/TA values as the baseline.

### CHEM-015: Solver Transparency
When recommendations are generated, the dashboard SHALL provide an expandable "Calculation Details" showing:
- Current values used
- Target values
- Effect coefficients applied
- Solution method (direct solve vs. sequential)

### CHEM-016: Practical Rounding
Chemical recommendations SHALL be rounded to practical measurement units:
- Tablespoons: round to 0.5 TBSP increments
- Teaspoons: round to 0.25 tsp increments
- Cups: round to 0.25 cup increments

Display both the calculated exact value and the rounded practical value.

### CHEM-017: Multi-Step Labeling (NEW in v3.5)
When solver returns a multi-step solution (e.g., bisulfate + bicarbonate):
- Each recommendation card SHALL display "Step X of Y: [action]"
- Projection line SHALL include warning: "⚠ Projection assumes all N steps completed"
- First step reason: "Step 1 of 2: Adjust pH"
- Second step reason: "Step 2 of 2: Adjust TA"

**Rationale:** User must understand that the "After all additions" projection depends on completing ALL steps, not just the first one.

---

## 17. Aeration Tracking and Calibration (AERATE)

Aeration (running jets with cover open) raises pH by releasing dissolved CO₂. The dashboard tracks aeration events and builds a calibrated model for time estimates.

### AERATE-001: Aeration States
The dashboard SHALL track aeration state:
- **Idle**: No active aeration session
- **Aerating**: Active session with timer running

### AERATE-002: Start Aeration Flow
When user presses [Start Aeration] in Idle state:
1. Display modal with optional pH input field
2. Prompt text: "Log pH now to get better aeration time estimates in the future?"
3. On [Start]:
   - If pH entered: log reading { date: now, ph: value }
   - Log event: { type: 'aeration_start', date: now, has_baseline: (pH was entered) }
   - Transition to Aerating state

### AERATE-003: Aerating State Display
While in Aerating state, dashboard SHALL display:
- Elapsed time since start (updating)
- [Stop Aeration] button

### AERATE-004: Stop Aeration Flow
When user presses [Stop Aeration]:
1. Display Modal 1: "Log Aeration Event"
   - Start time: datetime picker, default from aeration_start log entry
   - End time: datetime picker, default now
   - Duration: calculated and displayed
   - [Save] [Cancel]

2. If [Cancel] pressed: 
   - Do NOT delete the aeration_start event (preserves audit trail)
   - Transition to Idle state without logging aeration event

3. If [Save] pressed AND aeration_start.has_baseline == true, display Modal 2: "Complete Calibration?"
   - Prompt: "Log pH now to improve future aeration time estimates?"
   - Post-aeration pH: input (optional)
   - TA: auto-filled if recent reading exists, editable
   - [Save]

4. On [Save]:
   - If post_ph entered:
     - Log reading: { date: end_time, ph: post_ph, ta: ta }
     - Log event: { type: 'aeration_calibration', start, end, duration_min, ph_before, ph_after, ta, k_observed }
   - Else:
     - Log event: { type: 'aeration', start, end, duration_min }
   - Transition to Idle state

### AERATE-005: Calibration Coefficient Calculation
For calibration events, k_observed SHALL be calculated as:

```
k_observed = ΔpH / (t_hours × buffer_factor)
where:
  ΔpH = ph_after - ph_before
  t_hours = duration_min / 60
  buffer_factor = 100 / TA
```

### AERATE-006: Calibrated Model
The dashboard SHALL maintain a calibrated aeration rate by averaging k_observed from all calibration events:

```
k_calibrated = mean(k_observed) across all aeration_calibration events
```

If no calibration data exists, use default k = 0.10.

### AERATE-007: Aeration Time Estimate
When recommending aeration, the solver SHALL estimate duration:

```
t_hours = (target_pH - current_pH) / (k_calibrated × 100 / current_TA)
```

Display as: "Estimated time: X hours (based on N calibration sessions)" or "Estimated time: X hours (default estimate, no calibration data)"

### AERATE-008: Event Storage
Aeration events SHALL use the existing events storage key (hottub:events) with these type values:
- `aeration_start`: { type, date, has_baseline }
- `aeration`: { type, start, end, duration_min }
- `aeration_calibration`: { type, start, end, duration_min, ph_before, ph_after, ta, k_observed }

---

## Test Cases for CHEM Requirements

### CHEM-TC-001: Basic Joint Solve (pH high, TA low)
- Input: pH=8.0, TA=50
- Expected: ~5.3 TBSP bisulfate + ~4.3 TBSP bicarbonate
- Validates: CHEM-006, CHEM-011

### CHEM-TC-002: pH Out of Spec, TA In Spec
- Input: pH=8.0, TA=80
- Expected: Required recommendation for pH (bisulfate)
- Expected: Show TA secondary effect (80 → ~53 ppm, now out of spec)
- Expected: Add bicarbonate to compensate
- Validates: CHEM-010, CHEM-011, CHEM-013

### CHEM-TC-003: Infeasible - Aeration Required (pH low, TA high)
- Input: pH=7.0, TA=140
- Expected: No chemical recommendation; aeration strategy with time estimate
- Validates: CHEM-008, CHEM-009, AERATE-007

### CHEM-TC-004: Sequential Required (pH high, TA low-critical)
- Input: pH=8.2, TA=35
- Expected: Sequential recommendation (bisulfate with compensation, then retest)
- Validates: CHEM-008

### CHEM-TC-005: All In Range
- Input: pH=7.3, TA=75
- Expected: No required recommendations
- Expected: Optional "optimize" suggestions shown separately
- Validates: CHEM-010

### CHEM-TC-006: FAC After pH/TA
- Input: pH=8.0, TA=50, FAC=0.5
- Expected: pH/TA recommendation first, FAC recommendation based on projected state
- Validates: CHEM-014

### CHEM-TC-007: Over-Correction Prevention
- Input: pH=7.9, TA=45
- Expected: Bisulfate dose + bicarbonate compensation, TA stays ≥40
- Validates: CHEM-013

## Test Cases for AERATE Requirements

### AERATE-TC-001: Start Without Baseline
- Action: Start aeration, leave pH blank
- Expected: aeration_start logged with has_baseline=false
- Expected: Stop flow skips calibration modal
- Validates: AERATE-002, AERATE-004

### AERATE-TC-002: Full Calibration Flow
- Action: Start with pH=7.0, aerate 2 hours, stop with pH=7.2, TA=100
- Expected: Reading logged at start and end
- Expected: aeration_calibration event with k_observed = 0.2 / (2 × 1.0) = 0.1
- Validates: AERATE-002, AERATE-004, AERATE-005

### AERATE-TC-003: Calibrated Time Estimate
- Setup: 3 prior calibration events with k_observed = [0.08, 0.10, 0.12]
- Input: pH=7.0, TA=120, target pH=7.2
- Expected: k_calibrated = 0.10
- Expected: t = 0.2 / (0.10 × 100/120) = 2.4 hours
- Validates: AERATE-006, AERATE-007

---

## Revision to Existing Requirements

### DOSE-008 Amendment
DOSE-008 (Formula Correctness) is SUPERSEDED by CHEM-006 for pH/TA calculations. Independent formulas remain valid only for single-parameter chemicals (salt).

### PROJ-007 Amendment  
PROJ-007 (Recommendations Update) now delegates to CHEM solver. Recommendations account for projected values AND cross-parameter effects.

### UI-015 Amendment
UI-015 (Adjustment Recommendations) now requires CHEM solver integration with full effect display per CHEM-011.

### UI-021: Aeration Controls
Dashboard SHALL include aeration tracking UI per AERATE-001 through AERATE-004.

### UI-022: Extended Parameters (NEW in v3.0)
Dashboard SHALL support 19 parameters organized in groups:
- Primary (always visible): pH, TA, FAC, TAC, CC, CH, Salt
- Stability (always visible): CYA, Carbonate, Phosphates
- Environmental (always visible): Temp
- Contaminants (collapsed by default): Nitrate, Nitrite, Copper, Iron, Lead, Nickel
- Unused (collapsed by default): Bromine, MPS, Sulfite

### UI-023: Derived Combined Chlorine (NEW in v3.0)
Dashboard SHALL calculate CC = TAC - FAC when both values present.
CC SHALL be displayed in Primary group with "(calc)" indicator.
CC SHALL NOT be stored in readings (derived on display).

### UI-024: Treatment Logging Flow (NEW in v3.0)
Recommendation cards with chemistry type and amount SHALL have "Log" button.
"Log" button SHALL open modal with:
- Chemical name (read-only)
- Recommended amount (display)
- Actual amount (editable, defaults to recommended)
- Notes field (optional)
- Save and Cancel buttons
On save, treatment SHALL be logged to hottub:treatments.

### UI-025: Aeration Calibration Modal (NEW in v3.0)
Aeration Stop action SHALL open modal with:
- Duration display (calculated)
- Starting pH (from aerationStartPh state, if available)
- Current pH field (optional, enables calibration)
- Current TA field (pre-filled from latest reading)
If current pH provided AND aerationStartPh exists:
- SHALL calculate k_observed using calculateAerationK()
- SHALL log aeration_calibration event type
- SHALL also log a reading with the provided pH/TA
If current pH NOT provided:
- SHALL log simple aeration event type

### UI-026: Settings View Content (NEW in v3.0)
Settings view SHALL contain:
- Maintenance Dates section with date inputs for Last Drain and Cartridge Installed
- Backup & Reset section with Export Backup, Import Backup, Clear All Data buttons
- Data counts display (readings, treatments, events count)

### UI-027: Modal Backdrop Behavior (NEW in v3.5)
All modals (TreatmentModal, Aeration Start/Stop, Drain/Fill, Cartridge) SHALL:
- Cancel on backdrop click (click outside modal content area)
- Stop propagation on content area clicks to prevent accidental dismissal
- Support Escape key to cancel (existing)

**Rationale:** Clicking outside a modal should abort the action, not save. Previous behavior could result in accidental treatment logging.

### UI-028: Clipboard Backup (NEW in v3.5)
Backup & Reset section SHALL provide:
- Export: "Download" button (file download) and "Copy" button (clipboard)
- Import: "File" button (file picker) and "Paste" button (clipboard import)
- Status feedback for each operation showing success/failure with details

**Rationale:** File downloads may not be visible in all environments; clipboard provides alternative. Copy/paste must be symmetric.

### STOR-009: Aeration Event Types
Events storage SHALL support types: aeration_start, aeration, aeration_calibration per AERATE-008.

---

## 15. Skill Integrations (INT) — Additions

### INT-004: jsx-dev Skill Integration (NEW in v3.0)
Dashboard modifications SHALL invoke jsx-dev skill with modes:
- architect: structural decisions before implementation
- player: implementation
- coach: code review before approval
Full workflow: architect → player → coach → APPROVED/CONTINUE/BLOCKED

---

## Changelog

### v3.5 (2026-01-17)
**New Requirements:**
- UI-027: Modal backdrop click cancels (not saves)
- UI-028: Export/Import with clipboard support (symmetric Copy/Paste)
- PROJ-009: Multi-step recommendation lifecycle (trigger threshold matches solver)
- PROJ-010: Shock recommendation suppression after logged
- CHEM-017: Multi-step recommendation labeling ("Step X of Y")

**Bug Fixes:**
- CRITICAL: Fixed step 2 of multi-step recommendations disappearing after logging step 1
  - Root cause: trigger threshold was 10 below target (70), but projected TA=73 > 70
  - Fix: threshold now 5 below target (75) to match solver's deltaTa > 5 threshold
- Fixed shock recommendation persisting after shock treatment logged
- Fixed modal backdrop clicks inadvertently saving treatments

### v3.0 (2026-01-16)
**Breaking Changes:**
- UI-001: 8-tab structure replaced with 3-view architecture (Status, History, Settings)
- WIZ-*: Wizard section deprecated (moved to conversational)
- UI-019: Test tab deprecated (moved to conversational)

**New Requirements:**
- UI-022: Extended parameters (19 total, grouped)
- UI-023: Derived CC display
- UI-024: Treatment logging flow
- UI-025: Aeration calibration modal
- UI-026: Settings view content
- INT-004: jsx-dev integration

**Updated Requirements:**
- UI-006: View navigation style
- UI-020: Last tested with relative time

### v2.1 (2026-01-15)
- Added AERATE-* requirements for aeration tracking
- Added UI-021 for aeration controls
- Added UI-015 amendment for aeration recommendations
