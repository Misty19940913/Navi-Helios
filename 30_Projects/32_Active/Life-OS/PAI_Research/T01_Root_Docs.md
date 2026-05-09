# T01 — Root 文件

> 組ID：T01
> 來源：[README.md, PLATFORM.md, SECURITY.md]
> 檔案總數：3
> 採樣分析：3
> 優先級：高

---

## 檔案結構分析

### README.md（主說明文件，478 行）

**核心定位：** Personal AI Infrastructure（PAI）是一個 **Life Operating System**，旨在讓 AI 放大每個人的能力，而不僅僅是頂端 1% 的人。

**版本現況：** v5.0.0（2026-04-30），代號「Life Operating System」

**檔案結構：**
- 專案標頭（含徽章、影片、社交連結）
- What PAI Is（系統定位說明）
- Principles（四大核心原則）
- Features（八大功能特性）
- Installation（安裝指南）
- PAI Packs（擴充包）
- FAQ（常見問題）
- Roadmap（發展藍圖）
- Community（社群資源）
- Contributing（貢獻指南）
- License / Credits
- Update History（更新歷史）

---

### PLATFORM.md（平台相容性文件，246 行）

**核心定位：** 追蹤 PAI 在不同作業系統上的程式碼與依賴相容性狀態。

**平台支援矩陣：**
| 平台 | 狀態 | 備註 |
|------|------|------|
| macOS | ✅ 完全支援 | 主要開發平台 |
| Linux | ✅ 完全支援 | Ubuntu/Debian 已測試 |
| Windows | ❌ 不支援 | 需社群貢獻 |

**問題分類：**
- ✅ FIXED（已修復）：sed 語法、PATH 硬編碼、LaunchAgent/systemd 等 5 項
- 📋 ALREADY HANDLED（已處理）：音訊播放、跨平台通知、process.platform 檢查等 5 項
- 🔮 MINOR ISSUES（輕微問題）：文件不一致、macOS 特定功能等 8 項
- ❌ UNSUPPORTED（不支援）：Windows 全面缺乏支援 1 項

---

### SECURITY.md（安全性文件，266 行）

**核心定位：** 公開版本的安全警告與 prompt injection 防護指導。

**兩大核心區塊：**

1. **公開倉庫警告（PUBLIC REPOSITORY WARNING）**
   - PAI_DIRECTORY（私人版）→ PAI（公開版）的轉移須知
   - 嚴禁包含：個人 API keys、真實郵件/電話、财务信息、医疗数据、个人上下文文件
   - 安全轉移檢查清單（8 項）

2. **Prompt Injection 與輸入驗證**
   - 核心原則：外部內容僅為「唯讀資訊」，命令只能來自用戶指示與 PAI 核心設定
   - 8 種攻擊面向（網頁爬取、文件解析、API 回應、用戶檔案、Git 倉庫、社交媒體、電郵、資料庫）
   - 5 種防禦策略（禁止 Shell 插值、永遠驗證輸入、消毒內容、辨識 prompt injection 模式、使用類型安全 API）

---

## 內容差異分析

| 維度 | README.md | PLATFORM.md | SECURITY.md |
|------|-----------|-------------|-------------|
| **性質** | 專案主文件 | 工程技術文件 | 安全警示文件 |
| **受眾** | 終端用戶、貢獻者 | 開發者、平台維護者 | 開發者、安全意識用戶 |
| **語氣** | 行銷與實用並重 | 技術性、條列式 | 警告性、強制性 |
| **更新頻率** | 隨版本發布 | 追蹤平台問題 | 安全事件驅動 |
| **技術深度** | 概念與功能介紹 | 平台特定程式碼 | 攻擊向量與防禦模式 |
| **依賴關係** | 引用 PLATFORM.md、SECURITY.md | 被 README.md 提及 | 獨立存在 |

**三者關聯：**
- README.md 為入口，提供整體願景與安裝指引
- PLATFORM.md 支撐「可在哪些環境運行」的工程問題
- SECURITY.md 處理「如何安全使用」的風險問題

---

## 核心機制

### 1. Life Operating System 架構（三層堆疊）

```
┌─────────────────────────────────┐
│           PAI（作業系統本體）      │
│  Skills、Memory、Algorithm、Telos │
├─────────────────────────────────┤
│     Pulse（生命儀表板）           │
│   localhost:31337 Life Dashboard │
├─────────────────────────────────┤
│     DA（數位助理）                │
│   語音與人格介面                  │
└─────────────────────────────────┘
```

### 2. Ideal State 驱动机制

