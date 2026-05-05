---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

```dataview
TABLE links.parent, links.child, links.related
FROM "80-System/84-YAML規範"
WHERE contains(description, "測試")
```

## 測試結果

**YAML 結構：**
```yaml
links:
  parent: "上層筆記"
  child: ["子筆記A", "子筆記B"]
  related: ["相關筆記1", "相關筆記2"]
```

請在 Obsidian 中打開此筆記，確認 YAML 解析正常後，執行上方的 Dataview 查詢，看是否能讀到 parent/child/related 三個欄位。

回報結果，我再根據結果決定結構是否調整。