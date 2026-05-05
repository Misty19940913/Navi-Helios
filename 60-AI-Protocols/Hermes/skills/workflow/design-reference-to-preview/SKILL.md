---
name: design-reference-to-preview
description: 將 MD 格式的 Design System 參考資料轉換為可瀏覽的 HTML Live Preview，屬性跨品牌並列對比
trigger: 用戶提供 Design System MD 參考資料，想做橫向比較
---

# Design Reference → Live Preview Workflow

## Trigger
用戶提供 Design System MD 參考資料，想在瀏覽器中做橫向比較而非直接套用自己的品牌。

## Input
- MD 格式的 Design System 參考檔（位於 `50_Content_Creation/20_創作框架/Design參考資料/`）
- 數量：16份參考（已全部完成：Cal · Vercel · Linear · Meta Store · Notion · Pinterest · Shopify · SpaceX · Starbucks · The Verge · WIRED · Airtable · Apple · BMW · Binance · Bugatti）

## Output
`_Design_Preview.html` — 單一 HTML 檔（~211KB），屬性並列對比（非品牌各自呈現）。Python parse 一次同時處理所有品牌，不需要分行執行。

## 結構（10 個 § 屬性維度）

| § | 屬性 | 內容 |
|:--|:--|:--|
| §1 | Colors | Primary · Background · Card · Dark · Accent · Gray scale |
| §2 | Typography | Font families · Display · Body · Mono · Tracking strategy |
| §3 | Spacing | Base unit · Scale · Section gap · Card padding |
| §4 | Radius | 5 級圓角（Micro → Full）|
| §5 | Shadows | Level 1/2/3 · Shadow-as-border |
| §6 | Buttons | Primary · Secondary · Ghost |
| §7 | Cards | Feature card · Dark card |
| §8 | Badges | Category badge · Pill status · Avatar |
| §9 | Do's & Don'ts | 各品牌 8 條規則 |
| §10 | AI Prompts | 可直接貼給 Claude Code 的生成指令 |

## 呈現邏輯
- **橫向**：各品牌（品牌名作為欄位標題）
- **縱向**：同一屬性（方便橫排比較）
- 目的：讓用戶在 IDE/瀏覽器中一目了然，選擇要採用哪些項目

## ⚠️ Misty 偏好：不做品牌移植，做屬性分類對照

**絕對禁止**：將參考品牌的設計 token（顏色、字體、間距數值）直接套用到 Misty 自己的品牌上。

**正確做法**：以「屬性」為維度，將所有品牌的同類設計並列展示。例如：
- §1 色彩：所有品牌的 Primary/Background/Accent hex 值排成一行對照
- §2 字體：所有品牌的 font-family + letter-spacing 排成一行對照

**為什麼**：Misty 的品牌（格紋幾何鴿，#404060 主色）需要獨立建立，不能從參考資料移植。設計參考資料的用途是「拓寬審美視野，支撐決策」，不是「抄襲 token」。

**Source**: session 20260428_004728（Misty 明確糾正：「不要套入我的設計，而是以參考資料為內容」）

## HTML 技術要求
- 單一 self-contained HTML（無外部依賴）
- 深色背景（#0d1117）舒適閱讀
- 8px spacing base 尺規視覺化
- CSS 變數集中管理所有 token
- 每次更新**蓋掉舊版** `_Design_Preview.html`

## 工作流
```
用戶提供 MD 參考檔
      ↓
解析 MD，抽離各 § 屬性內容
      ↓
更新 _Design_Preview.html（屬性並列對比結構）
      ↓
用戶在瀏覽器/IDE 預覽，選擇要採用的項目
```

## 檔案位置
```
50_Content_Creation/20_創作框架/Design參考資料/_Design_Preview.html
```
