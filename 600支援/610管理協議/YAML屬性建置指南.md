---
tags:
  - 系統/支援
status:
  - DONE
time_create: 2025-09-11
time_modifie: 2025-09-25
---
## 固定 key 集

- type: 檔案類別（content｜journal｜template｜strategy｜tool｜guide）
- system_level: 所屬系統層級（capture｜dream｜area｜project｜creation｜resource｜support）
- area: 領域細分（當 system=area 時必選：health｜life｜career｜social｜family｜finance｜mission｜growth）
- status: 當前狀態
- priority: 優先級（high｜medium｜low）
- tags: 標籤（建議命名空間化，如 系統/支援、系統/領域/財務、主題/AI應用）
- time_create: 建立日期
- time_modifie: 最後修改日期（YYYY-MM-DD）
- aliases: 同義名稱（便於搜尋/引用）
- slug: 友好連結代稱（SEO/固定連結，可選）
- parents: 父節點（清單）
- children: 子節點清單（清單）

### HUMAN 3.0 屬性
- life_domain: 四象限歸屬（mind｜body｜spirit｜vocation）
- development_phase: 發展階段（dissonance｜uncertainty｜discovery）
- capability_trait: 能力特質（knowledge｜experience｜skill）
- quadrant_assessment: 象限評估物件（mind/body/spirit/vocation 的 level、phase、strength、gap）
- lifestyle_archetype: 生活方式原型（explorer｜optimizer｜workaholic｜integrator 等）
- metatype: 元類型（動態命名，用於個人化描述）
- core_problem: 核心問題（根因而非症狀）
- assessment_date: 評估日期（YYYY-MM-DD）
- confidence: 評估信心（0~1 浮點數）

### 連結關聯
- related_files: 相關檔案連結清單（檔名或相對路徑）
- projects: 所屬/關聯專案（字串或連結）
- areas: 所屬/關聯領域（如 財務、健康）

### 創作/內容屬性
- publish: 是否公開發佈（true｜false）
- publish_platforms: 發佈平台（website｜IG｜YT｜LinkedIn 等）
- publish_date: 發佈日期（YYYY-MM-DD）
- content_theme: 內容主題（一句話描述主軸）
- target_audience: 目標受眾（人群輪廓或角色）
- seo_keywords: SEO 關鍵字（字串列表）
- series: 系列名稱（如「曦引系統」）
- episode: 系列集數（整數或代號）
- canonical_url: 正規連結（避免重複內容問題）
- reading_time: 預估閱讀時間（分鐘，數字）

### 交易/程式碼屬性
- file_format: 檔案格式（markdown｜mql5｜pine｜pdf｜image｜excalidraw）
- code_type: 程式類型（strategy｜indicator｜EA｜script）
- strategy_name: 策略名稱（人類可讀）
- strategy_type: 策略型別（trend｜mean_reversion｜breakout…）
- symbol: 交易品種（XAUUSD、EURUSD 等）
- market: 市場（forex｜crypto｜index｜stocks）
- broker: 經紀商或平台（可選）
- timeframe: 週期（M15｜H1｜H4｜D1）
- risk_per_trade: 單筆風險百分比（數字，如 1.0 代表 1%）
- position_sizing: 倉位計算法（fixed_fractional｜kelly…）
- entry_rules: 入場規則（簡述或連結）
- exit_rules: 出場規則（簡述或連結）
- stop_strategy: 停損策略（如 ATR(14)*2）
- backtest_period: 回測區間（YYYY-YYYY 或日期範圍）
- profit_factor: 獲利因子（數字）
- max_drawdown: 最大回撤百分比（數字）

### 專案管理屬性
- project_name: 專案名稱（與 projects 對應）
- project_phase: 專案階段（plan｜execute｜done｜paused）
- start_date: 開始日期（YYYY-MM-DD）
- end_date: 結束日期（YYYY-MM-DD）
- milestones: 里程碑（清單）
- dependencies: 依賴項（清單）
- okr: 目標與關鍵結果（物件或清單）
- kpi: 指標（清單）


## 極簡可用範例（貼入新檔案）

