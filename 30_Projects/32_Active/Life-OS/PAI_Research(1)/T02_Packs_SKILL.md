# T02 — Packs SKILL.md

> 組ID：T02
> 來源：Packs/*/src/SKILL.md
> 檔案總數：87
> 採樣分析：20 個
> 優先級：高

---

## 檔案結構分析

Packs 系統的 SKILL.md 是 PAI 技能的核心構建模塊，位於每個 Pack 的 `src/` 目錄下。所有探樣的 SKILL.md 都遵循統一的結構範式：

### 統一區塊結構

| 區塊 | 存在頻率 | 說明 |
|------|---------|------|
| **YAML Frontmatter** | 100% | `name`、`description`（含觸發詞）、`effort`、`context` 屬性 |
| **Customization 區塊** | 100% | 載入 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<SkillName>/` 的標準流程 |
| **Voice Notification** | ~90% | 技能執行前向 `localhost:31337` 或 `:8888` 發送語音通知的強制流程 |
| **Workflow Routing** | 100% | 觸發詞 → Workflow 檔案對照表 |
| **Core Content** | 100% | 技能核心說明、架構、工具列表 |
| **Examples** | 100% | 標準使用範例 |
| **Gotchas** | ~85% | 已知陷阱與常見錯誤 |
| **Execution Log** | ~90% | JSONL 執行日誌（寫入 `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`） |

### YAML Frontmatter 差異

| Pack 類型 | 額外屬性 |
|-----------|---------|
| 大型複雜技能（如 CreateSkill、Ideate） | `context: fork`、`effort: high` |
| 簡單路由技能（如 Security） | 僅 `name` + `description` |
| 圖像生成類（Art） | `effort: medium` |

---

## 內容差異分析

### 按功能類型分組

| 技能類型 | 特色 | 範例 |
|---------|------|------|
| **創意/內容生成** | 強調整體美學標準、工作流強制執行 | Art（Essay/D3Dashboards/Visualize 等 20+ 工作流）、BeCreative |
| **多智慧體協作** | 強調 custom agents only、嚴格邊界 | Agents（ComposeAgent + Traits）、Council、Delegation |
| **研究/分析** | 強調 URL 驗證、並行研究、深度等級 | Research、ArXiv、ExtractWisdom |
| **系統骨架** | 強調十二區段結構、ISC 穩定性、Tier Gate | ISA |
| **思維/推理框架** | 強調演化階段、噪聲控制、元學習 | Ideate（9 階段）、FirstPrinciples、RedTeam |
| **個人化生命管理** | 強調分階段採訪、隱私分類 | Telos、Interview |
| **安全/基礎設施** | 強調子技能路由、確定性過濾 | Security、Daemon |
| **代碼/專案生成** | 強調 TypeScript CLI 工具、參數化腳手架 | CreateSkill、CreateCLI |

### 大型技能（>200 行）vs 小型技能（<50 行）

| 特徵 | 大型技能 | 小型技能 |
|------|---------|---------|
| 行數 | 200-478 行 | 18-60 行 |
| 內容深度 | 含完整 Gotchas、Integration、Examples | 僅路由表 |
| 工具說明 | 詳列 CLI 命令與參數 | 無 Tools 區塊 |
| 子技能組織 | 多層子目錄（如 Security/Recon/、Security/PromptInjection/） | 單層 |
| 參考文檔 | 大量指向內部文檔（PAI/DOCUMENTATION/*） | 無 |

---

## 核心機制

### 1. 雙層觸發系統

**YAML Frontmatter `description`** 決定什麼情況下 skill 被載入：
- **正面觸發**：`USE WHEN` 列出所有觸發場景
- **負面排除**：`NOT FOR` 明確區分相似技能（如 Art NOT for video → Remotion Pack）

**SKILL.md 內部路由** 根據使用者措辭分流到具體 Workflow：
```
使用者：「research this topic」
→ 路由到 StandardResearch.md（3 agents 並行）
使用者：「quick research」
→ 路由到 QuickResearch.md（1 agent）
```

### 2. Customization 標準模式

```
行動前必執行：
if (路徑存在) ~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<Skill>/
  then load PREFERENCES.md / Configurations / Resources
  and override defaults
else
  proceed with skill defaults
```

### 3. Voice Notification 強制流程

```bash
# 幾乎所有技能執行前都發送通知
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running WORKFLOWNAME workflow in SKILLNAME skill to ACTION"}'
```

### 4. Execution Log 標準格式

每個技能執行後寫入 JSONL：
```json
{"ts":"ISO8601","skill":"SkillName","workflow":"WorkflowUsed","input":"8_WORD_SUMMARY","status":"ok|error","duration_s":SECONDS}
```

### 5. Workflow 分工模式

SKILL.md 本身只做**路由**，實際工作由 `Workflows/*.md` 執行：
- 技能複雜時（>100 行）：SKILL.md 是路由入口，細節在各 Workflow 檔
- 技能簡單時（<50 行）：SKILL.md 直接包含所有邏輯

---

## 關聯檔案

| 相關報告 | 關聯原因 |
|---------|---------|
| T03 — v5.0.0 skills SKILL.md | 同為 SKILL.md，結構相同但來自不同目錄 |
| T04 — Workflows MD | Workflows/ 是 SKILL.md 路由指向的實際工作檔 |
| T05 — Fabric Patterns | Fabric Pattern 是一種特殊的 prompt pattern skill |
| T12 — Algorithm v6.3.0 | 多個 skill（ISA、Ideate、Delegation）被 Algorithm 自動調用 |
| T26 — PAI CORE TS | Tools/*.ts 是 SKILL.md 中 Tools/ 區塊引用的執行工具 |

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計模式

**1. 意圖觸發 → 精確路由**
Packs SKILL.md 的描述文字既是人類可讀說明，也是 LLM 的 routing 指令。description 中的 `USE WHEN` / `NOT FOR` 條目形成精確的意圖分類器。

→ **建議用於 Life-OS**：每個模組的 `MODULES.md` 或首頁可加入 `USE WHEN` / `NOT WHEN` 觸發詞，幫助 LLM 理解何時該調用哪個模組。

**2. 雙層配置系統（Default + User Override）**
```
~/.claude/PAI/ (系統預設)
~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/ (用戶個人化覆寫)
```

→ **建議用於 Life-OS**：建立 `~/.life-os/USER/customizations/` 覆寫層，個人化設置不隨本體更新丟失。

**3. 執行日誌 + 品質追蹤**
JSONL 執行日誌記錄每個技能的執行時間、輸入摘要、狀態，累積後可做效能分析。

→ **建議用於 Life-OS**：每個 Habit/Project 的執行日誌，可用於「每週回顧」時的數據支撐。

**4. Tier/Gate 分級系統（ISA 案例）**
ISA 技能使用 E1-E5 五級難度門控，每級有不同的最低要求區段組合。

→ **建議用於 Life-OS**：Habit 可分為 Instant（日課）、Standard（例行）、Extended（深度工作），不同難度級別的 habit 有不同欄位要求。

**5. 確定性 + 非確定性組合（Ideate 案例）**
Ideate 用 Fisher-Yates 洗牌做結構化隨機，用 crypto API 取代 LLM temperature，既保留創意多樣性又避免 LLM 偏見。

→ **與 Life-OS 相關性較低**，這是創意工具的設計，不適用於個人生產力系統。

---

## 檔案清單

以下為本次分析採樣的 20 個 SKILL.md 完整路徑：

```
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Agents/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/AudioEditor/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Browser/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Council/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Daemon/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Delegation/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ExtractWisdom/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Fabric/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/FirstPrinciples/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ISA/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interview/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/RedTeam/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Security/src/SKILL.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Telos/src/SKILL.md
```

**未納入本次採樣但存在的 67 個 SKILL.md（隨機分布在各子目錄）：**
Packs/Thinking/*/SKILL.md、Packs/Utilities/src/*/SKILL.md、Packs/Security/src/*/SKILL.md、Packs/Media/src/*/SKILL.md、Packs/Investigation/src/*/SKILL.md 等。
