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

# Findings & Decisions

## Requirements
- 多AGENT配置方式深入研究
- Workspace配置
- 記憶系統配置
- 工具調用能力配置
- 協作方式配置
- 不同架構之間的效率評比
- 同樣的產出水準如何能更加節省token
- 對記憶與上下文更加友善

## Research Findings

### 1. Workspace配置 (Workspace Configuration)

**核心概念：**
- 每個Agent擁有獨立的workspace，作為其專屬工作目錄
- Workspace是文件工具的唯一操作目錄，也是上下文信息的來源
- 隔離的workspace提供安全邊界，防止Agent之間的上下文相互干擾

**配置選項：**
```json5
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace-main" },
      { id: "coding", workspace: "~/.openclaw/workspace-coding" },
      { id: "social", workspace: "~/.openclaw/workspace-social" },
    ]
  }
}
```

**Workspace佈局：**
- `AGENTS.md` - 操作指令
- `SOUL.md` - 人格、語氣、邊界
- `USER.md` - 用戶信息
- `IDENTITY.md` - Agent名稱、氛圍、emoji
- `TOOLS.md` - 本地工具備忘錄
- `HEARTBEAT.md` - 心跳檢查清單
- `memory/YYYY-MM-DD.md` - 每日日誌
- `MEMORY.md` - 長期記憶
- `skills/` - 工作區特定技能
- `canvas/` - Canvas UI文件

**隔離等級：**
- **無隔離（默認）**：相對路徑解析到workspace，但絕對路徑可達到主機其他位置
- **沙箱模式（Sandbox）**：可配置per-agent沙箱，進一步增強隔離

### 2. 記憶系統配置 (Memory System Configuration)

**雙層記憶架構：**
- **短期記憶**：`memory/YYYY-MM-DD.md` - 每日日誌（會話期間的活動和決策）
- **長期記憶**：`MEMORY.md` - 精選的長期知識（重要決策、偏好）

**記憶工具：**
- `memory_search` - 語義搜索（基於向量索引 + 混合搜索）
- `memory_get` - 定向讀取特定Markdown文件

**向量搜索配置：**
```json5
agents: {
  defaults: {
    memorySearch: {
      provider: "gemini", // openai, gemini, voyage, mistral, ollama, local
      model: "gemini-embedding-001",
      fallback: "openai"
    }
  }
}
```

**混合搜索（Hybrid Search）：**
- 向量相似度（語義匹配）
- BM25關鍵詞相關性（精確匹配）
- 權重可配置：`vectorWeight: 0.7, textWeight: 0.3`

**MMR重排序（MMR Re-ranking）：**
- 減少冗余結果，增加多樣性
- 默認λ=0.7（平衡相關性和多樣性）

**時間衰減（Temporal Decay）：**
- 近期記憶獲得更高權重
- 默認半衰期30天

**QMD後端（實驗性）：**
- 本地優先的搜索伴隨服務
- 結合BM25 + 向量 + 重排序

**自動記憶刷新：**
- 會話接近自動壓縮時觸發
- 在上下文壓縮前提醒Agent寫入持久記憶

### 3. 工具調用能力配置 (Tools Configuration)

**Per-Agent工具配置：**
```json5
{
  agents: {
    list: [
      {
        id: "family",
        tools: {
          allow: ["read", "sessions_list", "sessions_history"],
          deny: ["exec", "write", "edit", "apply_patch"]
        }
      }
    ]
  }
}
```

**工具權限繼承：**
- 子Agent繼承父Agent的工具配置
- 可選擇性覆蓋

**常用工具類別：**
- 文件操作：`read`, `write`, `edit`, `glob`, `grep`
- 執行：`exec`, `process`
- 會話管理：`sessions_spawn`, `sessions_send`, `sessions_list`, `sessions_history`
- 記憶：`memory_search`, `memory_get`
- 訊息：`message`

### 4. 協作方式配置 (Collaboration Patterns)

**4.1 Hub-and-Spoke（星型架構）：**
- 主Agent（協調者）分配任務給子Agent
- 子Agent向協調者匯報結果
- 適合：需要審計推理鏈的複雜任務

**4.2 直接通信（Direct Communication）：**
- Agent之間直接通信
- 需要授予`sessions_send`工具
- 優點：延遲更低
- 缺點：審計複雜度增加，循環風險

**4.3 共享工作區文件：**
- 通過共享文件協調：`goal.md`, `plan.md`, `status.md`, `log.md`
- 適合：需要持久化產物的協作

