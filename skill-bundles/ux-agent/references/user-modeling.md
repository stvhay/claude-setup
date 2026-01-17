# User Modeling

Build models that predict behavior, not personas that tell stories.

## The Behavioral Model

Demographics don't determine behavior. Job title, age, and location are proxies at best, noise at worst. Model what users *do*, not who they *are*.

### Core Dimensions

#### 1. Task Frequency

How often does this user perform this specific task?

| Frequency | Implications |
|-----------|--------------|
| **Continuous** (multiple times per hour) | Speed is everything. Every extra click costs. Keyboard shortcuts mandatory. Learn once, use forever. |
| **Daily** | Efficiency matters. Reasonable learning curve acceptable. Consistency reduces cognitive load. |
| **Weekly** | Reminders of how things work are welcome. Some re-learning expected. Clear signposting helps. |
| **Monthly** | Significant re-learning each session. Can't assume remembered shortcuts. Defaults matter more than customization. |
| **Quarterly+** | Treat as novice every time. Heavy progressive disclosure. Guide through workflow. |

#### 2. Expertise Gradient

Three orthogonal expertise dimensions:

**Domain expertise:** Understanding of the problem space (finance, medicine, logistics)
- High: Use domain terminology, skip explanations
- Low: Translate jargon, explain implications

**Interface convention expertise:** Familiarity with similar tools
- High: Follow conventions, surprise is costly
- Low: Guide expected interactions, explain patterns

**This-tool expertise:** Time spent with this specific interface
- High: Power features accessible, customization valuable
- Low: Sensible defaults, discoverable basics

Map each user segment across all three dimensions. A doctor (high domain) using software for the first time (low tool) needs different design than a medical billing clerk (medium domain) who's used the system for years (high tool).

#### 3. Error Patterns

Where do users predictably fail? What do they misunderstand?

**Error categories:**
- **Slip:** Knew the right action, did the wrong one (motor error, distraction)
- **Mistake:** Chose wrong action due to incorrect mental model
- **Violation:** Deliberately circumvented rules (often for good reasons)

**For each user segment, identify:**
- Most common slips → Design to prevent or recover
- Most common mistakes → Fix the mental model or the interface
- Common violations → Understand why rules are broken, possibly change rules

#### 4. Context of Use

When, where, and alongside what is this interface used?

**Temporal context:**
- Time pressure (urgent vs. leisurely)
- Time of day (alert vs. fatigued)
- Duration (quick check vs. extended session)

**Environmental context:**
- Physical location (desk, mobile, field)
- Interruption frequency
- Noise, lighting, privacy

**Concurrent context:**
- Other applications in use
- Other tasks in progress
- Collaboration or solo

**Implications:**
- High interruption → Preserve state aggressively, easy resumption
- Time pressure → Optimize for speed over comprehensiveness
- Mobile context → Accommodate variable connectivity, smaller targets

#### 5. Recovery Needs

When things go wrong, what does recovery look like?

**Questions:**
- What's the cost of an error? (Embarrassment? Money? Lives?)
- How do users currently recover?
- What does "undo" mean in this context?
- How far back might they need to go?
- Who helps when they're stuck?

## Building the Model

### Step 1: Identify Behavioral Segments

Group users by behavior, not demographics. Look for clusters along the dimensions above.

**Example segments for an analytics dashboard:**
- **Power analysts:** Daily use, high domain + tool expertise, deep analysis sessions
- **Executive reviewers:** Weekly use, high domain but low tool expertise, quick status checks
- **Occasional contributors:** Monthly use, varied domain expertise, need to input data

### Step 2: Map Each Segment

For each segment, complete this template:

```markdown
## Segment: [Name]

### Behavioral Profile
- **Task frequency:** [Continuous/Daily/Weekly/Monthly/Quarterly+]
- **Session duration:** [Typical time spent per session]
- **Primary tasks:** [What they actually do, in order of frequency]

### Expertise Levels
- **Domain:** [Low/Medium/High] — [Evidence]
- **Interface conventions:** [Low/Medium/High] — [Evidence]  
- **This tool:** [Low/Medium/High] — [Evidence]

### Context of Use
- **When:** [Time patterns]
- **Where:** [Physical context]
- **Alongside:** [Concurrent tasks/tools]
- **Interruptions:** [Frequency and nature]

### Error Patterns
- **Common slips:** [Specific observed errors]
- **Common mistakes:** [Mental model failures]
- **Workarounds:** [Rules they break and why]

### Recovery Profile
- **Error cost:** [Low/Medium/High/Critical]
- **Current recovery:** [How they fix problems today]
- **Help resources:** [Who/what they turn to]

### Key Jobs to Be Done
1. [Primary job — what success looks like]
2. [Secondary job]
3. [Edge case job that still matters]
```

### Step 3: Validate

Models are hypotheses. Validate through:

- **Observation:** Watch actual users (not demos, not role-play)
- **Data:** Actual usage patterns where available
- **Interviews:** But weight behavior over self-report
- **Iteration:** Models improve as you learn

## Anti-Patterns

**Demographic masking:** "Young users want..." "Enterprise customers need..." — these hide behavioral variation within groups.

**Average user:** Designing for the mean serves no one well. Design for segments.

**Self-projection:** "I would want..." — you're not the user, even if you use the tool.

**Persona theater:** Rich backstories that don't predict behavior are fiction, not models.

**Static models:** Users learn, contexts change, behaviors shift. Models need updating.

## Model Applications

**Feature prioritization:** Segment frequency × segment size × task importance

**Default selection:** What do most users in most contexts need most of the time?

**Progressive disclosure:** What do high-frequency expert users need that would confuse occasional novices?

**Error prevention:** Where do high-cost errors occur? For which segments?

**Documentation strategy:** Which segments need which kinds of help?
