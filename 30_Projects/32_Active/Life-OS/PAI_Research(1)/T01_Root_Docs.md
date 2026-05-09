# T01 — Root 文件

> 組ID：T01
> 來源：README.md, PLATFORM.md, SECURITY.md
> 檔案總數：3
> 採樣分析：3 個
> 優先級：高

---

## 檔案結構分析

### README.md（26,809 bytes，478 行）
**定位：** PAI 專案的首頁入口與旗艦文件，承擔 Landing Page + 概念白皮書雙重角色。

**結構層次：**

| 區塊 | 行號 | 內容性質 |
|------|------|---------|
| Badges / 社交證明 | 1–61 | 視覺化元資料（徽章、影片縮圖、SVG 打字動畫） |
| 重要宣言（> [!IMPORTANT]） | 66–73 | v5.0.0 核心定位：Life Operating System |
| 願景口號 | 75–79 | 「AI should magnify everyone」 |
| What PAI Is | 81–90 | 三層架構：PAI / Pulse / DA |
| Principles | 93–160 | 四大原則（人本、Life OS、理想狀態驅動、單一 DA） |
| Features | 162–162 | 十項功能特色（文字存儲、上下文鷹架、記憶複利等） |
| Installation | 164–240 | 安裝指南（一鍵安裝 / 手動安裝 / v4.x 遷移） |
| Packs | 243–248 | 套件市集入口 |
| FAQ | 251–296 | 常見問題解答 |
| Roadmap | 299–309 | 未來功能藍圖 |
| Community | 311–320 | 社群資源 |
| Contributing | 333–342 | 貢獻指南 |
| License / Credits | 344–383 | 授權與致謝 |
| Update History | 385–468 | 版本變遷日誌（v2.0 → v5.0） |

**設計特色：**
- 大量使用 Markdown 語法裝飾（[表格對齊]、[顏色徽章]、[折疊區塊]）
- 刻意保留影片縮圖（YouTube embed）作為視覺錨點
- v5.0.0 更新說明佔整體相當比重，展現「文件即 changelog」慣例

---

### PLATFORM.md（8,014 bytes，246 行）
**定位：** 跨平台相容性追蹤器，屬於「運維型文件」。

**結構：**

| 區塊 | 內容 |
|------|------|
| Platform Support Matrix | macOS ✅ / Linux ✅ / Windows ❌ |
| Known Issues（22 項） | 三大分類：FIXED（已修復）/ ALREADY HANDLED（已處理）/ MINOR（低優先）/ UNSUPPORTED（未支援） |
| Platform Detection Patterns | 推薦程式碼範例（bash / TypeScript） |
| Testing Requirements | 各平台測試覆蓋說明 |
| Future Work | 高/中/低優先級待辦 |
| Contribution Guidelines | 好的 PR vs 不好的 PR 範例 |

**核心發現：** 22 項平台問題中，20 項已解決；Windows 完全未支援，是主要缺口。

---

### SECURITY.md（7,985 bytes，266 行）
**定位：** 安全紅隊文件 + 開發者安全指南，專門針對「將私人基礎建設遷移到公開版本」的風險控制。

**結構：**

| 區塊 | 核心內容 |
|------|---------|
| 🔴 PUBLIC REPOSITORY WARNING | 遷移危險、清單checklist |
| PROMPT INJECTION & INPUT VALIDATION | 8 大攻擊面向 + 防禦策略 |
| Defense Strategy 1 | 永遠不用 Shell interpolation 處理外部輸入 |
| Defense Strategy 2 | URL 驗證（含 SSRF 保護）|
| Defense Strategy 3 | 外部內容標記隔離 |
| Defense Strategy 4 | Prompt injection 模式識別 |
| Defense Strategy 5 | 偏好 type-safe API |
| Skill-Specific Guidance | Web scraping / 文件解析 / API 整合各別指引 |
| Testing for Vulnerabilities | 紅隊測試命令範例 |

**關鍵洞察：** 明確建立「PAI_DIRECTORY（私人）→ PAI（公開）」的遷移紀律，用對照表（❌ 不含 / ✅ 安全含）呈現，並以真實攻擊鏈（`curl` injection → `rm -rf /`）說明風險。

---

## 內容差異分析

