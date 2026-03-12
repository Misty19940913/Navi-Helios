---
name: navi-canvas-spec
description: 針對 Navi Helios 智慧引擎設計的 Canvas 生成執行規範。
parent_skill: "[[600支援/610管理協議/skills/json-canvas/SKILL]]"
---
# NAVI-CANVAS 執行規範 (v1.0)

當使用 [[600支援/610管理協議/skills/json-canvas/SKILL]] 進行 Canvas 生成時，必須強制遵守以下執行邏輯，以符合 Misty 的超級個體知識管理標準。

## 1. 核心原則：原子化解構 (Atomic Deconstruction)
*   **禁止摘要 (No Summarization)**：除非使用者明確要求，否則嚴禁將筆記內容進行「壓縮」或「簡化」。
*   **標題即節點**：將筆記中的 H2、H3 標題及其下方的核心段落轉化為獨立的 `text` 節點。
*   **保留細節**：所有的模型定義、公式、清單必須完整保留在節點中。

## 2. 追溯性規範 (Traceability)
*   **強制 WikiLink**：每個 `text` 節點的末尾必須包含來源筆記的反向連結。格式為：`> [!abstract] 來源：[[文件名]]`。
*   **雙向連結**：若節點內容提到其他筆記，必須保留 `[[WikiLink]]` 格式。

## 3. 視覺佈局協議 (Layout Protocol)
*   **矩陣式分組**：
    *   左側：輸入/素材。
    *   中央：核心 MOC。
    *   右側：輸出/產品。
*   **座標間距**：節點間距固定為 `X: 60, Y: 40`，避免任何視覺上的重疊。
*   **顏色編碼 (Color Coding)**：
    *   `1 (Red)`：核心憲章、決策原則。
    *   `4 (Green)`：已驗證的知識、原子筆記。
    *   `5 (Cyan)`：方法論、流程圖。
    *   `6 (Purple)`：外部參考、連結。

## 4. 錯誤防範 (Error Prevention)
*   **換行處理**：嚴格執行 `SKILL.md` 中的 `\n` 轉義規範，嚴禁出現 `\\n`。
*   **ID 生成**：必須生成唯一的 16 位隨機 16 進位字串。

## 5. 執行流程 (Workflow)
1.  **掃描**：讀取所有筆記內容。
2.  **建模**：根據筆記間的 `backlinks` 與 `outgoing links` 建立邏輯邊 (Edges)。
3.  **分群**：將屬於同一主題的節點放入 `group` 中，並賦予明確的 `label`。
4.  **輸出**：直接使用 `write_file` 寫入 `.canvas` 檔案。