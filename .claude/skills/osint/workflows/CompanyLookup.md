# Company OSINT Lookup Workflow

**Purpose:** Comprehensive business intelligence gathering for authorized research, due diligence, or security assessments.

**Authorization Required:** Explicit authorization, defined scope, legal compliance confirmed.

## Phase 1: Authorization & Scope

**VERIFY BEFORE STARTING:**
- [ ] Explicit authorization from client
- [ ] Clear scope (target company, information types, purpose)
- [ ] Legal compliance confirmed
- [ ] Documented in engagement paperwork

**STOP if any checkbox is unchecked.**

## Phase 2: Entity Identification

**Collect initial identifiers:**
- Legal company name(s) and DBAs
- Known domains
- Known personnel (founders, executives)
- Geographic location
- Industry/sector
- Corporate structure

## Phase 3: Business Registration Research

**Corporate filings:**
- Secretary of State registrations (all relevant states)
- Federal registrations (SEC if applicable)
- Foreign qualifications
- DBA/fictitious name registrations

**Regulatory registrations:**
- Industry-specific licenses
- Professional certifications
- Securities registrations

## Phase 4: Domain & Digital Assets

**Domain enumeration (7 techniques):**
1. Certificate Transparency logs (crt.sh)
2. DNS enumeration
3. Search engine discovery
4. Social media bio links
5. Business registration website fields
6. WHOIS reverse lookups
7. Related TLD checking

## Phase 5: Technical Infrastructure

**For each discovered domain:**
- DNS records (A, MX, TXT, NS)
- IP resolution and geolocation
- Hosting provider identification
- SSL/TLS certificate analysis
- Technology stack (BuiltWith, Wappalyzer)
- Security posture (SPF, DKIM, DMARC)

## Phase 6: Deploy Researcher Fleet

**Launch 6-8 researchers in parallel:**

```
// Business Entity
Task({ subagent_type: "general-purpose", prompt: "Verify business registrations for [company]" })

// Leadership
Task({ subagent_type: "general-purpose", prompt: "Research founder and executive backgrounds for [company]" })

// Financial Intelligence
Task({ subagent_type: "general-purpose", prompt: "Research funding history and financial health for [company]" })

// Legal/Regulatory
Task({ subagent_type: "general-purpose", prompt: "Search for legal issues and regulatory actions for [company]" })

// Media Coverage
Task({ subagent_type: "general-purpose", prompt: "Analyze media coverage and reputation for [company]" })

// Competitive Intelligence
Task({ subagent_type: "general-purpose", prompt: "Map competitive landscape and market position for [company]" })
```

## Phase 7: Intelligence Synthesis

**Consolidate findings:**
- Business legitimacy indicators
- Leadership credibility assessment
- Financial health signals
- Regulatory compliance status
- Reputation analysis
- Red flags identified

**Report structure:**
- Executive summary
- Company profile
- Leadership analysis
- Financial assessment
- Regulatory status
- Risk assessment
- Sources consulted

## Quality Gates

**Before finalizing report:**
- [ ] All domains discovered and analyzed
- [ ] Business registrations verified
- [ ] Leadership backgrounds researched
- [ ] Multi-source verification (3+ sources per claim)
- [ ] Red flags investigated

---

**Reference:** See `references/CompanyTools.md` for tool details.