**4.4 A2A Gateway插件：**
- 跨服務器通信
- 實現A2A（Agent-to-Agent）協議
- 支持Agent Card發現
- 支持認證的Agent間通信

**Subagent Spawning：**
```bash
/subagents spawn --task "研究這個主題" --agent research
```
- 子Agent在獨立session中運行
- 默認最大深度為1（不可嵌套）
- 可配置`maxSpawnDepth`啟用多層次協調

**路由綁定（Bindings）：**
```json5
{
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },
  ]
}
```

**路由優先級：**
1. peer匹配（精確DM/群組/頻道ID）
2. parentPeer匹配（線程繼承）
3. guildId + roles（Discord角色路由）
4. guildId
5. accountId匹配
6. 頻道級匹配
7. 回退到默認Agent

### 5. 不同架構之間的效率評比 (Architecture Efficiency Comparison)

**5.1 單一Agent vs 多Agent：**

| 維度 | 單一Agent | 多Agent |
|------|-----------|---------|
| 上下文管理 | 簡單 | 複雜（需跨Agent協調） |
| 專業化 | 有限 | 高（每個Agent專注特定任務） |
| 資源消耗 | 中等 | 較高（多個上下文） |
| 隔離性 | 低 | 高（獨立workspace/記憶） |
| 延遲 | 低 | 較高（通信開銷） |

**5.2 協作模式比較：**

| 模式 | 延遲 | 審計性 | 複雜度 | 適用場景 |
|------|------|--------|--------|----------|
| Hub-and-Spoke | 中 | 高 | 中 | 複雜項目、層次任務 |
| 直接通信 | 低 | 中 | 高 | 簡單工作流、實時響應 |
| 共享文件 | 中 | 高 | 中 | 持久化產物、離線協作 |
| A2A跨服務 | 高 | 高 | 高 | 分布式系統、多服務部署 |

**5.3 子Agent Spawn模式：**

| 模式 | 上下文繼承 | 隔離性 | 資源消耗 |
|------|-----------|--------|----------|
| 內聯執行 | 完全繼承 | 無 | 高 |
| 後台Spawn | 最小繼承 | 高 | 中 |
| 持久Session | 可配置 | 高 | 視配置而定 |

### 6. Token節省策略 (Token Optimization)

**6.1 Per-Agent模型配置：**
```json5
{
  agents: {
    list: [
      { id: "chat", model: "anthropic/claude-sonnet-4-5" },
      { id: "opus", model: "anthropic/claude-opus-4-6" },
    ]
  }
}
```
- 簡單任務使用廉價模型
- 複雜推理保留旗艦模型

**6.2 上下文管理：**
- `/compact` - 壓縮會話歷史
- `/reset` - 清除短期上下文，保留長期記憶
- `/new` - 全新開始
- 調整`contextTokens`限制觸發自動壓縮

**6.3 記憶優化：**
- 語義分塊（Semantic Chunking）
- 向量緩存
- 混合搜索減少無關結果

**6.4 主動記憶刷新：**
- 配置自動壓縮前的記憶刷新
- 確保重要信息持久化

**6.5 提示詞優化：**
- 精簡指令
- 關鍵詞置前
- 請求結構化輸出
- 設置`max_tokens`限制

**6.6 社區技能：**
- "OpenClaw Token Optimizer" - 智能模型路由、心跳優化、預算追蹤

### 7. 對記憶與上下文更加友善的配置 (Memory & Context Friendly Configuration)

**7.1 層次記憶系統：**
- 短期（工作記憶）：會話內的當前對話
- 長期記憶：跨會話持久化知識
- 事件記憶：特定交互和成功解決方案

**7.2 上下文隔離：**
- 調用Agent時明確限定上下文範圍
- 只傳遞必要上下文（最新用戶查詢+一個artifact）
- 避免完整歷史造成上下文膨脹

**7.3 RAG（檢索增強生成）：**
- 構建搜索系統從外部數據庫檢索相關過去對話
- 只向LLM提供最相關的信息塊

**7.4 配置示例 - 記憶友好：**
```json5
{
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
      },
      memorySearch: {
        provider: "gemini",
        query: {
          hybrid: {
            enabled: true,
            vectorWeight: 0.7,
            textWeight: 0.3,
            mmr: { enabled: true, lambda: 0.7 },
            temporalDecay: { enabled: true, halfLifeDays: 30 }
          }
        }
      }
    }
  }
}
```

**7.5 Session記憶搜索（實驗性）：**
- 可選擇索引會話記錄並通過`memory_search`呈現
- 需要明確啟用：`experimental: { sessionMemory: true }`

## 額外研究發現 - 多框架比較

