---
parent:
  - K-AI-001-1_MCP基礎概念
type: MOC
folder: 42_MOC
tags:
  - K-AI
  - llm-wiki
  - prompt-system
status: active
time_created: 2026-04-28
time_modified: 2026-04-28
children:
  - K-AI-004-1_prompt-taxonomy
  - K-AI-004-2_identity-block
  - K-AI-004-3_style-block
  - K-AI-004-4_constraints-block
  - K-AI-004-5_scope-block
  - K-AI-004-6_output-block
  - K-AI-004-7_context-block
  - K-AI-004-8_escalation-block
  - K-AI-004-9_meta-block
  - K-AI-004-A_recipe-agents
  - K-AI-004-B_recipe-soul
  - K-AI-004-C_recipe-claude
  - K-AI-004-D_recipe-gemini
  - K-AI-004-E_recipe-chatgpt
  - K-AI-004-F_workflow-commands
  - K-AI-004-G_role-content-editor
  - K-AI-004-H_role-system-architect
  - K-AI-004-I_role-life-architect
  - K-AI-004-J_role-coordinator
  - K-AI-004-K_atomization-protocol
  - K-AI-004-L_canvas-protocol
  - K-AI-004-M_agent-protocol-architecture
  - K-AI-004-N_self-improvement-findings
  - K-AI-004-O_data-safety-protocol
  - K-AI-004-P_human-3-framework
  - K-AI-004-Q_professional-agents
related:
  - K-AI-004-K_atomization-protocol
  - K-AI-004-L_canvas-protocol
  - K-AI-004-M_agent-protocol-architecture
  - K-AI-004-N_self-improvement-findings
  - K-AI-004-O_data-safety-protocol
  - K-AI-004-P_human-3-framework
  - K-AI-004-Q_professional-agents
domain: [prompt-system, llm-wiki]
description: Prompt 系統技能地圖——以區塊組合代替完整模板，實現提示詞的元件化生產。
---

# K-AI-004：Prompt System — 技能地圖

## 定位聲明

本模組是 **Misty / Navi Helios 提示詞系統的元件化工廠**。

核心邏輯：提示詞不是一次性的完整文件，而是**可拆卸、可排列、可組合的區塊**。每種 AI 工具（AGENTS.md、SOUL.md、CLAUDE.md、GEMINI.md、ChatGPT 等）都是同一組區塊的不同配方。

---

## 區塊庫（Blocks）

|| 區塊 ID | 名稱 | 用途 |
||---------|------|------|
|| [[K-AI-004_2_identity-block]] | [identity] | 回答「我是誰」 |
|| [[K-AI-004_3_style-block]] | [style] | 回答「我怎麼說話」 |
|| [[K-AI-004_4_constraints-block]] | [constraints] | 回答「我絕對不做什麼」 |
|| [[K-AI-004_5_scope-block]] | [scope] | 回答「我管的範圍」 |
|| [[K-AI-004_6_output-block]] | [output] | 回答「我的產出長怎樣」 |
|| [[K-AI-004_7_context-block]] | [context] | 回答「我如何理解情境」 |
|| [[K-AI-004_8_escalation-block]] | [escalation] | 回答「我該找誰」 |
|| [[K-AI-004_9_meta-block]] | [meta] | 回答「這份文件的基本資訊」 |

**維度定義：→ [[K-AI-004_1_prompt-taxonomy]]**

---

## 配方對照（Recipes）

|| 文件類型 | 區塊配方 |
||----------|----------|
|| AGENTS.md | `[meta] + [identity] + [scope:多Agent] + [context] + [output:索引] + [escalation]` |
|| SOUL.md | `[meta] + [identity] + [style] + [constraints] + [output:敘事] + [escalation]` |
|| CLAUDE.md | `[meta] + [identity] + [scope:專案] + [context] + [output] + [constraints]` |
|| GEMINI.md | `[meta] + [identity] + [scope:CLI] + [style] + [constraints] + [output]` |
|| ChatGPT | `[meta] + [identity] + [style] + [constraints] + [output:對話]` |

|| 詳細配方 | 說明 |
||----------|------|
|| → [[K-AI-004_A_recipe-agents]] | AGENTS.md 多人 Agent 系統索引 |
|| → [[K-AI-004_B_recipe-soul]] | SOUL.md 單一 AI 靈魂 |
|| → [[K-AI-004_C_recipe-claude]] | CLAUDE.md 專案進入點 |
|| → [[K-AI-004_D_recipe-gemini]] | GEMINI.md CLI 配置 |
|| → [[K-AI-004_E_recipe-chatgpt]] | ChatGPT 自訂指令 |

---

## 角色庫（Roles）

|| 角色 | 職責 | 核心命令 |
||------|------|----------|
|| → [[K-AI-004_J_role-coordinator]] | 協調者：任務分配、跨角色協調 | `//sync` |
|| → [[K-AI-004_G_role-content-editor]] | 內容主編：審計、重構、創作 | `//audit` / `//tweak` / `//media` |
|| → [[K-AI-004_H_role-system-architect]] | 系統架構員：YAML 稽核、階層追溯 | — |
|| → [[K-AI-004_I_role-life-architect]] | 系統平衡者：能量審計、多重身份衝突分析 | — |

**命令完整索引：→ [[K-AI-004_F_workflow-commands]]**

---

## 使用方式

當 Misty 提出需求時：
1. 確認文件類型（屬哪個配方）
2. 調用配方中所有區塊的定義
3. 按配方順序拼接，並注入 Misty 的客製內容
4. 產出完整提示詞

---

## 相關鏈接

- 源頭參考：[[SRC-001_Karpathy-LLM-Wiki]] | [[SRC-002_openclaw-llm-wiki-admin]]
- 蒸餾來源：[[61-管理協議/gemini/]]（H3.0 角色定義、工作流指令集）
- 上層歸屬：[[K-AI-001_1_MCP基礎概念]]
