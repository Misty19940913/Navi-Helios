# T16 — Agents Pack

> 組ID：T16
> 來源：Packs/Agents/**
> 檔案總數：28
> 採樣分析：15 個
> 優先級：8

---

## 檔案結構分析

Agents Pack 採用標準 PAI Pack 結構，但具有極為清晰的關注點分離：

```
Packs/Agents/
├── README.md              # Pack 概述（面向用戶）
├── INSTALL.md             # AI 安裝向導
├── VERIFY.md              # 安裝驗證腳本
├── SKILL.md               # 技能路由定義（面向 AI）
├── src/
│   ├── SKILL.md           # 技能實作（含 composition engine 文件）
│   ├── AgentProfileSystem.md    # Agent Profile 架構 v2（markdown reading list 模式）
│   ├── AgentPersonalities.md    # Named Agent 角色定義（10 個角色完整 backstory）
│   ├── REDESIGN-SUMMARY.md     # v1.0→v2.0 重新設計總結
│   ├── Data/
│   │   └── Traits.yaml         # 組合 Trait 庫 + 完整 ElevenLabs 聲音映射
│   ├── Tools/
│   │   ├── ComposeAgent.ts      # 核心組合引擎
│   │   ├── LoadAgentContext.ts # 情境載入器
│   │   ├── SpawnAgentWithProfile.ts # 帶 profile 啟動 agent
│   │   ├── package.json
│   │   └── bun.lock
│   ├── Templates/
│   │   ├── DynamicAgent.hbs    # Handlebars 動態 prompt 模板
│   │   └── CUSTOMAGENTTEMPLATE.md
│   ├── Workflows/
│   │   ├── CreateCustomAgent.md    # 自定義 agent 創建 workflow
│   │   ├── ListTraits.md             # Trait 列表 workflow
│   │   └── SpawnParallelAgents.md    # 平行啟動 workflow
│   ├── ArchitectContext.md
│   ├── ArtistContext.md
│   ├── ClaudeResearcherContext.md
│   ├── CodexResearcherContext.md
│   ├── DesignerContext.md
│   ├── EngineerContext.md
│   ├── GeminiResearcherContext.md
│   ├── GrokResearcherContext.md
│   ├── PerplexityResearcherContext.md
│   ├── QATesterContext.md
│   └── Scratchpad/
│       └── sparkline-color-analysis.md
```

---

## 核心機制

### 1. 混合 Agent 模型（Hybrid Agent Model）

Agents Pack 定義了兩種互補的 agent 類型：

| 類型 | 用途 | 持久性 | 聲音 |
|------|------|--------|------|
| **Named Agents** |  recurring 任務、語音輸出、角色深度互動 | 跨 session 持久 | 預先映射到 ElevenLabs voices |
| **Custom Agents（Dynamic）** | 一次性特殊任務、平行工作 | 臨時，基於 trait 組合 | 每個 agent 獨特 voice |

**Named Agents** 定義於 `AgentPersonalities.md`，包含完整的 backstory、voice settings、character traits。目前定義了 10 個角色：
- **Jamie** — "The Expressive Eager Buddy"（教學助理出身，golden retriever energy）
- **Rook Blackburn** — "The Reformed Grey Hat"（資安滲透測試者，低穩定性高表達）
- **Priya Desai** — "The Aesthetic Anarchist"（藝術家，創意發散型）
- **Aditi Sharma** — "The Design School Perfectionist"（設計批評家，精確嚴格）
- **Ava Chen** — "The Investigative Analyst"（調查記者，權威確信）
- **Ava Sterling** — "The Strategic Sophisticate"（策略分析，三步預判）
- **Alex Rivera** — "The Multi-Perspective Analyst"（多元視角，壓力測試結論）
- **Zoe Martinez** — "The Calm in Crisis"（危機工程師，冷靜沉著）
- **Marcus Webb** — "The Battle-Scarred Leader"（資深領導，經驗沉澱）
- **Serena Blackwood** — "The Academic Visionary"（學術願景，長期架構思維）

每個角色有精確定義的 prosody 參數（stability, similarity_boost, style, speed）和 Voice ID。

### 2. Trait-Based 組合系統

**Custom Agents** 的核心創新：從三維度 trait 庫動態組合 agent。

```
Expertise（專業領域）
  security, technical, research, creative, business, data, communications, legal, finance, medical

Personality（人格維度）
  skeptical, analytical, enthusiastic, cautious, bold, creative, empathetic, contrarian, pragmatic, meticulous

Approach（工作風格）
  thorough, rapid, systematic, exploratory, comparative, synthesizing, adversarial, consultative
```

**Trait → Voice 自動映射**：`Traits.yaml` 定義了完整的 ElevenLabs Premade Voice 註冊表（39 個 voices），並提供：
- **精確組合匹配**（最高優先）：`["skeptical", "analytical"]` → `{PRINCIPAL.NAME}`
- **人格回退**（中優先）：`skeptical` → `George`
- **專業回退**（低優先）：`security` → `Callum`
- **預設**：用戶自己的 voice

### 3. 組合引擎（ComposeAgent.ts）

核心 TypeScript 工具，負責：
1. 解析 `--traits` 和 `--task` 參數
2. 從 `Traits.yaml` 載入對應的 expertise、personality、approach fragments
3. 選擇最匹配的 voice（根據映射規則）
4. 使用 `DynamicAgent.hbs` Handlebars 模板生成完整 agent prompt
5. 輸出 JSON：`name`, `voice`, `voice_id`, `color`, `prompt`

```bash
# 基本用法
bun run ComposeAgent.ts --traits "security,skeptical,thorough" --task "Security review"

# 持久化
bun run ComposeAgent.ts --task "Security review" --save

# 列出已保存
bun run ComposeAgent.ts --list-saved
```

### 4. 三 workflow 路由

| Workflow | Trigger | 用途 | 是否使用 ComposeAgent |
|----------|---------|------|----------------------|
| **CreateCustomAgent** | 說 "custom agents" | 獨特人格/voice/color 的臨時 agent | ✅ 每次都執行 |
| **SpawnParallelAgents** | 說 "spin up agents"（無 "custom"）| 平行 grunt work，相同 identity | ❌ 不用 |
| **ListTraits** | 說 "what traits available" | 展示可用 trait 組合 | ❌ 不用 |

### 5. Agent Profile System v2（重大重構）

**v1.0 的問題**：YAML 檔案 + memory blocks + 複雜解析器，造成重複內容。

**v2.0 的解決方案**：每個 agent type 一個 markdown 檔案作為「閱讀清單」而非「知識庫」。

```
# ArchitectContext.md
**Role**: Software architecture specialist
**Model**: opus

## Required Knowledge (Pre-load from Skills)
- **PAI/CONSTITUTION.md** - Foundational principles
- **PAI/CoreStack.md** - Stack preferences

## Task-Specific Knowledge
- **api** → skills/Development/References/APIDesign.md
- **security** → PAI/SecurityProtocols.md
```

**關鍵設計原則**：
- ❌ 不複製 PAI 已加載的內容（constitutional principles, stack preferences）
- ✅ 僅引用 Skills 系統（作為 curated reading list）
- ✅ 補充而非替代 PAI 提供的基礎 context
- ✅ 簡單的 markdown 格式，維護成本低

### 6. Voice Prosody 系統

每個 voice 有 5 個 prosody 參數控制 ElevenLabs 語音合成：

| 參數 | 範圍 | 效果 |
|------|------|------|
| `stability` | 0.0-1.0 | 低 = 表達多變，高 = 一致沉悶 |
| `similarity_boost` | 0.0-1.0 | 聲音身份保留度 |
| `style` | 0.0-1.0 | 風格誇張程度 |
| `speed` | 0.7-1.2 | 說話速率 |
| `use_speaker_boost` | boolean | 增強清晰度（增加延遲） |

人格 → prosody 指南：
- **Skeptical**: stability 0.60, style 0.10, speed 0.95（謹慎精確）
- **Enthusiastic**: stability 0.35, style 0.40, speed 1.10（高能量）
- **Analytical**: stability 0.65, style 0.08, speed 0.95（清晰結構化）
- **Bold**: stability 0.45, style 0.35, speed 1.05（自信動態）
- **Cautious**: stability 0.70, style 0.05, speed 0.90（仔細刻意）

### 7. 與 Delegation Skill 的邊界

Agents Pack 專注於**一次性臨時 agent**（fire-and-forget，無共享狀態）。Agent teams/swarms 由 Delegation Skill → `TeamCreate` 處理，這是嚴格的 scope boundary：

| 需求 | 系統 |
|------|------|
| "custom agents", "spin up agents" | **Agents** → ComposeAgent → `Task(subagent_type="general-purpose")` |
| "create an agent team", "agent team", "swarm" | **Delegation** → TeamCreate |

---

## 內容差異分析

### Named Agents vs Custom Agents

| 維度 | Named Agents | Custom Agents (Dynamic) |
|------|--------------|--------------------------|
| **創建方式** | 定義於 `AgentPersonalities.md` | 從 `Traits.yaml` 即時組合 |
| **語音** | 預先定義完整 backstory + prosody | 由 trait 映射到 voice registry |
| **顏色** | 未指定 | 由 ComposeAgent 自動分配 |
| **持久性** | 持久，跨 session | 臨時，單次使用 |
| **最佳場景** | recurring 任務、voice 輸出 | 一次性特殊任務、平行視角 |

### Agent Context Files 差異

8 個 `*Context.md` 檔案的共同結構：
- **Role** 和 **Model**（頂部 frontmatter）
- **Required Knowledge** 段落（Skills 引用）
- **Task-Specific Knowledge**（關鍵字 → 檔案映射）
- **Output Format**（該 agent 類型的輸出模板）

差異在於**職責和引用 Skills 的不同**：
- Architect → 架構設計相關 skills
- Engineer → TDD、開發相關 skills
- Designer → UX/UI 相關 skills
- Artist → 視覺創意相關 skills
- QATester → 驗證、Gate 4 質量把關

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計

1. **Trait-Based 組合系統**：Expertise + Personality + Approach 三維度组合的思想可以應用於 Life-OS 的「角色/身份」系統。例如：輸入層的身分標籤（工程師/設計師/研究者）結合風格標籤（謹慎/大膽/系統化）。

2. **Voice Prosody 控制**：ElevenLabs 風格參數系統（stability/style/speed）是一種優雅的「表達參數化」設計。對於 Life-OS，可以探索如何參數化「溝通風格」。

3. **Scope Boundary 強制**：Agents Pack 明確說明「NOT for agent teams/swarms」，Delegation Skill 有明確邊界。這種邊界意識對 Life-OS 的「系統 vs 工具」區分有參考價值。

4. **v2 簡化重構原則**：從複雜 YAML 系統遷移到「閱讀清單」模式，減少重複、增強可維護性。Life-OS 的文件系統若有類似問題可參考。

5. **混合模型設計**：Named（持久關係）vs Dynamic（臨時任務）的光譜，在 Life-OS 可以對應「核心身份」（如 DA Identity）vs「一次性角色」（如 研究者、規劃師）。

### 不適用的設計

1. **ElevenLabs 語音系統**：Life-OS 目前無語音輸出需求。
2. **臨時 agent 並行**：「fire-and-forget」模式不適合 Life-OS 的謹慎決策文化。
3. **外部 model 集成**（Claude/Codex/Gemini/Grok/Perplexity researchers）：生命週期管理過於複雜。

---

## 關聯檔案

- **T01** — Root 文件（SKILL.md 格式源頭）
- **T03** — .claude/skills SKILL.md（技能路由機制）
- **T11** — Memory System（agent 持久化機制對比）
- **T15** — DA Identity（Named Agent 角色定義對比）
- **T17** — Council Pack（多 agent 協調機制對比）
- **T22** — Interview Pack 完整（平行 researcher deployment 模式）

---

## 檔案清單

1. `Packs/Agents/README.md`
2. `Packs/Agents/INSTALL.md`
3. `Packs/Agents/VERIFY.md`
4. `Packs/Agents/src/SKILL.md`
5. `Packs/Agents/src/AgentProfileSystem.md`
6. `Packs/Agents/src/AgentPersonalities.md`
7. `Packs/Agents/src/REDESIGN-SUMMARY.md`
8. `Packs/Agents/src/Data/Traits.yaml`
9. `Packs/Agents/src/Tools/ComposeAgent.ts`
10. `Packs/Agents/src/Tools/LoadAgentContext.ts`
11. `Packs/Agents/src/Tools/SpawnAgentWithProfile.ts`
12. `Packs/Agents/src/Tools/package.json`
13. `Packs/Agents/src/Templates/DynamicAgent.hbs`
14. `Packs/Agents/src/Templates/CUSTOMAGENTTEMPLATE.md`
15. `Packs/Agents/src/Workflows/CreateCustomAgent.md`
16. `Packs/Agents/src/Workflows/ListTraits.md`
17. `Packs/Agents/src/Workflows/SpawnParallelAgents.md`
18. `Packs/Agents/src/ArchitectContext.md`
19. `Packs/Agents/src/ArtistContext.md`
20. `Packs/Agents/src/ClaudeResearcherContext.md`
21. `Packs/Agents/src/CodexResearcherContext.md`
22. `Packs/Agents/src/DesignerContext.md`
23. `Packs/Agents/src/EngineerContext.md`
24. `Packs/Agents/src/GeminiResearcherContext.md`
25. `Packs/Agents/src/GrokResearcherContext.md`
26. `Packs/Agents/src/PerplexityResearcherContext.md`
27. `Packs/Agents/src/QATesterContext.md`
28. `Packs/Agents/src/Scratchpad/sparkline-color-analysis.md`