### CrewAI vs LangChain vs AutoGen

**CrewAI：**
- **架構**：角色扮演、結構化方法
- **特點**：基於"Crews"和"Agents"，每個Agent有特定"roles"、"goals"、"tasks"
- **優勢**：易於使用、快速原型開發、角色清晰
- **劣勢**：強制順序執行可能導致指數級token增長

**LangChain (LangGraph)：**
- **架構**：圖形化狀態機
- **特點**：Agent作為圖形節點，邊和控制流管理交互
- **優勢**：高度可定制、複雜工作流、狀態持久化
- **劣勢**：圖形遍歷開銷

**AutoGen：**
- **架構**：對話驅動
- **特點**：將複雜工作流視為多個可對話Agent之間的對話
- **優勢**：對話模式靈活、代碼執行和工程任務、异步事件驅動
- **劣勢**：對話歷史可能膨脹

**性能比較：**
| 框架 | 延遲 | Token消耗 | 擴展性 |
|------|------|-----------|--------|
| CrewAI | 中 | 高 | 中 |
| LangChain | 低-中 | 中 | 高 |
| AutoGen | 低 | 中-高 | 高 |

## 額外研究發現 - 架構模式比較

### 1. 星型架構 (Hierarchical)
- **特點**：Agent組織成樹狀結構，類似組織架構圖
- **優勢**：可擴展性、模組化、清晰問責鏈、多層次決策能力
- **劣勢**：集中化風險、瓶頸、協調複雜度
- **適用場景**：倉庫機器人系統、企業自動化、業務流程

### 2. 點對點架構 (Peer-to-Peer)
- **特點**：去中心化網狀結構，無中央協調者
- **優勢**：韌性強、無單點故障、靈活性高
- **劣勢**：全局一致性難達成、通信開銷大、調試複雜
- **適用場景**：去中心化研究團隊、靈活協作

### 3. 順序架構 (Sequential)
- **特點**：像裝配線，每個Agent完成後傳遞給下一個
- **優勢**：可預測性、易調試、模組化
- **劣勢**：效率低、無並行、瓶頸風險
- **適用場景**：內容創建流程、數據處理系統

### 4. 平行架構 (Parallel)
- **特點**：多個Agent同時處理不同任務
- **優勢**：速度快、效率高、可擴展
- **劣勢**：協調複雜度、結果彙總挑戰
- **適用場景**：時間敏感的業務、大型數據處理、PR審查

### 混合架構
- 生產系統常結合多種模式
- 例如：層次結構用於整體協調 + 平行執行用於戰術子任務

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 使用星型架構作為默認協作模式 | 高審計性、低循環風險、適合複雜任務 |
| 記憶系統採用混合搜索 | 結合語義和關鍵詞優勢，提高準確性 |
| 啟用時間衰減 | 確保最新信息優先，減少過時知識干擾 |
| Per-Agent模型差異化 | 成本效益最大化，簡單任務用廉價模型 |

## 多AGENT整合外部框架

**OpenClaw + CrewAI/LangChain/AutoGen：**
- OpenClaw支持通過適配器與其他多AGENT框架集成
- 實現混合框架協作
- 可結合不同框架的優勢

**配置示例：**
```json5
{
  plugins: {
    slots: {
      adapter: "crewai" // 或 "langchain", "autogen"
    }
  }
}
```

## Issues Encountered
| Issue | Resolution |
|-------|------------|
|       |            |

## Resources
- OpenClaw Docs: https://docs.openclaw.ai/concepts/multi-agent
- OpenClaw Docs: https://docs.openclaw.ai/concepts/agent-workspace
- OpenClaw Docs: https://docs.openclaw.ai/concepts/memory
- OpenClaw Docs: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools
- OpenClaw Docs: https://docs.openclaw.ai/tools/subagents

## Visual/Browser Findings

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*

---

## 任務系統整合發現（2026-04-14）

### 整合框架：三省六部 + Mission Control

經過與 Mission Control（builderz-labs/mission-control）和 Edict（三省六部，cft0808/edict）的比較研究，確定了以下整合任務框架。

---

### 任務流向（已驗證）

