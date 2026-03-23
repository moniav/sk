# SVG Element Patterns

Copy-ready SVG patterns for technical diagrams. All elements follow the design system in `SKILL.md`.

## Arrow Markers

```xml
<!-- Gray (default) -->
<marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
  <path d="M0,0 L0,6 L9,3 z" fill="#ccc"/>
</marker>

<!-- Green (success/positive) -->
<marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
  <path d="M0,0 L0,6 L9,3 z" fill="#27ae60"/>
</marker>

<!-- Blue (primary) -->
<marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
  <path d="M0,0 L0,6 L9,3 z" fill="#3498db"/>
</marker>

<!-- Red (error) -->
<marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
  <path d="M0,0 L0,6 L9,3 z" fill="#e74c3c"/>
</marker>
```

## Nodes

**Circle node with inner dot:**
```xml
<!-- Neutral -->
<circle cx="100" cy="175" r="35" fill="none" stroke="#ccc" stroke-width="2"/>
<circle cx="100" cy="175" r="18" fill="#999"/>

<!-- With color and label text inside -->
<circle cx="100" cy="175" r="35" fill="none" stroke="#ccc" stroke-width="2"/>
<circle cx="100" cy="175" r="18" fill="#3498db"/>
<text x="100" y="180" font-family="monospace" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold">CLI</text>
```

**Node with label box below:**
```xml
<circle cx="100" cy="175" r="35" fill="none" stroke="#ccc" stroke-width="2"/>
<circle cx="100" cy="175" r="18" fill="#27ae60"/>
<rect x="60" y="225" width="80" height="24" fill="none" stroke="#ccc" stroke-width="1"/>
<text x="100" y="241" font-family="monospace" font-size="11" fill="#666" text-anchor="middle">NODE_NAME</text>
```

## Containers

**Standard container:**
```xml
<rect x="250" y="130" width="130" height="90" fill="none" stroke="#ccc" stroke-width="2" rx="4"/>
<text x="315" y="115" font-family="monospace" font-size="10" fill="#666" text-anchor="middle">CONTAINER_NAME</text>
```

**Dashed container (sandbox/isolation/preserved):**
```xml
<rect x="470" y="130" width="120" height="90" fill="none" stroke="#f39c12" stroke-width="2" stroke-dasharray="5,3" rx="2"/>
<text x="530" y="115" font-family="monospace" font-size="10" fill="#f39c12" text-anchor="middle">SANDBOX</text>
```

**Large container with subtitle:**
```xml
<rect x="190" y="70" width="280" height="340" fill="none" stroke="#ccc" stroke-width="2" rx="4"/>
<text x="330" y="60" font-family="monospace" font-size="11" fill="#666" text-anchor="middle" font-weight="bold">SECTION</text>
<text x="330" y="95" font-family="monospace" font-size="8" fill="#999" text-anchor="middle">description text</text>
```

## Inner Component Boxes

**Single component:**
```xml
<rect x="210" y="110" width="240" height="32" fill="#fff" stroke="#27ae60" stroke-width="1.5" rx="2"/>
<text x="330" y="131" font-family="monospace" font-size="10" fill="#27ae60" text-anchor="middle">component_name</text>
```

**Component with subtitle:**
```xml
<rect x="210" y="152" width="240" height="42" fill="#fff" stroke="#3498db" stroke-width="1.5" rx="2"/>
<text x="330" y="170" font-family="monospace" font-size="10" fill="#3498db" text-anchor="middle">component_name</text>
<text x="330" y="184" font-family="monospace" font-size="8" fill="#999" text-anchor="middle">27 items</text>
```

**Stacked components (list):**
```xml
<rect x="300" y="120" width="160" height="40" fill="#fff" stroke="#3498db" stroke-width="1.5" rx="2"/>
<text x="380" y="145" font-family="monospace" font-size="10" fill="#3498db" text-anchor="middle">item_one</text>

<rect x="300" y="170" width="160" height="40" fill="#fff" stroke="#3498db" stroke-width="1.5" rx="2"/>
<text x="380" y="195" font-family="monospace" font-size="10" fill="#3498db" text-anchor="middle">item_two</text>

<rect x="300" y="220" width="160" height="40" fill="#fff" stroke="#3498db" stroke-width="1.5" rx="2"/>
<text x="380" y="245" font-family="monospace" font-size="10" fill="#3498db" text-anchor="middle">item_three</text>
```

