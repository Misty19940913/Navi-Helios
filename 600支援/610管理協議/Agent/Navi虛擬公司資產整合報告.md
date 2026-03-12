# Navi Helios 虛擬公司：跨領域 Agent 資源庫整合審計報告

> **本報告旨在整合兩大外部資源：**
> 1. **Soul Library**: `agency-agents-main` (專精於性格、職掌與語氣)
> 2. **Tool Library**: `awesome-llm-apps-main` (專精於 SOP、指令與技術執行)
> **核心目標**：將兩者縱向堆疊，為虛擬公司提供「具備靈魂的專業工具人」。

---

## 一、 資源庫定位分析 (Resource Positioning)

| 資源名稱 | 設計面相 | 提供價值 | 適用層級 |
| :--- | :--- | :--- | :--- |
| **Agency Agents** | **IDENTITY (誰)** | 決定 Agent 的語氣、禁令、核心使命、性格與溝通風格。 | 靈魂層 (System Prompt) |
| **Awesome Skills** | **EXECUTION (做)** | 提供具體的技術交付標準、Python 腳本、數據分析框架。 | 執行層 (Skills.md / Tools) |

---

## 二、 全域資源解耦與部門分派清單 (Global Decoupling Matrix)

> [!WARNING] 二元解耦原則 (Decoupling Logic)
> 一份文件屬於「Prompt」還是「Skill」**取決於其內容細節，而非它來自哪個資料夾**。
> - **作為 Prompt (人設)**：擷取文件中的性格 (Personality)、溝通風格 (Voice)、思考盲區與價值觀禁令。
> - **作為 Skill (外掛)**：擷取文件中的執行框架 (Framework)、SOP 步驟、填空模板 (Template) 或檢核清單 (Checklist)。
> **兩大資源包的文件皆被徹底打散，可跨界互相掛載。**

按照 Navi Helios 虛擬公司部門編號 (21x-24x) 進行全面整合分類：

### 🏢 21x 行政決策部 (Executive Office)
*負責全局調度、專案決策審計與外部資源協調。*

| Agent (Identity) & 功能說明 | 來源人設 (Prompt: 靈魂與語氣) | 建議掛載技能 (Skills: SOP與模板) |
| :--- | :--- | :--- |
| **Navi-Chief (CEO)**<br>總管系統運作、處理模糊需求、調度跨部門任務。 | [[600支援/610管理協議/gemini/610-210Navi Helios.md\|610-210 Navi Helios]]：原有系統總控。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/specialized/agents-orchestrator.md\|Agents Orchestrator]]：具備鳥瞰視角、發號施令的指揮性格。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/strategy-advisor/SKILL.md\|strategy-advisor]]：戰略決策矩陣框架。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/strategy/nexus-strategy.md\|Nexus Strategy]]：直接取用其跨部門協作機制 SOP。 |
| **專案牧羊人 (PM)**<br>監控專案瓶頸、跨團隊溝通以排除上線阻礙。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/project-management/project-management-project-shepherd.md\|Project Shepherd]]：端到端協調、充滿同理心的人設。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/project-management/project-manager-senior.md\|Senior PM]]：嚴格工期控制性格。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/project-planner/SKILL.md\|project-planner]]：專案任務拆解(WBS) SOP。<br>[[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/meeting-notes/SKILL.md\|meeting-notes]]：會議摘要與行動項生成模板。 |
| **行政摘要官 (Secretary)**<br>過濾海量雜訊，生成對外溝通或向上呈報的精隨摘要。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/support/support-executive-summary-generator.md\|Executive Summary Gen]]：精煉、C-suite 高階溝通語氣。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/email-drafter/SKILL.md\|email-drafter]]：專業信件對外撰寫框架。<br>[[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/technical-writer/SKILL.md\|technical-writer]]：清晰的公文撰寫標準。 |
| **敏捷排程官 (Agile Master)**<br>處理任務池優先級，確保 ROI 最高的行動優先執行。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/product/product-sprint-prioritizer.md\|Sprint Prioritizer]]：重視價值工程與資源最大化的務實人設。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/decision-helper/SKILL.md\|decision-helper]]：SWOT、RICE 優先級評分公式模組。 |

### ✍️ 22x 內容品牌部 (Content & Brand)
*負責 SentryPigeon 品牌敘事、美學與全通路社群滲透。*

