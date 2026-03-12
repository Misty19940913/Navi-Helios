---
name: obsidian-canvas-creator
description: Create Obsidian Canvas files from text content, supporting both MindMap and freeform layouts. Use this skill when users want to visualize content as an interactive canvas, create mind maps, or organize information spatially in Obsidian format.
---

# Obsidian Canvas Creator

Transform text content into structured Obsidian Canvas files with support for MindMap and freeform layouts.

## When to Use This Skill
- User requests to create a canvas, mind map, or visual diagram from text
- User wants to organize information spatially
- User mentions "Obsidian Canvas" or similar visualization tools
- Converting structured content into visual format

## Core Workflow

### 1. Analyze Content
Read and understand the input content to identify topics and relationships.

### 2. Determine Layout Type
- **MindMap Layout**: Radial structure from center, parent-child relationships. Good for brainstorming and hierarchy.
- **Freeform Layout**: Custom positioning, flexible relationships. Good for complex networks and custom arrangements.

### 3. Plan Structure
- **For MindMap**: Identify central root node and primary/secondary branches.
- **For Freeform**: Group related concepts, identify connection patterns and planned spatial zones.

### 4. Generate Canvas
Create JSON following the Canvas specification.
- Unique 8-12 character hex IDs.
- Dimensions based on content length.
- No coordinate overlaps.
- Arrows for relationships, labels for complex links.

### 5. Apply Layout Algorithm
- **MindMap**: Center root at (0, 0), distribute nodes radially. Spacing: 320px horizontal, 200px vertical between centers.
- **Freeform**: Group nodes logically, position with clear separation, and balance visual weight.

### 6. Validate and Output
Check for unique IDs, no overlaps, valid node references, and proper quote escaping (『』 for double, 「」 for single).

## Node Sizing Guidelines
- Short text (<30 chars): 220 × 100 px
- Medium text (30-60 chars): 260 × 120 px
- Long text (>60 chars): 320 × 140 px

## Color Schemes
**Preset Colors:**
- `"1"` - Red (warnings) | `"2"` - Orange (actions) | `"3"` - Yellow (notes/questions)
- `"4"` - Green (positive) | `"5"` - Cyan (info) | `"6"` - Purple (concepts)

## Critical Rules
1. **Quote Handling**: Use 『』 for Chinese double quotes, 「」 for single, and `\"` for English double.
2. **ID Generation**: 8-12 character hex strings, must be unique.
3. **Z-Index**: Output groups first, then subgroups, then text nodes.
4. **Spacing**: Minimum horizontal 320px, vertical 200px between centers.
5. **No Emoji**: Do not use Emoji symbols in node text.

---
