# Excellence Criteria

"Good design" is vague. Excellence is specific, measurable, and varies by modality.

## Universal Excellence Markers

These apply regardless of modality:

### Invisible Interface

The best interface is one users don't notice. They notice the task, the outcome, the content—not the tool. When someone says "that interface was beautiful," something failed. When they say "that was easy," excellence was achieved.

**Measure:** Task completion without interface-directed attention. Users shouldn't think about how to do things; they should think about what they're doing.

### Inevitable Interaction

Every interaction should feel like the obvious choice in retrospect. Users shouldn't wonder "why is it this way?" because the answer is self-evident. If a design decision requires explanation, it probably should have been different.

**Measure:** First-time success rate. How often do users choose the correct action without trial and error?

### Proportional Friction

Friction should match stakes. Deleting a temporary file should be effortless. Deleting a user account should require confirmation. This seems obvious but is routinely violated—either by adding friction to low-stakes actions (death by confirmation dialogs) or removing it from high-stakes ones (one-click disasters).

**Measure:** Friction-to-stakes ratio. Easy things easy, hard things possible, dangerous things protected.

### Recovery by Default

Systems fail. Users err. Excellence means errors are recoverable by design, not by heroic intervention. Undo isn't a feature; it's a fundamental property.

**Measure:** Mean time to recovery from common errors. Distance from error to restored state.

## GUI Excellence

### Information Hierarchy

The eye should know where to go before the brain catches up. Visual hierarchy isn't decoration—it's instruction.

**Markers:**
- Primary action obvious within 100ms
- Scanning pattern follows intended reading order
- Status visible without searching
- Density appropriate to frequency (daily use can be denser)

**Test:** Screenshot at 50% size, blurred. Can you still identify the primary action?

### Interaction Cost

Every click, scroll, and keystroke has a cost. Excellence minimizes total cost for common tasks while keeping rare tasks possible.

**Markers:**
- Common tasks: minimal clicks from starting state
- Fitts's Law respected: frequent targets large and near current focus
- Keyboard shortcuts for power users
- No scroll to find primary action

**Test:** Count interactions for the five most common tasks. Each should be optimal for its frequency.

### State Clarity

User should always know: Where am I? How did I get here? What can I do? What happens if I do it?

**Markers:**
- Current state visible without action
- Available actions discoverable
- Consequences of actions predictable
- Return path obvious

**Test:** Show interface to new user for 5 seconds. Ask: What is this for? What would you do first?

### Error Prevention and Recovery

Preventing errors beats recovering from them. But recovery must exist.

**Markers:**
- Constraints prevent impossible states
- Warnings before destructive actions
- Undo available for reversible actions
- Error messages explain and guide

**Test:** Deliberately try to break it. How hard is it? How far can you recover?

## CLI Excellence

### Discoverability Without Manuals

A CLI should teach itself. `--help` isn't a dump of flags; it's a guide to usage.

**Markers:**
- `--help` shows common use cases, not just options
- Error messages suggest correct syntax
- Tab completion where possible
- Examples with realistic values

**Test:** New user with `--help` only. Can they complete basic task without searching?

### Composability

Unix philosophy: do one thing well, compose with others. Commands should produce output that other commands can consume.

**Markers:**
- Machine-readable output option (JSON, TSV)
- Quiet mode for scripting
- Exit codes meaningful
- Stdin/stdout/stderr used correctly

**Test:** Can this command be used in a shell pipeline? A script?

### Sensible Defaults

Simple case should be simple. Complex case should be possible.

**Markers:**
- Zero-argument invocation does something useful
- Most common options are defaults
- Required arguments are truly required
- Flags override defaults, not replace them

**Test:** What's the minimum command for the most common use case?

### Forgiveness

Typos happen. Confirmation before destruction.

**Markers:**
- Confirmation for destructive operations
- Dry-run option available
- Similar flag suggestions on typo
- `--force` for intentional override

**Test:** What happens if I typo a flag? What happens if I typo a filename?

## Voice/Aural Excellence

### Turn Clarity

User must know: Is the system listening? Did it hear me? Whose turn is it?

**Markers:**
- Clear audio/visual listening indicator
- Immediate acknowledgment of input
- Explicit turn transition ("Okay, searching for...")
- Timeout with graceful recovery

**Test:** In noise, can user tell if system is listening?

### Disambiguation Without Frustration

Ambiguity is inevitable. Resolution should be fast and non-repetitive.

**Markers:**
- Clarification questions are specific
- Options presented are distinct
- Previous context reduces re-asking
- Fallback to GUI when voice fails

**Test:** Ambiguous command followed by clarification. How many turns to resolution?

### Brevity

Every word costs attention. System speech should be minimal.

**Markers:**
- Confirmations short ("Done" not "I have completed the action you requested")
- Information delivered in priority order
- User can interrupt
- Verbosity scales to stakes

**Test:** Word count for standard confirmations. Under 5 words preferred.

### State Transparency

Voice interfaces are stateless from user perspective. Make state audible.

**Markers:**
- Current context recapped briefly
- Pending actions named
- Queue position indicated if waiting
- Easy full state query ("What's my status?")

**Test:** User returns after interruption. How quickly can they orient?

## Agentic Excellence

### Calibrated Trust

Agent should be confident when right, uncertain when uncertain, and ask when stakes are high.

**Markers:**
- Confidence expressed appropriately
- Uncertainty triggers clarification
- High-stakes decisions require confirmation
- Learning improves calibration over time

**Test:** Give edge cases. Does agent ask or assume? Does confidence match accuracy?

### Transparent Operation

Users don't need to understand everything, but must know what's happening.

**Markers:**
- Current activity visible (even simplified)
- Progress toward goal clear
- Blockers surfaced immediately
- Reasoning available if requested

**Test:** Agent working for 30 seconds. Can user describe what it's doing?

### Graceful Degradation

Partial success is better than opaque failure.

**Markers:**
- Partial results delivered if full goal impossible
- Specific failure explanation (not "something went wrong")
- Manual takeover path clear
- What succeeded preserved

**Test:** Interrupt or complicate task mid-execution. What happens to partial work?

### Control Without Micromanagement

User should steer, not drive.

**Markers:**
- Easy pause/resume
- Redirect without restart
- Preferences learned, not re-asked
- Override without punishment

**Test:** User changes mind mid-task. How much work is lost?

## Cross-Cutting Excellence Metrics

For any modality, measure these:

| Metric | Excellent | Good | Unacceptable |
|--------|-----------|------|--------------|
| First-time success rate | >90% | >75% | <60% |
| Time to common task | Optimal | 1.5× optimal | >3× optimal |
| Error recovery time | <30s | <2min | Unrecoverable |
| Learning curve | 1 session | 1 week | 1 month |
| Expert/novice speed ratio | <2× | <4× | >10× |

## The Ultimate Test

Show the interface to someone who's never seen it but understands the problem domain. 

If they can complete the primary task without instruction, that's good design.

If they don't remember using an interface at all—just accomplishing a goal—that's excellent design.
