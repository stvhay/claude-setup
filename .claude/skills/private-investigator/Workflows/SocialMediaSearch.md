# Social Media Search Workflow

**Purpose:** Systematically search social media platforms to find a person's online presence

**When to Use:**
- User specifically wants to find someone's social media accounts
- Main investigation needs social media component
- Cross-platform correlation is needed

---

## Step 1: LinkedIn Search (Professional Presence)

LinkedIn is most reliable for professionals 30+.

### Method 1: Google X-Ray (Recommended)
```
site:linkedin.com/in "[Full Name]" "[City]"
site:linkedin.com/in "[Full Name]" "[Company Name]"
site:linkedin.com/in "[Full Name]" "[University]"
```

### Method 2: Direct LinkedIn Search
- Use LinkedIn's search bar with name
- Filter by: Location, Company, School, Industry
- Note: Limited results without Premium

### Method 3: Alumni Search
- If you share a school, use LinkedIn Alumni feature
- Filter by graduation year and major

**Record:**
- Profile URL
- Current employer and title
- Location
- Education history
- Connection count (helps verify correct person)

---

## Step 2: Facebook Search

### Method 1: Google X-Ray (Bypasses Facebook Limitations)
```
site:facebook.com "[Full Name]" "[City]"
site:facebook.com "[Full Name]" "[School]"
site:facebook.com "[Full Name]" "[Employer]"
```

### Method 2: Direct Search
- Search by name in Facebook search bar
- Filter by: Location, Education, Workplace
- Check "People" tab specifically

### Method 3: Mutual Friends
- If you have mutual friends, check their friend lists
- Look for tagged photos and mentions

### Advanced Techniques
- Search for family member profiles, then check their friends
- Look for group memberships (alumni groups, local groups)
- Check public events they may have RSVP'd to

**Record:**
- Profile URL
- Profile photo (for verification)
- Location listed
- Mutual friends if any
- Public posts/check-ins

---

## Step 3: Instagram Search

### Method 1: Direct Search
- Search by name in Instagram
- Search by username variations

### Method 2: Google X-Ray
```
site:instagram.com "[Full Name]"
site:instagram.com "[Username]"
```

### Method 3: Username Pattern Matching
Common patterns to try:
- firstname.lastname
- firstnamelastname
- firstinitial.lastname
- firstname_lastname
- lastname.firstname
- firstname[birthyear]

### Method 4: Location/Hashtag Search
- Search location tags in their city
- Search hashtags related to their profession/interests

**Record:**
- Username and profile URL
- Bio information
- Location tags in posts
- Cross-references to other platforms

---

## Step 4: X (Twitter) Search

### Method 1: X Advanced Search
```
from:username - Search specific user's tweets
"[Full Name]" - Search mentions
near:"[City]" within:15mi - Location filter
```

### Method 2: Google X-Ray
```
site:twitter.com "[Full Name]"
site:x.com "[Full Name]"
```

### Method 3: Username Search
- Try same username patterns as Instagram
- Check if username from other platforms exists on X

**Record:**
- Handle and profile URL
- Bio and location in profile
- Website links in bio
- Tweet activity level

---

## Step 5: TikTok Search

### Method 1: Direct Search
- Search by name or username in TikTok
- Check "Users" tab in search results

### Method 2: Google X-Ray
```
site:tiktok.com/@"[username]"
site:tiktok.com "[Full Name]"
```

### Method 3: Cross-Platform Username
- Try usernames found on other platforms

**Record:**
- Username and profile URL
- Bio information
- Content themes (helps verify correct person)

---

## Step 6: Username Enumeration

If you found a username, check across 400+ platforms.

### Sherlock (Command Line)
```bash
pip install sherlock-project
sherlock [username] --print-found
sherlock [username] -o results.txt
```

### WhatsMyName (Web)
- URL: https://whatsmyname.app
- Enter discovered username
- Returns all platforms where username exists

### Namechk (Web)
- URL: https://namechk.com
- Quick availability check across major platforms

**Record:**
- All platforms where username is claimed
- Which accounts appear active
- Profile consistency across platforms

---

## Step 7: Email Account Discovery

If you have an email address, find which services use it.

### Holehe (Command Line)
```bash
pip install holehe
holehe email@example.com
```
Checks 120+ services for account existence without sending notification.

### Epieos (Web)
- URL: https://epieos.com
- Enter email address
- Returns linked accounts and Google account info

### Hunter.io (Web)
- URL: https://hunter.io
- Best for corporate email patterns
- Find all emails at a domain

---

## Step 8: Cross-Reference and Verify

Confirm all found accounts belong to same person.

**Verification Points:**
1. **Photo Consistency:** Do profile photos match across platforms?
2. **Bio Consistency:** Similar job titles, locations, descriptions?
3. **Connection Overlap:** Do friends/followers overlap?
4. **Content Themes:** Similar interests and posting patterns?
5. **Timeline Consistency:** Does activity timeline make sense?

**Red Flags (May Be Wrong Person):**
- Drastically different photos
- Conflicting locations/ages
- No connection overlap with known associates
- Different professional background

---

## Output

```markdown
## Social Media Presence: [Subject Name]

### Confirmed Accounts (HIGH Confidence)
| Platform | URL | Username | Verified By |
|----------|-----|----------|-------------|
| LinkedIn | [URL] | [username] | Photo + employer match |
| Facebook | [URL] | [username] | Mutual friends + location |

### Probable Accounts (MEDIUM Confidence)
| Platform | URL | Username | Notes |
|----------|-----|----------|-------|
| Instagram | [URL] | [username] | Same username, location matches |

### Possible Accounts (LOW Confidence)
| Platform | URL | Username | Notes |
|----------|-----|----------|-------|
| Twitter | [URL] | [username] | Common name, needs verification |

### Username Patterns
- Primary pattern: [firstname.lastname]
- Found on: LinkedIn, Instagram, GitHub
```