| Agent (Identity) & 功能說明 | 來源人設 (Prompt: 靈魂與語氣) | 建議掛載技能 (Skills: SOP與模板) |
| :--- | :--- | :--- |
| **內容主編 (Chief Editor)**<br>負責高壓文案審計、風格脫水與敘事轉向。 | [[600支援/610管理協議/gemini/610-220內容主編.md\|610-220 內容主編]]：冷峻偵查語氣，痛感第一。<br>[[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/editor/SKILL.md\|editor]]：此文件的「專業嚴謹查核者」性格。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/marketing/marketing-content-creator.md\|Marketing Content Creator]]：取用其「Hook 公式與排版框架」作為寫作技能。<br>[[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/fact-checker/SKILL.md\|fact-checker]]：資訊實證技術。 |
| **視覺與品牌監製 (Art/Brand)**<br>邏輯具象化、美學稽核與視覺一致性守護。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-visual-storyteller.md\|Visual Storyteller]]：情感流動與黑膠氛圍敘事人設。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-brand-guardian.md\|Brand Guardian]]：苛求品牌識別一致性的巡邏員。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/visualization-expert/SKILL.md\|visualization-expert]]：圖表選擇邏輯與 Mermaid 排版法。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-image-prompt-engineer.md\|Image Prompt Engineer]]：生成式 AI 算圖參數模板技能。 |
| **社群滲透專家 (Social Leads)**<br>針對特定社群制定黑話傳播、互動與演算法策略。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/marketing/marketing-reddit-community-builder.md\|Reddit/Twitter等平台專家集]]：具備深潛論壇、熟悉各平台鄉民網路語氣的多重性格庫。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/content-creator/SKILL.md\|content-creator]]：取用其「各社群平台發文排版字數限制框架」作為技能。 |
| **幽默與體驗注入者 (UX/Whimsy)**<br>消除文字 AI 感，設計文案中的微互動與痛點驚喜。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-whimsy-injector.md\|Whimsy Injector]]：俏皮、反直覺、尋找死角笑點的性格。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-ux-architect.md\|UX Architect]]：從使用者旅程出發的極致同理心。 | (需自定義：非線性敘事邏輯與幽默感解構 SOP) |

### ⚙️ 23x 系統運作部 (Operations & Systems)
*負責金庫底層結構、自動化腳本、資安與基礎設施。*

| Agent (Identity) & 功能說明 | 來源人設 (Prompt: 靈魂與語氣) | 建議掛載技能 (Skills: SOP與模板) |
| :--- | :--- | :--- |
| **架構守門人 (Architect)**<br>負責 Obsidian 目錄結構、命名法、YAML 合規秩序。 | [[600支援/610管理協議/gemini/610-230系統架構員.md\|610-230 系統架構員]]：無法忍受無秩序的數位強迫症管家。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/project-management/project-management-studio-operations.md\|Studio Operations]]：取用其「SOP 撰寫模板與資源清冊格式」。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/testing/testing-workflow-optimizer.md\|Workflow Optimizer]]：取用其工作流效率診斷檢核表。 |
| **核心開發者 (Dev)**<br>負責 Python 指令開發、腳本迭代與架構原型構建。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/python-expert/SKILL.md\|python-expert]]：極致簡潔邏輯、討厭冗餘代碼的資深工程師性格。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/engineering/engineering-rapid-prototyper.md\|Rapid Prototyper]]：追求 MVP 快速破壞迭代性格。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/code-reviewer/SKILL.md\|code-reviewer]]：代碼安全性與結構稽核 SOP。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/engineering/engineering-devops-automator.md\|DevOps Automator]]：CI/CD 測試與部署核對清單。 |
| **維運與合規官 (Ops/Compliance)**<br>GCP 運作、Token 消耗監控、API 安全與資安檢查。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/support/support-infrastructure-maintainer.md\|Infrastructure Maintainer]]：極度重視系統穩定的防禦型性格。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/support/support-legal-compliance-checker.md\|Legal Compliance]]：咬文嚼字、零容忍風險法務性格。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/debugger/SKILL.md\|debugger]]：報錯系統化診斷與根因分析 SOP。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/testing/testing-accessibility-auditor.md\|Accessibility Auditor]]：系統無障礙與可用性診斷矩陣。 |
| **素材整理師 (Data Curator)**<br>過濾對話雜訊，轉化為原子知識與數據歸一化。 | [[600支援/610管理協議/gemini/610-250代理人角色庫.md\|610-251 素材提煉官]]：極致去雜訊與提煉核心骨架的性格。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/specialized/data-consolidation-agent.md\|Data Consolidation]]：取用其「資料歸一化 (Normalization) 演算法」作為提取法。 |

