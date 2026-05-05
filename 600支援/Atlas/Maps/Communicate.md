---
up:
  - "[[Home]]"
related:
  - "[[Add]]"
  - "[[Relate]]"
created: 2022-01-01
in: 
- "[[Views]]"
---
這個 **Communicate** 筆記是一個追蹤你各種*輸出*的地方。

以下是使用標籤 `output` 追蹤我的各種輸出的簡單範例。

這足以讓你開始。隨著時間的推移，你可能會想要客製化你的視圖。

> [!Script]- ###### 新聞通訊
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  created as "Published"
>  
> FROM #output/newsletter and -#x/readme
> 
> SORT created desc
>  ```

# 影片

> [!Watch]+ ###### 即將推出的影片
> This filters for `#output/youtube◻️` with a rank above `3`.
> 
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  rank as "Rank"
> 
> FROM #output/youtube◻️ 
> 
> WHERE rank > 3
> 
> SORT rank desc
> ```

> [!Video]- ###### 已發布的 YouTube 影片
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  created as "Published"
>  
> FROM #output/youtube☑️  and -#x/readme
> 
> SORT created desc
> ```

