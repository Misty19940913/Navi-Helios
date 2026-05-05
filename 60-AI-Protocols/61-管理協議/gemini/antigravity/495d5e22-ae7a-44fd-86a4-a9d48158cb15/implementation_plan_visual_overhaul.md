---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# 畫布視覺強化轉換計畫 (視覺強化協議實施)

本計畫將根據 `畫布節點視覺強化協議.md`，對 `一人企業節點邏輯分析圖.canvas` 中涉及 `232-150` 的知識點進行視覺升級。

## 定義知識點與摘要提取

我將針對以下知識點進行轉換：
1. **內核影響力**：[[說服力 (Persuasion)]]
2. **產品化與戰略**：[[技能堆疊公式 (Skill Stacking Formula)]]、[[個人壟斷 (Personal Monopoly)]]
3. **創造力策略**：[[智能模仿 (Intelligent Imitation)]]、[[跨領域合成 (Transdisciplinary Synthesis)]]、[[先開始，再學習 (Build-to-Learn)]]
4. **定位與內容**：[[3-Interest Mix]]、[[主題樹結構 (Topic Tree)]]、[[真實性護城河 (Authenticity Moat)]]
5. **封裝與產出**：[[訊息層 (Messaging)]]、[[價值傳遞 8 要素 (8 Pillars of Value Transfer)]]、[[寫作：數位底層協議 (Writing as Base Protocol)]]、[[思維鐵匠 (Mindsmithing)]]、[[概念開發：命名流程 (Naming Your Process)]]
6. **分銷**：[[分銷平衡模型 (Distribution Balance Model)]]

## 轉換邏輯
- **節點類型轉換**：由 `file` 改為 `text`。
- **格式封裝**：
  ```markdown
  ## [[檔案名稱]]
  {提取筆記定義段落}
  ```
- **尺寸優化**：統一調整為 `width: 350`, `height: 160` (或根據文字長度動態調整)。

## 執行步驟
1. 逐一讀取上述筆記的「定義」或「摘要」段落。
2. 在 Canvas 文件中將對應 ID 的節點替換為 `text` 格式。
3. 確保連線 (Edges) ID 保持不變，維持原有邏輯拓撲。

## 驗證計畫
- [ ] 檢查所有節點是否均變為可點擊的連結標題。
- [ ] 檢查簡介文字是否溢出或過長。
- [ ] 確認所有影子節點 (Shadow Nodes) 亦同步更新。
