# T02 — Packs SKILL.md

> 組ID：T02
> 來源：Packs/*/src/SKILL.md
> 檔案總數：87
> 採樣分析：15 個
> 優先級：🔴 高

---

## 檔案結構分析

PAI 的 SKILL.md 是技能的**入口檔案**，採用標準的兩層結構：

### 標準 frontmatter 格式
```yaml
---
name: SkillName
description: "觸發描述 — 完整描述技能的觸發條件和用途"
effort: low|medium|high
---
```

### 標準身體結構
1. **Customization 段落**（可選）— 檢查 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<SkillName>/` 是否存在用戶自訂
2. **Voice Notification 段落**（几乎所有技能都有）— 強制在執行前發送 curl 通知到 `localhost:31337/notify`
3. **Workflow Routing 表格** — 根據觸發詞路由到對應的 Workflow 檔案
4. **主內容段落** — 技能的詳細說明
5. **Examples 段落**（可選）— 使用範例
6. **Gotchas 段落**（可選但建議）— 已知問題和陷阱
7. **Execution Log 段落**（部分技能有）— 執行日誌寫入 `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`

---

## 內容差異分析

### 技能類型分組

| 技能名稱 | 類型 | 複雜度 | 特殊元素 |
|---------|:---:|:------:|---------|
| Interview | 對話式採訪 | 高 | 4階段遞進、Review/Fill 模式、InterviewScan.ts |
| Art | 視覺生成 | 高 | 20+ workflows、模型路由、透明度規則 |
| Science | 演算法 | 中 | 7階段科學方法、診斷捷徑 |
| Agents | 代理組成 | 高 | 動態組合、Voice Prosody、Named/Dynamic 代理 |
| Council | 多智能體辯論 | 中 | 協作-對抗、3輪可見記錄 |
| Thinking | 技能路由 | 低 | 6個子技能路由 |
| CreateSkill | 技能開發 | 高 | 雙軌（結構/有效性）、9種技能類型 |
| RedTeam | 對抗分析 | 高 | 32並行專家代理、5階段協議 |
| ExtractWisdom | 內容提取 | 中 | 內容自適應區段、5種深度層級 |
| Prompting | 提示工程 | 中 | Handlebars 模板、3個支柱 |
| Knowledge | 知識管理 | 高 | 4實體類型、typed graph、ripple 更新 |
| RedTeam | 對抗分析 | 高 | 32並行專家代理、5階段協議 |
| ExtractWisdom | 內容提取 | 中 | 動態區段建構、5種深度層級 |

### 觸發描述的結構模式

所有 description 都遵循相同模式：
```
"{主要功能描述}。USE WHEN [觸發詞列表]。NOT FOR [排除場景列表]。"
```

---

## 核心機制

### 1. Workflow Routing（工作流路由）
技能將請求路由到對應的 Workflow 檔案：

```markdown
## Workflow Routing
| Trigger | Workflow |
|---------|----------|
| "trigger" | `Workflows/WorkflowName.md` |
```

### 2. Customization 系統（雙層配置）
標準模式：
- 系統默認配置在技能的 `Data/` 或技能根目錄
- 用戶自訂在 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<SkillName>/`
- 用戶自訂覆蓋系統默認

```markdown
## Customization
**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<SkillName>/`
```

### 3. Voice Notification（語音通知）
幾乎所有技能都要求在執行前發送 HTTP 通知：
```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WORKFLOWNAME workflow in the Skill skill to ACTION"}' \
  > /dev/null 2>&1 &
```

### 4. Execution Log（日誌追蹤）
部分技能在執行後寫入 JSONL：
```bash
echo '{"ts":"2026-05-07T02:00:00Z","skill":"SkillName","workflow":"WorkflowName","input":"8_WORD_SUMMARY","status":"ok","duration_s":30}' >> ~/.claude/PAI/MEMORY/SKILLS/execution.jsonl
```

---

## 與 Life-OS 的借鑒點

### 1. 技能描述的 USE WHEN / NOT FOR 模式
PAI 使用 `USE WHEN` + `NOT FOR` 明確描述觸發邊界。這比 Life-OS 的觸發條件定義更精細。

### 2. 雙層配置系統
```
System default → USER/SKILLCUSTOMIZATIONS/ → 覆蓋系統
```
這種模式讓技能既保持通用性又有個人化空間。Life-OS 可考慮採用此模式。

### 3. Workflow 路由
技能內部的 Workflow 路由讓單一技能可以處理多種類型的請求，而不是創建多個技能。

### 4. Execution Log 追蹤
JSONL 格式的執行日誌提供了技能使用情況的量化數據，可用於優化技能觸發。

### 5. Gotchas 段落
「已知問題」段落累積技能使用中的教訓，是很好的經驗傳遞方式。

---

## 檔案清單（採樣 15 個）

1. `Packs/Thinking/src/Science/SKILL.md`
2. `Packs/Thinking/src/SKILL.md`
3. `Packs/Thinking/src/BeCreative/SKILL.md`
4. `Packs/Thinking/src/IterativeDepth/SKILL.md`
5. `Packs/Thinking/src/WorldThreatModelHarness/SKILL.md`
6. `Packs/Thinking/src/FirstPrinciples/SKILL.md`
7. `Packs/Thinking/src/Council/SKILL.md`
8. `Packs/Thinking/src/RedTeam/SKILL.md`
9. `Packs/Loop/src/SKILL.md`
10. `Packs/AudioEditor/src/SKILL.md`
11. `Packs/Agents/src/SKILL.md`
12. `Packs/USMetrics/src/SKILL.md`
13. `Packs/WorldThreatModel/src/SKILL.md`
14. `Packs/Art/src/SKILL.md`
15. `Packs/Interceptor/src/SKILL.md`
16. `Packs/Delegation/src/SKILL.md`
17. `Packs/ArXiv/src/SKILL.md`
18. `Packs/Ideate/src/SKILL.md`
19. `Packs/CreateSkill/src/SKILL.md`
20. `Packs/Scraping/src/BrightData/SKILL.md`
21. `Packs/ContentAnalysis/src/ExtractWisdom/SKILL.md`
22. `Packs/Utilities/src/Cloudflare/SKILL.md`
23. `Packs/Ideate/src/SKILL.md`
24. `Packs/ExtractWisdom/src/SKILL.md`
25. `Packs/Prompting/src/SKILL.md`
26. `Packs/Science/src/SKILL.md`
27. `Packs/Utilities/src/SKILL.md`
28. `Packs/Thinking/src/Council/SKILL.md`
29. `Packs/Interview/src/SKILL.md`
30. `Packs/Art/src/SKILL.md`
31. `Packs/Knowledge/src/SKILL.md`
32. `Packs/PAIUpgrade/src/SKILL.md`
33. `Packs/BrightData/src/SKILL.md`
34. `Packs/Security/src/SECUpdates/SKILL.md`
35. `Packs/RedTeam/src/SKILL.md`

---

## 關聯檔案

- 主索引：[[PAI_Research/00_框架索引|00 — 框架索引]]
- 上一份：[[PAI_Research/01_README_Root|01 — README.md（根目錄）]]
- 下一份：[[PAI_Research/03_ClaudeSkills_SKILL|03 — .claude/skills SKILL.md]]
