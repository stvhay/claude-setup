# Netblock Reconnaissance Workflow

**CIDR range and IP block investigation**

## Purpose

Perform reconnaissance on network blocks (CIDR ranges) to:
- Identify netblock ownership and allocation
- Discover live hosts in range
- Map infrastructure within network blocks
- Enumerate services across ranges
- Assess network segmentation
- Identify patterns and interesting hosts

## When to Use

- Pentesting entire network ranges
- Mapping organization's IP allocations
- Threat intelligence on attacker infrastructure
- Network asset inventory
- ISP/hosting provider investigation
- Called by domain-recon or ip-recon for related networks

## Input

**CIDR notation:**
- `/24` network: `192.168.1.0/24` (256 IPs)
- `/16` network: `10.0.0.0/16` (65,536 IPs)
- `/8` network: `10.0.0.0/8` (16,777,216 IPs)

## CRITICAL WARNING

**AUTHORIZATION ABSOLUTELY REQUIRED FOR ACTIVE SCANNING**

Scanning network ranges you don't own is:
- **Illegal** in most jurisdictions
- **Detectable** by IDS/IPS systems
- **Aggressive** and can cause service impact
- **Potentially criminal** (Computer Fraud and Abuse Act in US)

**NEVER perform active netblock scanning without:**
1. Explicit written authorization (pentest SOW)
2. Confirmed scope (target ranges in writing)
3. Coordination with target (contact info, scan window)
4. Rate limiting (respectful scanning)

**Passive reconnaissance OK. Active = MUST HAVE AUTHORIZATION.**

## Workflow Modes

### Passive Mode (Default - Safe)
- WHOIS netblock lookup
- Sample IP investigation (a few IPs only)
- ASN mapping
- Public database queries
- No mass scanning

### Active Mode (Requires Authorization)
- Live host discovery
- Port scanning across range
- Service detection
- Network mapping

## Workflow Steps

### Phase 1: CIDR Validation and Parsing

**Step 1.1: Validate CIDR Notation**

Parse and validate the CIDR:
- Network address
- Subnet mask
- First usable IP
- Last usable IP
- Total IPs in range

**Step 1.2: Assess Scan Size**

| Mask | IPs | Category | Recommendation |
|------|-----|----------|----------------|
| /24-/32 | 1-256 | Small | Safe to scan with authorization |
| /20-/23 | 257-4096 | Medium | Scan in batches, rate limit |
| /16-/19 | 4097-65536 | Large | Sample scan only |
| /8-/15 | 65537+ | Extremely Large | DO NOT scan entire range |

### Phase 2: Passive Netblock Intelligence

**Step 2.1: WHOIS Netblock Lookup**

```bash
whois -h whois.arin.net "n 192.168.1.0/24"
```

**Extracts:**
- NetRange (start - end IPs)
- CIDR blocks
- Organization name
- Registration date
- Allocation status
- Abuse contact
- Parent/child allocations

**Step 2.2: ASN Mapping**

```bash
whois -h whois.cymru.com " -v 192.168.1.1"
```

**Step 2.3: Sample IP Investigation**

For large ranges, sample representative IPs:
- First IP in range
- Last IP in range
- Middle IP
- Common offsets (.1, .10, .100, .254)

For each sample:
- IP geolocation lookup
- Reverse DNS
- Basic analysis

### Phase 3: Active Reconnaissance (Authorization Required)

**AUTHORIZATION CHECK:**

Before any active scanning:
1. Confirm written authorization exists
2. Verify scope includes this netblock
3. Confirm coordination with network owner
4. Document authorization for audit trail

**Step 3.1: Live Host Discovery (if authorized)**

Identify which IPs in the range are active.

**Step 3.2: Port Scanning (if authorized)**

For discovered live hosts, identify open ports.

**Step 3.3: Service Detection (if authorized)**

Probe services on discovered ports.

## Rate Limiting

**For any active scanning, implement rate limiting:**
- Respectful scanning (10-100 requests/second max)
- Progress logging
- Timeout handling
- Error handling

## Output Report Template

```markdown
# Netblock Reconnaissance: 192.168.1.0/24

## Summary
- CIDR: 192.168.1.0/24
- Total IPs: 256
- Usable IPs: 254
- Owner: [organization]
- ASN: [number]

## Netblock Details (WHOIS)
- NetRange: 192.168.1.0 - 192.168.1.255
- Organization: [name]
- Registration: [date]
- Abuse Contact: [email]

## Sample IP Analysis
### 192.168.1.1
- Reverse DNS: [hostname]
- Organization: [name]
- Type: [hosting/business]

### 192.168.1.100
- [similar analysis]

## Active Scan Results (if authorized)
- Live Hosts: [count]
- Open Ports: [summary]
- Interesting Hosts: [list]

## Recommendations
- [Further investigation areas]
- [Security observations]
```

## Success Criteria

### Passive Recon Complete
- CIDR parsed and validated
- WHOIS netblock info retrieved
- ASN identified
- Sample IPs investigated
- Report generated

### Active Recon Complete (if authorized)
- Authorization documented
- Live hosts discovered
- Port scans completed
- Services detected
- Rate limiting applied (no DoS)
- Coordination maintained

---

**Critical Reminder:** Never scan networks you don't own. Always get written authorization. Respect rate limits. Coordinate with network owners.
