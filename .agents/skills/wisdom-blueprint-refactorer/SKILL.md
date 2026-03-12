---
name: wisdom-blueprint-refactorer
description: 將長篇筆記提煉為高資訊密度的知識圖表邏輯骨架。負責將非結構化文字轉化為公式、對比、核心模組與 SOP 的結構化數據。
metadata:
  version: 1.0.0
---
# Wisdom Blueprint Refactorer (邏輯提煉師)

本技能負責執行「內容產品化」的第一步：將原始筆記轉化為具備「震懾力」與「專家權威感」的邏輯架構。

## 1. 核心邏輯架構 (Kevin Style Skeleton)

輸出必須包含以下五大核心區塊：

1. **頂部看板 (The Hook)**:

   * **主標題**: 具備掛鈎力的命名。
   * **核心核心公式**: `[要素A] × [要素B] + [要素C] = [最終價值]`。
   * **定義句**: 一句話說明本質。
2. **二元衝突/重塑 (The Conflict)**:

   * **紅區 (Old/Pain)**: 傳統誤區、痛點、混亂狀態（3-4 點）。
   * **綠區 (New/Value)**: 新模式、解決方案、秩序狀態（3-4 點）。
3. **中心架構 (The Core Modules)**:

   * 將知識拆解為 **3-6 個核心模組**。
   * 每個模組需包含：
     * 標題 (關鍵詞)。
     * 核心說明 (15-20 字)。
     * 推薦的 Isometric 圖示描述。
4. **行動/防坑區 (Execution SOP)**:

   * **左側 (行動 SOP)**: 具體的 3-4 個原子化步驟。
   * **右側 (警示區)**: 核心誤區或「大深坑」。
5. **底層腳註 (The Foundation)**:

   * **底層邏輯**: 一句充滿哲理且扎心的總結。

## 2. 輸出規範

提煉結果應以 JSON 格式提供給後續的渲染工具（如 `excalidraw-diagram`），或以 Markdown 格式展現給用戶確認：

```json
{
  "header": {
    "title": "...",
    "formula": "...",
    "definition": "..."
  },
  "conflict": {
    "red_zone": ["...", "..."],
    "green_zone": ["...", "..."]
  },
  "modules": [
    { "title": "...", "desc": "...", "icon_hint": "..." }
  ],
  "execution": {
    "sop": ["Step 1...", "Step 2..."],
    "warnings": ["...", "..."]
  },
  "footer": {
    "bottom_logic": "..."
  }
}
```

## 3. 處理原則

* **極致壓縮**: 捨棄修飾詞，只保留「名詞 + 動詞」。
* **痛感敘事**: 使用具備實戰感的詞彙，避免雞湯。
* **視覺化暗示**: 每段邏輯都要考慮「畫成圖後是否好懂」。
