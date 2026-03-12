# JSON Canvas Specification for Obsidian

## Overview
JSON Canvas is an open standard for visual diagrams. It uses a `.canvas` file extension and consists of a single JSON object with `nodes` and `edges` arrays.

## Top Level Structure
```json
{
  "nodes": [...],
  "edges": [...]
}
```

## Node Types

### Common Attributes
Each node must have:
- `id`: unique 12-char string
- `x`: x-coordinate
- `y`: y-coordinate
- `width`: node width
- `height`: node height
- `type`: "text" | "file" | "link" | "group"
- `color`: (optional) "1" to "6" or hex string

### Text Nodes
```json
{
  "id": "node1",
  "type": "text",
  "text": "Hello, world",
  "x": 0, "y": 0, "width": 200, "height": 100
}
```

### File Nodes
```json
{
  "id": "node2",
  "type": "file",
  "file": "path/to/note.md",
  "x": 200, "y": 0, "width": 300, "height": 400
}
```

### Link Nodes
```json
{
  "id": "node3",
  "type": "link",
  "url": "https://example.com",
  "x": 500, "y": 0, "width": 300, "height": 100
}
```

### Group Nodes
```json
{
  "id": "group1",
  "type": "group",
  "label": "Group Label",
  "x": -50, "y": -50, "width": 600, "height": 500
}
```

## Edges (Connections)
Edges connect nodes via their IDs.
```json
{
  "id": "edge1",
  "fromNode": "node1",
  "fromSide": "right",
  "toNode": "node2",
  "toSide": "left",
  "label": "Connection Label"
}
```
**Side values**: "top", "bottom", "left", "right"

---
