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

# Skill Graph Agent 整合研究 - 研究發現

> 研究日期：2026-04-04
> 研究者：Navi

---

## 發現記錄

### 發現 1: Agency Profile System

**架構：**
```
Profile System
├── Profile Name          → Agent 角色名稱
├── Role Definition       → 核心角色定義
├── Skills              → 技能列表
├── Behavioral Guidelines → 行為準則
├── Context Templates    → 上下文模板
└── Tool Permissions    → 工具許可權
```

**關鍵 insight：**
- 每個 Profile 是獨立的定義單元
- Profile 可引用其他 Profile（Skill Reference）
- 交付物（Deliverables）有標準格式

**對我們的啟發：**
- 每個部門的 sub-agent 需要預先定義 Profile
- Profile 包含 Skills、Guidelines、Tools、Verification

### 發現 2: OpenClaw sessions_spawn

**架構：**
```
Profile Agent（組長）
    ↓ sessions_spawn
Sub-agent（Sage）
    ├── 根據 agentId 對應 AGENTS.md
    ├── 執行指定任務
    └── 產出寫入共享 workspace
```

**關鍵 insight：**
- Sub-agent 的能力完全來自預先定義的 AGENTS.md
- 組長只需選擇 sub-agent 類型，不需臨時賦予能力
- Sub-agent 可共享父 Agent 的 context

**對我們的啟發：**
- AGENTS.md 就是我們的 Profile 定義位置
- 組長的協調能力比執行能力更重要

### 發現 3: Skill Graph 網站

**流程：**
```
輸入（CV/經歷）
    ↓ AI 萃取
技能節點 + 關係邊 = Skill Graph
    ↓ 對比目標
Gap 識別
    ↓
學習路徑 + 實踐建議
    ↓
追蹤進度，Graph 持續演化
```

**關鍵 insight：**
- 技能萃取自動化
- Gap 分析有系統化方法
- Learning Path 可量化

**對我們的啟發：**
- 將「技能萃取」改為「任務類型萃取」
- 每個任務類型（Task Type）對應一組固定的執行套件

---

## Phase 3: 系統整合評估

### 整合架構

```
組長收到任務
        ↓
Skill Graph 查詢（哪種 Task Type）
        ↓
OpenViking 檢索相關記憶
        ↓
組長使用 Task Type 模板創建 sub-agent
        ↓
Sub-agent 執行
        ↓
Skill Graph 驗證（verification checklist）
        ↓
如果成功 → self-master 記錄 pattern
如果失敗 → self-master 記錄 error
```

### 與現有系統的關係

| 系統 | 角色 | 邊界定義 |
|------|------|---------|
| Knowledge Graph | 知識儲存層 | Skill Graph 引用知識節點，不重複儲存 |
| self-master | 進化學習層 | Skill Graph 的驗證結果觸發 self-master 學習 |
| OpenViking | 記憶檢索層 | 組長查詢 Skill Graph 時，OpenViking 提供相關記憶注入 |

---

## 假設

1. Skill Graph 節點可以預先定義在 Obsidian 中，供組長查詢
2. 每個任務類型（Task Type）對應一組固定的執行套件
3. Sub-agent 的能力完全來自預先定義的 Profile，組長只需選擇不需臨時賦予

## 已驗證的假設

1. **Agency Profile System 可用於 OpenClaw** — OpenClaw 的 AGENTS.md 就是 Profile 的載體

## 已否定的假設

[待填寫]

---

*研究發現完成：2026-04-04*
