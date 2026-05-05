---
version: 0.1.0
type: moc
folder: 42_MOC
status: ready
tags:
- 嗜好
- 興趣
- MOC
time_created: 2026-04-16
time_modified: 2026-04-16
description: 嗜好與興趣相關原子筆記樞紐
parent: null
children: []
related: []
---

# K-HOBBY 嗜好與興趣 MOC

嗜好與興趣相關原子化筆記的樞紐。

## 筆記清單

| 筆記 | 標題 | 核心概念 |
|------|------|----------|
| [[K-HOBBY-001_1_硬體與物種需求]] | 硬體與物種需求 | 設備選購 |
| [[K-HOBBY-001_2_底床設計與沸石問題]] | 底床設計與沸石問題 | 環境設計 |
| [[K-HOBBY-001_3_流速分區設計]] | 流速分區設計 | 水流管理 |
| [[K-HOBBY-001_4_物種衝突與解決]] | 物種衝突與解決 | 混養知識 |
| [[K-HOBBY-002_1_三物種概述與水質需求]] | 三物種概述與水質需求 | 物種知識 |
| [[K-HOBBY-002_2_水下與水上植物配置]] | 水下與水上植物配置 | 植栽設計 |
| [[K-HOBBY-002_3_混養可行性分析]] | 混養可行性分析 | 可行性評估 |
| [[K-HOBBY-002_4_推薦方案]] | 推薦方案 | 方案建議 |

## 框架關聯

```mermaid
flowchart LR
    Hardware["硬體設備"] --> Environment["環境設計"]
    Environment --> Species["物種管理"]
    Species --> Plants["植栽配置"]
    Plants --> Mix["混養設計"]
```

## 使用建議

- 設備選購：參考 K-HOBBY-001-1
- 環境設置：參考 K-HOBBY-001-2/3
- 物種知識：參考 K-HOBBY-002 系列

---

## Metadata

| Field | Value |
|-------|-------|
| Version | 0.1.0 |
| Last Updated | 2026-04-16 |
| Total Notes | 8 |