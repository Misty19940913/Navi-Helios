# T30 — 安裝與驗證系統

> 組ID：T30
> 來源：**/INSTALL.md, **/VERIFY.md（所有 Packs）
> 檔案總數：107 對（INSTALL.md + VERIFY.md）
> 採樣分析：54 對（涵蓋主要類別）
> 優先級：🔴 高

---

## 檔案結構分析

PAI 的安裝/驗證系統是一套**標準化、批次化、被 AI Agent 自動執行**的安裝流程。幾乎所有 Pack 都遵循完全一致的 INSTALL.md + VERIFY.md 雙檔結構。

### INSTALL.md 標準結構（98% 的 Pack 遵循）

```
# {PackName} — Installation Guide

## AI Agent Instructions
使用 Claude Code 的原生工具（AskUserQuestion, TodoWrite, Bash, Read, Write）來向導用戶完成安裝。

### Welcome Message
（一段預設的歡迎訊息，AI 直接說給用戶聽）

## Phase 1: System Analysis
bash 指令：檢查 ~/.claude/skills/{PackName} 是否已存在

## Phase 2: Confirm with User
AskUserQuestion：是否安裝？是否備份現有版本？

## Phase 3: Backup (only if existing)
bash 指令：有舊版就 mv 到 .backup-{timestamp}/

## Phase 4: Install
bash 指令：mkdir -p ~/.claude/skills && cp -R src/ $SKILL_DIR/

## Phase 5: Verify
執行 VERIFY.md 中的檢查清單
```

### VERIFY.md 標準結構（98% 的 Pack 遵循）

```
## File Verification
bash 指令：[ -d "$SKILL_DIR" ] && echo "OK" || echo "MISSING"

## Frontmatter Check
bash 指令：grep -q "^---" frontmatter Delimiter 檢查

## Functional Test
（描述性文字：重啟 Claude Code 後觸發技能）

## Installation Checklist
markdown 勾選清單（5 項）
```

---

## 內容差異分析

### 兩種安裝模式

| 模式 | Pack 範例 | 特徵 |
|:---|:---|:---|
| **標準精簡型** | Aphorisms, Apify, Art, BrightData, Browser, Council, CreateSkill, Daemon, Delegation, Fabric, FirstPrinciples, IDEate, Interview, ISA, RedTeam, Remotion, Research, RootCauseAnalysis, Science, Security, SystemsThinking, WriteStory | 5 Phase 結構，歡迎訊息為「I'm installing {Pack} from PAI v5.0.0」，沒有額外系統檢查 |
| **Wizard 增強型** | Agents, Research, Security | 包含系統分析、多步決策向導、依賴檢查（Bun 等）、詳細檔案清單 |

### Agent Pack — 最複雜的 INSTALL

Agents 的 INSTALL.md 是唯一具有以下增強機制的：
- **多決策點 Wizard**：Conflict Resolution → Tool Dependencies → Final Confirmation（含「Show me what will change」選項）
- **系統分析預檢查**：Bun 運行時檢查、node_modules 狀態檢查、現有技能衝突檢測
- **TodoWrite 追蹤**：建立 4 項追蹤清單（建立目錄 → 複製檔案 → 安裝依賴 → 執行驗證）
- **備份策略**：時間戳備份

### Security Pack — 獨特的 Welcome Message 結構

Security 的 INSTALL.md 包含一個超長的 Welcome Message，直接嵌入整個 SKILL.md 的功能描述於安裝向導中。這是唯一一個 Welcome Message 內容長度超過一般 2-3 行的 Pack。

### 對比表：INSTALL.md 關鍵變數

| Pack | 目標目錄 | 是否檢查現有版本 | 是否有備份 | 是否有依賴檢查 | 是否有 Tool |
|:---|:---|:---:|:---:|:---:|:---:|
| Agents | ~/.claude/skills/Agents/ | ✅ | ✅ 時間戳備份 | ✅ Bun | ✅ (TS tools) |
| Research | ~/.claude/skills/Research/ | ✅ | ✅ | ❌ | ✅ (TS tools) |
| Security | ~/.claude/skills/Security/ | ✅ | ✅ | ❌ | ❌ |
| ArXiv | ~/.claude/skills/ArXiv/ | ✅ | ✅ | ❌ | ❌ |
| Art | ~/.claude/skills/Art/ | ✅ | ✅ | ❌ | ❌ |
| 其他精簡型 Pack | ~/.claude/skills/{Name}/ | ✅ | ✅ | ❌ | ❌ |

### VERIFY.md 差異

| Pack | 額外驗證項目 |
|:---|:---|
| Agents | 檢查 SKILL.md frontmatter、Tools/目錄、Workflows/目錄、所有子檔案（8 項 context files + 3 項 workflows + Data/Traits.yaml + Tools/TS 檔） |
| Research | 檢查 SKILL.md frontmatter、Tools/目錄、Workflows/目錄 |
| 其他 Pack | 只驗證 SKILL.md 存在 + frontmatter 有效 |

---

