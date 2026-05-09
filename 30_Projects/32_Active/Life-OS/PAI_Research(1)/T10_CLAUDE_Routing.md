# T10 — CLAUDE.md 路由

> 組ID：T10
> 來源：Releases/v5.0.0/.claude/CLAUDE.md
> 檔案總數：3（主要分析）、額外發現多版本 CLAUDE.md
> 採樣分析：2 個
> 優先級：高

---

## 檔案結構分析

### 主 CLAUDE.md（v5.0.0）

```
# PAI 5.0.0 — Personal AI Infrastructure
@ 引用區塊（5個核心 identity 文件）
# MODES（3種模式）
  ├── NATIVE MODE（簡單任務）
  ├── ALGORITHM MODE（複雜多步任務）
  └── MINIMAL（純確認/評分）
### Operational Rules（11條運營規則）
### Operational Notes（5條注意事項）
### Context Routing（路由表）
  ├── PAI System（20+ 系統模組）
  ├── {PRINCIPAL.NAME} — Identity & Voice（8項）
  ├── {PRINCIPAL.NAME} — Life Goals (Telos)（7項）
  ├── {DA_IDENTITY.NAME}（1項）
  ├── {PRINCIPAL.NAME} — Work（4項）
  └── Project-Specific Rules（專案級別覆蓋）
```

### 技能目錄 CLAUDE.md（skills/CLAUDE.md）

極簡結構，專門用於約束 CreateSkill 技能的使用。

```
# skills/CLAUDE.md
## MANDATORY: Use the CreateSkill skill for ALL skill work
### Triggers（MUST invoke CreateSkill）
### NOT triggers（direct edits allowed）
### Enforcement
```

---

## 內容差異分析

| 項目 | 主 CLAUDE.md（v5.0.0） | skills/CLAUDE.md |
|------|------------------------|------------------|
| **用途** | 全域運營主文件 | 技能目錄約束文件 |
| **模式定義** | ✅ NATIVE/ALGORITHM/MINIMAL | ❌ 無 |
| **運營規則** | ✅ 11條（含 Forge auto-include） | ❌ 無 |
| **路由表** | ✅ 完整路由表（PAI/User/Telos/Work） | ❌ 無 |
| **CreateSkill 約束** | ❌ 無 | ✅ 強制使用宣告 |
| **長度** | 148行 | 34行 |

---

## 核心機制

### 1. 三模式系統

| 模式 | 觸發場景 | 格式特徵 |
|------|----------|----------|
| **NATIVE** | 簡單、不耗時的任務 | 匣框格式，含 TASK/CONTENT/CHANGE/VERIFY/DA回顧 |
| **ALGORITHM** | 多步複雜工作（debug/build/design/investigate等） | 強制讀取 `PAI/ALGORITHM/LATEST` → 執行對應版本演算法 |
| **MINIMAL** | 純確認、評分、感謝 | 精簡格式，4行 CreateStoryExplanation bullets |

### 2. 上下文路由機制

CLAUDE.md 的核心價值——透過路由表動態指向所需上下文，而非將所有內容內嵌。

```
啟動時自動載入（@-import）：
  - PRINCIPAL_IDENTITY.md
  - DA_IDENTITY.md
  - PROJECTS.md
  - PRINCIPAL_TELOS.md
  - ARCHITECTURE_SUMMARY.md

按需載入（路由表查詢）：
  - PAI System：Algorithm/Memory/Skill/Hook/Agent/Delegation 等 20+ 模組
  - Principal Identity：Career/Contacts/Opinions/WritingStyle 等
  - Telos：Mission/Goals/Challenges/Beliefs/Wisdom 等
  - Work：Feed/Business/Health/Finances
```

### 3. 變量替換系統

使用 `{DA_IDENTITY.NAME}`、`{PRINCIPAL.NAME}` 等變量，實現單一檔案支援多使用者。

### 4. 技能目錄約束

`skills/CLAUDE.md` 強制所有技能變更必須透過 `Skill("CreateSkill")` 執行，防止 handrolling（手動執行 CreateSkill 工作流）。

---

## 關聯檔案

| 報告 | 關聯說明 |
|------|----------|
| T11 — MEMORY System | 路由表中的 Memory System 文件 |
| T12 — ALGORITHM | 路由表中的 Algorithm System，ALGORITHM MODE 的目標系統 |
| T13 — USER Identity | 路由表中 Principal/DA Identity 的上游定義 |
| T01 — Root Docs | 整個 PAI 的 PLATFORM/SECURITY 基礎 |
| T03 — v5.0.0 Skills SKILL.md | 技能系統的 Skill.md 定義 |

---

## 與 Life-OS 的借鑒點

### 1. 路由表設計
PAI 的 CLAUDE.md 路由表是极佳的「按需載入」範例。Life-OS 可參考此模式，將經常性使用的文件（如專案概覽、當前任務清單）改為路由引用而非全部內嵌，降低每次啟動的 token 消耗。

### 2. 三模式系統
NATIVE/ALGORITHM/MINIMAL 的分層設計對應不同認知負載：
- **MINIMAL** = 系統1（快速反射）
- **NATIVE** = 系統2（輕度思考）
- **ALGORITHM** = 系統3（深度推理）

Life-OS 可據此設計任務複雜度分級響應。

### 3. 變量化 Identity
`{PRINCIPAL.NAME}` / `{DA_IDENTITY.NAME}` 的變量機制使同一系統可服務多人。Life-OS 若要支援多成員家庭或團隊，可採用類似變量架構。

### 4. 技能約束強制
`skills/CLAUDE.md` 的「禁止手動執行，必須 skill 化」設計確保系統一致性。Life-OS 的重複性工作應強制 skill 化，防止工作流程散落各處。

---

## 檔案清單

### 主要分析檔案
1. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/CLAUDE.md`
2. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/CLAUDE.md`

### 額外發現（未詳細分析）
- `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.0/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.1/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.2/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v2.3/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v2.4/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v2.5/.claude/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Art/Tools/CLAUDE.md`
- `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Prompting/Templates/Tools/CLAUDE.md`
