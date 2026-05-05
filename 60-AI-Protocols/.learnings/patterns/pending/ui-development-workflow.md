# Pattern: Visual-First UI Development

## Trigger
- **When:** Navi-Dashboard JARVIS shell development repeatedly failed due to manual HTML/CSS coding
- **Type:** ERR (Inefficient approach)
- **Date:** 2026-04-09
- **Sessions:** Multiple failed attempts to make HUD element display correctly

## Root Cause Analysis
1. **手工編碼複雜 UI** — 視覺化設計用手工編碼來實現，錯誤率高
2. **缺乏原型驗證** — 直接寫 code 而非先建立視覺原型
3. **JS 架構不良** — widget/element 類型混淆導致多次重寫

## Solution
- Use **Excalidraw** to visually design Dashboard layout first
- Export to JSON → Parse → Generate HTML/CSS
- Provides faster feedback loop

## Pattern (PROVISIONAL)
When building complex UI:
1. Draw design in Excalidraw first
2. Export JSON
3. Parse and generate code
4. User tests and provides feedback
5. Adjust design or code

## Outcome
Pending user confirmation

---
*Created: 2026-04-09T01:52:00Z*
