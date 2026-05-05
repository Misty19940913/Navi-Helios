---
type: journal
folder: journal
status: active
priority: medium
tags:
  - life-os
  - life-os/daily
time_created: '2026-04-27'
time_modified: '2026-04-27'
description: ''
parent: []
children: []
related: []
---
#  早晨啟動

## 能量校準
- [ ] 今日能量狀態：🟢 充沛 / 🟡 平穩 / 🔴 下滑 / ⚫ 低沉
- [ ] 聚焦程度（1-10）：_
- [ ] 主要干擾因素：_

## 今日意圖
- [ ] 今日最重要的一件事（MIT）：_
- [ ] 為什麼今天一定要完成這件事？_

## HUMAN 3.0 象限檢查
今日最需要關注的象限：
- [ ] Mind 心智 — 學習、思考、創造
- [ ] Body 身體 — 健康、能量、休息
- [ ] Spirit 精神 — 關係、情感、意義
- [ ] Vocation 價值 — 職業、財務、目標

---

# 📋 代辦事項

![[添加任務按鈕.components]]

### 今日任務

```dataview
TABLE WITHOUT ID
  file.link AS 任務,
  status AS 狀態,
  priority AS 優先級,
  projectId AS 所屬專案
FROM "20_Life_Planning/Task"
WHERE time_start = date(today) AND status != "done"
SORT status ASC, priority ASC
```

### 已完成

```dataview
TABLE WITHOUT ID
  file.link AS 任務,
  time_done AS 完成時間
FROM "20_Life_Planning/Task"
WHERE time_start = date(today) AND status = "done"
SORT time_done DESC
```

---

# ⏱️ 柳比歇夫時間日誌

> **核心原則**：事件完成後立即記錄，不依賴記憶。

### 格式：時間區間 | [象限] 事件描述 | 時長

```
09:00 - 09:30 | [心智] 閱讀學習 | 30min
09:30 - 12:00 | [價值] 內容創作 | 150min
12:00 - 13:00 | [身體] 午餐與休息 | 60min
```

### 象限分類
- **心智 Mind**：學習、思考、創作、會議
- **身體 Body**：運動、工作、休息、飲食
- **精神 Spirit**：社交、家庭、伴侶
- **價值 Vocation**：工作、賺錢、副業、項目

### 能量標記（每區塊後標記）
| 狀態 | 說明 |
|------|------|
| 🟢 充沛 | 高效、專注、充滿能量 |
| 🟡 平穩 | 正常運作、無特別起伏 |
| 🔴 下滑 | 開始疲憊、難以專注 |
| ⚫ 低沉 | 耗竭、需要休息或切換 |

### 範例
```
09:00 - 11:30 | [心智] 閱讀學習 | 150min 🟢
11:30 - 12:00 | [精神] 處理訊息 | 30min 🟡
14:00 - 16:00 | [價值] 客戶會議 | 120min 🟡
16:00 - 16:30 | [價值] 事務性工作 | 30min 🔴
```

### 每日結算
- **總計**：____ 分鐘
- **心智**：____ min
- **身體**：____ min
- **精神**：____ min
- **價值**：____ min

### 本日觀察
- 能量最高時段：________
- 能量最低時段：________
- 需要調整的事件：________

---

# 🌙 晚間覆盤

## MIT 完成結算
- [ ] MIT 完成與否：✅ / ❌
- [ ] 實際完成的事情：
- [ ] 未完成的事情及原因：

## 能量與情緒
- [ ] 今日結束時能量狀態：🟢 / 🟡 / 🔴 / ⚫
- [ ] 情緒曲線：高點___ / 低點___
- [ ] 學到的功課：

## 明日預先設定
- [ ] 明日 MIT：_
- [ ] 明日能量預期：🟢 / 🟡 / 🔴 / ⚫
- [ ] 明日最需要關注的象限：Mind / Body / Spirit / Vocation

---

# 🧠 深度覺察（可選）

> 當你有觸發情緒的事件時使用。@@每日快速覺察，並在需要時進行深度的認知重構或內在探索。@@

## Part 1: 快速覺察
- **觸發情境**：(客觀描述：時間、地點、人、事、物)
- **情緒與身體反應**：
  - **主要情緒**：(快樂、悲傷、焦慮、憤怒等)
  - **情緒強度 (1-10)**：
  - **身體感受**：(胸口發緊、胃部攪動、肩膀僵硬等)
- **自動化思考**：(腦中閃過的第一個念頭是什麼？)

## Part 2: 進階分析（Optional）
模組 A：認知行為重構 (ABCDE)

#### D. 想法辯論與挑戰
- **證據檢視**：支持或反駁這個想法的證據分別是什麼？
- **合理性分析**：這個想法 100% 合理、客觀嗎？有沒有其他可能的解釋？
- **換位思考**：如果朋友遇到同樣的情況，我會怎麼建議他？

#### E. 建立有效新信念
- **新觀點**：可以用什麼更積極、平衡、或慈悲的想法來替換它？

模組 B：內在冰山探索

#### 4. 期待層
- 我對自己、他人或這個情境，有什麼未被滿足的期待？

#### 5. 渴望層
- 在這些期待的背後，我真正渴望的是什麼？(被愛、被尊重、安全感、歸屬感、自由)

#### 6. 自我層
- 這個事件如何觸動了我的核心自我認同？我如何看待我自己？

---

# 📊 日誌總結

1. 今日最有價值的行動是什麼？
2. 明日需要調整的策略？
3. 對自己的肯定與鼓勵？
4. **本次練習最大的新發現是什麼？**

---

# 📚 筆記追蹤

### 新建筆記
@@今日所創建的新筆記@@

```dataview
TABLE status, priority, time_created
FROM ""
WHERE date(time_created) = date(this.time_created)
SORT time_modified DESC
```

### 更新筆記
@@今日所更新的筆記(包含從舊筆記蛻變新筆記)@@

```dataview
TABLE status, priority, time_modified
FROM ""
WHERE date(time_modified) = date(this.time_modified)
SORT time_modified DESC
```

---

*模板：Daily.md | Life OS 統一日記 | 整合 OS-每日檢查 + Daily*
