# T15 — DA Identity

> 組ID：T15
> 來源：DA_IDENTITY.md, DA/*.md, DA/*.yaml, DAInterview.ts
> 檔案總數：5（含 DA 目錄結構）
> 採樣分析：5 個
> 優先級：高

---

## 檔案結構分析

DA Identity 系統在 v5.0.0 中呈現兩層結構：

### 1. Bootstrap 層（PAI 安裝時預設）
- `PAI/USER/DA_IDENTITY.md` — 單一 MD 檔，內含 DA 的名稱、語音、個性、關係模式
- 這是**功能性預設值**，在用戶執行 `/interview` 之前運作

### 2. 完整 DA 系統層（ interview 之後建立）
- `PAI/USER/DA/` 目錄：
  - `_presets.yaml` — 5 種人格預設（efficient, friendly, creative, mentor, worker）
  - `_registry.yaml` — 用戶已建立之 DA 清單（被 DAInterview.ts 管理）
  - `_example/` — 參考範本（identity.yaml + identity.md）
  - `<your-da-name>/` — interview 完成後建立的使用者 DA

每個真實 DA 的子目錄包含：
```
DA_IDENTITY.yaml  # 結構化設定（供 hooks/lib/identity.ts 讀取）
DA_IDENTITY.md    # 人類可讀身份（供 CLAUDE.md @import）
growth.jsonl      # 累進日誌（DA 理解成長軌跡）
opinions.yaml     # DA 對用戶的看法
diary.jsonl       # 每次 session 的 DA 反思
```

---

## 內容差異分析

### DA_IDENTITY.md（Bootstrap）vs DA/_example/identity.md

| 面向 | Bootstrap DA_IDENTITY.md | _example/identity.md |
|:---|:---|:---|
| 格式 | 單一 MD，固定內容 | MD 模板，含 `{placeholder}` |
| Name | "PAI"（硬編碼） | `{DA_IDENTITY.NAME}`（變數） |
| Voice | 含 ElevenLabs ID | 空 (`YOUR_TTS_VOICE_ID`) |
| Personality | 明確描述 | 開放式填空 |
| Autonomy | 明確清單（can_initiate/must_ask） | 預設清單 |
| 用途 | 安裝後立即可用 | interview 過程中填充 |

---

## 核心機制

### DA 人格系統（14 維度）

`_presets.yaml` 定義 14 個人格維度（0-100 量化）：

```
enthusiasm（熱情）
energy（活力）
expressiveness（表達力）
resilience（韌性）
composure（沉著）
optimism（樂觀）
warmth（溫暖）
formality（正式度）
directness（直接度）
precision（精準度）
curiosity（好奇心）
playfulness（玩心）
```

5 種預設對照：

| 維度 | efficient | friendly | creative | mentor | worker |
|:---|---:|---:|---:|---:|---:|
| directness | 90 | 60 | 50 | 70 | 95 |
| warmth | 40 | 85 | 70 | 80 | 30 |
| curiosity | 70 | 80 | 95 | 85 | 50 |
| playfulness | 20 | 60 | 85 | 30 | 5 |
| precision | 95 | 75 | 60 | 85 | 98 |

### DAInterview.ts 三階段引導

```
Phase 1（Quick）：Name + Preset + Formality
Phase 2（Standard）：Personality描述 + Must-ask邊界 + 寫作風格
Phase 3（Deep）：Companion設定 + 關係動態 + 初始信念
```

### Autonomy 分離（安全模型）

```
can_initiate:    send_notification, create_reminder, log_learning, routine_checks
must_ask:        send_external_message, modify_code_unprompted, financial_action, delete_data, publish_content
```

### 身份載入時機

Bootstrap `DA_IDENTITY.md` 在 `CLAUDE.md` 頂部 `@`-import，確保每次 session 開始時 DA 身份自動載入。完整的 `<da-name>/DA_IDENTITY.md` 替代該預設值。

---

## 關聯檔案

- T13 — USER Identity（DA 的上層：PRINCIPAL_IDENTITY）
- T11 — Memory System（growth.jsonl / diary.jsonl 屬於長期記憶系統）
- T10 — CLAUDE.md Routing（@import 身份機制）
- T14 — PULSE Daemon（通知/提醒依賴 autonomy can_initiate 權限）

---

## 與 Life-OS 的借鑒點

### 1. 身份分離模式（Bootstrap → Interview 完成品）

PAI 的設計：**安裝時有功能性預設** → **引導式 interview 建立真實身份**

Life-OS 可借鑒：系統一開始有合理的預設值（如 HERMES 協調者人格），讓用戶透過某種引導流程建立自己的「HERMES 身份」，包含聲音偏好、溝通風格、角色定位。

### 2. 量化人格維度（14 維度）

PAI 將人格轉為 14 個 0-100 維度，可供 LLM 調整輸出風格。

Life-OS 可借鑒：將「協調者風格」量化（例：直接度、正式度、溫暖度），讓用戶能選擇或調整 Hermes 的行為模式。

### 3. 自主權邊界清單（can_initiate / must_ask）

```
can_initiate:    主動執行（通知、提醒、學習）
must_ask:        被動確認（發送外部訊息、修改代碼、刪除資料）
```

Life-OS 可借鑒：建立明確的「協調者自主權邊界」，區分哪些行動 Hermes 可自行決定，哪些需要用戶明確授權。

### 4. 關係動態選擇（peers / commander / mentor）

PAI 提供三種關係模式，用戶在 interview 中選擇。Life-OS 可借鑒：讓用戶定義與 Hermes 的工作關係（平等協作、指令執行、導師指導）。

---

## 檔案清單

```
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA_IDENTITY.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/README.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/identity.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/README.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/identity.yaml
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_presets.yaml
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/TOOLS/DAInterview.ts
~/.hermes/Personal_AI_Infrastructure/Releases/v3.0/.claude/skills/PAI/USER/DAIDENTITY.md（歷史版本對照）
```
