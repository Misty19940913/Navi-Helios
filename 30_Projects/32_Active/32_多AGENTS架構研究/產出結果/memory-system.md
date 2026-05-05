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

# 記憶系統設計

## 設計原則

### 1. 隔離 vs 共享的平衡

| 記憶類型 | 儲存位置 | 共享範圍 | 用途 |
|----------|----------|----------|------|
| 公司整體知識 | 共享空間 | 全體Agent | 公司政策、標準流程 |
| 部門專業知識 | 各部門空間 | L2-L3 | 部門技術、專業 |
| 個人工作記錄 | 個人空間 | 僅本人 | 個人任務進度 |
| 專案記錄 | 專案空間 | 參與者 | 跨部門專案 |

### 2. 記憶層級架構

```
~/.openclaw/
├── workspace-shared/          # 🔽 共享記憶區（公司整體）
│   ├── MEMORY.md             # 公司長期記憶
│   ├── policies/             # 政策文件
│   │   └── company-rules.md
│   ├── knowledge/            # 知識庫
│   │   ├── tech-wiki.md
│   │   ├── media-strategy.md
│   │   └── finance-analysis.md
│   └── projects/             # 專案記錄
│       └── YYYY-MM-DD/
│
├── workspace-supervisor-a/    # 🔽 L1 A主管（Navi）
│   ├── MEMORY.md
│   └── memory/
│
├── workspace-supervisor-b/   # 🔽 L1 B主管（Advisor）
│   ├── MEMORY.md
│   └── memory/
│
├── workspace-tech-lead/      # 🔽 技術部門
│   ├── MEMORY.md
│   └── memory/
│
├── workspace-media-lead/    # 🔽 媒體部門
│   ├── MEMORY.md
│   └── memory/
│
├── workspace-finance-lead/  # 🔽 金融部門
│   ├── MEMORY.md
│   └── memory/
│
└── workspace-doc-lead/       # 🔽 文書部門
    ├── MEMORY.md
    └── memory/
```

### 3. 記憶內容分類

#### 3.1 共享記憶（Shared Memory）
```
workspace-shared/knowledge/
├── company-vision.md        # 公司願景、使命
├── standard-procedures.md   # 標準作業程序
├── approved-tools.md       # 已批准使用的工具
├── budget-guidelines.md    # 預算編列原則
└── escalation-process.md   # 升級流程
```

#### 3.2 部門記憶（Department Memory）
```
workspace-tech-lead/
├── tech-stack.md           # 技術棧
├── codebase-structure.md   # 程式碼結構
├── coding-standards.md      # 編碼規範
└── active-projects.md     # 進行中的專案

workspace-media-lead/
├── content-calendar.md     # 內容日曆
├── platform-strategies.md  # 平台策略
├── brand-guidelines.md     # 品牌規範
└── performance-metrics.md  # 績效指標

workspace-finance-lead/
├── portfolio-summary.md    # 投資組合摘要
├── risk-parameters.md      # 風險參數
├── market-analysis/        # 市場分析
└── trade-log.md           # 交易日誌

workspace-doc-lead/
├── obsidian-structure.md  # Obsidian結構
├── format-standards.md     # 格式標準
├── vault-access.md        # 閘門存取權限
└── documentation/         # 文件庫
```

#### 3.3 個人記憶（Personal Memory）
```
每個Agent的個人workspace/
├── MEMORY.md               # 個人長期記憶
├── preferences.md         # 個人偏好
├── task-queue.md          # 任務隊列
└── notes/                 # 臨時筆記
```

### 4. 向量搜索配置

```json5
// 每個Agent的記憶搜索配置
agents: {
  defaults: {
    memorySearch: {
      provider: "gemini",
      model: "gemini-embedding-001",
      // 額外索引共享知識庫
      extraPaths: [
        "~/.openclaw/workspace-shared/knowledge",
        "~/.openclaw/workspace-shared/policies"
      ],
      // 混合搜索
      query: {
        hybrid: {
          enabled: true,
          vectorWeight: 0.7,
          textWeight: 0.3
        },
        // MMR減少冗餘
        mmr: {
          enabled: true,
          lambda: 0.7
        },
        // 時間衰減
        temporalDecay: {
          enabled: true,
          halfLifeDays: 30
        }
      }
    }
  }
}
```

### 5. 自動記憶刷新配置

```json5
agents: {
  defaults: {
    compaction: {
      reserveTokensFloor: 20000,
      memoryFlush: {
        enabled: true,
        softThresholdTokens: 4000,
        systemPrompt: "Session nearing compaction. Store durable memories now.",
        prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
      }
    }
  }
}
```

### 6. 記憶寫入規則

| 情境 | 寫入位置 | 範例 |
|------|----------|------|
| 公司政策更新 | shared/knowledge/policies/ | 新頒布的規範 |
| 部門技術決定 | department/MEMORY.md | 技術選型決定 |
| 個人任務完成 | personal/memory/ | 完成某功能開發 |
| 跨部門專案 | shared/projects/YYYY-MM/ | 專案進度 |
| 錯誤發生 | error-log/ | 錯誤記錄與解決方案 |

### 7. 記憶同步策略

- **定時同步**：每小時檢查共享記憶是否有更新
- **事件觸發**：當Agent寫入共享記憶時，通知相關Agent
- **按需讀取**：需要時從共享空間查詢，不預先載入

---

## 建議配置優先順序

1. 先建立共享空間 `workspace-shared/`
2. 設定每個Agent的 `extraPaths` 指向共享知識庫
3. 啟用混合搜索和MMR
4. 設定自動記憶刷新
