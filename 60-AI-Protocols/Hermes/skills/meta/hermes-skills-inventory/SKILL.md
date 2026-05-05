---
name: hermes-skills-inventory
description: Hermes vault skills 現況追蹤（2026-05-05 磁碟實查版）
trigger: 被問到「現在有哪些 skills」「某 skill 存在嗎」「skills_list 和磁碟對不上」時觸發
required_primitives: []
---

# Hermes Skills Inventory（2026-05-05 磁碟實查版）

## 對齊狀態（2026-05-05）

| 指標 | 數值 |
|---|---|
| Manifest (`.bundled_manifest`) | **112** |
| 磁碟實際 (frontmatter `name:` 掃描) | **112** |
| 差距 | **0** |

> 2026-05-05 同步後：原本 87 + 新增 25（8 個 `_primitives` + 17 個活性技能）= 112，Manifest 與磁碟完美對齊。

## 對齊狀態查詢脚本

```bash
python3 << 'EOF'
import re, os
from pathlib import Path

skills_dir = Path('/home/misty/.hermes/skills')
manifest = open(skills_dir / '.bundled_manifest').read().strip().split('\n')
bundled = set(line.split(':')[0] for line in manifest if line.strip())

disk_fm = {}
for root, dirs, files in os.walk(skills_dir, followlinks=True):
    dirs[:] = [d for d in dirs if d not in {'.git', '.github', '.hub', '__pycache__'}]
    if 'SKILL.md' not in files:
        continue
    rel = str(Path(root).relative_to(skills_dir))
    content = open(f'{skills_dir}/{rel}/SKILL.md', encoding='utf-8').read()
    m = re.match(r'---\s*\n(.*?)\n---', content, re.DOTALL)
    if m:
        for line in m.group(1).split('\n'):
            if line.startswith('name:'):
                disk_fm[line.split(':',1)[1].strip()] = rel

only_m = bundled - set(disk_fm.keys())
only_d = set(disk_fm.keys()) - bundled
print(f'Manifest: {len(bundled)} | Disk: {len(disk_fm)}')
print(f'Only manifest (deleted): {len(only_m)} → {sorted(only_m) if only_m else "none"}')
print(f'Only disk (unregistered): {len(only_d)} → {sorted(only_d) if only_d else "none"}')
EOF
```

**關鍵診斷觀念：**
- Manifest 格式是 `name:hash`（無路徑），比對時**絕對不能比較 folder name**
- 唯一正確的 ground truth 是 **SKILL.md frontmatter 的 `name:` 欄位**
- Folder name 可能與 frontmatter name 不同（例如 `mlops/models/segment-anything/` 的 frontmatter 是 `segment-anything-model`）
- 用 folder name 做對比的診斷會產生大量 false positive（曾誤判 6 個為「被刪除」）

## Skills 磁碟架構（真實分佈）

| 目錄 | 數量 | 說明 |
|---|---|---|
| `~/.hermes/skills/` | **112** | 全部 skills（含 87 官方 + 25 自建已對齊） |
| `.bundled_manifest` | 112 | Hermes 官方清單（name:hash 格式） |

> 注意：`.bundled_manifest` 在 2026-05-05 前只追蹤 87 個官方技能，2026-05-05 同步後纳入 25 個自建技能。`.archive/` 目錄不存在（已清理）。

## Vault Skills 路徑
`~/.hermes/skills/` = symlink → `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/skills/`
兩者是同一目錄，vault 端 OneDrive 同步通過 symlink 到 WSL 路徑。

---

## Skills 磁碟架構（真實分佈）

| 目錄 | 數量 | 說明 |
|---|---|---|
| `~/.hermes/hermes-agent/skills/` | 87 | Hermes 內建 skills（官方包裝，與 `.bundled_manifest` 87 項對齊） |
| `~/.hermes/hermes-agent/optional-skills/` | 58 | 可選 skills，預設不啟用 |
| `~/.hermes/skills/`（symlink → OneDrive） | **138** | 使用者自己的 skills，含 51 個不在 manifest 的自建技能 |

## 自建 Skills（已對齊至 manifest，2026-05-05）

### _primitives/（8個，已補進 manifest）

| 目錄 | 說明 |
|---|---|
| `01_flow-planning/` | 將目標分解為可執行步驟 |
| `02_data-retrieval/` | 從 vault、網路、API 獲取資料 |
| `03_format-parsing/` | 轉換資料格式（JSON/YAML/MD/HTML） |
| `04_format-validation/` | 根據規格驗證輸出格式 |
| `05_content-generation/` | 生成文字或圖片內容 |
| `06_file-operations/` | 讀寫檔案 |
| `07_external-publishing/` | 推送內容至外部平台 |
| `08_logging/` | 記錄執行成功/失敗事件 |

### 活性技能（17個，已補進 manifest）

| 路徑 | 說明 |
|---|---|
| `content-audit/` | 自媒體文案稽核 |
| `defuddle/` | 網頁 Markdown 萃取 |
| `workflow/design-reference-to-preview/` | Design MD → HTML Preview |
| `meta/hermes-memory-system/` | Hermes 三層記憶系統 |
| `meta/hermes-skills-inventory/` | 本檔案 |
| `devops/hermes-update-workflow/` | Hermes update + gateway 重啟流程 |
| `json-canvas/` | JSON Canvas 編輯 |
| `narrative-refactor/` | 敘事極致化重構 |
| `obsidian-bases/` | Obsidian Bases 格式 |
| `obsidian-cli/` | Obsidian CLI 操作 |
| `obsidian-markdown/` | Obsidian Flavored Markdown |
| `software-development/obsidian-plugin-dev/` | Plugin 開發主控 |
| `skill-authoring/` | Skill 創作實戰手冊（v2，含強制停等點機制，5 個檢查哨） |
| `workflow/social-content-strategy/` | 自媒體內容策略 |
| `workflow/vault-bulk-translation/` | 批次翻譯 vault |
| `knowledge-management/vault-folder-reorganization/` | vault 資料夾重組 |
| `llm-wiki-ops/vault-knowledge-distillation/` | LLM Wiki INGEST 流程 |

