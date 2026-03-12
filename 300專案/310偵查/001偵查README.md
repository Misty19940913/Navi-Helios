---
tags:
  - 系統/領域/事業/偵查
time_create: 2025-11-03
time_modifie: 2025-11-18
status: DOING
parent:
  - "[[事業INDEX]]"
---
## 案件一覽
```dataview

TABLE Time_start, Time_create, Time_modifie, tasks

FROM ""

WHERE contains(tags, "系統/領域/事業/偵查") AND contains(status, "DOING" ) AND contains(type, "case")

SORT modifieTime DESC

```

## 任務一覽

```dataview

TABLE parent, Time_start, Time_create, Time_modifie

FROM ""

WHERE contains(tags, "系統/週期") AND contains(status, "DOING" ) AND contains(type, "task")

SORT modifieTime DESC

```
