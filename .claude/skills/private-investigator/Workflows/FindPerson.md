# Find Person - Complete Investigation Workflow

**Purpose:** Systematically locate a person using all available public data sources

**When to Use:**
- User wants to find a specific person by name
- User wants to reconnect with an old friend, classmate, or contact
- User needs to locate someone for legitimate purposes

---

## Step 1: Gather Initial Information

Collect all available starting data from the user.

**Questions to Ask:**
1. What is the person's full name? (including maiden name, nicknames, variations)
2. What is their approximate age or date of birth?
3. Where did you last know them to be located?
4. How do you know this person? (school, work, family, etc.)
5. When did you last have contact?
6. Do you have any old phone numbers, emails, or addresses?
7. Do you know any family members or mutual contacts?
8. Do you have any photos of them?

**Build Subject Profile:**
```
Name: [Full name]
Aliases/Variations: [Maiden name, nicknames, spelling variations]
Age/DOB: [Approximate or exact]
Last Known Location: [City, State]
Connection Context: [How user knows them]
Last Contact: [Year/timeframe]
Known Associates: [Family, friends, colleagues]
Additional Identifiers: [Old phone, email, employer, school]
```

---

## Step 2: Parallel Investigation

**Use the `dispatching-parallel-agents` skill pattern.**

### Independent Search Domains

| Domain | Agent Task | Data Sources |
|--------|------------|--------------|
| People Aggregators | Search for [NAME] on people search sites | TruePeopleSearch, FastPeopleSearch, Spokeo |
| Social Media | Find [NAME]'s social media presence in [LOCATION] | LinkedIn, Facebook, Instagram, X |
| Public Records | Search public records for [NAME] in [STATE] | Property, voter, court, business filings |

### Agent Prompt Template

Each agent receives:

```markdown
Search for [FULL NAME] with these details:
- Location: [CITY, STATE]
- Age: approximately [AGE]
- Context: [HOW USER KNOWS THEM]
- Spelling variations to try: [LIST]

Your search domain: [ASSIGNED DOMAIN]

Search these sources: [SOURCE LIST]

Return:
- All addresses found (current and historical)
- All phone numbers discovered
- All relatives/associates mentioned
- Social media profile URLs (if applicable)
- Official records found (if applicable)
- Confidence level for each finding (HIGH/MEDIUM/LOW)
- Which spelling variations returned results
```

### Dispatch

Launch all domain agents in a single message with multiple Task tool calls.

---

## Step 3: Synthesize Findings

When agents return, cross-reference their results:

**Address Verification:**
- Do multiple sources show the same current address?
- Does address history show logical progression?

**Family Verification:**
- Do relative names appear consistently across sources?
- Do ages/relationships make sense?

**Timeline Verification:**
- Does the life history make sense chronologically?
- Do employment/education dates align with known context?

**Compile Master List:**
```
Addresses Found:
- [Address 1] - Sources: [list] - Confidence: [level]
- [Address 2] - Sources: [list] - Confidence: [level]

Phone Numbers:
- [Number 1] - Sources: [list] - Confidence: [level]

Relatives/Associates:
- [Name] - Relationship: [if known] - Sources: [list]

Social Media:
- [Platform]: [URL] - Confidence: [level]
```

---

## Step 4: Reverse Lookups on Discovered Info

For each phone number, email, or username found:

**Invoke:** `Workflows/ReverseLookup.md`

This may reveal:
- Additional accounts linked to email
- More phone numbers for same person
- Cross-platform username usage

---

## Step 5: Associate Network Mapping

If direct search yields limited results, investigate known associates:

1. Search each relative/associate name found in Step 3
2. Check their social media for subject mentions/tags
3. Look for mutual connections on LinkedIn
4. Search for family events (weddings, obituaries) that may mention subject

**Associate Search Strategy:**
- Parents often have more stable addresses
- Siblings may be connected on social media
- Spouse/partner records may show current address
- Colleagues may have professional network connections

---

## Step 6: Verification

**Invoke:** `Workflows/VerifyIdentity.md`

Before concluding, verify you found the correct person using:
- Age/DOB match
- Location history consistency
- Family connection match
- Employment/education alignment
- Photo comparison (if available)

---

## Step 7: Compile Investigation Report

```markdown
# People Search Report: [Subject Name]

**Search Date:** [Date]
**Confidence Level:** [HIGH/MEDIUM/LOW]

## Subject Profile
- **Name:** [Full name]
- **Age:** [Approximate/confirmed]
- **Last Known Location:** [From original request]

## Findings

### Current Contact Information
- **Address:** [Current address if found]
- **Phone:** [Phone numbers found]
- **Email:** [Email addresses found]

### Social Media Presence
- **LinkedIn:** [URL or "Not found"]
- **Facebook:** [URL or "Not found"]
- **Instagram:** [URL or "Not found"]
- **Other:** [Any additional platforms]

### Verification Points
- [Point 1 that confirms identity]
- [Point 2 that confirms identity]
- [Point 3 that confirms identity]

### Investigation Path
1. [Source 1] → [What was found]
2. [Source 2] → [What was found]
3. [Source 3] → [What was found]

## Confidence Assessment
[Explanation of why confidence level was assigned]

## Recommended Next Steps
- [Suggested action 1]
- [Suggested action 2]

## Sources Used
- [List all sources checked]

---
*This investigation used only publicly available information*
```

---

## Common Challenges

### Common Name
**Solution:** Require location + age + additional identifier. Use timeline analysis and family verification to disambiguate.

### No Results in People Search
**Solution:** Try spelling variations (maiden name, nickname, ethnic variations). Expand location search. Focus on social media and public records.

### Subject Has Minimal Online Presence
**Solution:** Focus on public records (property, voter). Search through family members. Check professional licenses if applicable.

### Multiple Possible Matches
**Solution:** Use VerifyIdentity workflow to eliminate candidates based on timeline, family, and corroborating data.
