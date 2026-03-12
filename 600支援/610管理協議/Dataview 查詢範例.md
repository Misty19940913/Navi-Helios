# Dataview 查詢範例

### 基本篩選

```dataview

TABLE status, priority, modifieTime

FROM ""

WHERE contains(tags, "系統/項目") AND contains(tags, "狀態/進行中")

SORT modifieTime DESC

```

### 發佈排程

```dataview

TABLE publishTime, publish_platforms

FROM ""

WHERE contains(tags, "類型/文章") AND publishTime

SORT publishTime ASC

```

### 象限分析

```dataview

TABLE rows.file.link as "檔案"

FROM ""

WHERE quadrant = "心智"

SORT file.mtime DESC

```

### 領域細分查詢

```dataview

TABLE rows.file.link as "檔案"

FROM ""

WHERE contains(tags, "系統/項目/財務")

SORT file.mtime DESC

```

### 主題細分查詢

```dataview

TABLE rows.file.link as "檔案"

FROM ""

WHERE contains(subject, "AI應用")

SORT file.mtime DESC

```