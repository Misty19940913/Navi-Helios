---
up:
  - "[[Home]]"
related:
  - "[[Relate]]"
  - "[[Communicate]]"
created: 2022-01-01
obsidianUIMode: preview
in:
  - "[[Views]]"
---

這個 **Add** 筆記不只是一個收件匣。它是一個冷卻墊 🧊。
想法滾燙地進來。但幾天後，它們就冷卻下來了。
當冷卻後的想法占主導地位時，你可以更好地優先排序。冷靜下來了嗎？

> [!activity]+ ## 已添加的內容
> 此視圖查看你 **+** 資料夾中最新的 10 條筆記。當你處理每條筆記時：新增連結、新增細節、將它們移到最佳資料夾，並刪除所有不再激發✨的內容。
>
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  (date(today) - file.cday).day as "Days alive"
>
> FROM "+" and -#x/readme
>
> SORT file.cday desc
>
> LIMIT 10
> ```

> [!Notes]- 此數據視圖 🔬 只在可下載版本中呈現。
> 除非你下載了工具包，否則你將無法看到這個魔術，但這是它在「Ideaverse Lite」中的大致樣子
> ![[lyt-kit-example-cooling-pad-.png]]

---

如果你想遇到一些新東西，看看： [🐦](https://www.twitter.com) 或 [📚](https://readwise.io/lyt/)
