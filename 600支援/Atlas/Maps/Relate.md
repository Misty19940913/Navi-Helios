---
up:
  - "[[Home]]"
related:
  - "[[Add]]"
  - "[[Communicate]]"
created: 2022-02-22
in:
  - "[[Views]]"
obsidianUIMode: preview
cssclasses:
  - wide-page
---

你的 **Relate** 筆記是一個快樂的地方——沒有期望或義務。

對於一個痴迷於任務的文化來說，這將是一個令人頭疼的，但當你開始給予你的想法他們應得的榮耀時，你開始擁有越來越好的想法！

以下是它的工作方式：當你在一個筆記中有一種感覺想要回到它——無論是模糊或清晰的原因——就在那個筆記中添加一個標籤。然後透過數據視圖的魔術，你可以自信地使用這些自動更新的列表來稍後找到它們：

> [!Multi-column]
>
> > [!Sailboat]+ ## 船隻 🚤
> > 你可能是在匆忙中做了這些筆記。這些 [[BOAT notes]] 是_孤獨的船隻漂浮在空曠的海洋中_。你所需要做的就是將它們 tether 到其他筆記。
> >
> > ```dataview
> > LIST
> > FROM #note/boat🚤
> > SORT file.cday desc
> > LIMIT 10
> > ```
> >
> > 這排序最多最近的 `10`。
>
> > [!Leaf]+ ## 發展 🍃
> > 你可以透過發表評論、澄清和批評來發展這些筆記。添加你的意見，並在需要時引用你的來源。
> >
> > ```dataview
> > LIST
> > FROM #note/develop🍃
> > SORT file.cday desc
> > LIMIT 10
> > ```
> >
> > 這排序最多最近的 `10`。

---

> [!NOTE]+ 只有「船隻」和「發展」數據視圖包含在 Ideaverse Lite 中。
> 這是我的實際筆記的清理版本。
>
> - 內容和連結已被移除。
