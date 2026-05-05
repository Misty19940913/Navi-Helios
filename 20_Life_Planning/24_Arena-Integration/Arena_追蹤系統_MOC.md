---
title: Arena 追蹤系統 MOC
type: MOC
status: draft
time_created: 2026-04-20
time_modified: 2026-04-20
tags:
  - life-os
  - arena
  - arena/tracking
parent:
  - "[[../Life-OS-MOC]]"
children: []
related:
  - "[[../Arena-進化追蹤]]"
  - "[[../../30_Projects/32_Active/Arena/Arena_MOC_new]]"
---

# Arena 追蹤系統 MOC

> **功能定位：** 控制塔——不是新建系統，而是串聯現有元件的說明書與介面定義。
> **核心原則：** 不改變現有元件。所有元件維持原狀，僅定義介面與數據流向。

---

## 系統定位

Arena 追蹤系統是 **Arena 進化框架**與 **Life OS** 的串聯層，肩負以下職責：

- 作為兩大系統的膠水層，定義彼此如何通訊
- 確保數據從日常作業單向流動至進化記錄
- 提供介面規格，讓各元件保持獨立而不需修改

---

## 現有元件索引

| 元件 | 路徑 | 角色 |
|------|------|------|
| Arena 進化記錄總覽 | `20_Life_Planning/24_Arena-Integration/Arena-進化追蹤.md` | 卡片列表存放點（每次訪談後更新） |
| 追蹤卡片模板 | `20_Life_Planning/24_Arena-Integration/Arena-進化追蹤卡片模板.md` | 每次訪談填入一張 |
| OS-每日檢查 | `21_Journsal/OS-每日檢查.md` | 每日輸入端 |
| OS-每週覆盤 | `21_Journsal/OS-每週覆盤.md` | 每週聚合端 |
| Arena MOC（子專案） | `30_Projects/32_Active/Arena/Arena_MOC_new` | Arena 框架本體 |

---

## 數據流動定義（三層）

### 第一層：每日 → Life OS 輸入

```
OS-每日檢查.md
  ├── 能量校準（情緒/體力/專注力）
  ├── MIT（每日三項重點）
  └── 象限覺察（時間矩陣位置）
  ↓
流向 21_Journsal/（日誌沉澱）
```

**負責模板：** `OS-每日檢查.md`
**介面責任：** 能量、MIT、象限，純日誌顆粒度，不跨天保留

---

### 第二層：每週 → Arena 進化

```
OS-每週覆盤.md
  ├── Arena 進化章節（填寫四維度自評）
  ├── 障礙追蹤（卡點記錄）
  └── 行動計劃執行（複盤）
  ↓
流向 Arena-進化追蹤卡片（每30天/訪談後填入）
```

**負責模板：** `OS-每週覆盤.md`
**介面責任：** 進化比較、障礙追蹤、計劃執行，每週產生一次比對基準

---

### 第三層：訪談後 → Arena MOC 更新

```
Arena-進化追蹤卡片（填入模板）
  ↓
更新 Arena-進化追蹤.md（卡片列表）
  ↓
流向 Arena MOC（趨勢視覺化）
```

**負責模板：** `Arena-進化追蹤卡片模板.md`
**介面責任：** 四維度快照、進化/退化判斷、行動建議寫入 Life OS

---

## 介面責任定義

| 元件 | 負責範圍 | 輸出 |
|------|---------|------|
| `OS-每日檢查.md` | 能量校準、MIT、象限覺察 | 日誌檔 → 21_Journsal/ |
| `OS-每週覆盤.md` | 進化比較、障礙追蹤、Arena行動計劃執行 | 每週覆盤檔 |
| `Arena-進化追蹤卡片` | 四維度快照、進化/退化判斷、行動建議 | 卡片檔 → Arena-進化追蹤.md |
| `主頁.components` | 讀取進化記錄，顯示趨勢面板 | 趨勢視覺化（待實作） |

---

## 進化記錄卡片命名規則

```
Arena-進化卡片_YYYYMMDD.md
```

- **YYYYMMDD** = 訪談日期
- 範例：`Arena-進化卡片_20260420.md`
- 存放於：`20_Life_Planning/24_Arena-Integration/`

---

## 與 Life OS MOC 的關係

```
Life-OS-MOC.md
  └── Arena 追蹤系統 MOC（子系統）
        ├── 每日數據源（OS-每日檢查.md）
        ├── 每週聚合（OS-每週覆盤.md）
        └── 進化記錄（ Arena-進化追蹤.md / Arena-進化卡片_* ）
```

Arena 追蹤系統 MOC 為 `Life-OS-MOC.md` 的子系統，不替代任何現有流程。

---

## 第一輪實驗目標（Day 1–14）

**實驗性質：** 驗證性（Proof of Concept）

### 目標

驗證數據是否能從「每日 → 每週 → 進化卡片」完整流動。

### 產出

- **追蹤實驗日誌：** `Arena_追蹤實驗日誌.md`
  - 記錄每日流動狀態、斷點、觀察
  - 位於：`20_Life_Planning/24_Arena-Integration/Arena_追蹤實驗日誌.md`

### 判斷標準

連續完成以下条件后，评估能否產出有意義的進化比較：

1. 連續 7 天完成 `OS-每日檢查.md`
2. 完成 1 次 `OS-每週覆盤.md`
3. 產生至少 1 張 `Arena-進化卡片_YYYYMMDD.md`
4. `Arena-進化追蹤.md` 卡片列表有更新

若滿足以上條件，檢視卡片內容是否能支撐四維度進化判斷；若否，記錄斷點並提出介面調整建議。

---

## 模板與文件參考

- [[../Arena-進化追蹤]] — 卡片列表總覽
- [[../Arena-進化追蹤卡片模板]] — 卡片格式定義
- [[../../30_Projects/32_Active/Arena/Arena_MOC_new]] — Arena 框架本體
- [[../Life-OS-MOC]] — 父系統