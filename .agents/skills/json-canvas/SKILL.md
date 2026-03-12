---
name: json-canvas
description: 使用節點 (Nodes)、邊 (Edges)、分組 (Groups) 與連接建立與編輯 JSON Canvas 檔案 (.canvas)。當處理 .canvas 檔案、建立視覺化畫布、心智圖、流程圖，或使用者提及 Obsidian 中的 Canvas 時，請使用此技能。
---

# JSON Canvas 技能

此技能使具備技能相容性的代理人能夠建立和編輯用於 Obsidian 及其他應用程式的有效 JSON Canvas (`.canvas`) 檔案。

## 概覽

JSON Canvas 是無限畫布資料的開放格式。檔案副檔名為 `.canvas`，內容符合 [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/) 的格式。

## 檔案結構

畫布檔案包含兩個頂層陣列：
```json
{
  "nodes": [],
  "edges": []
}
```

- `nodes` (選填): 節點物件陣列
- `edges` (選填): 連接節點的邊物件陣列

## 節點 (Nodes)

節點是置於畫布上的物件。共有四種類型：
- `text` - 包含 Markdown 的文字內容
- `file` - 引用檔案/附件
- `link` - 外部 URL
- `group` - 其他節點的視覺容器

### 疊放順序 (Z-Index)

陣列中節點的順序決定了疊放程度：
- 首位節點：最底層（顯示在其他節點下方）
- 末位節點：最上層（顯示在其他節點上方）

### 通用節點屬性

所有節點共享下列屬性：
| 屬性 | 必填 | 類型 | 描述 |
|-----------|----------|------|-------------|
| `id` | 是 | 字串 | 唯一識別碼 |
| `type` | 是 | 字串 | `text`, `file`, `link`, 或 `group` |
| `x` | 是 | 整數 | X 座標位置 (像素) |
| `y` | 是 | 整數 | Y 座標位置 (像素) |
| `width` | 是 | 整數 | 寬度 (像素) |
| `height` | 是 | 整數 | 高度 (像素) |
| `color` | 否 | 顏色 | 節點顏色 (1-6 預設或十六進位) |

### 文字節點 (Text Nodes)

```json
{
  "id": "6f0ad84f44ce9c17",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 400,
  "height": 200,
  "text": "# 標題\n\n這是包含 **Markdown** 的文字。"
}
```

**關鍵警告**：在 JSON 中，換行字元必須表示為 `\n`。**嚴禁**在 `.canvas` 檔案中直接使用 `\\n`，否則 Obsidian 會將其顯示為 "/" 字元。
*   **正確**：`"Line 1\nLine 2"`
*   **錯誤**：`"Line 1\\nLine 2"` (Obsidian 渲染結果會不正確)

### 檔案節點 (File Nodes)

引用資源庫中的檔案（圖片、影片、PDF、筆記等）。
- `file`: 系統內檔案路徑
- `subpath`: 連結到標題或區塊（以 `#` 開頭）

### 分組節點 (Group Nodes)

組織其他節點的容器。
- `label`: 分組標籤文字
- `backgroundStyle`: 背景樣式 (`cover`, `ratio`, `repeat`)

## 邊 (Edges)

連接節點的線條。
- `fromNode`: 起始節點 ID
- `fromSide`: 出發方向 (`top`, `right`, `bottom`, `left`)
- `toNode`: 結束節點 ID
- `toSide`: 進入方向
- `label`: 邊線標籤文字
- `toEnd`: 終點形狀 (預設為 `arrow`)

## 顏色顏色預設

| 預設值 | 顏色 |
|--------|-------|
| `"1"` | 紅色 |
| `"2"` | 橘色 |
| `"3"` | 黃色 |
| `"4"` | 綠色 |
| `"5"` | 青色 |
| `"6"` | 紫色 |

## 完整範例 (基礎連結)

```json
{
  "nodes": [
    {
      "id": "node1",
      "type": "text",
      "x": 0, "y": 0, "width": 200, "height": 100,
      "text": "核心主題"
    },
    {
      "id": "node2",
      "type": "text",
      "x": 300, "y": 0, "width": 200, "height": 100,
      "text": "關聯概念"
    }
  ],
  "edges": [
    {
      "id": "edge1",
      "fromNode": "node1", "fromSide": "right",
      "toNode": "node2", "toSide": "left"
    }
  ]
}
```

## ID 生成

節點與邊的 ID 必須是唯一的。建議產生 16 位的隨機 16 進位字串：
`"id": "6f0ad84f44ce9c17"`

## 佈局建議

- `x` 向右增加，`y` 向下增加。
- 座標可以是負數。
- 節點間距建議保持 `50-100` 像素以維持可讀性。

## 驗證規則

1. ID 全局唯一。
2. `fromNode` 與 `toNode` 必須存在於畫布中。
3. `type` 必須正確。
4. 嚴格轉移 JSON 中的非法換行字元。

## 參考資料

- [JSON Canvas Spec](https://jsoncanvas.org/spec/1.0/)
- [JSON Canvas GitHub](https://github.com/obsidianmd/jsoncanvas)
