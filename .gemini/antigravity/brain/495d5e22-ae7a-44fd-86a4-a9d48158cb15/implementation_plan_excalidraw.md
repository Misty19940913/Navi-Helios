# 繪圖格式轉換實施計畫 (Canvas to Excalidraw Conversion)

將現有的 `一人企業節點邏輯分析圖.canvas` 轉換為 `一人企業節點邏輯分析圖.excalidraw.md`，以符合使用者偏好的繪圖管理方式。

## 待執行變更

### [繪圖轉換]

#### [NEW] [一人企業節點邏輯分析圖.excalidraw.md](file:///d:/OneDrive/Obsidian/Navi Helios/600支援/640excaildraw/一人企業節點邏輯分析圖.excalidraw.md)
- 建立符合 Excalidraw 規範的 Markdown 封裝檔。
- 基於 Canvas 座標與節點類型，生成對應的 Excalidraw Elements。
- 將 Canvas 的 `file` 節點映射為具備雙向連結的 Excalidraw Text 或 Sticky Note。
- 將 `group` 節點映射為 Excalidraw 的 Rectangle (帶有背景色與 Label)。
- 將 `edges` 映射為 Excalidraw 的 Arrows。

## 驗證計畫

### 手動驗證
- 使用者在 Obsidian 中開啟新的 `.excalidraw.md` 檔案，確認視覺結構是否與 Canvas 版本一致。
- 測試點擊節點連結，確認是否能正確跳轉至原子化筆記。
