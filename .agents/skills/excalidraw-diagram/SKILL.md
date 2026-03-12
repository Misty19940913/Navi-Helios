---
name: excalidraw-diagram
description: Generate Excalidraw diagrams from text content. Supports three output modes - Obsidian (.md), Standard (.excalidraw), and Animated (.excalidraw with animation order). Triggers on "Excalidraw", "畫圖", "流程圖", "思维導圖", "可视化", "diagram", "标准Excalidraw", "standard excalidraw", "Excalidraw动画", "动画图", "animate".
metadata:
  version: 1.2.1
---

# Excalidraw Diagram Generator

Create Excalidraw diagrams from text content with multiple output formats.

## Output Modes
根據用戶的觸發詞選擇輸出模式：

| 觸發詞 | 輸出模式 | 文件格式 | 用途 |
|--------|----------|----------|------|
| `Excalidraw`、`畫圖`、`流程圖`、`思维導圖` | **Obsidian**（默認） | `.md` | 在 Obsidian 中直接打開 |
| `標準Excalidraw`、`standard excalidraw` | **Standard** | `.excalidraw` | 在 excalidraw.com 打開/編輯/分享 |
| `Excalidraw動畫`、`動畫圖`、`animate` | **Animated** | `.excalidraw` | 拖到 excalidraw-animate 生成動畫 |

## Workflow
1. **Detect output mode** from trigger words (see Output Modes table above)
2. Analyze content - identify concepts, relationships, hierarchy
3. Choose diagram type (see Diagram Types below)
4. Generate Excalidraw JSON (add animation order if Animated mode)
5. Output in correct format based on mode
6. **Automatically save to current working directory**
7. Notify user with file path and usage instructions

## Output Formats

### Mode 1: Obsidian Format (Default)
**嚴格按照以下結構輸出，不得有任何修改：**

```markdown
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'

# Excalidraw Data

## Text Elements
%%
## Drawing
```json
{JSON 完整數據}
```
%%
```

**關鍵要點：**
- Frontmatter 必須包含 `tags: [excalidraw]`
- 警告信息必須完整
- JSON 必須被 `%%` 標記包圍
- 不能使用 `excalidraw-plugin: parsed` 以外的其他 frontmatter 設置
- **文件擴展名**：`.md`

### Mode 2: Standard Excalidraw Format
直接輸出純 JSON 文件，可在 excalidraw.com 打開：

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [...],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

**關鍵要點：**
- `source` 使用 `https://excalidraw.com`（不是 Obsidian 插件）
- 純 JSON，無 Markdown 包裝
- **文件擴展名**：`.excalidraw`

### Mode 3: Animated Excalidraw Format
與 Standard 格式相同，但每個元素添加 `customData.animate` 字段控制動畫順序：

```json
{
  "id": "element-1",
  "type": "rectangle",
  "customData": {
    "animate": {
      "order": 1,
      "duration": 500
    }
  },
  ...其他標準字段
}
```

**動畫順序規則：**
- `order`: 動畫播放順序（1, 2, 3...），數字越小越先出現
- `duration`: 該元素的繪製時長（毫秒），默認 500
- 相同 `order` 的元素同時出現
- 建議順序：標題 → 主要框架 → 連接線 → 细节文字

**使用方法：**
1. 生成 `.excalidraw` 文件
2. 拖到 https://dai-shi.github.io/excalidraw-animate/
3. 點擊 Animate 預覽，然後導出 SVG 或 WebM

**文件擴展名**：`.excalidraw`

## Diagram Types & Selection Guide
選擇合適的圖表形式，以提升理解力與視覺吸引力。

| 類型 | 英文 | 使用場景 | 做法 |
|------|------|---------|------|
| **流程圖** | Flowchart | 步驟說明、工作流程、任務執行順序 | 用箭頭連接各步驟，清晰表達流程走向 |
| **思维導圖** | Mind Map | 概念發散、主題分類、靈感捕捉 | 以中心為核心向外發散，放射狀結構 |
| **層級圖** | Hierarchy | 組織結構、內容分級、系統拆解 | 自上而下或自左至右構建層級節點 |
| **關係圖** | Relationship | 要素之間的影響、依賴、互動 | 圖形間用連線表示關聯，箭頭與說明 |
| **對比圖** | Comparison | 兩種以上方案或觀點的對照分析 | 左右兩欄或表格形式，標明比較維度 |
| **時間線圖** | Timeline | 事件發展、項目進度、模型演化 | 以時間為軸，標出關鍵時間點與事件 |
| **矩陣圖** | Matrix | 雙維度分類、任務優先級、定位 | 建立 X 與 Y 兩個維度，座標平面安置 |
| **自由佈局** | Freeform | 內容零散、靈感記錄、初步信息收集 | 無需結構限制，自由放置圖塊與箭頭 |

