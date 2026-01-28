# Verify Identity Workflow

**Purpose:** Confirm you've found the correct person, especially when dealing with common names or multiple candidates

**When to Use:**
- Multiple possible matches found for a common name
- Need to confirm identity before contact
- Single source match needs verification
- User wants to ensure they have the right person

---

## Verification Checklist

### Core Identity Markers

| Marker | Check | Weight |
|--------|-------|--------|
| **Age/DOB** | Does the age match expected range? | High |
| **Location History** | Does address progression make sense? | High |
| **Family Connections** | Do relative names match known info? | High |
| **Employment/Education** | Does career/school align with context? | Medium |
| **Physical Appearance** | Do photos match (if available)? | High |

### Verification Matrix

```
□ Age/DOB matches expected range
□ Location history makes sense chronologically
□ Family connections match known information
□ Employment/education aligns with context
□ Photos (if available) match known appearance
□ Multiple independent sources confirm same data
```

---

## Common Name Disambiguation

When dealing with names like "John Smith" or "Maria Garcia":

### Step 1: Add Specificity Filters

Require matches to include:
- **Location:** Current or historical city/state
- **Age:** Within 5-year window
- **Context:** Employer, school, or known association

### Step 2: Cross-Reference Multiple Data Points

Don't accept a match unless 2+ of these align:
- DOB or age
- Address (current or historical)
- Family member names
- Professional history

### Step 3: Timeline Analysis

Build a life timeline and check for consistency:

```
Expected Timeline:
- 1985: Born (based on "class of 2005" → ~18 in 2005)
- 2001-2005: University of Texas (known context)
- 2005-2010: [Unknown - gap to fill]
- 2010-present: [Unknown]

Candidate A Timeline:
- 1986: Born (close enough)
- 2004-2008: University of Texas (matches!)
- 2008-2012: Austin startup (location matches)
- 2012-present: San Francisco

Verdict: Timeline consistent, HIGH confidence
```

### Step 4: Family Network Verification

Cross-reference family members found:
- Do parents' names appear in both user's memory and search results?
- Do siblings' ages make sense relative to subject?
- Is spouse/partner name consistent across sources?

---

## Photo Verification

If photos are available from multiple sources:

### Visual Comparison Points
- Face shape and features
- Approximate age in photos vs. expected
- Distinguishing characteristics
- Background context (location, setting)

### Reverse Image Search
Use image search to find if same photo appears on verified profiles:
- LinkedIn (usually accurate)
- Company websites
- News articles

### Caution
- Photos can be outdated
- Some people have limited online photos
- Don't rely solely on photos for common names

---

## Confidence Scoring

### HIGH Confidence (Safe to contact)
- 3+ unique identifiers match
- Independent sources confirm
- Timeline is consistent
- Family connections verified

**Example:** Name + DOB + address + employer all match across TruePeopleSearch, LinkedIn, and property records.

### MEDIUM Confidence (Verify before contact)
- 2 identifiers match
- Timeline is consistent
- Some gaps in verification

**Example:** Name + location match, but DOB not confirmed. LinkedIn profile looks right but is sparse.

### LOW Confidence (Need more investigation)
- Single source match
- Name-only match
- Conflicting information

**Example:** Found a "John Smith" in Austin on Facebook, but no other corroborating data.

### POSSIBLE (Do not act)
- Partial match only
- Significant conflicting data
- Too many candidates remain

**Example:** Found 5 "John Smiths" in Texas, ages 35-45. Cannot distinguish without more information.

---

## Elimination Process

When multiple candidates exist:

### Step 1: List All Candidates

```
Candidate A: John Smith, 38, Austin TX, works at Dell
Candidate B: John Smith, 41, Austin TX, self-employed
Candidate C: John Smith, 36, Round Rock TX, teacher
```

### Step 2: Apply Known Filters

User said: "College roommate, graduated 2005, worked in tech"

```
Candidate A: Age 38 → Born ~1987 → Graduated ~2009 ❌
Candidate B: Age 41 → Born ~1984 → Graduated ~2006 ✓, tech? unknown
Candidate C: Age 36 → Born ~1989 → Graduated ~2011 ❌, teacher not tech ❌
```

### Step 3: Deep Dive on Remaining Candidates

For Candidate B:
- Check LinkedIn for education history
- Search for college mentions in social media
- Look for professional history in tech

### Step 4: Final Determination

Either:
- Confirm one candidate with HIGH confidence
- Narrow to 2-3 and ask user for more distinguishing info
- Conclude search is inconclusive if no clear match

---

## When to Conclude vs. Continue

### Conclude the Search When:
- HIGH confidence match achieved
- All available sources exhausted
- User has enough info to make contact decision

### Continue Investigating When:
- MEDIUM confidence but more sources available
- Multiple viable candidates remain
- New leads discovered that weren't pursued

### Ask User for More Info When:
- Common name with multiple matches
- Key distinguishing factor unknown
- User may have forgotten details that would help

---

## Output

```markdown
## Identity Verification Report: [Subject Name]

### Verification Summary
**Confidence Level:** [HIGH/MEDIUM/LOW/POSSIBLE]
**Recommendation:** [Safe to contact / Verify first / Need more info]

### Verified Identity Markers

| Marker | Expected | Found | Match |
|--------|----------|-------|-------|
| Age/DOB | ~38 (class of 2005) | 39 | ✓ |
| Location | Austin, TX | Austin, TX | ✓ |
| Education | UT Austin | UT Austin '05 | ✓ |
| Family | Brother named Mike | Michael Smith (brother) | ✓ |

### Timeline Analysis
- [Year]: [Event] - [Source]
- [Year]: [Event] - [Source]
- [Year]: [Event] - [Source]

### Cross-Reference Summary
- **Sources confirming this identity:** [List]
- **Conflicting information:** [None / List issues]

### Eliminated Candidates
- [Candidate name] - Eliminated because: [reason]

### Confidence Justification
[Explain why this confidence level was assigned]

### Recommended Next Steps
- [Action 1]
- [Action 2]
```
