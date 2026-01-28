# Passive Reconnaissance Workflow

**Safe, non-intrusive intelligence gathering using only public sources**

## Purpose

Perform reconnaissance on targets (domains, IPs, netblocks) using exclusively passive techniques that:
- Do NOT send packets directly to the target
- Do NOT trigger IDS/IPS systems
- Do NOT require authorization
- Use only public databases and third-party services

## When to Use

- Initial reconnaissance before active testing
- Gathering intelligence without target interaction
- Legal constraints prevent active scanning
- Stealth is required
- Quick information gathering
- Called by OSINT for infrastructure mapping

## Input Types

**Accepts:**
- Domain names (example.com, subdomain.example.com)
- IP addresses (1.2.3.4)
- CIDR ranges (192.168.1.0/24)
- ASN numbers (AS15169)

## Passive Techniques

### 1. WHOIS Lookups

**Domain WHOIS:**
```bash
whois example.com
```

**Extracts:**
- Registrar information
- Registration date
- Expiration date
- Name servers
- Registrant contact (if not privacy-protected)
- Domain status

**IP/Netblock WHOIS:**
```bash
whois 1.2.3.4
```

**Extracts:**
- Netblock owner organization
- CIDR range
- Allocation date
- Abuse contact email
- Geographic region

### 2. DNS Enumeration

**Record Types to Query:**
```bash
# A records (IPv4)
dig example.com A

# AAAA records (IPv6)
dig example.com AAAA

# MX records (mail servers)
dig example.com MX

# NS records (name servers)
dig example.com NS

# TXT records (SPF, DMARC, verification)
dig example.com TXT

# SOA records (zone authority)
dig example.com SOA
```

**Email Security Analysis:**
```bash
# SPF record
dig example.com TXT | grep "v=spf1"

# DMARC policy
dig _dmarc.example.com TXT
```

**Reverse DNS:**
```bash
dig -x 1.2.3.4
```

### 3. Certificate Transparency

**crt.sh Search:**
```bash
# Search for certificates
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq

# Extract unique subdomains
curl -s "https://crt.sh/?q=%.example.com&output=json" | \
  jq -r '.[].name_value' | \
  sed 's/\*\.//g' | \
  sort -u
```

**Extracts:**
- All subdomains ever certified
- Certificate issuers
- Certificate validity periods
- Historical subdomain data

### 4. IP Information

**Using WebFetch or curl:**
```bash
curl "https://ipinfo.io/1.2.3.4/json"
```

**Extracts:**
- IP address
- Hostname (reverse DNS)
- City, Region, Country
- Geographic coordinates
- ASN number
- Organization name
- ISP/hosting provider

### 5. ASN Information

**BGP Information:**
```bash
whois -h whois.radb.net AS15169
```

**Extracts:**
- ASN number
- Organization name
- All CIDR prefixes owned
- Country of registration

## Workflow Steps

### For Domain Targets

**Step 1: WHOIS Domain Info**
```bash
whois example.com
```
- Extract registration info
- Note name servers
- Check expiration date

**Step 2: DNS Enumeration**
```bash
dig example.com A AAAA MX NS TXT SOA
dig _dmarc.example.com TXT
```

**Step 3: Certificate Transparency**
```bash
curl -s "https://crt.sh/?q=%.example.com&output=json" | \
  jq -r '.[].name_value' | \
  sed 's/\*\.//g' | \
  sort -u
```

**Step 4: Compile Report**
- Domain registration details
- All DNS records
- All discovered subdomains
- Email security posture

### For IP Address Targets

**Step 1: IP Info Lookup**
- Geolocation
- ASN and organization
- Hosting provider

**Step 2: Reverse DNS**
```bash
dig -x 1.2.3.4
```

**Step 3: WHOIS Netblock**
```bash
whois 1.2.3.4
```

**Step 4: Compile Report**
- IP metadata
- Reverse DNS
- Netblock information

## Output Report Template

```markdown
# Passive Reconnaissance Report

**Target:** example.com
**Date:** YYYY-MM-DD
**Type:** Passive Only
**Authorization:** Not Required

## Summary
- Target Type: Domain
- IPs Discovered: [count]
- Subdomains Found: [count]
- ASN: [number]
- Organization: [name]

## Domain Registration (WHOIS)
- Registrar: [name]
- Registration Date: [date]
- Expiration Date: [date]
- Name Servers: [list]

## DNS Records
### A Records
- [IP addresses]

### MX Records
- [mail servers]

### TXT Records
- [SPF, DMARC, etc.]

## Subdomains (Certificate Transparency)
- [list of discovered subdomains]

## Email Security
- SPF: [configured/missing]
- DMARC: [policy]
- DKIM: [selectors found]

## Recommendations
- [Areas requiring further investigation]
- [Security observations]
```

## Best Practices

**Data Collection:**
1. Start broad (WHOIS, DNS)
2. Discover assets (cert transparency)
3. Map relationships (ASN, netblocks, reverse DNS)
4. Compile comprehensive view

**Documentation:**
- Save all raw output
- Timestamp all findings
- Note data sources
- Preserve for future comparison

**Legal:**
- Passive recon is generally legal (public data)
- Still respect ToS of data sources
- Don't abuse APIs or scrape aggressively

## Success Criteria

**Minimum viable recon:**
- WHOIS data retrieved
- Core DNS records enumerated (A, MX, NS)
- At least one IP address identified
- ASN determined
- Report generated

**Comprehensive recon:**
- All DNS record types queried
- Certificate transparency searched
- All subdomains enumerated
- All IPs analyzed
- Email security assessed
- Netblock ownership mapped
- Recommendations generated

---

**Remember:** Passive recon is about gathering intelligence without touching the target. If you need to send packets to the target, that's active recon and requires authorization.
