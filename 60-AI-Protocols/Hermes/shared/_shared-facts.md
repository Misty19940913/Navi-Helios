---
version: 5.0.0
created: 2026-04-17T15:47:00Z
updated: 2026-04-29T10:25:00Z
type: shared-fact
folder: 60-AI-Protocols/Hermes/shared
status: active
time_created: '2026-04-17'
time_modified: '2026-04-29'
description: Hermes 系統技術共識
parent:
  - "[[60-AI-Protocols/Hermes/index]]"
children: []
related:
  - "[[_hermes-errors]]"
  - "[[_user-profile]]"
  - "[[60-AI-Protocols/.learnings]]"
tags:
  - hermes
  - shared-facts
---

# _shared-facts

> Hermes 系統技術層面共識。
> 使用者身份、偏好、溝通模式 → `[[_user-profile]]`

---

## Vault 系統架構

### 核心路徑
| 路徑 | 說明 |
|------|------|
| `Vault` | `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios` |
| `AI-Protocols` | `60-AI-Protocols/` |
| `Skills` | `60-AI-Protocols/Hermes/skills/` |
| `Shared` | `60-AI-Protocols/Hermes/shared/` |

### 檔案操作對應
| 副檔名 | 技能 |
|--------|------|
| `.md` | `obsidian-markdown` |
| `.base` | `obsidian-bases` |
| `.canvas` | `json-canvas` |
| 網頁擷取 | `defuddle` |
| Vault CLI | `obsidian-cli` |

### Skills 路徑速查
```
~/.hermes/skills/obsidian-markdown/
~/.hermes/skills/obsidian-bases/
~/.hermes/skills/json-canvas/
~/.hermes/skills/defuddle/
~/.hermes/skills/obsidian-cli/
```

---

## 記憶系統三層

| 層 | 說明 |
|----|------|
| **MEMORY.md** | 持久記憶（~2,200 chars，80% soft limit 約 1,760 chars） |
| **USER.md** | 使用者 profile（~1,375 chars） |
| **session_search** | 跨 session 搜尋（所有歷史對話，FTS5 SQLite） |

---

## Skills 結構

| 類別 | 說明 |
|------|------|
| `_primitives/` | 基礎技能（01_flow-planning ~ 08_logging） |
| `workflow/` | 工作流技能（含 pattern-pending 機制） |
| `llm-wiki-ops/` | Wiki 操作技能 |
| `obsidian/` | Obsidian 相關技能 |

---

## 進化觸發時機

| 觸發條件 | 動作 |
|---------|------|
| 5+ tool calls 完成複雜任務 | 建立 skill 或更新記憶 |
| 遇到錯誤並找到解決路徑 | 更新 `_hermes-errors.md` |
| 使用者修正了 approach | 更新 `_user-profile.md` |
| 發現非平凡 workflow | 建立對應 skill |

---

## 容量管理

| 儲存 | 限制 |
|------|------|
| MEMORY.md | 2,200 chars，80% soft limit（約 1,760 chars）就開始合併 |
| USER.md | 1,375 chars |
| Skills | 無硬性限制，需定期 lint |

---

## 演化記錄

| 日期 | 事實 |
|------|------|
| 2026-04-29 | 重構：移除 OpenClaw 殘留內容，統一為 Hermes 純系統技術文件 |

---

*此頁記錄 Hermes 系統技術事實。*
