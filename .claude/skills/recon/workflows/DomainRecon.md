# Domain Reconnaissance Workflow

**Comprehensive domain infrastructure mapping and enumeration**

## Purpose

Perform full reconnaissance on a domain to discover:
- Domain registration and ownership details
- DNS configuration and records
- Subdomains and related assets
- Mail infrastructure and email security
- IP addresses and hosting providers
- Certificate details and history
- Attack surface mapping

## When to Use

- Investigating target domains for pentesting
- Mapping organization's internet-facing infrastructure
- Bug bounty reconnaissance
- Attack surface assessment
- Called by OSINT for entity infrastructure mapping
- Threat intelligence on malicious domains

## Input

**Domain name (FQDN):**
- Root domain: `example.com`
- Subdomain: `api.example.com`
- Internationalized domain: `example.de`

## Workflow Modes

### Passive Mode (Default)
- WHOIS lookup
- DNS enumeration
- Certificate transparency
- Public database searches
- No direct probing of subdomains

### Active Mode (Requires Authorization)
- Subdomain brute forcing
- HTTP/HTTPS probing
- Technology detection
- Vulnerability scanning
- Service fingerprinting

## Workflow Steps

### Phase 1: Domain Validation & WHOIS

**Step 1.1: Validate Domain Name**
Ensure the domain is properly formatted.

**Step 1.2: WHOIS Lookup**
```bash
whois example.com
```

**Extract:**
- Registrar
- Registration Date
- Expiration Date
- Status
- Name Servers
- Registrant (if not privacy-protected)
- DNSSEC status

### Phase 2: DNS Enumeration

**Step 2.1: Core DNS Records**

```bash
# A records (IPv4)
dig example.com A +short

# AAAA records (IPv6)
dig example.com AAAA +short

# MX records (mail servers)
dig example.com MX +short

# NS records (name servers)
dig example.com NS +short

# SOA record (zone authority)
dig example.com SOA +short

# TXT records (various metadata)
dig example.com TXT

# CNAME records (for www typically)
dig www.example.com CNAME +short
```

**Step 2.2: Mail Infrastructure Analysis**

```bash
# MX records with priority
dig example.com MX

# SPF record
dig example.com TXT | grep "v=spf1"

# DMARC policy
dig _dmarc.example.com TXT

# DKIM selectors (common ones)
dig default._domainkey.example.com TXT
dig google._domainkey.example.com TXT
dig k1._domainkey.example.com TXT
```

**Email Security Assessment:**
- SPF: Check for sender policy framework
- DMARC: Check for domain-based message authentication
- DKIM: Check for domain keys identified mail

### Phase 3: Subdomain Enumeration

**Step 3.1: Certificate Transparency**

```bash
# Query crt.sh for all certificates
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq

# Extract unique subdomains
curl -s "https://crt.sh/?q=%.example.com&output=json" | \
  jq -r '.[].name_value' | \
  sed 's/\*\.//g' | \
  sort -u
```

**Categorize interesting subdomains:**
- Administrative interfaces (admin, panel, dashboard)
- API endpoints (api, rest, graphql)
- Development/staging (dev, test, staging, uat)
- Internal systems (internal, intranet, vpn)
- Mail systems (mail, smtp, webmail)

### Phase 4: IP Address Enumeration

**Step 4.1: Resolve All Discovered Domains**

For each subdomain found, resolve to IP addresses and note hosting providers.

**Step 4.2: Identify Hosting Providers**

Group IPs by hosting provider to understand infrastructure.

### Phase 5: Active Probing (Authorization Required)

**AUTHORIZATION CHECK:**
Active subdomain probing requires explicit authorization.

**Step 5.1: HTTP/HTTPS Probing (if authorized)**

Test discovered subdomains for live web applications.

**Step 5.2: Technology Detection (if authorized)**

Detect technologies on each live webapp.

### Phase 6: Certificate Analysis

**Step 6.1: Current Certificates**

For each HTTPS endpoint, extract certificate details:
- Common Name (CN)
- Subject Alternative Names (SANs)
- Issuer
- Validity period
- Serial number

**Step 6.2: Historical Certificates**

Check certificate transparency logs for historical data.

## Output Report Template

```markdown
# Domain Reconnaissance: example.com

## Summary
- Domain: example.com
- Registrar: [name]
- Registration: [date]
- Expiry: [date]
- Subdomains Found: [count]
- IPs Discovered: [count]

## Domain Registration (WHOIS)
[WHOIS details]

## DNS Records
### A Records
[list]

### MX Records
[list]

### NS Records
[list]

### TXT Records
[list]

## Email Security
- SPF: [configured/missing]
- DMARC: [policy]
- DKIM: [status]

## Subdomains
[list categorized by type]

### Interesting Subdomains
- admin.example.com (administrative interface)
- api.example.com (API endpoint)
- staging.example.com (non-production)

## IP Addresses
[list with hosting provider info]

## Recommendations
[areas requiring further investigation]
```

## Success Criteria

### Passive Recon Complete
- WHOIS data retrieved
- DNS records enumerated (A, AAAA, MX, NS, TXT, SOA)
- Email security assessed (SPF, DMARC, DKIM)
- Certificate transparency searched
- Subdomains enumerated (passive methods)
- IP addresses identified
- Hosting providers mapped
- Report generated

### Active Recon Complete (if authorized)
- Authorization documented
- Live web applications probed
- Technology stack detected
- Comprehensive attack surface mapped
- No aggressive techniques used

---

**Key Principle:** Domain recon provides the foundation for all subsequent security testing. Be thorough in enumeration and careful about what you expose.