| 面向 | README.md | PLATFORM.md | SECURITY.md |
|------|-----------|-------------|-------------|
| **主要讀者** | 初次接觸的開發者 / 用戶 | 貢獻者 / 跨平台開發者 | 安全意識的開發者 |
| **內容性質** | 行銷 + 概念 + 操作手冊 | 技術障礙追蹤 | 威脅模型 + 防御實踐 |
| **更新頻率** | 每版必更新 | 較靜態 | 較靜態 |
| **技術深度** | 中等（概念層） | 高（平台特定程式碼） | 高（攻擊鏈範例） |
| **與 Algorithm 關聯** | 直接引用（v6.3.0） | 無 | 無 |

---

## 核心機制

### 1. PAI 三層架構
```
PAI（作業系統本體）→ Pulse（生命儀表板，:31337）→ DA（數位助理身份層）
```
三者構成「讓 AI 認識你、幫助你到達理想狀態」的完整閉環。

### 2. 文本優先原則（Text over Opaque Storage）
所有資料偏好純文字 Markdown，反對 SQLite/Postgres 等不透明儲存，確保人類與 AI 都能直接讀取。

### 3. 上下文鷹架 > 模型（Context Scaffolding > Model）
給強大模型正確的上下文（你是誰、你想完成什麼、你有什麼工具），比選擇更強的模型更重要。

### 4. Containment Zone 隔離機制
隱私是結構性的——`containment-zones.ts` 宣告每個目錄的隱私區域，`ContainmentGuard` PreToolUse 鉤子阻擋跨區洩漏。

### 5. 安全遷移紀律（PRIVATE → PUBLIC）
從私人 PAI_DIRECTORY 遷移到公開 PAI 時，必須經過五步驟審計（Audit / Search / Check / Verify / Test），並建立「從不包含」清單（API Key、個人資訊、財務資料等）。

### 6. Prompt Injection 防禦框架
五層防禦策略：隔離 Shell → URL 驗證 → 內容標記 → 模式識別 → Type-Safe API。

---

## 關聯檔案

| 關聯檔案 | 關聯方式 |
|---------|---------|
| T03 — v5.0.0 Skills SKILL.md | v5.0.0 技能系統詳細說明 |
| T11 — Memory System | 三層記憶與文字優先原則的具體實現 |
| T12 — Algorithm v6.3.0 | README 直接引用其演算法邏輯 |
| T15 — DA Identity | DA 身份層的具體實作 |
| T29 — v5.0.0 DOCUMENTATION | v5.0.0 完整發行說明 |

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計

1. **版本發布結構（README Update History）**  
   PAI 每個版本都有結構化 changelog，含具體功能數量（45 skills、171 workflows、37 hooks）。Life-OS 的框架索引若能加入「本版構成」摘要，會更容易追蹤演進。

2. **Containment Zone 隱私分區**  
   目錄級隱私宣告 + PreToolUse 鉤子強制執行，是「安全內建而非外加」的具體典範。Life-OS 若加入「專案邊界」宣告， 可防止跨專案資訊洩漏。

3. **遷移安全清單**  
   SECURITY.md 的「TRANSFER CHECKLIST」對照表（❌ 永不 / ✅ 可安全），可直接移植到 Life-OS 的「個人基礎建設 → 分享模板」的遷移流程。

4. **平台相容性追蹤器**  
   PLATFORM.md 的問題分級（FIXED / HANDLED / MINOR / UNSUPPORTED）提供了一個可複製的「已知問題透明度」框架。

5. **Prompt Injection 威脅分類**  
   8 大攻擊面向的列舉方式，可作為 Life-OS 的「外部輸入風險」審計清單參考。

### 不宜照搬的部分

- **單一 DA 綁定 Claude Code** — Life-OS 目前以 Obsidian 為中心，不應複製此綁定關係。
- **一鍵安裝腳本** — PAI 是 CLI 工具，Life-OS 是 Vault 框架，性質不同。
- **公共倉庫嚴格安全要求** — Life-OS 目前無此需求。

---

## 檔案清單

```
~/.hermes/Personal_AI_Infrastructure/README.md
~/.hermes/Personal_AI_Infrastructure/PLATFORM.md
~/.hermes/Personal_AI_Infrastructure/SECURITY.md
```
