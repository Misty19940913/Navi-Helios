---
up: 
related: 
created: 2024-09-02
version:
  - "1.5"
---

「Views」是主要目的為***顯示自訂搜索的自動更新、動態結果***的地圖。

> [!map]+ # 視圖
> 此筆記收集所有 `in` 屬性說是 `Views` 的筆記。
> 
> ```dataview
> TABLE WITHOUT ID
> 	file.link as View
> WHERE
> 	contains(in,this.file.link) and
> 	!contains(file.name, "Template")
> SORT file.name asc
> LIMIT 222
> ```
