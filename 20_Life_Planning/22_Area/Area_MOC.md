---
title: 人生領域 MOC
type: MOC
status: active
created: 2026-04-08
tags:
- life-os
- life-os/area
folder: resource
time_created: '2026-04-09'
time_modified: '2026-04-09'
description: ''
parent: []
children: []
related: []
---

# 🏛️ 人生領域 MOC

> 此 MOC 匯聚你的人生五大領域，每個 Area 是你生活中需要持續關注與投入的核心範疇。

## 五宮格 Overview

```dataview
TABLE areaId, 象限, status
FROM "20_Life_Planning/22_Area"
WHERE type = "area"
SORT areaId ASC
```

## 各 Area 連結

- [[職業發展]] — Vocation 象限
- [[財務自由]] — Vocation 象限
- [[身心健康]] — Body 象限
- [[關係家庭]] — Spirit 象限
- [[自我成長]] — Mind 象限

## 平衡檢查

每週覆盤時，請檢視五個 Area 的投入是否平衡。

```dataview
TABLE WITHOUT ID file.link AS Area, 象限
FROM "20_Life_Planning/22_Area"
WHERE type = "area"
SORT 象限 ASC
```

---

*建立者：Larvis*
*日期：2026-04-08*
*更新：2026-04-27（移除 Arena 耦合）*