```
┌─────────────────────────────────────────────────────────────────────┐
│ 第一階段：計劃制定（多人協作）                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  太子A（戰略）────┐                                                 │
│  太子B（技術）────┼──→ 朝堂議政（討論計劃）                           │
│  太子C（財務）────┘         ↓                                       │
│                              │                                       │
│                    門下省審核（完整性、可執行性）                        │
│                              │                                       │
│                    ✅ 通過 → 尚書省派發                               │
│                    🚫 駁回 → 太子重新討論                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 第二階段：任務執行                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  任務屬性（標註專業需求）                                             │
│  例：代碼 / 寫作 / 研究 / 法務 / 財務 / 美術                          │
│         ↓                                                          │
│  尚書省派發（根據屬性，只有具備該專業的 Agent 才能領取）               │
│         ↓                                                          │
│  六部執行（依專業分工）                                               │
│         ↓                                                          │
│  質量審查（Aegis）───→ ✅ 通過 → 交付                                │
│              └───→ 🚫 不通過 → 退回重做（最多 3 次）                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 審核機制（已驗證）

| 系統 | 審核時機 | 審核維度 | 失敗處理 | 來源 |
|------|---------|---------|---------|------|
| **門下省（Edict）** | 計劃制定後、執行前 | 完整性、可執行性 | 打回重做 | README |
| **Aegis（Mission Control）** | 任務完成後 | 由 Aegis Agent 的 SOUL 定義（可客製） | 退回（最多 3 次） | docs/orchestration.md |

**關鍵發現：** Aegis 就是一個普通 Agent，審核維度由它的 SOUL 決定，不是固定的。

---

### 任務屬性（Task Taxonomy）

| 屬性 | 說明 | 可領取的 Agent（需具備該專業） |
|------|------|-------------------------------|
| `code` | 程式開發 | code-reviewer, programmer |
| `writing` | 內容創作 | content-writer, doc-editor |
| `research` | 研究分析 | researcher, analyser |
| `legal` | 法務相關 | legal-advisor |
| `finance` | 財務相關 | financial-analyst |
| `design` | 美術設計 | designer, artist |
| `general` | 通用（無限制） | 任何 Agent |

---

### Agent 專業能力定義方式

**定義方式：** 透過 Agent.md、SOUL.md 的設定，搭配技能（skills）來定義。

**來源文件：**
- Agent 定義：`Navi Helios/60-AI-Protocols/61-管理協議/Agent/`
- Skills 定義：`Navi Helios/60-AI-Protocols/61-管理協議/Agent/skills/`

---

### 待同步更新的項目

- [ ] 任務屬性 taxonomy（代碼/寫作/研究...）
- [ ] Agent 專業能力定義（每個 Agent 的擅長領域）
- [ ] 審核維度客製化（Aegis SOUL 設計）
- [ ] Dashboard Tasks 分頁設計（Edict 視圖 + Kanban 視圖）
- [ ] 尚書省派發邏輯（屬性限定）

---

### 參考資料

| 來源 | Repo / 位置 |
|------|------------|
| Edict（三省六部）| https://github.com/cft0808/edict |
| Mission Control | https://github.com/builderz-labs/mission-control |
| Mission Control 編排 | `docs/orchestration.md` |


---

## 全域 Agent 架構分析（2026-04-15）

### 核心概念：三層級流向

```
┌─────────────────────────────────────────────────────────────────┐
│  上而下（任務派發）                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  分揀 → 規劃 → 審核 → 派發 → 執行                                 │
│    ↑        ↑        ↑        ↑        ↑                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│  下而上（任務完成）                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  執行 → 彙總 → 回奏                                               │
│    ↑        ↑        ↑                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 全域 Agent 清單與分層

#### 皇上/你
| Agent | 角色 | 功能 |
|-------|------|------|
| **你（navi）** | 皇上 | 下達旨意、最終接收回奏 |

---

#### 第一層：規劃（Plan）

| Agent | 原系統 | 專業領域 |
|-------|--------|---------|
| `taizi` | 三省六部 | 飛書消息分揀（旨意 vs 閒聊） |
| `zhongshu` | 三省六部 | 接收旨意、起草執行方案、協調審核與派發 |
| `doc-leader` | 文書組 | L2 協調者、統籌規劃、團隊管理 |

---

#### 第二層：審查（Review）

| Agent | 原系統 | 審查維度 |
|-------|--------|---------|
| `menxia` | 三省六部 | 可行性、完整性、風險、資源 |
| `xingbu` | 三省六部 | 程式碼審查、測試驗收、質量保障 |
| `doc-leader` | 文書組 | 文書品質把關 |

---

#### 第三層：執行（Execute）