## Arrows and Connections

**Horizontal arrow with label:**
```xml
<path d="M 140 175 L 240 175" stroke="#27ae60" stroke-width="2" fill="none" marker-end="url(#arrowGreen)"/>
<text x="190" y="167" font-family="monospace" font-size="8" fill="#27ae60" text-anchor="middle">label</text>
```

**Vertical arrow with polygon head:**
```xml
<path d="M 300 115 L 300 140" stroke="#ccc" stroke-width="1.5"/>
<polygon points="295,138 300,148 305,138" fill="#ccc"/>
```

**Fan-out arrows (multiple outgoing):**
```xml
<g stroke="#e74c3c" stroke-width="1.5" fill="none" stroke-dasharray="4,4">
  <path d="M 160 175 L 280 135"/>
  <path d="M 160 200 L 280 200"/>
  <path d="M 160 225 L 280 265"/>
</g>
```

**Return arrows (lighter, dashed):**
```xml
<g stroke="#ccc" stroke-width="1" fill="none" opacity="0.5" stroke-dasharray="3,3">
  <path d="M 280 145 L 160 185"/>
</g>
```

## Flow Diagram Elements

**Start/end ellipse:**
```xml
<ellipse cx="300" cy="90" rx="120" ry="22" fill="#fff" stroke="#3498db" stroke-width="2"/>
<text x="300" y="95" font-family="monospace" font-size="10" fill="#3498db" text-anchor="middle">START_STATE</text>
```

**Process step rectangle:**
```xml
<rect x="200" y="150" width="220" height="40" fill="#fff" stroke="#9b59b6" stroke-width="2" rx="2"/>
<text x="310" y="167" font-family="monospace" font-size="10" fill="#9b59b6" text-anchor="middle">PROCESS_STEP</text>
<text x="310" y="182" font-family="monospace" font-size="7" fill="#999" text-anchor="middle">detail text</text>
```

**Decision diamond:**
```xml
<polygon points="310,240 395,275 310,310 225,275" fill="#fff" stroke="#e74c3c" stroke-width="2"/>
<text x="310" y="272" font-family="monospace" font-size="9" fill="#e74c3c" text-anchor="middle">condition?</text>
```

**Decision branch labels:**
```xml
<!-- Yes path (downward) -->
<text x="322" y="325" font-family="monospace" font-size="8" fill="#27ae60">yes</text>

<!-- No path (sideways) -->
<path d="M 395 275 L 470 275" stroke="#e74c3c" stroke-width="1" stroke-dasharray="3,3"/>
<text x="485" y="270" font-family="monospace" font-size="8" fill="#e74c3c">no</text>
```

**Vertical guide line (for flow diagrams):**
```xml
<line x1="310" y1="55" x2="310" y2="710" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="4,4"/>
```

## Legend / Info Box

```xml
<rect x="20" y="310" width="155" height="80" fill="none" stroke="#ccc" stroke-width="1" rx="3"/>
<text x="97" y="330" font-family="monospace" font-size="9" fill="#666" text-anchor="middle" font-weight="bold">Legend Title</text>
<text x="32" y="350" font-family="monospace" font-size="8" fill="#3498db">item_one</text>
<text x="90" y="350" font-family="monospace" font-size="8" fill="#999">description</text>
<text x="32" y="366" font-family="monospace" font-size="8" fill="#27ae60">item_two</text>
<text x="90" y="366" font-family="monospace" font-size="8" fill="#999">description</text>
```

## Bottom Notes

```xml
<!-- Single line -->
<text x="400" y="360" font-family="monospace" font-size="10" fill="#999" text-anchor="middle">summary note here</text>

<!-- Two lines -->
<text x="400" y="450" font-family="monospace" font-size="10" fill="#999" text-anchor="middle">primary summary</text>
<text x="400" y="468" font-family="monospace" font-size="8" fill="#ccc" text-anchor="middle">secondary detail</text>
```
