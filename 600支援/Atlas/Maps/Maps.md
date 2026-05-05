---
up:
  - "[[Home]]"
related:
  - "[[Views]]"
created: 2024-09-02
tags: 
version:
  - "1.5"
---
要了解更多，請訪問 [[MOCs Overview]]

> [!map]+ # 地圖
> 此筆記收集所有 `in` 屬性說是 `Maps` 的筆記。
> 
> ```dataview
> TABLE WITHOUT ID
> 	file.link as Map
> WHERE
> 	contains(in,this.file.link) and
> 	!contains(file.name, "Template")
> SORT file.name asc
> LIMIT 222
> ```
