---
version: 1.0.0
created: 2026-04-29
type: pattern
status: confirmed
description: Vision Analyze 失敗時的替代處理
---

# Pattern: Vision Analyze 失敗時的替代處理

## Trigger
- **When:** vision_analyze 失敗（網路問題、格式不支援、CDN 阻擋等）
- **Type:** SUCCESS
- **Date:** 2026-04-29

## Solution
1. curl 下載圖片至本地
2. python zlib 解析 RGBA 取色
3. 或使用 mcp_firecrawl 的 screenshot 格式截圖分析

## Verification
- [x] 2026-04-29：Discord CDN PNG 成功下載並用 python zlib 解析 RGBA 取色
- [x] 2026-04-29：本地 PNG 成功解析
- [x] 2026-04-29：WebP 格式 fallback 成功

## Status
confirmed
