---
tags:
- task
- ai
- skill
- openviking
- self-improvement
status: in-progress
time_created: 2026-03-23
type: content
folder: area
time_modified: '2026-04-09'
description: ''
parent: []
children: []
related: []
domain: []
---

# 技能進化任務：OpenViking 與 self-improving-agent

## 任務來由

### 背景

在設計公司制度化多Agent架構的過程中，需要建立一套有效的水平分享機制，讓不同層級、不同部門的Agent能夠共享知識、避免重複犯錯，並持續學習與優化。

現有的兩個技能引起了注意：

1. **self-improving-agent**
   - 功能：記錄錯誤、學習、持續優化
   - 現況：單一Agent為主的優化機制
   - 限制：主要是事後記錄，需要手動促進到共享空間

2. **OpenViking**
   - 功能：層次化上下文管理（L0/L1/L2分層載入）
   - 現況：虛擬檔案系統架構，支援跨Agent上下文
   - 特色：自動session結束後提取、更新知識

### 問題點

這兩個技能目前各自運作，但需要整合才能實現：
- 跨Agent的錯誤學習共享
- 層次化的記憶分享機制
- 自動化的知識同步與更新

---

## 任務目標

### 主要目標

1. **整合兩個技能的優勢**
   - 讓 self-improving-agent 的錯誤記錄能透過 OpenViking 層次化分享
   - 讓 OpenViking 的上下文管理納入 self-improving-agent 的學習機制

2. **實現水平分享機制**
   - 建立共享記憶層級（L0/L1/L2）
   - 自動化錯誤知識的同步與傳播
   - 確保不同部門Agent能夠按需獲取相關知識

3. **保持「配置簡易」原則**
   - 不過度複雜化配置
   - 以OpenClaw為基礎平台
   - 讓日常使用門檻降低

### 具體交付物

- [ ] 整合技術方案文件
- [ ] OpenClaw配置範例
- [ ] 測試案例與驗證
- [ ] 使用說明文件

---

## 備註

- 此任務源自「多AGENTS架構研究」計畫
- 屬於公司制度化多Agent架構設計的一部分
- 優先順序：高
