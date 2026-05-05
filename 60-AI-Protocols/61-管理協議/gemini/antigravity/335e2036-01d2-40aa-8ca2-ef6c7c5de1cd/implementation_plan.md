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

# 智能協議重構企劃案：從「指令」轉向「協議」

## 1. 核心願景
將原有的 `gemini/` 多文件框架轉型為 **`Agent/Protocols/` (智能協議庫)**。
不再強求固定的 `//` 指令觸發，而是定義一套「標準作業程序 (SOP)」，讓 AI 在任何對話中都能根據情境主動調用對應的協議。

---

## 2. 目錄結構變更 (Proposed Structure)

```
Agent/
├── AGENTS.md                 ← 中央大腦（定義誰在做、在哪做）
├── Prompts/                  ← 角色人格（定義 AI 的性格與語氣）
│   ├── SentryPigeon-內容戰略官.md
│   └── 系統架構師.md
└── Protocols/                ← 執行協議（定義 AI 如何做事，由 gemini/ 遷移）
    ├── 對話日誌存檔協議.md    ← 原 //log
    ├── 自媒體審計協議.md      ← 原 //audit + 內容主編邏輯
    ├── 敘事極致化重構協議.md  ← 原 //tweak + //rb
    ├── 原子任務捕獲協議.md    ← 原 //CAPTURE_TASK
    └── 專案進度分析協議.md    ← 原 //status
```

---

## 3. 改造細節 (Transformation Rules)

### 3.1 格式現代化
每個協議檔案將採用以下結構，以利 `agent-client` 背後的 LLM 精準執行：
- **引發情境 (Triggers)**：明確列出何時該啟動此程序。
- **思考邏輯 (Chain of Thought)**：定義 AI 的診斷與處理步驟。
- **禁止清單 (Avoid)**：明確紅線，防止 AI 流於平庸。
- **輸出範本 (Output Template)**：確保產出的格式穩定。

### 3.2 角色與協議分流
- **Prompts (Who)**：負責語氣、濾鏡（如：冷峻、警察視角）。
- **Protocols (How)**：負責演算法、邏輯（如：四維度評分、三層級拆解）。
> [!TIP]
> 這樣的好處是：同一個「審計協議」可以套用在「內容主編」或「架構師」身上，靈活性更高。

### 3.3 移除編號系統
捨棄 `610-XXX` 的傳統編號命名，改用明確的**中文語意命名**，方便在 Obsidian 中透過 `[[` 快速關聯。

---

## 4. 遷移對照表 (Migration Map)

| 原 Gemini 文件 | 改造方向 | 目標路徑 |
|---|---|---|
| `610-010 形象` | 已整合至 AGENTS.md | (歸檔) |
| `610-020 架構` | 已整合至 AGENTS.md | (歸檔) |
| `610-200 指令` | 拆解為多個獨立協議 | `Agent/Protocols/` |
| `610-220 內容主編` | 演算法部分轉化為「審計協議」 | `Agent/Protocols/自媒體審計協議.md` |
| `610-300 自動化` | 轉化為「路徑映射與週期清算程序」 | `Agent/Protocols/系統自動化程序.md` |

---

## 5. 待決事項與建議

- **Gemini CLI 適配**：Gemini CLI 仍可透過 `GEMINI.md` 的指針讀取這些 Protocol。
- **Agent Client 使用法**：在對話中輸入「[[自媒體審計協議]] 請幫我審核這篇...」，AI 就會自動載入該 SOP。

---
**如果您認同此方向，我將開始執行第一階段：建立 Protocols 目錄並遷移核心邏輯。**