**核心概念：**
- **ISA（Ideal State Artifact）**：類似 PRD 的理想狀態表述文件，12 個章節、五種身份
- **ISC（Ideal State Criteria）**：從 ISA 分解出的離散驗證項目
- **Algorithm v6.3.0**：七階段循環（OBSERVE → THINK → PLAN → BUILD → EXECUTE → VERIFY → LEARN）

### 3. 記憶系統（Memory v7.6）

按用途結構化：
- **WORK**：主動任務 ISA
- **KNOWLEDGE**：人物、公司、想法、研究、部落格（帶類型的圖）
- **LEARNING**：元模式
- **RELATIONSHIP**：DA-Principal 筆記
- **OBSERVABILITY**：每個工具調用鉤子觸發與滿意度信號
- **STATE**：環路註冊

### 4. 技能系統（45 技能、171 工作流、37 鉤子）

層次結構：`code → CLI → workflows → SKILL.md`

### 5. Containment Zones（隱私containment機制）

- `containment-zones.ts` 宣告每個目錄的隱私區域
- `ContainmentGuard` PreToolUse 鉤子阻斷跨區域洩漏
- 12 個安全閘門在每次公開發布時執行
- 兩階段發布（stage → publish）永不自動鏈接

### 6. 安全性核心原則

```
外部內容 = 唯讀資訊（永遠不執行）
命令來源 = 僅來自用戶指示 + PAI 核心設定
```

---

## 關聯檔案

基於三個源文件的交叉引用，推測的相關檔案：

### 直接引用
- `Releases/v5.0.0/README.md`（升級與遷移指南）
- `Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.3.0.md`（算法規格）
- `Releases/v5.0.0/.claude/PAI/PULSE/`（生命儀表板原始碼）
- `Packs/`（技能包目錄）
- `LICENSE`（授權條款）

### 内部模組（推測）
- `containment-zones.ts`（containment 區域宣告）
- `Observability/manage.sh`（觀測性管理腳本）
- Voice system（音訊系統相關檔案）

### 外部整合
- Claude Code（底層引擎）
- ElevenLabs（語音合成）
- Fabric（互補的 prompt 模式集合）

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計模式

| PAI 機制 | Life-OS 潛在應用 | 價值 |
|----------|------------------|------|
| **ISA 文件化** | 將目標狀態寫入文件，避免模糊 | 高 |
| **演算法驅動的階段循環** | 工作流程的觀察→思考→計劃→執行→驗證→學習 | 高 |
| **三層記憶系統（WORK/KNOWLEDGE/LEARNING）** | 區分正在進行的任務、積累的知識、持續學習 | 高 |
| **containment-zones 隱私分區** | 不同專案/領域的資料隔離 | 中 |
| **技能作為確定性單元** | 將重複任務封裝為可組合技能 | 中 |
| **自我改進循環** | 根據反饋信號優化系統本身 | 中 |
| **文字優先存儲（無 RAG）** | 純文字與交叉引用取代向量檢索 | 低（現有架構已支援） |

### 需要注意的差異

1. **部署環境**：PAI 基於 Claude Code（本地 CLI），Life-OS 基於 Obsidian（本地檔案）
2. **隱私模型**：PAI 的公開倉庫 vs Life-OS 的純本地存儲
3. **目標客群**：PAI 為個人 AI 基礎設施，Life-OS 為個人知識與任務管理
4. **學習曲線**：PAI v5.0.0 需要完整的 interview 流程來初始化 TELOS

### 具體建議

- **短期（可直接採用）：**
  - 建立類似的「目標文件」機制來表述理想狀態
  - 採用 WORK/KNOWLEDGE/LEARNING 三層分類整理研究資料
  - 參考 PAI 的「五種身份」表達方式來描述 Life-OS 的各個組成部分

- **中期（需要規劃）：**
  - 設計類似 Algorithm 的七階段工作循環
  - 建立 containment zones 機制區分不同專案域
  - 參考自我改進循環建立系統反饋機制

- **長期（需進一步研究）：**
  - 探索類似 DA（數位助理）的智慧代理介面
  - 研究 Pulse 類似的「生命儀表板」視覺化呈現

---

## 檔案清單

| 序號 | 檔案名 | 路徑 | 行數 | 性質 | 優先級 |
|------|--------|------|------|------|--------|
| 1 | README.md | ~/.hermes/Personal_AI_Infrastructure/ | 478 | 主說明文件 | 高 |
| 2 | PLATFORM.md | ~/.hermes/Personal_AI_Infrastructure/ | 246 | 平台相容性追蹤 | 中 |
| 3 | SECURITY.md | ~/.hermes/Personal_AI_Infrastructure/ | 266 | 安全警示文件 | 高 |

---

**分析完成時間：** 2026-05-08
**分析版本：** PAI v5.0.0
**技術棧：** TypeScript, Bun, Claude Code 原生
