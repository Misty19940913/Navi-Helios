---
up:
  - "[[Home]]"
created: 2020-06-01
in:
  - "[[Maps]]"
aliases:
  - Sources Map
---
這是我追蹤我遇到的一些來源的地方。
什麼「來源」你應該追蹤？
書和電影怎麼樣？

> [!Book]- ### 書籍
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  file.link as Book
> 
> WHERE
> 	contains(in,link("Books")) and
> 	!contains(file.name, "Template")
> 
> SORT year asc
> ```

> [!video]- ### 電影
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  file.link as Movie
>  
> FROM -#x/readme
> 
> WHERE
> 	contains(in,link("Movies")) and
> 	!contains(file.name, "Template")
> 
> SORT year asc
> ```

我正在嘗試一個稱為 `in` 的屬性欄位。它允許我以一种不错的方式為不同類型的來源創建一些被動的地圖到不同的集合。以下是我目前有的，隨意製作更多：

- [[Books]] | [[Games]] | [[Movies]] | [[Papers]] | [[Songs]] | [[Speeches]]

> [!Script]- ## 所有來源
> 這是一個簡單的數據視圖，從 **Sources** 資料夾中提取任何內容。
> 
> ```dataview
> TABLE WITHOUT ID
>  year as "Year",
>  join(in) as Type,
>  file.link as Source
>  
> FROM -#x/readme 
> WHERE
> 	contains(in,link("Sources")) and
> 	!contains(file.name, "Template")
> 
> SORT year asc
> ```

這裡沒有包含，但在我個人的 vault 中，我喜歡查看全面的 [[Source MOC]] 和流覽我的 [[Bookshelf 📚]]。為了紀念舊的，我也保留了一個基於標籤的 [[Commonplace Book]]。

> [!NOTE]+ 這是我的實際筆記的清理版本。
> - 內容和連結已被移除。






