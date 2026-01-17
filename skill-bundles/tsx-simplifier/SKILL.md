---
name: tsx-simplifier
description: Simplify Claude-generated TSX/React artifacts without changing functionality. Use when reviewing or refactoring TSX code that Claude has written, when artifacts feel over-engineered, when reducing bundle size or complexity, or when the user asks to clean up, simplify, or streamline React code. Targets common Claude over-generation patterns like excessive state, redundant abstractions, and verbose conditional rendering.
---

# TSX Simplifier

Review Claude-generated TSX and simplify without changing external behavior.

## Common Claude Over-Generation Patterns

Target these specific patterns in priority order:

### 1. State Bloat
Claude often creates separate useState calls for values derivable from existing state or props.

```tsx
// Before: redundant derived state
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);
const [hasItems, setHasItems] = useState(false);

// After: derive from source
const [items, setItems] = useState([]);
const itemCount = items.length;
const hasItems = items.length > 0;
```

### 2. Unnecessary Abstraction Layers
Claude creates wrapper components and utility functions that add indirection without value.

```tsx
// Before: pointless wrapper
const ItemWrapper = ({ children }) => <div className="item">{children}</div>;
const items = data.map(d => <ItemWrapper key={d.id}><Item data={d} /></ItemWrapper>);

// After: inline the trivial wrapper
const items = data.map(d => <div key={d.id} className="item"><Item data={d} /></div>);
```

### 3. Verbose Conditionals
Claude writes explicit boolean checks where simpler patterns suffice.

```tsx
// Before
{isLoading === true ? <Spinner /> : null}
{items.length > 0 ? items.map(...) : null}
{error !== null && error !== undefined ? <Error msg={error} /> : null}

// After
{isLoading && <Spinner />}
{items.map(...)}
{error && <Error msg={error} />}
```

### 4. Effect Overuse
Claude adds useEffect for synchronous derivations or inline computations.

```tsx
// Before: effect for derived value
const [data, setData] = useState([]);
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(data.filter(d => d.active));
}, [data]);

// After: compute inline or useMemo
const filtered = data.filter(d => d.active);
// or useMemo if expensive
const filtered = useMemo(() => data.filter(d => d.active), [data]);
```

### 5. Prop Drilling Helpers
Claude creates context or callback chains for state that could stay local.

```tsx
// Before: context for two-level prop
const ThemeContext = createContext();
const Parent = () => <ThemeContext.Provider value="dark">...</ThemeContext.Provider>;
const Child = () => { const theme = useContext(ThemeContext); ... };

// After: just pass the prop if depth is shallow
const Parent = () => <Child theme="dark" />;
```

### 6. Type Assertion Noise
Claude adds unnecessary type assertions and explicit generics.

```tsx
// Before
const [items, setItems] = useState<Item[]>([] as Item[]);
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... };

// After: let inference work
const [items, setItems] = useState<Item[]>([]);
const handleClick = (e) => { ... };  // if type isn't used in body
```

### 7. Fragment and Key Redundancy
```tsx
// Before
<React.Fragment key={id}><span>{text}</span></React.Fragment>

// After
<span key={id}>{text}</span>
```

## Process

1. Identify which patterns above appear in the code
2. Apply simplifications in priority order (state bloat has highest impact)
3. Remove dead code: unused imports, unreachable branches, commented code
4. Verify external behavior unchanged (same props in, same render out)
5. Report: list each simplification applied and token/line reduction

## Constraints

- Do NOT add features or change behavior
- Do NOT add dependencies
- Do NOT refactor working code that isn't over-complicated
- Preserve all user-facing functionality exactly
- Keep changes minimal—simplify, don't redesign

## Output

After simplification, provide:
1. The simplified TSX
2. Brief summary: which patterns were addressed, approximate reduction in lines/complexity