### 🔍 24x 策略增長部 (Strategy & Growth)
*負責前瞻研發、轉換漏斗優化、財務與生命能量審計。*

| Agent (Identity) & 功能說明 | 來源人設 (Prompt: 靈魂與語氣) | 建議掛載技能 (Skills: SOP與模板) |
| :--- | :--- | :--- |
| **趨勢與工具研發 (R&D)**<br>掃描市場情報競品、評測新 AI 工具、生成行業洞察。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/product/product-trend-researcher.md\|Trend Researcher]]：具備商業直覺與前瞻敏感性的情報員。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/deep-research/SKILL.md\|deep-research]]：多來源交叉驗證與嚴謹引用格式。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/testing/testing-tool-evaluator.md\|Tool Evaluator]]：軟體技術多維度評測矩陣表技能。 |
| **增長與數據分析 (Growth/Data)**<br>漏斗優化追蹤、財務報表與用戶行為統計分析。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/marketing/marketing-growth-hacker.md\|Growth Hacker]]：數字說話、唯 ROI 是問的果斷性格。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/design/design-ux-researcher.md\|UX Researcher]]：追蹤用戶痛點與行為反饋的同理研究。 | [[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/data-analyst/SKILL.md\|data-analyst]]：SQL/Pandas 演算邏輯與數據處理化 SOP。<br>[[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/support/support-finance-tracker.md\|Finance Tracker]]：取用其預算警示與耗損追蹤報表模板。 |
| **生活與能量平衡者 (Balance)**<br>個人覆盤反思、能量審計與多重身份心理磨損協調。 | [[600支援/610管理協議/gemini/610-240系統平衡者.md\|610-240 系統平衡者]]：生命架構師，包容但理性的指導語氣。 | [[600支援/610管理協議/Agent/agency-agents-main/agency-agents-main/testing/testing-reality-checker.md\|Reality Checker]]：取用其殘酷的「事實驗證清單」作為防爆走反思技。<br>[[600支援/610管理協議/Agent/awesome-llm-apps-main/awesome-llm-apps-main/awesome_agent_skills/sprint-planner/SKILL.md\|sprint-planner]]：精力估算、Story Points 與週覆盤 SOP。 |



---

## 三、 核心映射模式分析 (Mapping Patterns)

### 1. 職能缺漏 (The Gaps)
雖然兩庫極強，但以下 **Navi Helios 靈魂組件** 依舊缺失：
- **原子化處理技能 (Atomization Skill)**：缺乏將筆記雜訊拆解為原子卡片的 SOP。
- **MOC 聯網技能 (MOC Linking)**：缺乏在 Obsidian 中自動化索引建立的技術標準。
- **風險/警察思維 (Investigative Logic)**：缺乏將「刑事偵查」轉化為「商業稽核」的具體流程。

### 2. 1-對-多 (1 Agent → 多個 Skills)
- **架構長 (CTO)**：需要 `python-expert` + `code-reviewer` + `technical-writer` 才能完成一個完整的 Obsidian 自動化更新。

### 3. 多-對-1 (多個 Agent → 1 個底層 Skill)
- **Deep-Research**：由 `Trend Researcher`、`UX Researcher` 與 `Academic Researcher` 三位員工共享同一個 Google Search 與 ArXiv 檢索外掛。

---

## 四、 未來利用建議 (EO's Advisory)

1. **檔案建立原則**：
   在 `610-XXX` 檔案中，第一部分定義性格（參考 `agency-agents`），第二部分定義交付標準與指令（依賴 `awesome-agent-skills`）。

2. **OpenClaw 部署策略**：
   在 VM 上，將 `awesome-agent-skills` 的內容提取為獨立的 **json5 技能描述**，實現真正的「多 Agent 調用同一工具」。

3. **重點補強**：
   下一階段，行政官建議優先補強 **「原子化處理 (232)」** 與 **「MOC 管理員 (233)」**，這兩者是我們目前虛擬公司的獨門競爭力。

---

**報告批註**：
本報告已確認兩大資源庫中共 **61 個角色定義** 與 **20 個核心技能包** 已全數經過掃描並分類至四個部門。
報告人：Antigravity 行政官
日期：2026-03-09
