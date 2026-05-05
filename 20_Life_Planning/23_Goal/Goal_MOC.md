---
title: 目標管理 MOC
type: MOC
status: active
created: 2026-04-08
tags:
- life-os
- life-os/goal
folder: resource
time_created: '2026-04-09'
time_modified: '2026-04-09'
description: ''
parent: []
children: []
related: []
---

# 🎯 目標管理 MOC

> 所有目標（Goal）在此匯聚。Goal 是跨 Area、跨 Projects 的上層結構。
> 一個 Goal 可能橫跨多個 Area，並催生多個 Projects。

## 目標狀態定義

| 狀態 | 說明 |
|------|------|
| planning | 規劃中，尚未啟動 |
| active | 執行中 |
| completed | 已完成 |
| on-hold | 暫停 |
| cancelled | 取消 |

## 目標分層

```dataview
TABLE WITHOUT ID file.link AS 目標名稱, status AS 狀態, 截止日期, 象限
FROM "20_Life_Planning/23_Goal"
WHERE status != ""
SORT status ASC, 截止日期 ASC
```

## 年度核心目標

> 請在此連結年度最重要的 1-3 個目標

-

## 季度目標

> 本季度（Q2 2026）的目標

-

## Area Goals Map

```dataview
TABLE WITHOUT ID area AS Area, file.link AS 目標, status AS 狀態
FROM "20_Life_Planning/23_Goal"
WHERE area != ""
SORT area ASC, status ASC
```

## 如何新增目標

1. 在 `20_Life_Planning/23_Goal/` 資料夾建立新筆記
2. 使用 `目標模板` 初始化
3. 填寫 YAML frontmatter：status, 截止日期, 象限, relatedProjects
4. 在此 MOC 中建立雙向連結

## 參考資源

- [[30天整合行動計劃_20260330]] — 30天行動目標
- [[90天整合行動計劃_20260330]] — 90天行動目標
- [[20_Life_Planning/22_Area/Area_MOC]] — 人生領域

---

*建立者：Larvis*
*日期：2026-04-08*
*更新：2026-04-27（移除 Arena 耦合）*