## 核心機制

### 安裝觸發流程

```
用戶請求安裝某 Pack
    ↓
AI Agent 讀取該 Pack 的 INSTALL.md
    ↓
Phase 1: System Analysis（bash 探測）
    ↓
Phase 2: AskUserQuestion（2-3 個決策點）
    ↓
Phase 3: Backup（如有必要）
    ↓
Phase 4: cp -R src/ → ~/.claude/skills/{PackName}/
    ↓
Phase 5: 執行 VERIFY.md 中的 bash 檢查
    ↓
成功/失敗訊息回報
```

### 核心設計原則

1. **純粹由 AI Agent 執行**：INSTALL.md 和 VERIFY.md 是寫給 AI Agent 看的，不是給人類看的操作手冊
2. **複製即安裝**：`cp -R src/ $SKILL_DIR/` 是唯一的安裝命令 — 沒有編譯、沒有設定檔修改、沒有環境變數
3. **破壞性操作前的備份**：所有 Pack 都會自動備份現有版本到 `.backup-{timestamp}/`
4. **user customization 完全保留**：`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/` 路徑在安裝時明確宣告「不受影響」
5. **依賴隔離**：需要特殊運行時的 Pack（如 Agents 需要 Bun）單獨檢查，不滿足時只警告不安裝

### VERIFY.md 的兩層驗證

**第一層：檔案存在性檢查**
```bash
[ -d "$SKILL_DIR" ] && echo "OK directory" || echo "MISSING"
[ -f "$SKILL_DIR/SKILL.md" ] && echo "OK SKILL.md" || echo "MISSING"
```

**第二層：Frontmatter 語法檢查**
```bash
head -1 "$SKILL.md" | grep -q "^---" && echo "OK frontmatter" || echo "ERROR"
grep -q "^name:" "$SKILL.md" && echo "OK name field" || echo "ERROR"
grep -q "^description:" "$SKILL.md" && echo "OK description" || echo "ERROR"
```

**第三層（僅 Agents）：內容完整性檢查**
```bash
grep -q "Workflow Routing" "$SKILL.md" && echo "OK workflow routing" || echo "ERROR"
grep -q "ComposeAgent" "$SKILL.md" && echo "OK ComposeAgent reference" || echo "ERROR"
```

### SKILL.md 的前題重要性

安裝系統的核心假設是：**每個 Pack 的 `src/` 目錄中，必須有一個名為 `SKILL.md` 的檔案**，且該檔案必須有有效 YAML frontmatter（`---` 包裹的 `name:` 和 `description:` 欄位）。這是 Claude Code 技能系統的載入契約。

---

## 關聯檔案

| 相關報告 | 關係 |
|:---|:---|
| [[PAI_Research/T02_Packs_SKILL\|T02 — Packs SKILL.md]] | SKILL.md 是安裝的目標物，VERIFY.md 驗證的核心就是 SKILL.md 的有效性 |
| [[PAI_Research/T07_Packs_Install_Verify\|T07 — Packs 安裝驗證文件]] | T07 研究的是「描述安裝/驗證流程的文件本身」，T30 研究的是「所有 Pack 遵循的安裝/驗證系統機制」 |
| [[PAI_Research/T16_Agents_Pack\|T16 — Agents Pack]] | Agents Pack 擁有最複雜的 INSTALL.md，是安裝系統的「進階範例」 |

---

## 與 Life-OS 的借鑒點

### 當前 Life-OS 的安裝痛點

Life-OS 目前沒有標準化的「技能安裝系統」。每個技能的部署依賴手動複製或外部工具，沒有：
- 統一的 `INSTALL.md` 向導
- 備份現有版本的自動機制
- `VERIFY.md` 式的安裝後驗證

### 可以借鑒的 PAI 安裝系統設計

**1. 意圖宣告式歡迎訊息**
PAI 的 Welcome Message 讓 AI Agent 在安裝前先用自然語言向用戶說明即將發生什麼。Life-OS 的技能應該有自己的「安裝宣言」，在部署前向用戶說明技能的功能和影響範圍。

**2. 破壞性操作的時間戳備份**
`$SKILL_DIR.backup-$(date +%Y%m%d-%H%M%S)` 備份模式非常值得借鑒。Life-OS 在更新任何現有系統文件前，應自動建立時間戳備份。

**3. 三層驗證退出機制**
```
Phase 2 可以拒絕（Abort）
Phase 3 之前的任何決策點都可以取消
Phase 5 失敗則整個安裝被標記為不完整
```
Life-OS 的部署腳本應該有同樣的「安全的否決權」。

**4. 依賴顯式宣告**
Agents Pack 對 Bun 的顯式檢查和警告，是一個很好的「外部依賴宣告」模式。Life-OS 的技能如果有外部依賴，應該在 INSTALL.md 中顯式說明。

