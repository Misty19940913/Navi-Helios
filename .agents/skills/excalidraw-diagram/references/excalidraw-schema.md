# Excalidraw JSON Schema Reference

## Color Palette

### Primary Colors
| Purpose | Color | Hex |
|---------|-------|-----|
| Main Title | Deep Blue | `#1e40af` |
| Subtitle | Medium Blue | `#3b82f6` |
| Body Text | Dark Gray | `#374151` |
| Emphasis | Orange | `#f59e0b` |
| Success | Green | `#10b981` |
| Warning | Red | `#ef4444` |

### Background Colors
| Purpose | Color | Hex |
|---------|-------|-----|
| Light Blue | Background | `#dbeafe` |
| Light Gray | Neutral | `#f3f4f6` |
| Light Orange | Highlight | `#fef3c7` |
| Light Green | Success | `#d1fae5` |
| Light Purple | Accent | `#ede9fe` |

## Element Types

### Rectangle
```json
{
  "type": "rectangle",
  "id": "unique-id",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 80,
  "strokeColor": "#1e40af",
  "backgroundColor": "#dbeafe",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 3 }
}
```

### Text
```json
{
  "type": "text",
  "id": "unique-id",
  "x": 150,
  "y": 130,
  "text": "Content here",
  "fontSize": 20,
  "fontFamily": 5,
  "textAlign": "center",
  "verticalAlign": "middle",
  "strokeColor": "#1e40af",
  "backgroundColor": "transparent"
}
```

### Arrow
```json
{
  "type": "arrow",
  "id": "unique-id",
  "x": 300,
  "y": 140,
  "width": 100,
  "height": 0,
  "points": [[0, 0], [100, 0]],
  "strokeColor": "#374151",
  "strokeWidth": 2,
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```
---
