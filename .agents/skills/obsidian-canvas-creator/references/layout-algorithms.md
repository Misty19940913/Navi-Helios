# Layout Algorithms for Obsidian Canvas

## Layout Principles

### Universal Spacing Constants
- **H_SPACING**: 320px (Minimum horizontal distance between node centers)
- **V_SPACING**: 200px (Minimum vertical distance between node centers)
- **PADDING**: 60px (Padding between node boundaries)

### Collision Detection
Ensure the distance between any two node centers (x1, y1) and (x2, y2) meets:
`|x1 - x2| >= (w1 + w2) / 2 + H_SPACING`
`|y1 - y2| >= (h1 + h2) / 2 + V_SPACING`

## MindMap Layout Algorithm

### 1. Radial Tree Layout
1. Center common root node at (0, 0).
2. Distribute primary branches (main nodes) evenly in a circle around the root.
3. Distribute secondary branches (leaf nodes) based on their parent's position and angular direction.

### 2. Tree Layout (Hierarchical Top-Down)
1. Position root at (central_x, top_y).
2. Position children in a row below the parent, centered under the parent's x-coordinate.
3. Maintain horizontal/vertical spacing between sibling nodes.

## Freeform Layout Algorithm

### 1. Content-Based Grouping
- Group related nodes together based on hierarchical topics or categories.
- Assign each group to a specific "zone" on the canvas.

### 2. Grid-Based Zone Layout
1. Define a global grid of zones (e.g., 2x2 or 3x3 zones).
2. Assign each group a zone.
3. Layout nodes within each zone using a localized grid or radial layout.

### 3. Cross-Zone Connections
- Map connections between nodes in different zones.
- Use curved edges for cross-zone or cross-category relationships to distinguish them from direct hierarchical links.

---
