# T19 — CreateSkill Pack

> 組ID：T19
> 來源：Packs/CreateSkill/**/*, Releases/v5.0.0/.claude/skills/CreateSkill/**/*
> 檔案總數：11
> 採樣分析：11 個
> 優先級：高

---

## 檔案結構分析

CreateSkill Pack 為標準雙軌技能開發生命週期框架，分為 `src/`（技能本體）與 `Packs/` 包裝層。兩軌各有完整功能，結構高度一致。

### Pack 包裝層結構

```
Packs/CreateSkill/
├── INSTALL.md      # AI輔助安裝引導
├── VERIFY.md       # 安裝驗證
└── README.md       # 入口概覽
```

### src/ 技能層結構

```
Packs/CreateSkill/src/
├── SKILL.md                          # 主技能路由（478行）
└── Workflows/
    ├── CreateSkill.md                # 建立新技能
    ├── CanonicalizeSkill.md          # 重構 legacy 技能
    ├── ValidateSkill.md              # 驗證技能結構
    ├── TestSkill.md                  # 效能測試
    ├── OptimizeDescription.md        # 觸發描述優化
    ├── UpdateSkill.md                # 修改現有技能
    └── ImproveSkill.md               # 根據回饋改進
```

### v5.0.0 Release 版結構差異

Release 版 SKILL.md 內容幾乎相同，但 Workflow 檔案數量一致（7個），代表 CreateSkill 在 v5.0.0 已完全成型，Pack 版未增加新 workflow。

---

## 內容差異分析

### Pack README vs Release 版差異

| 面向 | Pack README | Release SKILL.md |
|------|-------------|-----------------|
| 定位 | 安裝導引 + 技能概覽 | 完整技能文件 + 觸發邏輯 |
| 作者資訊 | 有（danielmiessler） | 無 |
| 版本 | v1.0.0 | 無版本欄位 |
| 包裝層 | 有額外包裝（INSTALL/VERIFY） | 無 |

### 主技能檔 SKILL.md 核心內容

主技能定位為 **「結構軌 + 效能軌」雙軌技能開發生命週期**：

| 軌別 | Workflows | 核心方法論 |
|------|-----------|------------|
| **結構軌** | CreateSkill, ValidateSkill, CanonicalizeSkill, UpdateSkill | 確保技能符合 PAI 慣例（TitleCase、扁平資料夾、YAML frontmatter） |
| **效能軌** | TestSkill, ImproveSkill, OptimizeDescription | Anthropic 技能開發方法：平行對比測試 + 根因診斷 + 觸發準確度優化 |

---

## 核心機制

### 1. TitleCase 命名強制（約定核心）

所有命名必須用 PascalCase（TitleCase），這是 CreateSkill 最根本的約束：

```
✅ CORRECT:  CreateSkill, Create.md, ManageServer.ts
❌ WRONG:    createskill, create-skill, create_skill, MANAGE_SERVER.ts
```

**為何重要**：技能系統以大小寫作為公開/私有邊界 — `TitleCase` = 公開發布，`_ALLCAPS` = 私人技能。

### 2. 扁平資料夾結構（最多 2 層）

```
✅ MAX:    skills/SkillName/Workflows/CreateSkill.md
❌ FORBIDDEN: skills/SkillName/Workflows/Category/File.md（3層）
```

Context files 應置於技能根目錄，嚴禁 `Context/` 或 `Docs/` 子目錄。

### 3. YAML Frontmatter 單行描述 + USE WHEN 條款

```yaml
---
name: CreateSkill
description: What it does. USE WHEN trigger1 OR trigger2. NOT FOR confusable alternative.
---
```

**禁止**：多行 description、`triggers:` 陣列、`workflows:` 陣列（統統是舊格式）。

### 4. Voice Notification 強制（所有 Workflow）

每個 workflow 執行前必須同時：
1. 發送 curl POST 到 `localhost:31337/notify`
2. 輸出文字通知 `Running **WorkflowName** in **SkillName**...`

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WORKFLOWNAME workflow in the CreateSkill skill to ACTION"}' \
  > /dev/null 2>&