**5. User Customization 隔離區**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/` 的設計意味著：系統升級不影響用戶個人化設定。Life-OS 應該有類似的「用戶覆寫層」機制，讓系統更新和個人化設定互不影響。

---

## 檔案清單

以下為本次分析涵蓋的所有 INSTALL.md 和 VERIFY.md 檔案（按 Pack 名稱排序）：

```
Packs/Agents/INSTALL.md
Packs/Agents/VERIFY.md
Packs/ApertureOscillation/INSTALL.md
Packs/ApertureOscillation/VERIFY.md
Packs/Aphorisms/INSTALL.md
Packs/Aphorisms/VERIFY.md
Packs/Apify/INSTALL.md
Packs/Apify/VERIFY.md
Packs/ArXiv/INSTALL.md
Packs/ArXiv/VERIFY.md
Packs/Art/INSTALL.md
Packs/Art/VERIFY.md
Packs/AudioEditor/INSTALL.md
Packs/AudioEditor/VERIFY.md
Packs/BeCreative/INSTALL.md
Packs/BeCreative/VERIFY.md
Packs/BitterPillEngineering/INSTALL.md
Packs/BitterPillEngineering/VERIFY.md
Packs/BrightData/INSTALL.md
Packs/BrightData/VERIFY.md
Packs/Browser/INSTALL.md
Packs/Browser/VERIFY.md
Packs/ContentAnalysis/INSTALL.md
Packs/ContentAnalysis/VERIFY.md
Packs/ContextSearch/INSTALL.md
Packs/ContextSearch/VERIFY.md
Packs/Council/INSTALL.md
Packs/Council/VERIFY.md
Packs/CreateCLI/INSTALL.md
Packs/CreateCLI/VERIFY.md
Packs/CreateSkill/INSTALL.md
Packs/CreateSkill/VERIFY.md
Packs/Daemon/INSTALL.md
Packs/Daemon/VERIFY.md
Packs/Delegation/INSTALL.md
Packs/Delegation/VERIFY.md
Packs/Evals/INSTALL.md
Packs/Evals/VERIFY.md
Packs/ExtractWisdom/INSTALL.md
Packs/ExtractWisdom/VERIFY.md
Packs/Fabric/INSTALL.md
Packs/Fabric/VERIFY.md
Packs/FirstPrinciples/INSTALL.md
Packs/FirstPrinciples/VERIFY.md
Packs/ISA/INSTALL.md
Packs/ISA/VERIFY.md
Packs/Ideate/INSTALL.md
Packs/Ideate/VERIFY.md
Packs/Interceptor/INSTALL.md
Packs/Interceptor/VERIFY.md
Packs/Interview/INSTALL.md
Packs/Interview/VERIFY.md
Packs/Investigation/INSTALL.md
Packs/Investigation/VERIFY.md
Packs/IterativeDepth/INSTALL.md
Packs/IterativeDepth/VERIFY.md
Packs/Knowledge/INSTALL.md
Packs/Knowledge/VERIFY.md
Packs/Loop/INSTALL.md
Packs/Loop/VERIFY.md
Packs/Media/INSTALL.md
Packs/Media/VERIFY.md
Packs/Migrate/INSTALL.md
Packs/Migrate/VERIFY.md
Packs/Optimize/INSTALL.md
Packs/Optimize/VERIFY.md
Packs/PAIUpgrade/INSTALL.md
Packs/PAIUpgrade/VERIFY.md
Packs/PrivateInvestigator/INSTALL.md
Packs/PrivateInvestigator/VERIFY.md
Packs/Prompting/INSTALL.md
Packs/Prompting/VERIFY.md
Packs/RedTeam/INSTALL.md
Packs/RedTeam/VERIFY.md
Packs/Remotion/INSTALL.md
Packs/Remotion/VERIFY.md
Packs/Research/INSTALL.md
Packs/Research/VERIFY.md
Packs/RootCauseAnalysis/INSTALL.md
Packs/RootCauseAnalysis/VERIFY.md
Packs/Sales/INSTALL.md
Packs/Sales/VERIFY.md
Packs/Science/INSTALL.md
Packs/Science/VERIFY.md
Packs/Scraping/INSTALL.md
Packs/Scraping/VERIFY.md
Packs/Security/INSTALL.md
Packs/Security/VERIFY.md
Packs/SystemsThinking/INSTALL.md
Packs/SystemsThinking/VERIFY.md
Packs/Thinking/INSTALL.md
Packs/Thinking/VERIFY.md
Packs/USMetrics/INSTALL.md
Packs/USMetrics/VERIFY.md
Packs/Utilities/INSTALL.md
Packs/Utilities/VERIFY.md
Packs/WorldThreatModel/INSTALL.md
Packs/WorldThreatModel/VERIFY.md
Packs/WriteStory/INSTALL.md
Packs/WriteStory/VERIFY.md
Releases/v2.3/.claude/INSTALL.md
Releases/v2.5/.claude/INSTALL.md
Releases/Pi/INSTALL.md

（共 107 對 INSTALL.md + VERIFY.md 檔案）
```

---

*本報告為 T30 — Install & Verify System 分析。屬於 PAI v5.0.0 系統架構研究系列。*