### workflow/

| 目錄 | 說明 |
|---|---|
| `design-reference-to-preview/` | Design MD → HTML Live Preview |
| `pattern-pending/` | Pattern 驗證機制 |
| `social-content-strategy/` | 自媒體內容策略 |

### knowledge-management/

| 目錄 | 說明 |
|---|---|
| `vault-folder-reorganization/` | vault 資料夾重組工作流 |

### llm-wiki-ops/

| 目錄 | 說明 |
|---|---|
| `vault-knowledge-distillation/` | INGEST 流程（Raw Source → atomic page） |

### 獨立 skills（根目錄）

| 目錄 | 說明 |
|---|---|
| `llm-wiki/` | 知識攝取+查詢工作流 |
| `content-audit/` | 自媒體文章稽核 |
| `narrative-refactor/` | 敘事極致化重構 |
| `skill-authoring/` | Skill 創作實戰手冊（v2，含強制停等點機制，5 個檢查哨） |
| `defuddle/` | 網頁 Markdown 萃取 |
| `json-canvas/` | JSON Canvas 編輯 |
| `obsidian-bases/` | Obsidian Bases 格式 |
| `obsidian-cli/` | Obsidian CLI 操作 |
| `obsidian-markdown/` | Obsidian Flavored Markdown |



---

## _primitives/（原子技能層）

| 目錄 | 狀態 | 說明 |
|---|---|---|
| `01_flow-planning/` | ✓ | 將目標分解為可執行步驟 |
| `02_data-retrieval/` | ✓ | 從 vault、網路、API 獲取資料 |
| `03_format-parsing/` | ✓ | 轉換資料格式（JSON/YAML/MD/HTML） |
| `04_format-validation/` | ✓ | 根據規格驗證輸出格式 |
| `05_content-generation/` | ✓ | 生成文字或圖片內容 |
| `06_file-operations/` | ✓ | 讀寫檔案 |
| `07_external-publishing/` | ✓ | 推送內容至外部平台 |
| `08_logging/` | ✓ | 記錄執行成功/失敗事件 |
| `skills-map/` | ✗ | **不存在** — 僅在 discussion/規劃中，尚未建立於磁碟 |

> 注意：`skills-map/` 在早期討論中被規劃為 composed skills registry + primitives 依賴圖，但 SKILL.md 目錄從未建立於 `~/.hermes/skills/_primitives/skills-map/`。`skill_runner.py` 參照此路徑但會無法找到。若要啟動 skills-map orchestration，需先建立該目錄與 JSON 資料。

---

## software-development/

| 目錄 | 說明 |
|---|---|
| `obsidian-plugin-dev/` | Plugin 開發主控（評估→Study/Dev/BRAT Release/Gap） |
| `debugging-hermes-tui-commands/` | Hermes TUI slash commands 調試 |
| `hermes-agent-skill-authoring/` | Hermes in-repo SKILL.md 創作 |
| `node-inspect-debugger/` | Node.js --inspect + CDP 調試 |
| `plan/` | Plan mode：寫 markdown plan |
| `python-debugpy/` | Python pdb + debugpy remote (DAP) |
| `requesting-code-review/` | Pre-commit review：security scan + quality gates |
| `spike/` | Throwaway 實驗驗證 idea |
| `subagent-driven-development/` | 透過 delegate_task 執行 plan（2-stage review）|
| `systematic-debugging/` | 4-phase root cause debugging |
| `test-driven-development/` | TDD：RED-GREEN-REFACTOR |
| `writing-plans/` | 寫 implement plan：bite-sized tasks |

> 以下已蒸餾整合進 `obsidian-plugin-dev/`：obsidian-plugin-brat-release、obsidian-plugin-study、obsidian-plugin-compilation-debugging、obsidian-plugin-multi-patch、obsidian-plugin-spec-creation、plugin-gap-analysis、plugin-gap-deepening。

---




| 項目 | 說明 |
|---|---|
| `systematic-debugging/` | 原子技能，供其他 skill compose，尚未建立 |
| `hermes-cross-device-sync/` | 已被移除，不在磁碟中 |

---

## skill_manage 工具 bug

`skill_manage view` 有時回報「Skills directory does not exist」，但 `terminal ls` 確認目錄存在。

**create/write 嚴重失效（已驗證 2 次）**：`skill_manage create/write` 回傳成功，但 `find ~/.hermes/skills/ -name SKILL.md` 找不到檔案。觸發於新建目錄後立即寫入 SKILL.md。

**正確做法（永久解法）**：
```
terminal("mkdir -p ~/.hermes/skills/<name>/")
write_file("~/.hermes/skills/<name>/SKILL.md", content)
terminal("find ~/.hermes/skills/ -name SKILL.md | xargs wc -l")  # 驗證落地
```

`skill_manage` 適用於：已存在目錄的 patch/edit，與 read-only 檢視。

---

## 來源文獻
- SRC-001: Karpathy LLM-Wiki（~/wiki 的精神）
- SRC-002: openclaw llm-wiki-admin（INGEST 流程、5種場景、5個生成檔案）
- SRC-003: sdyckjq lab-v3.3（9個 workflows）
