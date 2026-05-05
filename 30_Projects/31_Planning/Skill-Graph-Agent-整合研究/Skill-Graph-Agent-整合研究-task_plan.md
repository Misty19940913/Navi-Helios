---
tags:
- 系統/研究
- Skill-Graph
- AI-代理
type: plan
status: PLANNING
time_created: 2026-04-04
time_modified: 2026-04-04
domain:
- 系統優化
progress: 0
summary: 研究如何將 Skill Graph 應用於多 Agent 協作
folder: resource
description: ''
parent: []
children: []
related: []
---

# Skill Graph Agent 整合研究

## Project Overview

建立 Skill Graph 系統，讓 7 個部門的組長（Profile Agent）在創建 sub-agent 時能快速查詢標準化的執行指引。

## Problem Statement

組長在創建 sub-agent 時，無法快速確認：
- 該用什麼 prompt template
- 該開放什麼 tools
- 該安裝什麼 skills
- 該如何驗收交付物

## Goals

1. 建立 Skill Graph 節點格式定義
2. 研究與現有系統整合方式
3. 規劃第一個部門的 Skill Graph 節點

## Scope of Work

### Phase 1: 現有 Skill Graph 研究
- [ ] 研究 Agency 文件中的 Profile System
- [ ] 研究 OpenClaw sessions_spawn 機制
- [ ] 研究現有 Skill Graph 工具（skill-graph.com）

### Phase 2: Skill Graph 節點設計
- [ ] 定義 Task Type 節點結構
- [ ] 定義 Prompt Template 格式
- [ ] 定義 Tools / Skills 對應關係
- [ ] 定義 Verification 檢查清單
- [ ] 定義 Deliverables 交付格式

### Phase 3: 與現有系統整合
- [ ] 與 Knowledge Graph 的關係
- [ ] 與 self-master 的關係
- [ ] 與 OpenViking 的關係

### Phase 4: 實作規劃
- [ ] 選擇儲存位置
- [ ] 定義 API 或查詢方式
- [ ] 規劃第一個部門的 Skill Graph 節點

## Major Milestones

| 里程碑 | 內容 | 預期交付 |
|---------|------|----------|
| M1 | 研究完成 | 研究報告 |
| M2 | 節點格式定義 | Skill Graph 節點模板 |
| M3 | 系統整合評估 | 整合建議書 |
| M4 | 第一個部門節點 | 可運作的 Skill Graph 節點 |

## Risks and Mitigation

| 風險 | 緩解方式 |
|------|----------|
| 複雜度過高 | 先做一個部門做驗證 |
| 與現有系統衝突 | 定義清楚邊界 |

## Executive Summary

本計畫旨在建立 Skill Graph 系統，為多 Agent 協作提供標準化的 sub-agent 創建指引。

## Related Documents

- [Knowledge-Graph-管理框架](../60-AI-Protocols/61-管理協議/AI-Config/Knowledge-Graph-管理框架.md)
- [Agency README](../60-AI-Protocols/61-管理協議/Agent/skills/agency-agents-main/agency-agents-main/README.md)

---

## Progress

| 日期 | 階段 | 進度 |
|------|------|------|
| 2026-04-04 | 初始化 | 0% |
