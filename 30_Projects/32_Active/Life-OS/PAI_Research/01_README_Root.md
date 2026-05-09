# 01 — README.md（根目錄）研究報告

> 分析目標：Personal AI Infrastructure 根目錄 README.md
> 來源路徑：`~/.hermes/Personal_AI_Infrastructure/README.md`
> 分析深度：文檔層次
> 上一份報告：無
> 下一份報告：[[PAI_Research/02_README_v5.0.0|02 — README.md（v5.0.0）]]

---

## 基本資訊

- **專案名稱：** Personal AI Infrastructure（PAI）
- **版本：** v5.0.0（2026-04-30 發布）
- **定位：** Life Operating System
- **開發者：** Daniel Miessler
- **License：** MIT
- **技術棧：** Claude Code + TypeScript + Bun
- **星標數：** 社群廣泛使用

---

## 核心定位

PAI 的定位經歷了三代進化：

```
v1-v3: AI 提示詞集合（Fabric 類）
v4.x:  AI 腳手架（上下文管理框架）
v5.0.0: Life Operating System（生命作業系統）
```

**v5.0.0 的口號：**
> "AI should magnify everyone—not just the top 1%."

---

## 三層架構

```
┌─────────────────────────────────────┐
│           YOU (使用者)              │
│  Health, Goals, Work, Relationships │
│  Creative, Finances, Learning, Life  │
└──────────────┬──────────────────────┘
               │ Context Beams
┌──────────────▼──────────────────────┐
│    PAI (Life Operating System)      │
│  Memory │ Skills │ Hooks │ Voice   │
│  Learning │ Agents │ Statusline    │
│  Security │ Context Scaffolding    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           ENGINES                   │
│  Claude Code │ OpenCode │ Pi        │
└─────────────────────────────────────┘
```

---

## 四大核心原則

### 1. Humans first, tech second
- 科技服務人類，不是人類服務科技
- 每個設計決定從「這對使用者有什麼幫助」出发

### 2. A Life OS, not an agent harness
- 核心是「你的生活」而不是「工具能力」
- 涵蓋：goals, work, relationships, health, finances
- AI 是手段，不是目的

### 3. Ideal State drives everything
- **最大的未解決問題：** 沒有人能定義 AI 任務的「完成」標準
- PAI 的核心概念：**Ideal State** — 從當前狀態（Current State）到理想狀態（Ideal State）的過渡
- 主要表達形式：**ISA（Ideal State Artifact）**
  - 類似軟體 PRD，但通用於任何創意任務
  - 系統將 Ideal State 分解為 **ISC（Ideal State Criteria）**
  - 系統透過不斷 hill-climb 達到 Ideal State

### 4. A single Digital Assistant will be everyone's interface to AI
- 2016 年的預測：chatbots → agents → Digital Assistants
- 每個人有一個 DA（Digital Assistant）作為主要 AI 介面
- TRIOT 的四個核心想法：
  1. 每個人一個 DA
  2. 萬物皆有 API
  3. DA 動態創建介面
  4. 你定義理想狀態，AI 幫你達到

---

## 五個核心功能

### 1. Text over opaque storage
- 大量使用純文字和 Markdown
- 避免 SQLite、Postgres 等不透明白儲存
- 設計哲學：cat 能讀的才用

### 2. Context scaffolding > model
- 大多數人犯的錯誤：沒有給 AI 足夠的上下文
- PAI 是上下文工程系統：給最強的模型正確的上下文
- 模型不如周邊重要

### 3. Bitter-pilled engineering
- 諷刺工程：模型越強，需要的指令越少
- 不斷審計 PAI，移除過度指令的地方
- 系統隨模型變強而縮小

### 4. Filesystem as context, no RAG
- 自 2025 年 6 月起放棄 RAG
- 使用 Rich text + cross-references + ripgrep 達到同樣效果
- 檔案系統就是索引

### 5. Memory that compounds
- 三層記憶：WORK / KNOWLEDGE / LEARNING
- 加上typed graph：People, Companies, Ideas, Research
- 記憶系統餵回輸入，幫助未來工作

---

## 自我改進循環

```
Signal → Capture → Analysis → Improvement
  ↑                            │
  └────────────────────────────┘
```

PAI 捕捉信號：
- 什麼成功了
- 什麼失敗了
- 明確評分、情緒、驗證結果、滿意度

---

## Algorithm 說明

> 「The Algorithm」是 PAI 的核心執行框架
> 建模自科學方法，使用 Deutsch 的「hard-to-vary explanations」作為「好」的標準
> 每個非平凡任務都經過它

---

## Skills 系統

- Skills 是確定的程式執行單元
- 層次：程式碼 → CLI → workflows（提示 CLI）→ SKILL.md（路由）
- **提示詞包裝程式碼；程式碼不包裝提示詞**

---

## Thinking Skills

有意義的自訂思考技能庫：
- First Principles
- Council Debates
- Red Team
- Root Cause
- Systems Thinking
- Iterative Depth
- Aperture Oscillation

Algorithm 在決策時拉取這些技能，提升品質。

---

## 安裝方式

### 官方一鍵安裝
```bash
curl -sSL https://ourpai.ai/install.sh | bash
```

### 流程
1. 驗證 Bun、Git、Claude Code
2. 提示 ElevenLabs API key（可跳過）
3. DA 身份嚮導（名字 + 聲音 + 個性）
4. Pulse launchd 服務註冊
5. 驗證

### 手動安裝
```bash
git clone https://github.com/danielmiessler/Personal_AI_Infrastructure.git
cd Personal_AI_Infrastructure/Releases/v5.0.0
cp -R .claude ~/
cd ~/.claude && ./install.sh
```

---

## 安裝後設定

### 必須：運行 /interview
PAI 會引導你完成四個階段：

1. **Phase 1 — TELOS:** Mission, Goals, Beliefs, Wisdom, Challenges, Books, Mental models, Narratives
2. **Phase 2 — IDEAL_STATE:** 成功的樣子是什麼
3. **Phase 3 — Preferences:** 工具、習慣、工作風格
4. **Phase 4 — Identity:** 最終 DA 個性調整

> **沒有 TELOS，你的 DA 沒有任何東西可以優化。**

---

## FAQ 重點摘要

### PAI vs Claude Code
- Claude Code 是引擎
- PAI 是讓 Claude Code 變成「你的」的層次
- 差異：持久記憶、自訂技能、你的上下文、智慧路由、自我改進

### PAI vs Fabric
- Fabric 是 AI 提示詞集合（專注於「問什麼」）
- PAI 是 AI 基礎設施（專注於「DA 如何運作」）
- 兩者互補

### Windows 支援
- 目前不支援 Windows
- 只有 macOS 和 Linux

---

## 與 Life-OS 的關聯

| PAI 概念 | Life-OS 概念 | 對應關係 |
|:---|:---|:---|
| Life OS | Life-OS | 相同定位 |
| DA (Digital Assistant) | 尚未定義 | 可參考 |
| TELOS | Vision + Goal | Phase 1 → Vision, Phase 2 → Goal |
| Ideal State | Goal 的一年時間限制 | Goal = 1年1個 → 每年 Ideal State |
| ISA | 尚未定義 | 可參考 12 章節格式 |
| Algorithm | 尚未定義 | 可參考 7 階段框架 |
| Memory v7.6 | KCE 框架 | Knowledge / Calendar / Efforts |

---

## 關聯檔案

- 主索引：[[PAI_Research/00_框架索引|00 — 框架索引]]
- 下一份：[[PAI_Research/02_README_v5.0.0|02 — README.md（v5.0.0）]]
