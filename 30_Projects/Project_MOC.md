---
title: 專案管理 MOC
type: MOC
status: active
created: 2026-04-09
tags:
- life-os
- life-os/project
folder: resource
time_created: '2026-04-09'
time_modified: '2026-04-09'
description: ''
parent: []
children: []
related: []
---

# 🔥 專案管理 MOC

> 所有專案（Project）在此匯聚。Project 是 Goal 的落地執行層。
> Goal → Project → Task 是單向催生關係。

## 專案狀態定義

| 狀態 | 說明 |
|------|------|
| planning | 規劃中，尚未啟動 |
| active | 執行中 |
| completed | 已完成 |
| on-hold | 暫停 |
| cancelled | 取消 |

## 專案分層

```dataview
TABLE WITHOUT ID file.link AS 專案名稱, status AS 狀態, 階段, 進度
FROM "30_Projects"
WHERE type = "project" OR type = "moc"
SORT status ASC, file.name ASC
```

## 🔗 與 Goals 的連結

每個 Project 需在 YAML frontmatter 中填寫 `goalId` 以連結到 Goal：

```dataview
TABLE WITHOUT ID file.link AS 專案, goalId AS 所屬目標
FROM "30_Projects"
WHERE goalId != ""
SORT goalId ASC
```

## 按 Area 分組

```dataview
TABLE WITHOUT ID areaId AS Area, file.link AS 專案, status AS 狀態
FROM "30_Projects"
WHERE areaId != ""
SORT areaId ASC, status ASC
```

## Active 專案一覽

```dataview
TABLE WITHOUT ID file.link AS 專案, 進度 AS 進度%, goalId AS Goal
FROM "30_Projects"
WHERE status = "active"
SORT 進度 DESC
```

## 資料夾結構

- `31_Planning/` — 規劃中專案
- `32_Active/` — 執行中專案
- `33_Done/` — 已完成專案
- `34_On-hold/` — 暫停專案

## 如何新增專案

1. 在對應狀態的資料夾建立新筆記
2. 使用 `任務模板` 或 `項目模板` 初始化
3. 填寫 YAML frontmatter：type=project, status, goalId, areaId, 進度
4. 在 [[Goal_MOC]] 中建立雙向連結

## 參考資源

- [[20_Life_Planning/23_Goal/Goal_MOC]] — 目標管理
- [[20_Life_Planning/22_Area/Area_MOC]] — 人生領域

---

*建立者：Larvis*
*日期：2026-04-09*
*更新：2026-04-27（移除 Arena 耦合）*
