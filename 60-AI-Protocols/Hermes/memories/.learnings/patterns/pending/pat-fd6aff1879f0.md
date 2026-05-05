# Pattern: pat-fd6aff1879f0
**Tool:** mcp_firecrawl_firecrawl_scrape  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-02T17:40:51.236358+00:00  
**Last seen:** 2026-05-02T17:40:51.236358+00:00

## Summary
API error in mcp_firecrawl_firecrawl_scrape: {"result": "{\n  \"markdown\": \"🔥 本期视频详细演示了Hermes Agent的两大高级功能： **个人微信原生集成** 和 **LLM Wiki知识库构建**。\\n\\n📱 首先演示了Hermes Ag

## Error hashes
- 8579241d9618771a

## Last error
```
Error Type: api_error
Tool Args: {'url': 'https://www.aivi.fyi/llms/hermes-wiki#%E5%89%8D%E7%BD%AE%E6%9D%A1%E4%BB%B6', 'formats': ['markdown'], 'onlyMainContent': True}

--- Error Output (last 30 lines) ---
{"result": "{\n  \"markdown\": \"🔥 本期视频详细演示了Hermes Agent的两大高级功能： **个人微信原生集成** 和 **LLM Wiki知识库构建**。\\n\\n📱 首先演示了Hermes Agent连接个人微信的完整流程——扫码登录、配对连接、私聊交互，轻松在微信中调用AI能力。\\n\\n📚 重点讲解了基于Andrej Karpathy分享的LLM Wiki知识库工作流。通过深入对比传统RAG（无状态碎片检索）与LLM Wiki（有状态知识编辑），揭示了知识复利增长的核心优势。实战演示了：从ArXiv批量摄入论文 → 自动提取结构化知识 → 生成交叉引用的Wiki页面 → 在Obsidian中可视化Graph图谱 → 多Wiki无缝切换与合并。\\n\\n🏗️ 详细解析了LLM Wiki的三层架构：不可变的原始来源层、Agent驱动的Wiki页面层、人机协同的进化层，真正实现”编译一次，持续更新”的数据飞轮。\\n\\n> 🚀本篇笔记所对应的视频：\\n>\\n> - [👉👉👉 通过哔哩哔哩观看](https://www.bilibili.com/video/BV1zGD9BrEwe/)\\n> - [👉👉👉 通过YouTube观看](https://youtu.be/UeI3nR9HLoQ)\\n\\n* * *\\n\\n这个适配器是针对 **个人微信账号** 的，使用的是腾讯的 **iLink Bot API**。它通过 HTTP 长轮询（long-polling）接收消息，因此 **不需要公网端点或 Webhook**。如果你需要企业微信，请使用 WeCom 适配器。\\n\\n* * *\\n\\n## 前置条件 [Permalink](https://www.aivi.fyi/llms/hermes
```
