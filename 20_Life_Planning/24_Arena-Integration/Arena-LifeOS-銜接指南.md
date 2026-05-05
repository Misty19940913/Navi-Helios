---
title: Arena × Life OS 銜接指南
type: guide
status: draft
time_created: '2026-04-14'
time_modified: '2026-04-14'
tags:
  - life-os
  - arena
  - guide
parent: []
children: []
related:
  - "[[../Life-OS-MOC]]"
  - "[[../24_Arena-Integration/Arena-進化追蹤]]"
  - "[[../../30_Projects/32_Active/Arena/Arena_MOC_new]]"
---

# Arena × Life OS 銜接指南

> Arena 是 Life OS 的人生教練插件
> 此指南說明 Arena 與 Life OS 如何銜接

---

## 一、系統定位

```
Life OS = 通用的人生執行嫁接層
Arena = Life OS 的人生教練插件
```

Arena 不是 Life OS 的核心，而是透過標準介面銜接的可選插件。

---

## 二、雙層架構

### Arena 的雙層價值

| 層 | 誰的視角 | 頻率 | 價值 |
|---|---------|------|------|
| 資料庫 | AI（教練）的大腦 | 框架不變，內容持續更新 | AI 理解如何讓使用者進化的分析引擎 |
| 報告/計劃/清單 | 使用者的使用記錄 | 每次訪談/每季產生 | AI 的歷史資料，讓 AI 每次都比上一次更了解使用者 |

### 兩層的關係

```
Arena 資料庫（第一層）
└─ AI 用這個來理解「如何讓使用者進化」

Arena 報告/計劃/清單（第二層）
└─ AI 用這個來更新使用者模型
└─ 這些資料同時寫入 Life OS
```

---

## 三、數據流向

```
Life OS（執行）
└── Goal/Project/Task 執行記錄
        ↓（每次覆盤/訪談）
Arena 第二層（報告/計劃/清單）← AI 用這個更新使用者模型
        ↓（分析）
Arena 第一層（資料庫）← AI 理解如何讓使用者進化
        ↓（指導）
下一輪 Life OS 執行 → ...
```

---

## 四、具體銜接方式

### Arena Stage 1 → Life OS

| Arena 產出 | Life OS 接收位置 | 說明 |
|-----------|-------------|------|
| HUMAN 3.0 進化報告 | Area 分數 | 四維度分數寫入 Area MOC |
| 30 天行動計劃 | Goal / Project / Task | Arena Stage 1 催生 Life OS Goal |

### Arena Stage 2 → Life OS

| Arena 產出 | Life OS 接收位置 | 說明 |
|-----------|-------------|------|
| 技能探索結果 | Skill Graph | Arena 技能圖譜可選寫入 |

### Arena Stage 3 → Life OS

| Arena 產出 | Life OS 接收位置 | 說明 |
|-----------|-------------|------|
| 季度計劃 | Project 里程碑 | Arena Stage 3 催生 Life OS Project |

### Arena Stage 4 → Life OS

| Arena 產出 | Life OS 接收位置 | 說明 |
|-----------|-------------|------|
| PDCA 迭代記錄 | TaskNotes | Arena Stage 4 的執行追蹤寫入 Life OS Task |

---

## 五、進化追蹤卡片流程

每次 Arena 訪談後：

```
1. Arena 訪談完成
2. 產生 Arena 進化追蹤卡片
   → 存放於：20_Life_Planning/24_Arena-Integration/
3. Arena 進化卡片寫入：
   → Area MOC（Arena 進化追蹤章節）
   → Goal MOC（Arena 進化追蹤章節）
   → Project MOC（Arena 進化追蹤章節）
4. Arena 進化追蹤 MOC 更新卡片列表
```

---

## 六、相關檔案索引

| 檔案 | 路徑 | 說明 |
|------|------|------|
| Arena-進化追蹤 | `20_Life_Planning/24_Arena-Integration/Arena-進化追蹤.md` | Arena 進化 MOC |
| Arena-進化追蹤卡片模板 | `20_Life_Planning/24_Arena-Integration/Arena-進化追蹤卡片模板.md` | 卡片模板 |
| Life OS MOC | `20_Life_Planning/Life-OS-MOC.md` | Life OS 總入口 |
| Area MOC | `20_Life_Planning/22_Area/Area_MOC.md` | Area 含 Arena 銜接 |
| Goal MOC | `20_Life_Planning/23_Goal/Goal_MOC.md` | Goal 含 Arena 銜接 |
| Project MOC | `30_Projects/Project_MOC.md` | Project 含 Arena 銜接 |
| Arena MOC | `30_Projects/32_Active/Arena/Arena_MOC_new.md` | Arena 總入口 |

---

*指南建立者：Larvis*
*日期：2026-04-14*
*版本：v1.0*
