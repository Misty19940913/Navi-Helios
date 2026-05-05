---
type: content
status: draft
tags:
  - 財務
  - 標準普爾
  - 六罐子
  - 理財
time_created: 2026-04-10
time_modified: 2026-04-17
description: 標準普爾四象限與六罐子理財系統的雙層映射模型與計算公式
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# S&P 四象限與六罐子整合

> [!abstract] 核心洞見 (Insight)
> 標準普爾四象限（10%/20%/30%/40%）提供資產配置的顶层框架，六罐子提供收入分配的執行路徑，兩者透過映射矩陣實現整合。

### 定義與機制 (What & How)
- **核心定義**：標準普爾四象限是資產配置的顶层框架，六罐子是收入分配的執行系統，透過映射矩陣實現雙層整合。
- **運作機制**：
  - 標準普爾：SP_spend(10%)、SP_protect(20%)、SP_grow(30%)、SP_preserve(40%)
  - 六罐子：必須生活、自由運用、長期儲蓄、退休投資、學習成長、夢想實踐
  - 整合公式：SUMPRODUCT(六罐金額, 映射權重)

### 實踐與案例 (Action & Proof)
- **真實案例**：長期儲蓄罐 → SP_protect（保護緊急預備金）；退休投資罐 → SP_grow（成長累積）；夢想實踐罐 → SP_preserve（長期目標）。
- **行動指南**：在 Excel 中建立映射矩陣，用 SUMPRODUCT 自動將六罐子金額分配至 S&P 象限，確保總和為 100%。

### 知識網絡 (Connection)
- **關聯脈絡**：
  - K-FIN-003-2：報酬計算方法
  - K-FIN-003-3：自動化財務系統
  - [[標準普爾四象限]]：資產配置框架
  - [[六罐子理財系統]]：收入分配系統
  - [[FIRE財務目標]]：FIRE 整合


## 關聯知識 (Related)

- [[K-FIN-003-2]]
- [[K-FIN-003-3]]

---

## 應用紀錄

### Input Notes
| Plan | Phase | Purpose |
|------|-------|----------|
| 財務系統建置 | Planning | 建立映射矩陣 |

### Output Notes
| Note | Type | Created In |
|------|------|------------|