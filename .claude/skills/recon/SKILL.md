---
name: recon
description: Security reconnaissance (passive/active). Use when recon, reconnaissance, bug bounty, attack surface, domain investigation, IP lookup, or infrastructure mapping.
---

# Recon Skill

**Infrastructure and Network Reconnaissance**

## Purpose

Technical reconnaissance of network infrastructure including domains, IP addresses, netblocks, and ASNs. Combines passive intelligence gathering with authorized active scanning to map attack surfaces and identify assets.

## When to Use This Skill

**Core Triggers:**

### Direct Recon Requests
- "do recon on [target]" or "run recon"
- "perform reconnaissance on [target]"
- "passive recon", "active recon"

### Infrastructure & Network Mapping
- "map infrastructure for [domain]"
- "find subdomains of [domain]"
- "enumerate [domain] infrastructure"

### IP & Domain Investigation
- "recon this IP" or "investigate this IP address"
- "domain recon" or "domain investigation"
- "DNS recon", "DNS enumeration"
- "WHOIS [domain/IP]"

### ASN & Netblock Research
- "investigate [ASN]" or "research ASN"
- "scan [CIDR range/netblock]"
- "enumerate netblock"

## Available Workflows

### 1. `workflows/PassiveRecon.md` - Safe Reconnaissance
Non-intrusive intelligence gathering using public sources:
- WHOIS data
- DNS records
- Certificate transparency
- IP geolocation lookups
- Reverse DNS
- No active scanning

**Input:** Domain, IP, or netblock
**Authorization:** None required

### 2. `workflows/DomainRecon.md` - Domain Investigation
Full domain mapping and enumeration:
- WHOIS domain registration
- DNS records (all types)
- Subdomain enumeration (certificate transparency)
- Mail server configuration
- IP addresses behind domain
- Certificate analysis

**Input:** Domain name
**Authorization:** Required for active subdomain probing

### 3. `workflows/IpRecon.md` - IP Address Investigation
Comprehensive IP address reconnaissance:
- IP geolocation (location, ASN, org)
- Reverse DNS
- WHOIS netblock info
- Certificate search
- Optional: Port scan (with authorization)

**Input:** Single IP address
**Authorization:** Required for active scanning

### 4. `workflows/NetblockRecon.md` - CIDR Range Investigation
Network range reconnaissance:
- CIDR parsing and validation
- WHOIS netblock ownership
- Sample IP investigation
- Optional: Live host discovery (with authorization)

**Input:** CIDR notation (e.g., 192.168.1.0/24)
**Authorization:** Required for active scanning

## Authorization Requirements

### Passive Reconnaissance (No Authorization Required)
- WHOIS lookups (domain and IP)
- DNS enumeration (A, AAAA, MX, NS, TXT, CNAME, SOA)
- Certificate transparency searches
- IP geolocation (IPInfo API)
- Reverse DNS lookups
- BGP/ASN information gathering
- Public database searches

### Active Reconnaissance (Requires Explicit Authorization)
- Port scanning
- Service detection and banner grabbing
- Technology fingerprinting
- Live host discovery
- HTTP/HTTPS probing
- SSL/TLS analysis

**CRITICAL AUTHORIZATION REQUIREMENTS:**

Active reconnaissance MUST have:
1. **Explicit user confirmation** for each active scan
2. **Documented authorization** (pentest engagement, bug bounty program, owned assets)
3. **Scope validation** (ensure target is in-scope)
4. **Rate limiting** (respectful scanning, no DoS)
5. **Session logging** (record all active recon for audit trail)

**Default behavior is PASSIVE ONLY.** Always confirm before active techniques.

## Relationship with Other Skills

**osint -> recon (Common Pattern):**
- OSINT identifies entities, companies, people (social/public records focus)
- Recon maps their technical infrastructure (network/system focus)
- Example: OSINT finds company -> Recon maps their domains/IPs/infrastructure

## Ethical and Legal Considerations

**CRITICAL RULES:**
1. **Authorization First** - Never perform active scanning without explicit authorization
2. **Scope Validation** - Ensure targets are in-scope for testing
3. **Rate Limiting** - Respectful scanning, no DoS or aggressive techniques
4. **Documentation** - Log all recon activities with timestamps and authorization
5. **Responsible Disclosure** - If vulnerabilities found, follow responsible disclosure
6. **No Destructive Testing** - Reconnaissance only, no exploitation

**Authorization Types:**
- Pentest engagement (written SOW/contract)
- Bug bounty program (in-scope targets only)
- Owned assets (your own infrastructure)
- Research lab/CTF environments

**Never scan:**
- Systems without permission
- Out-of-scope targets
- Critical infrastructure
- Government systems (without specific authorization)

**When in doubt:** Ask for explicit confirmation and documented authorization.

## File Organization

**Reports saved to:**
- `.superpowers/recon/YYYY-MM-DD-[target]/` - For investigation artifacts
