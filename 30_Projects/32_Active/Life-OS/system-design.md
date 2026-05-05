---
title: Life OS 系統設計規格
type: spec
status: draft
folder: 32_Active/Life-OS
time_created: '2026-05-04'
time_modified: '2026-05-04'
tags:
  - Life-OS
  - 系統設計
  - v4.1
maintainer: Antigravity (AI)
version: v0.1
---

# Life OS 系統設計規格

> **維護者**：Antigravity（AI）
> **版本**：v0.2（已確認 D1-D5）
> **狀態**：🟡 研究完成，等待確認是否進入新 Vault 實作階段
> **定位**：Life OS v4.1 系統工程的核心規格文件——目標/任務/日誌三大底層系統的整合設計。

---

## 一、系統頂層架構

### 1.1 三系統一體

Life OS 是一個 vault、三個子系統，共享同一套 KCE 空間框架：

```
┌─────────────────────────────────────────────────────┐
│                    Vision（願景）                      │
│              橫跨 Knowledge / Calendar / Efforts       │
└─────────────────────────────────────────────────────┘
                        ↓ 催生
┌──────────────────────────────────────────────────────┐
│                    目標系統 Goal                        │
│                   （戰略規劃層）                        │
└──────────────────────────────────────────────────────┘
                        ↓ 催生
┌──────────────────────────────────────────────────────┐
│                    執行系統                            │
│              Efforts × Task（執行層）                  │
└──────────────────────────────────────────────────────┘
                        ↓ 記錄
┌──────────────────────────────────────────────────────┐
│                    日誌系統 Log                         │
│              Calendar（日/週/月/年）                    │
└──────────────────────────────────────────────────────┘
```

### 1.2 執行鏈（新版）

```
Vision（願景）
   ↓ 橫跨三空間（Knowledge/Calendar/Efforts）
Goal（戰略目標）  ← 跨 Area，催生 Efforts
   ↓ 催生
Effort（努力方向）  ← 在 Efforts 空間內運作，承載 Task
   ↓ 催生
Task（任務）  ← 最小執行單位
   ↓ 沉澱至
Log（日誌）  ← Calendar 空間，時間戳記與覆盤
```

### 1.3 Vision → Goal 轉化界面

Vision（願景）催生 Goal（目標）的具體轉化機制：

**轉化路徑**：

```
Vision（使命宣言）
  └─ 核心理念與終極方向，橫跨三空間，無到期日
      └─ 年度主題（Annual Theme）
          └─ 年度 Goal（Year Goal）
              └─ 季度 Goal（Quarter Goal）← 主要操作層
                  └─ 月度 Goal（Month Goal）
```

**轉化界面規則**：
- 每個 Vision 只催生一個年度 Goal（Year Goal）
- 年度 Goal 在每年 Q1 規劃，由 Vision 向下分解
- 季度 Goal（Quarter Goal）是主要操作單位，位於 `23_Goal/` 資料夾
- Vision → Goal 的轉化依據：北極星宣言中的「終極方向」→ 轉化為「一年內可達成的階段性里程碑」

**現有 Vision 頁面**：`20_Life_Planning/00_北極星/個人覺醒使命宣言.md`

**改造方向**：
- frontmatter 新增 `type: vision`，`kce-space: cross`（橫跨三空間）

### 1.4 與 KCE 空間的對應關係

| 空間 | 容納 |
|:---|:---|:---|
| **Knowledge** | 知識沉澱 | Vision 陳述與 Goal 概念的沉澱處；Area MOC；領域知識庫；MOC 導航 |
| **Calendar** | 時間日誌 | Daily Log；Weekly Review；Periodic Notes；所有有時間屬性的記錄 |
| **Efforts** | 行動執行 | Effort 頁面（強度追蹤）；Task 列表；Project 執行記錄 |

---

## 二、目標系統（Goal System）

### 2.1 定位

目標系統是 Life OS 的**戰略層**——回答「我要往哪裡走」。

### 2.2 層次結構

```
Vision（願景）
  └─ 核心理念與終極方向，橫跨三空間，無到期日
      └─ 年度主題（Annual Theme）
          └─ 年度 Goal（Year Goal）
              └─ 季度 Goal（Quarter Goal）← 主要操作層
                  └─ 月度 Goal（Month Goal）
```


### 2.4 Goal 頁面（目標）

**現有**：`20_Life_Planning/23_Goal/Goal_MOC.md`

**改造方向**：
- 狀態定義保留：planning / active / completed / on-hold / cancelled
- 新增 `type: goal`（目標文件類型）；移除 `kce-space` 標記（Goal 為跨空間元素，不隸屬單一 KCE 空間）
- 季度 Goal 是主要操作單位（Q1/Q2/Q3/Q4）

