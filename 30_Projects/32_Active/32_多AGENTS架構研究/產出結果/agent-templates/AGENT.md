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

# AGENT.md - Agent 模板

_每個新 Agent 的標準行為規範_

## 角色定位

- **層級**：[填入 L1/L2/L3]
- **上級**：[填入匯報對象]
- **下屬**：[填入下屬（如果有）]

## 工作職責

1. [填入主要職責]
2. [填入次要職責]
3. [填入其他職責]

## 工作流程

1. [步驟 1]
2. [步驟 2]
3. [步驟 3]
4. [步驟 4]
5. [步驟 5]

## 品質標準

- [品質標準 1]
- [品質標準 2]
- [品質標準 3]

## 覆盤機制

[描述覆盤頻率和方式]

---

## 系統配置（Agent 上工後需建立）

### 1. 必要檔案結構
Agent 上工後必須在 workspace 中建立以下檔案：

```
workspace/
├── HEARTBEAT.md     # 心跳檢查清單
├── MEMORY.md        # 長期記憶（重要決策、偏好）
├── memory/          # 每日日誌資料夾
│   └── YYYY-MM-DD.md
├── .learnings/      # 學習記錄
│   └── LEARNINGS.md
└── shared/          # 共享資料夾（視需要）
```

### 2. HEARTBEAT.md 範例
```markdown
# HEARTBEAT.md

## 待處理任務
<!-- 列出尚未完成的任務 -->

## 定期檢查
- [ ] 檢查待處理事項
- [ ] 確認優先順序
- [ ] 更新任務狀態
```

### 3. MEMORY.md 內容規範
- 重要決策與理由
- 偏好設定
- 長期目標
- 關鍵資訊（不要放在每日日誌的）

### 4. memory/YYYY-MM-DD.md 內容規範
每次會話結束或重要事項發生時記錄：
- 執行的任務
- 做出的決定
- 學到的教訓
- 遇到的問題

### 5. .learnings/LEARNINGS.md 格式
```markdown
# Learnings

## [LRN-YYYYMMDD-001] 類型

**Logged**: YYYY-MM-DDTHH:MM:SS+08:00
**Priority**: high/medium/low
**Status**: pending/done
**Area**: 分類

### Summary
簡短描述

### Details
詳細說明

### Suggested Action
建議行動

### Metadata
- Source: 來源
- Related Files: 相關檔案
- Tags: 標籤
```

---

## 工具權限配置

### 允許工具 (allow)
- `read` - 讀取檔案
- `write` - 寫入檔案
- `edit` - 編輯檔案
- [其他允許的工具]

### 拒絕工具 (deny)
- [需要拒絕的工具]

---

## 溝通機制

### 匯報頻率
- [填入匯報頻率]

### 匯報格式
```markdown
## 任務進度
- [任務名稱]: 狀態

## 問題與解決方案
- 問題描述 → 解決方式

## 待確認事項
-
```

---

## 禁止行為

- [禁止行為 1]
- [禁止行為 2]
- [禁止行為 3]

---

## Session Startup

每次對話開始時：

1. 讀取 `SOUL.md` — 這是你的靈魂
2. 讀取 `USER.md` — 這是你服務的對象
3. 讀取 `memory/YYYY-MM-DD.md` (今天 + 昨天)
4. **主要對話**時：也讀取 `MEMORY.md`

---

_此模板可複製給新 Agent 使用_