## Design Rules

### Text & Format
- **所有文本元素必須使用** `fontFamily: 5`（Excalifont 手寫字體）
- **文本中的雙引號替換規則**：`"` 替換為 `『』`
- **文本中的圓括號替換規則**：`()` 替換為 `「」`
- **字體大小規則**（硬性下限，低於此值在正常縮放不可讀）：
  - 標題：20-28px（最小 20px）
  - 副標題：18-20px
  - 正文/標籤：16-18px（最小 16px）
  - 次要注釋：14px（僅限不重要的輔助說明，慎用）
  - **絕對禁止低於 14px**
- **行高**：所有文本使用 `lineHeight: 1.25`
- **文字居中估算**：獨立文本元素沒有自動居中，需手動計算 x 座標：
  - 估算文字寬度：`estimatedWidth = text.length * fontSize * 0.5`（CJK 字符用 `* 1.0`）
  - 居中公式：`x = centerX - estimatedWidth / 2`

### Layout & Design
- **畫布範圍**：建議所有元素在 0-1200 x 0-800 區域內
- **最小形狀尺寸**：帶文字的矩形/橢圓不小於 120x60px
- **元素間距**：最小 20-30px 間距，防止重疊
- **層次清晰**：使用不同顏色和形狀區分不同層級的信息
- **圖形元素**：適當使用矩形框、圓形、箭頭等元素來組織信息
- **禁止 Emoji**：不要在圖表文本中使用任何 Emoji 符號
- **線條風格（強制）**：所有箭頭與連接線必須設定 `"sharpness": "sharp"` (精確模式) 及 `"roundness": null`，禁止使用預設的曲線模式

### Color Palette
**文字顏色（strokeColor for text）：**

| 用途 | 色值 | 說明 |
|------|------|------|
| 標題 | `#1e40af` | 深藍 |
| 副標題/連接線 | `#3b82f6` | 亮藍 |
| 正文文字 | `#374151` | 深灰 |
| 強調/重點 | `#f59e0b` | 金色 |

**形狀填充色（backgroundColor, fillStyle: "solid"）：**

| 色值 | 語義 | 適用場景 |
|------|------|---------|
| `#a5d8ff` | 淺藍 | 輸入、數據源、主要節點 |
| `#b2f2bb` | 淺綠 | 成功、輸出、已完成 |
| `#ffd8a8` | 淺橙 | 警告、待處理、外部依賴 |
| `#d0bfff` | 淺紫 | 處理中、中間件、特殊項 |
| `#ffc9c9` | 淺紅 | 錯誤、關鍵、告警 |
| `#fff3bf` | 淺黃 | 備注、决策、規劃 |
| `#c3fae8` | 淺青 | 存儲、數據、緩存 |
| `#eebefa` | 淺粉 | 分析、指標、統計 |

## Knowledge Node Template

當節點用於呈現「知識點」（即連結至 Vault 內某份原子化筆記時），**text 欄位必須嚴格使用以下模板**：

```
## [[知識點名稱]]
一句話核心洞見或定義
```

**範例：**
```json
{
  "id": "node_quadrants",
  "type": "rectangle",
  "x": 450, "y": 160, "width": 280, "height": 80,
  "backgroundColor": "#d1fae5",
  "fillStyle": "solid"
}
```
對應的文字元素：
```json
{
  "id": "label_quadrants",
  "type": "text",
  "x": 470, "y": 170,
  "text": "## [[H3.0-四大象限]]\n心智、身體、精神、職業四維整合發展",
  "fontSize": 18,
  "fontFamily": 5
}
```

**規則細節：**
- 標題行：`## [[完整的 Wikilink 檔名，不含 .md 副檔名]]`
- 說明行：15-30 字以內的單句核心洞見，不使用條列符號
- `\n` 為標題與說明之間的唯一分隔符（必須是 JSON 中的 `\n`，非文字斷行）
- Wikilink 中的文字需與 Vault 中的實際檔案名完全一致（區分大小寫）

---
