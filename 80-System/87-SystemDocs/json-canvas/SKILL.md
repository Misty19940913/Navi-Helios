---
name: json-canvas
triggers:
  - "使用者要求建立、編輯或查看 JSON Canvas 檔案"
  - "打開 .canvas 檔案"
  - "建立新的 canvas 節點或連結"
---

# JSON Canvas Skill

## 觸發條件

此 Skill 在以下情境下被調用：

- 使用者提到 `.canvas` 檔案
- 需要建立新的 Canvas 視圖
- 需要編輯現有的 Canvas 節點或連線
- 需要查詢 Canvas 檔案結構

## 操作

1. 確認 vault 路徑
2. 定位或建立 .canvas 檔案
3. 讀取/編輯 JSON 結構

## 檔案格式

Canvas 檔案位於 vault 根目錄，以 `.canvas` 結尾，格式為標準 JSON。