| Agent | 原系統 | 專業領域 |
|-------|--------|---------|
| `shangshu` | 三省六部 | 派發任務、六部協調、彙總結果 |
| `hubu` | 三省六部 | 數據分析、統計、資源管理、報表生成 |
| `libu` | 三省六部 | 文檔、規範、用戶界面、對外溝通 |
| `libu_hr` | 三省六部 | 人事管理、團隊建設、Agent 管理、培訓 |
| `bingbu` | 三省六部 | 功能開發、架構設計、重構優化 |
| `gongbu` | 三省六部 | 基礎設施、部署運維、性能監控 |
| `doc-analyster` | 文書組 | 分析研究 |
| `doc-architecter` | 文書組 | 架構設計 |
| `doc-editor` | 文書組 | 編輯校對 |

---

### 特殊 Agent（不屬於三省六部）

| Agent | 功能 | 特殊位置 |
|-------|------|---------|
| `larvis` | 記憶系統、定時任務、數據分析 | 輔助系統 |
| `trader` | 交易相關 | 專門領域 |

---

### 任務屬性對應（三層級視角）

| 任務屬性 | 規劃 | 審查 | 執行 |
|---------|------|------|------|
| `code` | - | xingbu | bingbu |
| `writing` | doc-leader | doc-leader | libu, doc-editor |
| `research` | doc-analyster | - | doc-analyster |
| `finance` | hubu | - | hubu |
| `hr` | libu_hr | - | libu_hr |
| `qa` | - | xingbu | xingbu |
| `devops` | - | - | gongbu |
| `ui` | - | - | libu |

---

### 待確認事項

1. **三個太子**：目前只有 `taizi`，是否需要增加？
2. **研究/法務/美術**：目前沒有對應專屬 Agent
3. **`trader`** 的具體功能和所屬層級？


---

## 整合後的完整架構（2026-04-15 更新）

### L1/L2/L3 組織 + 三省六部 + 任務輪詢

```
┌─────────────────────────────────────────────────────────────────────┐
│  L1：規劃                                                          │
│  ├── 太子A（專案X）                                                  │
│  ├── 太子B（專案Y）                                                  │
│  └── 太子C（專案Z）                                                  │
│         ↓ 提交計劃                                                   │
├─────────────────────────────────────────────────────────────────────┤
│  L2：協調層（雙向把關）                                              │
│                                                                     │
│  上而下：                                                           │
│  L1 計劃 → L2 審查 → 皇上最終確認 → 發佈任務到 Queue                  │
│                                                                     │
│  下而上：                                                           │
│  L3 完成 → L2 檢查 → 皇上最終確認 → 上報回奏                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  L3：執行（輪詢取任務）                                              │
│  ├── hubu、libu、bingbu、gongbu、libu_hr                            │
│  ├── doc-analyster / architecter / editor                           │
│  └── 其他執行 Agent                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 任務流向（完整六環）

| 環節 | 角色 | 操作 |
|------|------|------|
| 1. 規劃 | L1（太子A/B/C）| 各自規劃專案 |
| 2. L2 審查 | menxia | 可行性、完整性審查 |
| 3. 皇上確認 | 你（navi）| **最終確認後才能發佈** |
| 4. 發佈任務 | 進入 Task Queue | L3 輪詢領取 |
| 5. L3 執行 | 六部、執行 Agent | 主動輪詢領任務、執行 |
| 6. L2 檢查 | xingbu | 質量審查 |
| 7. 皇上確認 | 你（navi）| **最終確認後才能上報** |
| 8. 回奏 | taizi | 彙總呈報皇上 |

---

### L2 雙向把關職責

| 方向 | L2 職責 | 對應功能 |
|------|---------|---------|
| **上而下** | 審查 L1 計劃，通過後發佈任務 | menxia（審議） |
| **下而上** | 檢查 L3 成果，通過後上報 | xingbu（質量保障） |

---

### 皇上（你）的最終確認環節

| 時機 | 確認內容 |
|------|---------|
| **計劃確認** | L2 審查通過後，皇上最終確認是否發佈任務 |
| **成果確認** | L2 檢查通過後，皇上最終確認是否上報/回奏 |

---

### 任務派發方式

| 情境 | 方式 |
|------|------|
| 皇上直接下旨 | taizi 分揀 → 三省六部流程 → 你確認 → 發佈 |
| 日常例行任務 | L2 直接發佈到 Task Queue，L3 輪詢領取 |
| 多專案並行 | 三個太子各自管理，L2 統一協調 |

---

### 吸收的機制

| 機制 | 來源 | 應用 |
|------|------|------|
| 任務流向（上而下/下而上）| 三省六部 | L1→L2→L3 / L3→L2→L1 |
| 審查機制 | 三省六部 | menxia 審查計劃、xingbu 審查成果 |
| 任務輪詢 | Mission Control | L3 Agent 主動到 Queue 領取任務 |

---

