---
up:
  - "[[Ideaverse Map]]"
related: []
created: 2022-05-11
modified: 2023-08-25
---
# Ideaverse Lite 1.5 - 版本說明
## 主要變更
- 新增 [[Home Basic]]。
	- 這是一個簡潔清晰的首页笔记。是 [[Home]] 的低調但高功能的替代方案。我們故意讓它易於編輯，所以我們希望你編輯它以符合你的個人風格——只是盡量保持格式簡單！
- 正式介紹 **資料夾 x**。
	- 「x」資料夾代表「額外」*。它在 Obsidian 和你的電腦檔案系統中都運作得非常出色。
	- 它是一個洩壓閥，一種簡單的方式來收納那些「額外」類型的筆記，例如「關於筆記的筆記」（元筆記、保險庫相關筆記）、實用筆記、歸檔筆記，以及不太立即相關的「佔位資料夾」，這些資料夾雖然現在不太重要，但仍然可以作為一個隱藏的提醒，提醒你某個正在沉澱或潛在感興趣的主題或領域。
	- 細心的觀察者會注意到一些資料夾因此被重新整理了。
- 安裝了高度客製化的 Soft Paper 主題。
    - 作為預設 Prism 主題的替代方案，這個主題會讓你進入更冷靜和更有反思性的心態。
- 更新了 `Atlas` 資料夾結構和組織
	- 將 `Atlas/Notes` 資料夾重新命名為 `Atlas/Dots` 資料夾
		- 將 `Atlas/Dots/Ideas` 資料夾重新命名為 `Atlas/Dots/Things` 資料夾
		- 創建了一個新資料夾 `Atlas/Dots/Statements` 並將所有陈述移至該處
		- 這是為了反映 [[Evergreen notes are things or statements about things]] 的概念
- **中繼資料力量轉移** 從標籤 ➡️ 屬性來組織筆記和集合
	- 原本具有 `type` 屬性來表示子類型的筆記（例如來源筆記的 `type: Book`）已轉換為 `in` 屬性和相關筆記的連結（例如 `[[Books]]`）。
	- `#concept` 標籤已替換為指向 `[[Concepts]]` 的 `in` 屬性。
	- 具有子標籤如 `#map/view` 的筆記已由指向 `[[Maps]]` 和 `[[Views]]` 的 `in` 屬性取代。
		- 來源筆記如 `#source/article` 也是如此，已轉換為指向 `[[Sources]]` 和 `[[Articles]]` 的連結
		- 有關此範例，你可以參觀 [[The Almagest]]
	- 取代使用標籤搜尋筆記的 Dataview 查詢，新的主要過濾標準是透過筆記的 `in` 屬性。
- 使用新的 [[Maps]] 和 [[Views]] 集合筆記，快速而強大地找到你最重要的筆記
- 更新了 [[Ideaverse Map]]
	- 在「如何自訂你的 ACE 頭部空間」中新增了對 ACE 以外其他資料夾的提及
	- 在「額外禮物」下新增了新的提示，以承認在 Ideaverse 中刻意使用樣式
- 簡化了 [[Library]] 筆記的格式。
	- 通過將文字從提示框中取出，我們鼓勵你實際編輯 Library 筆記使其成為你自己的。
## 小變更
- 因為首次載入時的意外行為，移除了 `Excalibrain` 社群插件
- 在相關筆記中嵌入了 LYT YouTube 影片以供進一步學習
- 將所有之前的「Ideaverse for Obsidian」提及替換為「Ideaverse Lite」以避免與 [[Ideaverse Pro]] 混淆
- 修復了即使檔案名稱更改仍能運作的未回應筆記提示
## 此版本中的新筆記
```dataview
list
from ""
where contains(version, "1.5")
sort file.name
```
## 主要筆記更新
```dataview
TABLE updates as "Updates"
FROM ""
WHERE updates
sort file.name
```

---

# Ideaverse Lite 1.0 - 版本說明
*發布於 2023-08-30*
**標題**
- 推出了具有 ACE 頭部空間的 [[Home]] 筆記。
	- 提供了多個範例
	- 提供了一個基本的 ARC 框架（Add、Relate、Communicate）來將想法發展為輸出。
- 推出了 [[ACE Folder Framework]]。
	- 為 ACE 提供了多個筆記和範例。
- 推出了一套基於強度的 [[Efforts]] 工作系統。
	- 為「努力」提供了多個範例。

**詳情**
- 310 筆記
- 改進了多個資料視圖以提升你的導航體驗。
- 進行了常規清理。
- 將工具包名稱從 LYT Kit 更改為 Ideaverse Lite，因為 Ideaverse 唤起了筆記和想法的連接性但又開放的性質。
	- 此外，此版本稱為 Ideaverse Lite。但這個名稱為其他版本打開了大門，例如適用於組織的 Ideaverse 和適用於 XYZ 的 Ideaverse。因此名稱的更改使原則能夠自然地超越工具。

---

# LYT Kit 7 - 版本說明
*發布於 2022-09-13*

**標題**
- 復古 Home 筆記
- Home 筆記中的 16 個賦能地圖
- ACCESS 資料夾精簡為 10 個資料夾
- 推出「努力」

**詳情**
- 286 筆記
- 復古 Home 筆記。
	- 重新製作了 Home 筆記以匹配最初帶給我很多樂趣的版本。
- Home 筆記中的 16 個賦能地圖。為清晰度和力量重建了每個地圖。
	- Thinking MOC、Inbox、Notebox、Outbox、Daily Notes
	- Library、People MOC、Sources MOC、Concepts MOC
	- Efforts、Plan and Review
	- Health MOC、Finance MOC、Life Map、LYT Kit 和 Meta PKM
- 精簡了 ACCESS 資料夾結構以獲得更簡單的起點。
- 推出了「努力」作為「專案」的替代方案。
	- 在 Home 筆記中新增了「努力」地圖。
- 改進了多個資料視圖以提升你的導航體驗。
- 進行了常規清理。

---

# LYT Kit 6 - 版本說明
*發布於 2022-05-11*

- 309 筆記
- ACCESS 資料夾結構
- 修訂了多個筆記以提高清晰度
- 新增了提示，解釋了一些筆記中指向 Ideaverse Lite 中不可用的個人 PKM 部分的中斷連結
- 記錄了一系列電子郵件課程，探索了一些 PKM 基礎知識以及在 ACCESS 資料夾結構中的工作方式，以提供在探索這個保險庫時的一些更多指導
- 新增了多個新的 MOC、索引和資料視圖
- 常規清理