### 2.5 Area（責任領域）

**現有**：`20_Life_Planning/22_Area/` 五宮格

**改造方向**：
- Area 是「責任範圍」而非專案，沒有終點
- Area → 可催生 Goal（如：Area 身心健康 → Goal 減重 5kg）
- 五宮格：職業發展 / 財務自由 / 身心健康 / 關係家庭 / 自我成長

### 2.6 與 Goal 現有檔案的銜接

|| 檔案 | 動作 |
|:---|:---|:---|
| `00_北極星/個人覺醒使命宣言.md` | 改造成 Vision 頁 | 新增 frontmatter |
| `22_Area/Area_MOC.md` | 確認 MOC 結構 | 對齊 spec |
| `23_Goal/Goal_MOC.md` | 更新狀態定義 + 新增 KCE 空間標註 | 改寫 |
| `23_Goal/2026-Q2-季度目標.md` | 確認內容與新版 Goal 定義的相容性 | 檢視 |

---

## 三、任務系統（Task System）

### 3.1 定位

任務系統是 Life OS 的**執行層**——回答「我要做什麼」。

### 3.2 Task 與 Effort 的區別

| 概念 | 說明 |
|:---|:---|:---|
| **Task** | 任務 | 最小執行單位，可交付、可勾選 |
| **Effort** | 努力方向 | Task 的容器，描述 Task 隸屬的「努力方向」 |

```
Example：
Effort「Hermes Agent 技能系統」→ 催生 Task：
  - Task：撰寫 obsidian-plugin-dev SPEC.md
  - Task：蒸餾 5 個現有 plugin 研究結果
  - Task：建立 skills 目錄 MOC
```

### 3.3 Task 屬性（YAML frontmatter）

```yaml
---
title: 任務名稱
type: task
status: pending          # pending | in-progress | completed | cancelled
effort:                  # 連結至 parent Effort
  - Effort 名稱
area: 身心               # 對應 Area 五宮格
goal: Q2-01              # 對應 parent Goal（可選）
effort-intensity: 🔥On   # 🔥On | ♻️Ongoing | 〰️Simmering | 💤Sleeping
created: 2026-05-04
due: 2026-05-10          # 截止日（可選）
tags:
  - life-os/task
---
```

### 3.4 Effort 強度（Intensity）

| 強度 | 心理意涵 | 操作原則 |
|:---|:---|:---|---|
| 🔥`On` | 最優先，必須本週突破 | 置頂，daily review 必看 |
| ♻️`Ongoing` | 持續運作，本週不求突破 | 常駐，閒暇時推進 |
| 〰️`Simmering` | 背景醞釀，隨時可暫停 | 低關注，季度檢視 |
| 💤`Sleeping` | 冷封存，完成或長期擱置 | 歸檔，不出現在日常視圖 |

### 3.5 與 Task 現有檔案的銜接

| 檔案 | 動作 |
|:---|:---|:---|
| `20_Life_Planning/Task/` 資料夾 | 確認所有 Task 頁面合規 | 需逐一改造 YAML |
| `Task/1111-1777274699178.md` | 測試檔案，評估刪除或正規化 | 待處理 |

---

## 四、日誌系統（Log System）

### 4.1 定位

日誌系統是 Life OS 的**沉澱層**——回答「我做了什麼、學到了什麼」。

### 4.2 與 KCE Calendar 空間的對應

所有日誌均歸檔在 `Calendar` 空間：

```
Calendar（日曆空間）
├── Daily Log（日記）
│   ├── Daily Note（每日流水）
│   └── Daily Review（每日覆盤，可內含於 Daily Note）
├── Weekly Review（每週覆盤）
│   ├── 本週執行記錄
│   ├── Effort 強度重分配
│   └── 下週規劃
├── Monthly Review（月度覆盤）
└── Annual Review（年度覆盤）
    └── Annual Theme（年度主題）
```

### 4.3 與 Journal 現有檔案的銜接

| 檔案 | 動作 |
|:---|:---|:---|
| `20_Life_Planning/21_Journsal/` | 重新命名為 `21_Calendar/` | 需移動大量檔案 |
| `21_Journsal/2026-04-*.md` | 更新至新的 Daily Note 格式 | 需批量改造 |
| `80-System/81-Template/Daily.md` | 確認是否合規，不合規則重寫 | 需檢視 |
| `80-System/81-Template/TPL-雙環每週覆盤.md` | 對齊 Weekly Review spec | 需檢視 |

### 4.4 Daily Note 規格（初版）

