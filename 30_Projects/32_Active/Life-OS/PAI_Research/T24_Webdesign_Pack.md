# T24 — Webdesign Pack

> 組ID：T24
> 來源：Packs/Webdesign, Releases/v5.0.0/.claude/skills/Webdesign
> 檔案總數：34
> 採樣分析：9 個核心檔案
> 優先級：🔴 高

---

## 檔案結構分析

Webdesign Pack 的核心是**Claude Design 的 Orchestration Layer**——包裝 claude.ai/design（Anthropic 的 2026 年 4 月發布的網頁設計產品）的 API-less 操控系統。

**三層架構：**

**工具層（Tools/）**
- `DriveClaudeDesign.ts`：Interceptor 包裝器，用於程式化驅動 claude.ai/design 會話
- `ProcessHandoffBundle.ts`：解析 Claude Design 輸出束 → 結構化 brief
- `VerifyDesign.ts`：截圖 + axe-core 無障礙審查

**工作流層（Workflows/）**
- `CreatePrototype.md`：Brief → 精製原型
- `ExtractDesignSystem.md`：從現有代碼庫提取設計系統
- `RefinePrototype.md`：迭代優化
- `WebsiteToRedesign.md`：網站重設計
- `ExportToCode.md`：導出為代碼束
- `IntegrateIntoApp.md`：整合進現有應用（框架感知 diff）
- `DeployDesign.md`：部署

**規格層（References/）**
- `HandoffBundleSpec.md`：束結構規範（PROMPT.md + tokens.json + preview.html + components/ + manifest.json）
- `ClaudeDesignCapabilities.md`：Claude Design 能力邊界
- `InputFormats.md`：Prompt 模式
- `ExportFormats.md`：導出格式（html/pdf/pptx/canva/url/bundle）

### Pack 與 v5.0.0 版本差異
兩版本內容高度一致，屬於同步發布。

---

## 核心機制

### Claude Design 操控原理

Claude Design 沒有 API、沒有 MCP 伺服器、沒有插件——純粹是 claude.ai 上的 web surface。這帶來關鍵限制：**必須用真實 Chrome 透過 Interceptor skill 進行操控**，CDP 自動化會觸發 bot 檢測並丢失 session cookie。

核心流程：
```
用戶 Brief → 構造 Prompt → DriveClaudeDesign.ts open → 提交 Prompt → 截圖 capture → Export bundle → VerifyDesign.ts → IntegrateIntoApp
```

### Handoff Bundle 系統

Claude Design 輸出的是一個目錄束（非單一檔案），包含：

| 檔案 | 角色 |
|------|------|
| `PROMPT.md` | 給 frontend-design plugin 的結構化 brief |
| `tokens.json` | 設計 Token（顏色、排版、間距、陰影、動效） |
| `preview.html` | 靜態預覽渲染 |
| `manifest.json` | 框架 + 版本元數據 |
| `components/` | 元件骨架檔案 |
| `assets/` | 二進制資源 |

tokens.json schema 定義了完整的設計系統：color（primary/neutral/accent/semantic）、typography（display/body/mono）、spacing（4px 單位）、radius、shadow、motion（duration + easing）。

### IntegrateIntoApp 的差異化設計

大多數設計工具假設 greenfield 開發。IntegrateIntoApp 的核心價值在於：**框架感知的 diff 生產**。

工作流程：
1. 審計目標項目（框架檢測 + token 檔案 + component 目錄）
2. 提取現有設計系統（ExtractDesignSystem）
3. 構造整合 Brief（約束 Claude Design 使用現有 token）
4. 框架翻譯（frontend-design plugin）
5. 生成 Diff（而非新檔案覆蓋）
6. 人類審查閘（critical gate）
7. 應用 Diff
8. 上下文驗證
9. 測試套件回歸檢查

---

## 內容差異分析

| 維度 | 描述 |
|------|------|
| 設計引擎 | Claude Design（claude.ai/design，Opus 4.7 vision） |
| 操控方式 | Interceptor（真實 Chrome）— 無 API、無 MCP |
| 輸出單元 | Handoff Bundle（目錄，非單一檔案） |
| 整合模式 | merge（默認）、replace（需明確授權）、token-only |
| 代碼生成 | frontend-design plugin（Claude Code 自動激活） |
| 驗證工具 | VerifyDesign.ts（截圖 + axe-core a11y） |

---

## 與 Life-OS 的借鑒點

### 1. Handoff Bundle Schema → 專案交付約定
`tokens.json + PROMPT.md + preview.html` 的束結構可改造為 Life-OS 專案交付約定——元數據包裹內容，而非散落檔案。

### 2. IntegrateIntoApp 的 Diff 哲學 → 現有系統整合模式
在改造現有系統時「尊重現有 token、匹配現有 component 模式、合併而非替換」的原則，直接適用於 Life-OS 的任何改造工作。

### 3. ExtractDesignSystem → 現有系統理解優先
在工作開始前先理解現有系統的設計 token，這個「先理解再動手」的模式是所有系統改造的必備步驟。

### 4. Human Gate（審查閘）設計 → 不可逆操作的安全閥
IntegrateIntoApp 在應用 Diff 前有人類審查閘——所有不可逆操作都應有對應的安全閥設計。

### 5. Bundle Schema 的版本化 → 介面契約版本化
tokens.json 有 `$schema` 和 `version` 字段——任何跨系統介面都應有明確的版本契約。

---

## 關聯檔案

- T05 — Fabric Patterns（前端相關）
- T26 — PAI CORE TS（Tools 層的 TypeScript 實現）
- 框架索引中所有與前端/工具相關的報告

---

## 檔案清單（分析樣本）

```
Packs/Webdesign/src/SKILL.md
Packs/Webdesign/src/References/HandoffBundleSpec.md
Packs/Webdesign/src/Workflows/CreatePrototype.md
Packs/Webdesign/src/Workflows/IntegrateIntoApp.md
Packs/Webdesign/src/Workflows/ExtractDesignSystem.md
Packs/Webdesign/src/Workflows/RefinePrototype.md
Packs/Webdesign/src/Workflows/WebsiteToRedesign.md
Packs/Webdesign/src/Workflows/ExportToCode.md
Packs/Webdesign/src/Workflows/DeployDesign.md
Packs/Webdesign/src/Tools/DriveClaudeDesign.ts
Packs/Webdesign/src/Tools/ProcessHandoffBundle.ts
Packs/Webdesign/src/Tools/VerifyDesign.ts
Packs/Webdesign/INSTALL.md
Packs/Webdesign/VERIFY.md
```