```

### 5. 技能類型分類（9 類型系統）

CreateSkill 內建 Anthropic 的 9 類型技能分類，用於指導結構決策：

| # | 類型 | 關鍵結構 |
|---|------|----------|
| 1 | Library/API Reference | Gotchas-heavy, 輕量參考 |
| 2 | Product Validation | 瀏覽器/tmux, 狀態斷言 |
| 3 | Data Fetching | 憑證, 查詢模式 |
| 4 | Business Process | 執行日誌, 一致性追蹤 |
| 5 | Code Scaffolding | 模板, 專案感知腳本 |
| 6 | Code Quality | 确定性腳本, hook 整合 |
| 7 | CI/CD & Deployment | 安全閘, smoke tests, rollback |
| 8 | Operations Runbook | 現象 → 診斷 → 報告 |
| 9 | Infrastructure Ops | 安全護欄, 審計日誌 |

### 6. 公開/私人技能邊界

CreateSkill 制定了精確的決策測試：

> **「這個技能能否直接放進陌生人的 `~/.claude/skills/` 就能運作？」**

- **Yes** → 公開技能（TitleCase）
- **No**（涉及身份、客戶、商業、隱私基礎設施）→ 私人技能（`_ALLCAPS`）

**預發布 Grep 檢查**（僅限公開技能）：
```bash
rg -i "<your-name>|<your-org>|<your-domain>|/Users/[a-z]+/" ~/.claude/skills/<SkillName>/
```
零匹配 = 準備發布。

### 7. BPE（Bitter-Pill Engineering）檢查

最終化技能前問：「更聰明的模型會讓這個技能變得不必要嗎？」

- **保留**：驗證工具、API quirks、累積的 gotchas
- **質疑**：CoT  orchestrators、格式解析器、retry 串聯

### 8. 漸進式揭露（Progressive Disclosure）

三層載入：
1. **YAML frontmatter**：系統提示詞始終載入，僅觸發資訊
2. **SKILL.md body**：技能喚醒時載入，路由 + 關鍵指引
3. **Reference files**：根目錄 `.md` 或 `References/` 按需載入

### 9. 效能軌 Workflows 核心邏輯

**TestSkill**：以-skill 代理 vs 無-skill 基準代理**平行**執行，比較輸出品質差異。

**ImproveSkill**：根因診斷（4 類回饋 × 3 種修復類型），重點是「不要用 MUST」，要用 reasoning 取代 rigid 約束。

**OptimizeDescription**：生成 20 個 should/shouldn't-trigger 評估查詢，系統性改善觸發準確度。

### 10. Public Release Readiness 強制

CreateSkill 是第一個內建「公共發布準備度」的技能——不是事後清理，而是從一開始就用通用語言撰寫，個人化內容放在 `SKILLCUSTOMIZATIONS/`。

---

## 關聯檔案

- **T02 Packs SKILL.md** — 同一視角看所有 Pack 的 SKILL.md 結構慣例
- **T03 v5.0.0 Claude Skills SKILL.md** — Release 版的技能檔案格式對照
- **T01 Root Docs** — README/PLATFORM/SECURITY 中對 CreateSkill 的依賴關係
- **PAI/DOCUMENTATION/Skills/SkillSystem.md** — CreateSkill 仰賴的權威參考（被多次引用但本身不在本次掃描範圍）

---

## 與 Life-OS 的借鑒點

### 1. 雙軌設計（最值得借鑒）

CreateSkill 的「結構軌 + 效能軌」模式可直接移植到 Life-OS 的技能開發：
- **結構軌**（類似 CanonicalizeSkill）→ 確保 Life-OS 文件符合約定格式
- **效能軌**（類似 TestSkill）→ 驗證文件系統變更確實帶來改善

### 2. Public/Private 邊界命名

CreateSkill 的 `TitleCase` = 公開 / `_ALLCAPS` = 私人命名邊界，**可直接用於 Life-OS 的研究文件分類**：
- 確認的框架 → `TitleCase`（公開可用）
- 個人化的研究 → `_PERSONAL`

### 3. Voice Notification 模式

所有 workflow 必須發送語音/文字通知的設計，適用於 Life-OS 的 cron job 排程工作——每個自動執行的研究任務開始/完成時，通知用戶。

### 4. 觸發描述優化（OptimizeDescription）

Generate 20 個 should/shouldn't-trigger 查詢來驗證描述準確度的循環，可用於 Life-OS 的 MOC 觸發條件優化——例如「MOC 在哪些查詢時應該出現或不應出現」。

### 5. BPE 檢查（應用於文件品質）

「會被更聰明模型取代的內容不該寫入」的原則，可用於 Life-OS 文件審查——如果某個說明可以被簡單推斷，就不該佔用文件空間。

### 6. Gotchas Section（最高資訊密度）

Anthropic 強調「Gotchas 是任何技能中資訊密度最高的區塊」，這個設計可應用於 Life-OS 的「常見失敗模式」區段——記錄研究過程中發現的系統性錯誤。

---

## 檔案清單

```
Packs/CreateSkill/INSTALL.md
Packs/CreateSkill/README.md
Packs/CreateSkill/VERIFY.md
Packs/CreateSkill/src/SKILL.md
Packs/CreateSkill/src/Workflows/CanonicalizeSkill.md
Packs/CreateSkill/src/Workflows/CreateSkill.md
Packs/CreateSkill/src/Workflows/ImproveSkill.md
Packs/CreateSkill/src/Workflows/OptimizeDescription.md
Packs/CreateSkill/src/Workflows/TestSkill.md
Packs/CreateSkill/src/Workflows/UpdateSkill.md
Packs/CreateSkill/src/Workflows/ValidateSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/SKILL.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/CanonicalizeSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/CreateSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/ImproveSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/OptimizeDescription.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/TestSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/UpdateSkill.md
Releases/v5.0.0/.claude/skills/CreateSkill/Workflows/ValidateSkill.md
```
