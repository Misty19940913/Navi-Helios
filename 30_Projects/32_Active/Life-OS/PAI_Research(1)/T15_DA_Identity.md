# T15 — DA Identity

> 組ID：T15
> 來源：PAI/USER/DA/* + PAI/DOCUMENTATION/Agents/DA.md
> 檔案總數：5（scaffold）+ DA 身份設定工具鏈
> 優先級：高

---

## 檔案結構分析

### 目錄架構

```
PAI/USER/DA/
├── README.md                    # 系統入口文件
├── _presets.yaml               # 5種人格預設（efficients/friendly/creative/mentor/worker）
├── _registry.yaml               # 使用者創建的 DA 列表（由 DAInterview.ts 自動管理）
├── _example/                    # 參考範例（展示檔案格式）
│   ├── identity.yaml
│   ├── identity.md
│   └── README.md
└── <user-da-name>/             # 使用者親自創建的 DA（由 DAInterview.ts 生成）
    ├── DA_IDENTITY.yaml         # 結構化設定（供 hooks/lib/identity.ts 讀取）
    ├── DA_IDENTITY.md           # 人類可讀身份（由 CLAUDE.md @-import 載入）
    ├── growth.jsonl             # 附加油取 DA 理解演進的_append-only 日誌
    ├── opinions.yaml            # DA 對使用者及工作的觀察
    └── diary.jsonl              # DA 每 session 的反思日誌
```

### _presets.yaml — 五種人格預設（12維度量化）

| 預設 | 描述 | 典型場景 |
|------|------|---------|
| **efficient** | 快速精準，最少閒聊 | 高壓交易環境 |
| **friendly** | 溫暖鼓勵，會話式 | 日常陪伴 |
| **creative** | 想像力豐富，探索性 | 頭腦風暴 |
| **mentor** | 深思教學導向，耐心 | 指導場景 |
| **worker** | 背景代理，任務聚焦 | 批處理工作 |

每種預設有 12 個維度的 0-100 數值配置：
`enthusiasm / energy / expressiveness / resilience / composure / optimism / warmth / formality / directness / precision / curiosity / playfulness`

---

## 核心機制

### 1. DAInterview.ts 對話式引導建立流程

透過 `bun PAI/TOOLS/DAInterview.ts` 互動式精靈建立 DA：

```bash
bun ~/.claude/PAI/TOOLS/DAInterview.ts                  # 快速模式
bun ~/.claude/PAI/TOOLS/DAInterview.ts --depth standard  # 標準模式
bun ~/.claude/PAI/TOOLS/DAInterview.ts --depth deep      # 深度模式
bun ~/.claude/PAI/TOOLS/DAInterview.ts --update           # 更新主要 DA
bun ~/.claude/PAI/TOOLS/DAInterview.ts --update --da kai # 更新特定 DA
```

對話收集：名字 → 聲音（ElevenLabs voice ID）→ 12維度人格 → 口號（session 開場白）

### 2. DA_IDENTITY 雙檔案設計

| 檔案 | 用途 | 被誰讀取 |
|------|------|---------|
| `DA_IDENTITY.yaml` | 結構化設定（變數替換）| hooks/lib/identity.ts |
| `DA_IDENTITY.md` | 人類可讀完整身份文件 | CLAUDE.md @-import |

所有 `{DA_IDENTITY.NAME}`、`{DA_IDENTITY.DISPLAY_NAME}` 等變量在 runtime 由 identity.ts 動態替換。

### 3. DA 生長系統（growth.jsonl / diary.jsonl）

- **growth.jsonl**：append-only，記錄 DA 對使用者理解如何隨時間演進
- **diary.jsonl**：每個 session 的 DA 反思，可作為日後自我改進的參考

### 4. 與 USER Identity 的關係

```
PRINCIPAL_IDENTITY.md（用戶本人）←→ DA_IDENTITY.md（AI分身）
```

DA 是被賦予人格的數位分身，不是通用 AI。身份層的雙檔案設計讓「用戶本人」與「AI分身」清楚分離，互不混淆。

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計

1. **12維度人格量化系統**
   `_presets.yaml` 的 12 維度雷達圖可用於 Life-OS 的「AI助手角色切換」——針對不同場景（創作/分析/覆盤）切換不同人格配置。

2. **雙檔案身份設計（YAML + MD）**
   YAML 供系統程式使用，MD 供人類閱讀。Life-OS 的「系統設定」可參考此模式：機器可讀層（YAML frontmatter）與人類解釋層（MD 正文）分開。

3. **口號/開場白的制度化**
   DA 的 catchphrase 是「讓 AI 有個性的最簡單方式」。Life-OS 若建立「每個 AI 操作週期開始時的固定開場白」，可增加系統的連貫感。

4. **growth.jsonl 的 append-only 日誌**
   DA 對用戶的觀察以 append-only 結構積累，不會被覆寫。Life-OS 若對「覆盤摘要」採用 append-only 而非覆寫，可建立時間序列的成長軌跡。

### 不宜照搬的部分

- **ElevenLabs 語音整合** — 需要外部付費 API，Life-OS 無語音需求
- **多 DA 架構** — PAI 支援多個 DA 同時運行，Life-OS 目前單一 AI 助手模型
- **DAInterview.ts 對話式精靈** — 需要 bun/TypeScript runtime

---

## 關聯檔案

- **T13 — USER Identity**：DA Identity 是 USER Identity 的「AI鏡像」，共同構成雙身份模型
- **T14 — PULSE Daemon**：PULSE Assistant 模組使用 DA Identity 作為人格核心
- **T09 — Interview System**：DAInterview.ts 是 PAI Interview System 的具體實現

---

## 檔案清單

1. `~/.claude/PAI/USER/DA/README.md`
2. `~/.claude/PAI/USER/DA/_presets.yaml`
3. `~/.claude/PAI/USER/DA/_registry.yaml`
4. `~/.claude/PAI/USER/DA/_example/identity.yaml`
5. `~/.claude/PAI/USER/DA/_example/identity.md`
6. `~/.claude/PAI/TOOLS/DAInterview.ts`
