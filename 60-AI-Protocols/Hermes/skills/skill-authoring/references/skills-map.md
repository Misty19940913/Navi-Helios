---
name: skills-map
description: 查詢 skills 之間的依賴關係、某 primitive 被誰使用、某 skill 的 composition chain
trigger: "查詢某 skill 的 composition、某 primitive 的 consumed_by/produces、或需要執行一個 composed skill 時觸發"
prerequisites: []
produces: []
---

# Skills Map

## Description

查詢 skills 之間的依賴關係、某 primitive 被誰使用、某 skill 的 composition chain

## Composed Skills Registry

```json
{
  "primitives": {
    "01_flow-planning": {
      "description": "將目標分解為可執行步驟",
      "prerequisites": [],
      "produces": [
        "cards",
        "journal",
        "vault-duplicate-finder",
        "vault-gap-analyzer",
        "content-audit",
        "narrative-refactor",
        "wiki-driven-content-editing",
        "llm-wiki",
        "hermes-cross-device-sync",
        "obsidian-plugin-dev"
      ],
      "consumed_by": []
    },
    "02_data-retrieval": {
      "description": "從 vault、網路、API 獲取資料",
      "prerequisites": [],
      "produces": [
        "content-audit",
        "wiki-driven-content-editing",
        "llm-wiki"
      ],
      "consumed_by": []
    },
    "03_format-parsing": {
      "description": "轉換資料格式（JSON/YAML/MD/HTML等）",
      "prerequisites": [],
      "produces": [
        "vault-duplicate-finder",
        "vault-gap-analyzer",
        "narrative-refactor",
        "wiki-driven-content-editing",
        "llm-wiki",
        "obsidian-plugin-dev"
      ],
      "consumed_by": []
    },
    "04_format-validation": {
      "description": "根據規格驗證輸出格式",
      "prerequisites": [],
      "produces": [
        "content-audit",
        "obsidian-plugin-dev"
      ],
      "consumed_by": []
    },
    "05_content-generation": {
      "description": "生成文字或圖片內容",
      "prerequisites": [],
      "produces": [
        "cards",
        "journal",
        "content-audit",
        "narrative-refactor",
        "wiki-driven-content-editing",
        "llm-wiki"
      ],
      "consumed_by": []
    },
    "06_file-operations": {
      "description": "讀寫檔案",
      "prerequisites": [],
      "produces": [
        "cards",
        "journal",
        "vault-duplicate-finder",
        "vault-gap-analyzer",
        "narrative-refactor",
        "wiki-driven-content-editing",
        "llm-wiki",
        "hermes-cross-device-sync",
        "obsidian-plugin-dev"
      ],
      "consumed_by": []
    },
    "07_external-publishing": {
      "description": "推送內容至外部平台",
      "prerequisites": [],
      "produces": [
        "journal",
        "hermes-cross-device-sync"
      ],
      "consumed_by": []
    },
    "08_logging": {
      "description": "記錄執行成功/失敗事件",
      "prerequisites": [],
      "produces": [],
      "consumed_by": [
        "cards",
        "journal",
        "vault-duplicate-finder",
        "vault-gap-analyzer",
        "content-audit",
        "narrative-refactor",
        "wiki-driven-content-editing",
        "llm-wiki",
        "hermes-cross-device-sync",
        "obsidian-plugin-dev"
      ]
    }
  },
  "skills": {
    "cards": {
      "type": "composed",
      "composition": [
        "01",
        "05",
        "06",
        "08"
      ],
      "chain": "01_flow-planning → 05_content-generation → 06_file-operations → 08_logging",
      "created": "2026-04-27"
    },
    "journal": {
      "type": "composed",
      "composition": [
        "01",
        "06",
        "05",
        "07",
        "08"
      ],
      "chain": "01_flow-planning → 06_file-operations → 05_content-generation → 07_external-publishing → 08_logging",
      "created": "2026-04-27"
    },
    "vault-duplicate-finder": {
      "type": "composed",
      "composition": [
        "06",
        "03",
        "08"
      ],
      "chain": "06_file-operations → 03_format-parsing → 08_logging",
      "created": "2026-04-27"
    },
    "vault-gap-analyzer": {
      "type": "composed",
      "composition": [
        "06",
        "03",
        "08"
      ],
      "chain": "06_file-operations → 03_format-parsing → 08_logging",
      "created": "2026-04-27"
    },
    "content-audit": {
      "type": "composed",
      "composition": [
        "01",
        "02",
        "04",
        "05",
        "08"
      ],
      "chain": "01_flow-planning → 02_data-retrieval → 04_format-validation → 05_content-generation → 08_logging",
      "created": "2026-04-27"
    },
    "narrative-refactor": {
      "type": "composed",
      "composition": [
        "01",
        "03",
        "05",
        "06",
        "08"
      ],
      "chain": "01_flow-planning → 03_format-parsing → 05_content-generation → 06_file-operations → 08_logging",
      "created": "2026-04-27"
    },
    "wiki-driven-content-editing": {
      "type": "composed",
      "composition": [
        "01",
        "02",
        "03",
        "05",
        "06",
        "08"
      ],
      "chain": "01_flow-planning → 02_data-retrieval → 03_format-parsing → 05_content-generation → 06_file-operations → 08_logging",
      "created": "2026-04-27"
    },
    "llm-wiki": {
      "type": "composed",
      "composition": [
        "01",
        "02",
        "03",
        "05",
        "06",
        "08"
      ],
      "chain": "01_flow-planning → 02_data-retrieval → 03_format-parsing → 05_content-generation → 06_file-operations → 08_logging",
      "created": "2026-04-27"
    },
    "hermes-cross-device-sync": {
      "type": "composed",
      "composition": [
        "06",
        "07",
        "08"
      ],
      "chain": "06_file-operations → 07_external-publishing → 08_logging",
      "created": "2026-04-27"
    },
    "vault-gap-analyzer": {
      "type": "composed",
      "composition": ["01_flow-planning", "02_data-retrieval", "03_format-parsing", "04_format-validation", "06_file-operations", "08_logging"],
      "chain": "01_flow-planning → 02_data_retrieval → 03_format-parsing → 04_format-validation → 06_file-operations → 08_logging",
      "created": "2026-04-28"
    },
    "vault-knowledge-distillation": {
      "type": "composed",
      "composition": ["01_flow-planning", "02_data-retrieval", "03_format-parsing", "05_content-generation", "06_file-operations", "08_logging"],
      "chain": "01_flow-planning → 02_data-retrieval → 03_format-parsing → 05_content-generation → 06_file-operations → 08_logging",
      "created": "2026-04-28"
    },
    "wiki-backlink-update": {
      "type": "composed",
      "composition": ["01_flow-planning", "03_format-parsing", "04_format-validation", "06_file-operations", "08_logging"],
      "chain": "01_flow-planning → 03_format-parsing → 04_format-validation → 06_file-operations → 08_logging",
      "created": "2026-04-28"
    },
    "vault-llm-wiki-reingest": {
      "type": "composed",
      "composition": ["01_flow-planning", "06_file-operations", "08_logging"],
      "chain": "01_flow-planning → 06_file-operations → 08_logging",
      "created": "2026-04-28"
    },
    "skill-authoring": {
      "type": "composed",
      "composition": ["01_flow-planning", "06_file-operations", "08_logging"],
      "chain": "01_flow-planning → 06_file-operations → 08_logging",
      "created": "2026-04-28"
    },
    "wiki-knowledge-chain-diagnosis": {
      "type": "composed",
      "composition": ["01_flow-planning", "02_data-retrieval", "03_format-parsing", "04_format-validation", "06_file-operations"],
      "chain": "01_flow-planning → 02_data-retrieval → 03_format-parsing → 04_format-validation → 06_file-operations",
      "created": "2026-04-28"
    },
    "defuddle": {
      "type": "tool-skill",
      "description": "從網頁乾淨擷取 Markdown（npm install -g defuddle）",
      "composition": [],
      "created": "2026-04-28"
    },
    "json-canvas": {
      "type": "syntax-skill",
      "description": "JSON Canvas 語法（.canvas）",
      "composition": [],
      "created": "2026-04-28"
    },
    "obsidian-cli": {
      "type": "tool-skill",
      "description": "Obsidian CLI 桌面端互動",
      "composition": [],
      "created": "2026-04-28"
    },
    "obsidian-markdown": {
      "type": "syntax-skill",
      "description": "Obsidian Flavored Markdown 語法",
      "composition": [],
      "created": "2026-04-28"
    },
    "obsidian-bases": {
      "type": "syntax-skill",
      "description": "Obsidian Bases (.base) 資料庫語法",
      "composition": [],
      "created": "2026-04-28"
    }
  }
}
```
