# Chemistry Quick Reference - Hotspring Flair (335 gal)

## Target Ranges (FreshWater Salt System)

| Parameter | Target | Min | Max | Unit | Notes |
|-----------|--------|-----|-----|------|-------|
| Salt | 1,750 | 1,500 | 2,000 | ppm | Per manufacturer spec |
| Calcium Hardness | 50 | 25 | 75 | ppm | Salt system requires LOW calcium |
| Total Alkalinity | 80 | 40 | 120 | ppm | Buffer for pH stability |
| pH | 7.4 | 7.2 | 7.8 | — | Per manufacturer spec |
| Free Chlorine | 4 | 3 | 5 | ppm | Per manufacturer spec |
| Combined Chlorine | <0.5 | 0 | 0.5 | ppm | Industry standard (CC = TAC - FAC) |
| Phosphates | <150 | 0 | 300 | ppb | Per manufacturer spec |
| Temperature | 100 | — | 104 | °F | Max 104°F per safety; target is user preference |

## pH and Chlorine Efficacy

| pH | % Hypochlorous Acid (active) | Effective Sanitizer |
|----|------------------------------|---------------------|
| 7.0 | 73% | High |
| 7.2 | 66% | High |
| 7.4 | 55% | Good |
| 7.6 | 45% | Moderate |
| 7.8 | 35% | Low |
| 8.0 | 21% | Very Low |
| 8.2 | 12% | Ineffective |

**Key insight**: At pH 8.0, your 3 ppm FAC only delivers ~0.6 ppm effective sanitizer.

## Dosing Tables (335 gallons)

### Salt Addition

| Current (ppm) | Target (ppm) | Add (cups) |
|---------------|--------------|------------|
| 0 | 1,750 | 7.7 (round to 8) |
| 1,000 | 1,750 | 3.3 (round to 3.5) |
| 1,500 | 1,750 | 1.1 (round to 1) |
| 1,250 | 1,750 | 2.2 (round to 2) |

**Formula**: cups = (target - current) / 228

### Chlorine (Sodium Dichlor)

| Current FAC | Target FAC | Add (tsp) |
|-------------|------------|-----------|
| 0 | 4 | 3.3 |
| 0 | 5 | 4.2 |
| 1 | 4 | 2.5 |
| 2 | 4 | 1.7 |
| 3 | 5 | 1.7 |

**Formula**: tsp = (target - current) / 1.2

See design-basis.md for derivation.

### pH Down (Sodium Bisulfate)

| Current pH | Target pH | Add (TBSP) | Expected TA drop |
|------------|-----------|------------|------------------|
| 8.2 | 7.4 | 5.3 | ~27 ppm |
| 8.0 | 7.4 | 4.0 | ~20 ppm |
| 7.8 | 7.4 | 2.7 | ~13 ppm |
| 7.6 | 7.4 | 1.3 | ~7 ppm |

**Formula**: TBSP = (current - target) / 0.15
**Side effect**: Each TBSP also lowers TA by ~5 ppm

See design-basis.md for derivation.

### pH Up (Sodium Carbonate)

| Current pH | Target pH | Add (TBSP) | Expected TA rise |
|------------|-----------|------------|------------------|
| 7.0 | 7.4 | 4.0 | ~32 ppm |
| 7.2 | 7.4 | 2.0 | ~16 ppm |

**Formula**: TBSP = (target - current) / 0.1
**Side effect**: Each TBSP also raises TA by ~8 ppm

See design-basis.md for derivation.

### Alkalinity Up (Sodium Bicarbonate)

| Current TA | Target TA | Add (TBSP) |
|------------|-----------|------------|
| 40 | 80 | 5.7 |
| 50 | 80 | 4.3 |
| 60 | 80 | 2.9 |
| 70 | 80 | 1.4 |

**Formula**: TBSP = (target - current) / 7
**Side effect**: Minimal pH impact

See design-basis.md for derivation.

## Adjustment Order

Always adjust in this sequence:
1. **Calcium Hardness** (if outside range)
2. **Total Alkalinity** (buffers pH adjustments)
3. **pH** (affects sanitizer efficacy)
4. **Salt** (system won't generate without proper level)
5. **Chlorine** (sanitizer last, after chemistry stable)

## Fresh Fill Recipe (335 gal, softened well water)

Assuming fill water: ~30 ppm CH, ~50 ppm TA, ~7.8 pH, 0 salt, 0 chlorine

| Step | Chemical | Amount | Purpose |
|------|----------|--------|---------|
| 1 | None | — | CH likely OK from softener output |
| 2 | Sodium bicarbonate | 4-5 TBSP | Raise TA from ~50 to ~80 |
| 3 | Sodium bisulfate | 2-3 TBSP | Lower pH from ~7.8 to ~7.4 |
| 4 | FreshWater Salt | 8 cups | Establish 1,750 ppm |
| 5 | Sodium dichlor | 4 tsp | Shock to 5 ppm |

Wait 24h, retest, adjust as needed before use.

## Combined Chlorine Calculation

Combined Chlorine (CC) = Total Chlorine (TC) - Free Chlorine (FC)

| FC | TC | CC | Status |
|----|----|----|--------|
| 3.0 | 3.2 | 0.2 | Good |
| 3.0 | 3.5 | 0.5 | Borderline |
| 2.5 | 3.5 | 1.0 | Shock needed |
| 2.0 | 4.0 | 2.0 | Shock immediately |

**Action**: If CC > 0.5 ppm, shock to 5+ ppm FAC to break chloramines.

## Cyanuric Acid (CYA) — FreshWater Salt System Guidance

**Per Hotspring Dealer FAQ: Zero is preferred, up to 50 ppm acceptable.**

| CYA Level | Status | Action |
|-----------|--------|--------|
| 0 ppm | Ideal | None needed |
| 1-50 ppm | Acceptable | Monitor |
| 51-100 ppm | Elevated | Plan drain |
| >100 ppm | Chlorine lock | Drain required |

**Why zero is preferred for this installation:**
- Hot tub is **covered** → minimal UV exposure → no need for UV protection
- Salt system generates chlorine **continuously** → no "stored" chlorine to protect
- CYA **inhibits chlorine effectiveness** → worse in hot tubs with high bather density
- High CYA causes "chlorine lock" where chlorine is bound and inactive

**CYA accumulation:**
- Sodium dichlor adds ~0.9 ppm CYA per tsp per 335 gallons
- CYA does not evaporate or degrade — only decreases via dilution
- The 12-month drain interval helps manage CYA buildup
- If CYA lock occurs, switch to unstabilized chlorine (liquid sodium hypochlorite)

**Source:** FreshWater Salt System Dealer FAQ — "What is the recommended Cyanuric acid level for use with Salt System? Zero is a preferred level, however up to 50 ppm is acceptable."
