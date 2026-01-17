# Troubleshooting Reference - Hotspring Flair

## Salt System Status Indicators

### Control Panel Status

| Status | Color | Meaning | Action |
|--------|-------|---------|--------|
| System OK | Green | Operating normally | None |
| System Testing | — | Test in progress | Wait |
| 24-Hour Boost On | — | Running at max output | Normal if initiated |
| 10-Day Check | Flashing | Confirm output level | Test water, press OK |
| Low Output Mode | Yellow | System reduced output | Output not confirmed in 15-20 days |
| Inactive - System Off | — | Output level set to 0 | Increase if needed |
| Inactive - High Status | Red (right) | Salt too high | Dilute: drain 25%, refill |
| Inactive - Low Status | Red (left) | Salt/cartridge issue | Add salt, check cartridge |
| Cartridge 4 Months | — | Replacement reminder | Replace cartridge |
| Service Required | — | System error | Contact dealer |

### Logo Light Indicators

| Indicator | Color | Meaning |
|-----------|-------|---------|
| Power | Blue solid | Power on, normal |
| Power | Blue off | No power or control box issue |
| Power | Red flashing | High limit tripped |
| Ready | Green solid | Water within 2°F of set temp |
| Ready | Green off | Heating in progress |
| Ready | Red flashing | Temperature sensor issue |
| Status | Green | All functions normal |
| Status | Yellow | Attention needed |
| Status | Red flashing | Immediate attention required |

## Water Problems

### Cloudy Water

```
Cloudy Water
├── Check pH
│   └── >7.8? → Add sodium bisulfate (pH down)
├── Check FAC
│   └── <1 ppm? → Shock to 5 ppm with dichlor
├── Check filter
│   └── Dirty? → Clean immediately (soak in filter cleaner)
├── Check phosphates
│   └── >300 ppb? → Treat with phosphate remover
└── Still cloudy?
    └── Drain and refill
```

### Green Water / Algae

```
Green Water
├── Almost always: pH too high
│   └── At pH 8.0, only 21% of chlorine is active
├── Step 1: Lower pH to 7.2-7.4
│   └── Add sodium bisulfate
├── Step 2: Shock to 10 ppm FAC
│   └── ~8 tsp dichlor for 335 gal
├── Step 3: Run jets, brush surfaces
├── Step 4: Keep cover off 30 min to vent
└── If persistent after 48h:
    └── Drain and refill completely
```

### Green Tint with Scum/Film

```
Green + Scum
├── Likely cause: Biofilm + algae
├── pH was probably high for extended period
├── Drain completely
├── Clean shell with approved cleaner
├── Flush plumbing with pipe cleaner (optional)
├── Refill following fresh fill procedure
└── Maintain pH 7.2-7.4 going forward
```

### No Chlorine Reading

```
No FAC on test
├── Check output level
│   └── Below 6? → Increase to 6-7
├── Check 10-day timer
│   └── Not confirmed? → System auto-reduces to level 1-3
├── Check phosphates
│   └── >300 ppb? → Treat with phosphate remover (inhibits generation)
├── Check water temp
│   └── <95°F? → System less effective in cold water
├── Check cartridge age
│   └── >4 months? → Replace cartridge
├── Manual intervention:
│   ├── Add 4 tsp dichlor (shock to 5 ppm)
│   ├── Press Boost button (24h max output)
│   └── Retest in 24h
└── Still no reading at max output?
    └── Contact dealer - possible system issue
```

### Chlorine Smell (Chloramines)

```
Chlorine odor
├── Paradox: "Chlorine smell" = not enough chlorine
├── Cause: Combined chlorine (chloramines) from organic waste
├── Test: TC - FC = CC
│   └── CC > 0.5 ppm? → Shock needed
├── Treatment:
│   ├── Shock to 5+ ppm FAC
│   ├── Run jets on high
│   └── Leave cover off 20+ min (vent gases)
└── Prevention: Weekly shock treatment
```

### Foam

```
Foam on surface
├── Cause: Soap, oils, lotions, cosmetics
├── Temporary fix: Add defoamer
├── Root cause: Cannot oxidize soap out
├── If low CH: Soft water increases foaming
│   └── Check CH, raise if <25 ppm (but stay <75 for salt system)
└── Persistent foam:
    └── Drain and refill (only solution)
```

### Scale Buildup

```
White crusty deposits
├── Cause: Calcium hardness too high
├── Salt system requires 25-75 ppm CH
├── If >75 ppm:
│   ├── Use Vanishing Act calcium remover
│   └── Or drain 50% and refill with softened water
└── Prevention: Use Clean Screen pre-filter on fill
```

### Staining (Brown/Green)

```
Shell staining
├── Brown stains: Iron in water
├── Green stains: Copper in water
├── Treatment:
│   ├── Use iron/metal remover (chelating agent)
│   ├── Wait 24h before adding chlorine
│   └── Clean filters after treatment
└── Prevention: 
    ├── Use Clean Screen pre-filter
    └── Test fill water for metals
```

## Equipment Issues

### High Limit Tripped (Power indicator red flashing)

```
High limit trip
├── Cause: Water temp exceeded safe range OR flow restriction
├── Step 1: Wait 30 minutes (let system cool)
├── Step 2: Check filters
│   └── Dirty? → Clean immediately
├── Step 3: Check water level
│   └── Low? → Fill to proper level
├── Step 4: Reset breakers
│   ├── Turn both OFF
│   ├── Wait 30 seconds
│   └── Turn 30A ON first, then 20A
└── Recurring trips:
    └── Contact dealer - possible sensor or heater issue
```

### Jets Weak or Surging

```
Weak jets
├── Check water level
│   └── Low? → Fill to 1" above highest jet
├── Check air control lever
│   └── Closed? → Open by turning clockwise
├── Check filters
│   └── Dirty? → Clean
├── Check diverter position
│   └── Try both positions
└── Check for air in lines
    └── Run clean cycle, jets on high 2 min
```

### Cold Water on Refill (High Limit Issue)

```
Cold fill trip (<50°F water)
├── System may enter High Limit Protection
├── Recovery:
│   ├── Disconnect power completely
│   ├── Locate sensors on heater (equipment compartment)
│   ├── Warm sensors and vinyl tubing with hair dryer (10 min)
│   └── Reconnect power
└── Prevention: Fill with water >50°F
    └── Blend warm water with cold during fill
```

## Diagnostic Questions

When troubleshooting, gather this information:

1. **What do you see?**
   - Water color (clear, cloudy, green, milky)
   - Surface condition (foam, film, scum)
   - Shell condition (stains, scale)

2. **What do you smell?**
   - Chlorine odor (chloramines)
   - Musty odor (biofilm, algae)
   - No odor (normal)

3. **What are current readings?**
   - pH (meter or strip)
   - FAC and TAC (Taylor kit preferred)
   - Salt (strip or system status)
   - TA, CH if available

4. **What changed recently?**
   - New chemical added?
   - Heavy use?
   - Power outage?
   - Maintenance skipped?

5. **Control panel status?**
   - Any error codes?
   - Logo light colors?
   - Salt system status color?