```yaml
---
title: "2026-05-04"
type: daily-note
date: 2026-05-04
day: Monday
week: 2026-W19
effort-summary: 🔥On × 2 | ♻️Ongoing × 3 | 〰️Simmering × 1
mood:             # 可選：😊 😐 😫 😡
energy:           # 可選：high / medium / low
---

# 2026-05-04（Monday）

## 🌅 早晨啟動
- [ ] 確認今日 1-3 個 MIT（Most Important Tasks）
- [ ] 能量確認：energy

## ✅ 今日執行

### 🔥 On（今日最高優先）
- [ ] Task：...

### ♻️ Ongoing（持續推進）
- [ ] Task：...

## 📝 記錄與沉澱
- 今日發現：
- 障礙/干擾：
- 明日改進：

## 🌙 晚間覆盤
- 完成的事情：
- 未完成的事情：
- 能量/心情回顧：
```

---

## 五、系統串聯圖（完整視角）

```
┌──────────────────────────────────────────────────────────────┐
│  Knowledge 空間                  Calendar 空間    Efforts 空間│
│                                                             │
│                  北極星（Vision）  Daily Note      Effort     │
│  Area_MOC    ←── 五宮格         Weekly Review    Task       │
│  Goal_MOC    ←── 季度目標       Monthly Review   Project    │
│  Library     ←── 000-900        Annual Review                 │
│                                                             │
│  ←── 催生 ──→                    ←── 沉澱 ──→               │
└──────────────────────────────────────────────────────────────┘
                            ↑
                    ┌─────────────────┐
                    │  HQ Center（MOC）│  ← 處理中心入口
                    └─────────────────┘
```

---

## 六、已確認決策（D1-D5）

### ✅ D1：Journal → Calendar 資料夾改名

- **決策**：直接改名 `21_Journsal/` → `21_Calendar/`
- **說明**：新建 vault 後直接採用正確命名，Navi Helios 現 vault 不變
- **影響**：Dataview query 路徑、vault 設定均需同步更新

### ✅ D2：Effort 強度量化標準

- **🔥`On`**：本週有實質推進（7天內有 action），最高優先
- **♻️`Ongoing`**：持續運作但本週無實質突破
- **〰️`Simmering`**：7天未動，自動降級至背景觀察
- **💤`Sleeping`**：冷封存，完成或長期擱置

> **降級觸發條件**：任一 Effort 連續 7 天無新增 Task 或無状态更新，系統提示降級。

### ✅ D3：Task 儲存方式

- **選項 A：獨立頁面（每 Task 一個 .md）**
- Daily Note 的 checklist 是「視圖引用」，source of truth 在各 Task 頁面
- Task 頁面具備完整 frontmatter + 執行記錄

### ✅ D4：Goal KCE 空間標註

- **不同意**：不在 Goal frontmatter 加入 `kce-space` 標註
- Goal 的 KCE 空間隱含由位置決定（Goal_MOC 在 Knowledge 空間）

### ✅ D5：Vision 定位

- `00_北極星/個人覺醒使命宣言.md` 即為 **Vision（願景）**
- Vision 不催生 Task，直接催生 Goal

---

## 七、研究定位與文件角色

> ⚠️ **重要**：本規格為**研究產物**，非立即實作計畫。

> **Life OS 計畫定位**：研究新框架 → 完成後才依研究結果創建新 Vault。
> **Navi Helios 角色**：研究素材（`22_Area`、`30_Projects` 等既有結構是「過去的殘留」，用完即棄）。
> **當前任務**：完成框架研究，確認 `task_plan.md` 與 `system-design.md` 的共識描述。

||| 檔案 | 角色 |
|:---|:---|
| `task_plan.md` | 建構藍圖（宏觀研究計畫）|
| `system-design.md` | 設計規格（微觀系統設計）|
| Navi Helios | 素材參考，非遷移目標 |

---



|| 章節 | 狀態 | 備註 |
|:---|:---|:---|:---|
| Ch1 系統頂層架構 | ✅ 確認 | D1-D5 已固化 |
| Ch2 目標系統 | ✅ 確認 | D4, D5 已固化 |
| Ch3 任務系統 | ✅ 確認 | D2, D3 已固化 |
| Ch4 日誌系統 | ✅ 確認 | D1 已固化 |
| Ch5 系統串聯圖 | ✅ 確認 | - |
| Ch6 已確認決策 | ✅ 完成 | D1-D5 全部確認 |
| Ch7 研究定位與文件角色 | ✅ 完成 | 確認 vault 策略共識 |

---

*維護者：Antigravity*
*版本：v0.2*
*最後更新：2026-05-04*
