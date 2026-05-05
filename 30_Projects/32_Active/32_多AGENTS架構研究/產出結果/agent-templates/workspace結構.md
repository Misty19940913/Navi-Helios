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

# 新 Agent Workspace 結構

## 標準目錄結構

```
~/.openclaw/workspace-{agentId}/
│
├── AGENT.md              # 行為規範（從模板複製）
├── SOUL.md               # 靈魂/人格（從模板複製，需客製化）
├── USER.md               # 用戶資訊（從模板複製，需客製化）
├── IDENTITY.md           # 身份定義（從模板複製，需客製化）
├── TOOLS.md              # 工具筆記（從模板複製，需客製化）
├── HEARTBEAT.md          # 心跳檢查清單（上工後建立）
│
├── memory/               # 個人記憶目錄（上工後建立）
│   └── YYYY-MM-DD.md    # 每日日誌
│
├── MEMORY.md             # 長期記憶（上工後建立）
│
├── .learnings/           # 學習記錄（上工後建立）
│   └── LEARNINGS.md
│
├── skills/               # Per-Agent 技能（可選）
│   └── [自訂技能]
│
└── canvas/               # Canvas 檔案（可選）
    └── index.html
```

---

## 核心檔案說明

| 檔案 | 說明 | 建立時機 |
|------|------|----------|
| AGENT.md | 行為規範、工作職責、工具權限 | 從模板複製 |
| SOUL.md | 靈魂、人格、價值觀 | 從模板客製化 |
| USER.md | 用戶資訊、偏好 | 從模板客製化 |
| IDENTITY.md | 身份識別、名稱、emoji | 從模板客製化 |
| TOOLS.md | 本地工具備忘錄 | 從模板客製化 |
| HEARTBEAT.md | 心跳檢查清單 | 上工後建立 |
| MEMORY.md | 長期記憶 | 上工後建立 |
| memory/YYYY-MM-DD.md | 每日日誌 | 上工後建立 |
| .learnings/LEARNINGS.md | 學習記錄 | 上工後建立 |

---

## 建立新 Agent 的步驟

### 1. 複製模板檔案

```bash
# 假設新Agent ID為 "supervisor-b"
TEMPLATE_DIR="/mnt/c/Users/ghost/OneDrive/Obsidian/Navi Helios/30_Projects/32_Active/32_多AGENTS架構研究/產出結果/agent-templates"

# 1. 建立目錄
mkdir -p ~/.openclaw/workspace-supervisor-b

# 2. 複製模板
cp $TEMPLATE_DIR/AGENT.md ~/.openclaw/workspace-supervisor-b/
cp $TEMPLATE_DIR/SOUL.md ~/.openclaw/workspace-supervisor-b/
cp $TEMPLATE_DIR/USER.md ~/.openclaw/workspace-supervisor-b/
cp $TEMPLATE_DIR/IDENTITY.md ~/.openclaw/workspace-supervisor-b/
cp $TEMPLATE_DIR/TOOLS.md ~/.openclaw/workspace-supervisor-b/
```

### 2. 客製化 SOUL.md

編輯 `SOUL.md`，填入：
- Name
- Creature  
- Vibe
- Emoji

### 3. 客製化 USER.md

編輯 `USER.md`，填入：
- 用戶名稱
- 稱呼
- 時區
- 備註

### 4. 客製化 IDENTITY.md

編輯 `IDENTITY.md`，填入：
- Name
- Creature
- Vibe
- Emoji
- Avatar

### 5. 客製化 TOOLS.md

編輯 `TOOLS.md`，填入：
- 專屬工具配置
- 部門特定配置
- 常用命令備忘

### 6. 依 AGENT.md 規範建立檔案

按照 AGENT.md 中的「系統配置」章節建立：
- HEARTBEAT.md
- MEMORY.md
- memory/YYYY-MM-DD.md
- .learnings/LEARNINGS.md

### 7. 配置 OpenClaw

在 `~/.openclaw/openclaw.json` 中添加：

```json5
{
  agents: {
    list: [
      {
        id: "supervisor-b",
        name: "Advisor",
        workspace: "~/.openclaw/workspace-supervisor-b",
        model: "minimax-portal/MiniMax-M2.5"
      }
    ]
  }
}
```

---

## 共享 Workspace

所有 Agent 可以訪問的共享空間：

```
~/.openclaw/workspace-shared/
├── MEMORY.md              # 公司長期記憶
├── policies/              # 政策文件
│   └── company-rules.md
├── knowledge/             # 知識庫
│   ├── tech-wiki.md
│   ├── media-strategy.md
│   └── finance-analysis.md
└── projects/              # 專案記錄
    └── YYYY-MM-DD/
```

---

## 快速建立腳本

```bash
#!/bin/bash
# new-agent.sh

AGENT_ID=$1
AGENT_NAME=$2
TEMPLATE_DIR="/mnt/c/Users/ghost/OneDrive/Obsidian/Navi Helios/30_Projects/32_Active/32_多AGENTS架構研究/產出結果/agent-templates"

# 建立目錄
mkdir -p ~/.openclaw/workspace-$AGENT_ID/{memory,.learnings,skills,canvas}

# 複製模板
cp $TEMPLATE_DIR/AGENT.md ~/.openclaw/workspace-$AGENT_ID/
cp $TEMPLATE_DIR/SOUL.md ~/.openclaw/workspace-$AGENT_ID/
cp $TEMPLATE_DIR/USER.md ~/.openclaw/workspace-$AGENT_ID/
cp $TEMPLATE_DIR/IDENTITY.md ~/.openclaw/workspace-$AGENT_ID/
cp $TEMPLATE_DIR/TOOLS.md ~/.openclaw/workspace-$AGENT_ID/

echo "Agent $AGENT_ID 建立完成！"
echo "請記得："
echo "1. 客製化 SOUL.md"
echo "2. 客製化 USER.md"
echo "3. 客製化 IDENTITY.md"
echo "4. 客製化 TOOLS.md"
echo "5. 依 AGENT.md 建立 HEARTBEAT.md、MEMORY.md、memory/、.learnings/"
echo "6. 在 openclaw.json 中配置"
```

用法：
```bash
./new-agent.sh supervisor-b Advisor
```

---

## 更新記錄

- 2026-03-23: 初始版本
- 2026-03-27: 更新為 6 核心檔案結構 (AGENT, SOUL, USER, IDENTITY, TOOLS, HEARTBEAT)