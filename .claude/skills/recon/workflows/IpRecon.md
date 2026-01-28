# IP Address Reconnaissance Workflow

**Comprehensive investigation of individual IP addresses**

## Purpose

Perform detailed reconnaissance on a specific IP address to gather:
- Geolocation and hosting information
- Network ownership and ASN details
- Reverse DNS and hostnames
- Open ports and running services (with authorization)
- Associated domains and certificates
- Historical data and reputation

## When to Use

- Investigating suspicious IP addresses
- Mapping infrastructure for known IPs
- Pentest reconnaissance on target IPs
- Threat intelligence on malicious IPs
- Network asset inventory
- Called by domain-recon for discovered IPs
- Called by OSINT for entity infrastructure mapping

## Input

**Single IP address in IPv4 or IPv6 format:**
- IPv4: `1.2.3.4`
- IPv6: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

## Authorization Levels

### Passive Mode (Default - No Authorization Required)
- IP geolocation lookup
- Reverse DNS
- WHOIS netblock information
- Certificate transparency search
- Public database queries
- No packets sent to target

### Active Mode (Requires Authorization)
- Port scanning
- Service detection
- Banner grabbing
- Technology fingerprinting
- SSL/TLS probing

**Always start with passive. Only proceed to active with explicit authorization.**

## Workflow Steps

### Phase 1: Validation

**Step 1.1: Validate IP Address**
Ensure the IP is properly formatted (IPv4 or IPv6).

**Step 1.2: Check for Special IP Ranges**
Identify if IP is:
- Loopback (127.x.x.x)
- Private (10.x.x.x, 172.16-31.x.x, 192.168.x.x)
- Link-local (169.254.x.x)
- Multicast (224-239.x.x.x)

### Phase 2: Passive Intelligence Gathering

**Step 2.1: IP Geolocation Lookup**

Using WebSearch or WebFetch:
```
IP info for: 1.2.3.4
```

**Extracts:**
- Geographic location (city, region, country)
- ASN number and organization
- Hosting provider type
- Abuse contact

**Step 2.2: Reverse DNS Lookup**

```bash
dig -x 1.2.3.4 +short
```

**Extracts:**
- PTR records (hostnames)
- Compare with other data sources
- Note discrepancies

**Step 2.3: WHOIS Netblock Information**

```bash
whois 1.2.3.4
```

**Extracts:**
- CIDR netblock
- Organization name
- Registration date
- Abuse email
- Technical contact
- RIR (ARIN, RIPE, APNIC, etc.)

**Step 2.4: Certificate Transparency Search**

```bash
curl -s "https://crt.sh/?q=1.2.3.4&output=json" | jq
```

**Discovers:**
- Domains hosted on this IP
- Hostnames associated
- Certificate issuers

**Step 2.5: DNS Forward Lookups**

If reverse DNS found hostname, verify forward resolution:
```bash
dig [hostname] A
```

### Phase 3: Active Reconnaissance (Authorization Required)

**AUTHORIZATION CHECK:**
Active reconnaissance MUST have explicit authorization.

**Step 3.1: Port Scanning (if authorized)**

Identify open ports and services.

**Step 3.2: Service Detection (if authorized)**

Detect HTTP/HTTPS services and technologies.

**Step 3.3: Banner Grabbing (if authorized)**

Retrieve service banners for version information.

**Step 3.4: SSL/TLS Analysis (if authorized)**

Analyze certificate details and TLS configuration.

## Output Report Template

```markdown
# IP Reconnaissance: 1.2.3.4

## Summary
- IP: 1.2.3.4
- Organization: [name]
- ASN: [number]
- Location: [city, region, country]
- ISP: [provider]
- Type: [hosting/business/residential]

## DNS
- Reverse DNS: [hostname]

## Network Information
- CIDR: [range]
- Netblock Owner: [organization]
- Abuse Contact: [email]

## Certificates (Passive)
- Domains found: [list]

## Services (Active - if authorized)
- Open Ports: [list]
- Services: [list with versions]
- Technologies: [list]

## Recommendations
- [Further investigation areas]
- [Security observations]
```

## Success Criteria

### Passive Recon Complete
- IP geolocation retrieved
- Reverse DNS checked
- WHOIS netblock info gathered
- Certificate search performed
- Report generated

### Active Recon Complete (if authorized)
- Authorization documented
- Port scan completed
- Service detection performed
- Technology fingerprinting done
- No DoS or destructive techniques used

---

**Key Principle:** Always start passive. Only go active with explicit authorization and documentation.
