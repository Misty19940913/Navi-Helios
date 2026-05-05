# Pattern: pat-3a6d5ff0f95e
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-01T19:09:49.037993+00:00  
**Last seen:** 2026-05-01T19:09:49.037993+00:00

## Summary
API error in read_file: {"content": "     1|# Area：CSS/Rendering 除錯\n     2|\n     3|> 蒸餾自 2026-04-27 ~ 2026-04-29 session 叢集（tasknotes 原始碼研究 + 

## Error hashes
- 70ef7b7fb358a2d0

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/memories/areas/rendering.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|# Area：CSS/Rendering 除錯\n     2|\n     3|> 蒸餾自 2026-04-27 ~ 2026-04-29 session 叢集（tasknotes 原始碼研究 + navi-calendar code review）\n     4|\n     5|---\n     6|\n     7|## 核心發現：Inline Widget 必須全用 `span`\n     8|\n     9|**錯誤假設 1：`div` 可以透過 CSS `display: inline` 變成 inline。**\n    10|\n    11|實際：`div` 即使設 `display: inline`，仍保留 block 特性（`width: 100%` 行為）。CodeMirror 的 `block` attribute 只影響裝飾層級，DOM 元素本身必須是 `span` 才能讓 CSS `display: inline !important` 完全生效。\n    12|\n    13|**正確模式（TaskNotes inline widget）：**\n    14|```typescript\n    15|class TaskLinkWidget extends WidgetType {\n    16|  toDOM(): HTMLElement {\n    17|    const wrapper = document.createElement(\"span\");  // ← 不是 div\n    18|    wrapper.className = \"tasknotes-plugin tasknotes-inline-widget\";\n    19|    const card = document.createElement(\"span\");     // ← 不是 div\n    20|    c
```
