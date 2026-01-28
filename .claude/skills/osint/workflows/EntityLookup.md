# Entity/Threat Intel Lookup Workflow

**Purpose:** Technical intelligence gathering on domains, IPs, and potential threat actors for authorized security assessments.

**Authorization Required:** Explicit authorization, defined scope, legal compliance confirmed.

## Phase 1: Authorization & Scope

**VERIFY BEFORE STARTING:**
- [ ] Explicit authorization from client
- [ ] Clear scope (target entity, investigation purpose)
- [ ] Legal compliance confirmed (CFAA, responsible disclosure)
- [ ] Documented in engagement paperwork

**STOP if any checkbox is unchecked.**

## Phase 2: Entity Identification

**Collect initial identifiers:**
- Domain names
- IP addresses
- Email addresses
- File hashes (if malware related)
- Observed infrastructure

## Phase 3: Domain Intelligence

**For each domain:**
- WHOIS registration data
- DNS records (all types)
- Subdomain enumeration (crt.sh, passive sources)
- Historical DNS (if available)
- Certificate transparency logs
- Registrar and registration timeline

## Phase 4: IP Intelligence

**For each IP address:**
- Geolocation data
- ASN and organization
- Reverse DNS
- Historical WHOIS
- Shodan/Censys data (passive only)
- Reputation checks (AbuseIPDB, VirusTotal)

## Phase 5: Threat Intelligence

**Cross-reference with threat databases:**
- VirusTotal (domain/IP/hash lookup)
- AlienVault OTX (indicators of compromise)
- URLScan.io (URL analysis)
- Hybrid Analysis (if malware samples)
- MITRE ATT&CK mapping (if TTPs observed)

## Phase 6: Deploy Researcher Fleet

**Launch 4-6 researchers in parallel:**

```
// Domain Intelligence
Task({ subagent_type: "general-purpose", prompt: "Gather WHOIS, DNS, and certificate data for [domain]" })

// IP Intelligence
Task({ subagent_type: "general-purpose", prompt: "Research IP address [IP] - geolocation, ASN, reputation" })

// Threat Intel
Task({ subagent_type: "general-purpose", prompt: "Search threat intelligence databases for indicators related to [entity]" })

// Historical Analysis
Task({ subagent_type: "general-purpose", prompt: "Investigate historical data and timeline for [entity]" })
```

## Phase 7: Analysis & Attribution

**Synthesize findings:**
- Infrastructure mapping
- Timeline of activity
- Attribution indicators (if any)
- Confidence assessment
- Related entities discovered

**Report structure:**
- Executive summary
- Entity profile
- Technical indicators
- Threat assessment
- Attribution analysis (with confidence)
- Recommendations
- Sources consulted

## Ethical Guardrails

**NEVER:**
- Active scanning without authorization
- Exploitation of discovered vulnerabilities
- Accessing private systems
- Sharing sensitive indicators publicly without responsible disclosure

**ALWAYS:**
- Use only passive techniques unless explicitly authorized
- Document all findings with timestamps
- Report critical findings through proper channels
- Respect responsible disclosure practices

---

**Reference:** See `references/EntityTools.md` for tool details.