```yaml
---
type: "content"                  # 大類
subtype: "article"               # 次類
system_level: "creation"         # 層級
status: "doing"                  # 狀態
priority: "high"                 # 優先級
tags: ["象限/心智","主題/自我覺醒"]  # 標籤
time_create: 2025-09-11              # 建立日期
modifieTime: 2025-09-11             # 修改日期
aliases: ["別名A"]               # 同義名稱
slug: "xiyin-intro-awaken"       # 友好連結

life_domain: "mind"              # HUMAN 3.0 象限
consciousness_level: "2.0"       # 意識層級
development_phase: "discovery"   # 發展階段
capability_trait: "knowledge"    # 能力特質

publish: true
publish_platforms: ["website","IG","YT"]
publish_date: 2025-08-01
content_theme: "曦引系統開場 × 自我認知"
seo_keywords: ["自我覺醒","系統傾斜"]

owner: "Misty"
review_cycle: "monthly"
last_reviewed: 2025-09-11
---
```


## 系統層級專用模板

### 000 捕獲（靈感）

```yaml
---
type: "content"
subtype: "idea"
system_level: "capture"
status: "draft"
priority: "low"
source: "inspiration"            # 可加：來源型別
created: 2025-09-11
tags: ["捕獲/靈感","狀態/待處理"]   # 自訂
capture_date: 2025-09-11
inspiration_type: "外部觸發"     # 日常發現｜外部觸發｜思考碎片
---
```

### 100 夢想（日誌）

```yaml
---
type: "journal"
subtype: "daily"
system_level: "dream"
status: "doing"
created: 2025-09-11
tags: ["夢想/日誌","時間/日誌"]
log_date: 2025-09-11
mood: "正面"
energy_level: "中"
focus_areas: ["健康","事業","財務"]
achievements: ["今日成果1","今日成果2"]
tomorrow_focus: ["明日重點1","明日重點2"]
---
```

### 200 領域（知識）

```yaml
---
type: "content"
subtype: "knowledge"
system_level: "area"
area_domain: "health"             # 領域細分
life_domain: "mind"
status: "done"
tags: ["系統/領域","系統/領域/健康","類型/知識晶片"]
knowledge_level: "advanced"      # basic｜intermediate｜advanced
related_concepts: ["概念1","概念2"]
---
```

### 300 項目（管理）

```yaml
---
type: "strategy"
subtype: "project-plan"
system_level: "project"
status: "doing"
priority: "high"
tags: ["項目/東黎有限公司","狀態/進行中","優先級/高"]
project_name: "東黎有限公司"
project_phase: "execute"
start_date: 2025-01-01
end_date: 2025-12-31
milestones: ["里程碑1","里程碑2"]
resources_needed: ["資源1","資源2"]
stakeholders: ["相關人員1","相關人員2"]
dependencies: []
---
```

### 400 創作（內容）

```yaml
---
type: "content"
subtype: "article"
system_level: "creation"
status: "doing"
tags: ["創作/文章","狀態/進行中"]
publish: true
publish_platforms: ["website","IG","YT"]
publish_date: 2025-08-01
content_theme: "曦引系統開場 × 自我認知"
target_audience: "操縱者/決策型"
content_goals: ["引導下載Xilog","導入訓練營招募"]
seo_keywords: ["自我覺醒","系統傾斜"]
---
```

### 500 資源（模板）

```yaml
---
type: "template"
subtype: "chip"
system_level: "resource"
status: "done"
tags: ["資源/模板","狀態/完成"]

template_type: "知識晶片"
usage_frequency: "high"
last_used: 2025-09-01
template_fields: ["欄位1","欄位2"]
instructions: "使用說明"
---
```

### 交易策略（MQL5/Pine）

```yaml
---
type: "tool"
subtype: "strategy"
system_level: "area"
area_domain: "finance"           # 領域細分
life_domain: "vocation"
file_format: "mql5"
code_type: "strategy"
status: "done"
tags: ["系統/領域","系統/領域/財務","類型/工具","程式碼/MQL5","主題/交易策略"]

strategy_name: "均線策略"
strategy_type: "trend"
symbol: "XAUUSD"
market: "forex"
timeframe: "H1"
risk_per_trade: 1.0
position_sizing: "fixed_fractional"
entry_rules: "MA50 上穿 MA200"
exit_rules: "MA50 下穿 MA200 或 ATR 止損"
stop_strategy: "ATR(14)*2"
backtest_period: "2020-2025"
profit_factor: 1.52
max_drawdown: 15.2
---
```


## Dataview 查詢範例

```dataview
TABLE system_level, area_domain, life_domain, status, priority
FROM ""
WHERE system_level = "project" AND status = "doing"
AND exists(priority)
SORT priority DESC, file.mtime DESC
```

```dataview
TABLE rows.file.link as "檔案"
FROM ""
WHERE contains(tags, "系統/領域/財務")
SORT file.mtime DESC
```

```dataview
TABLE rows.file.link as "檔案"
FROM ""
WHERE contains(tags, "主題/交易策略")
SORT file.mtime DESC