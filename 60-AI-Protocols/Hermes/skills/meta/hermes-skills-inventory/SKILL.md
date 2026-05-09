---
name: hermes-skills-inventory
description: Hermes vault skills 現況追蹤（2026-05-08 磁碟實查版）
trigger: 被問到「現在有哪些 skills」「某 skill 存在嗎」「skills_list 和磁碟對不上」時觸發
required_primitives: []
---

# Hermes Skills Inventory（2026-05-08 磁碟實查版）

## 對齊狀態（2026-05-08 最新）

| 指標 | 數值 |
|---|---|
| Manifest (`.bundled_manifest`) | **120** |
| 磁碟實際 (frontmatter `name:` 掃描) | **120** |
| YAML 解析失敗 | **0**（本次修復 12 個） |
| 差距 | **0** |

> 2026-05-08 完成：
> - 修復 `_primitives/01~08` 集體 YAML trigger 失效（引號內嵌雙引號）
> - 修復 `creative/pretext`（`@` 特殊字元）、`creative/baoyu-comic`（`|` 語法）、`mlops/inference/vllm`（逗號非陣列）YAML 錯誤
> - 補入 `workflow/pattern-pending` 缺少的 `name:` 欄位並註冊 manifest
> - 清理 `vault-knowledge-distillation` 殭尸，納入 8 個未登錄技能

## 對齊狀態查詢脚本（含 YAML + Manifest 雙檢查）

```bash
python3 << 'EOF'
import re, yaml, os
from pathlib import Path

skills_dir = Path('/home/misty/.hermes/skills')
manifest = open(skills_dir / '.bundled_manifest').read().strip().split('\n')
bundled = set(line.split(':')[0] for line in manifest if line.strip())

disk_fm, yaml_errors = {}, []
for root, dirs, files in os.walk(skills_dir, followlinks=True):
    dirs[:] = [d for d in dirs if d not in {'.git', '.github', '.hub', '__pycache__'}]
    if 'SKILL.md' not in files:
        continue
    rel = str(Path(root).relative_to(skills_dir))
    content = open(f'{skills_dir}/{rel}/SKILL.md', encoding='utf-8').read()
    m = re.match(r'---\s*\n(.*?)\n---', content, re.DOTALL)
    if m:
        try:
            data = yaml.safe_load(m.group(1))
            name = data.get('name', '?')
            disk_fm[name] = rel
        except Exception as e:
            yaml_errors.append((rel, str(e)[:80]))

only_m = bundled - set(disk_fm.keys())
only_d = set(disk_fm.keys()) - bundled
print(f'Manifest: {len(bundled)} | Disk: {len(disk_fm)}')
print(f'Only manifest (deleted): {len(only_m)} → {sorted(only_m) if only_m else "none"}')
print(f'Only disk (unregistered): {len(only_d)} → {sorted(only_d) if only_d else "none"}')
print(f'YAML errors: {len(yaml_errors)}')
if yaml_errors:
    for rel, err in yaml_errors:
        print(f'  ✗ {rel}: {err}')
    print('Fix: patch YAML frontmatter errors first, then update manifest hashes')
else:
    print('✓ YAML all clean')
EOF
```

**維修優先順序**：
1. 先修 YAML 錯誤（任何 `YAML ERROR` 都會讓 frontmatter 無法被解析）
2. 再更新 manifest hash（每修一個 YAML 就重新計算並寫入）
3. 最後加註冊未登錄的技能（如 `pattern-pending`）

**關鍵診斷觀念：**
- Manifest 格式是 `name:hash`（無路徑），比對時**絕對不能比較 folder name**
- 唯一正確的 ground truth 是 **SKILL.md frontmatter 的 `name:` 欄位**
- Folder name 可能與 frontmatter name 不同（例如 `mlops/models/segment-anything/` 的 frontmatter 是 `segment-anything-model`）
- 用 folder name 做對比的診斷會產生大量 false positive（曾誤判 6 個為「被刪除」）

## Skills 磁碟架構（真實分佈）

| 目錄 | 數量 | 說明 |
|---|---|---|
| `~/.hermes/skills/` | **119** | 全部 skills（含 hermes-agent 內建 87 + 自建 32 項，已對齊 manifest）|
| `.bundled_manifest` | 119 | Hermes 官方清單（name:hash 格式） |

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

## 自建 Skills（已對齊至 manifest，2026-05-08）

### 活性技能（25個，已補進 manifest）

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
| `navi-obsidian-editing/` | Navi Obsidian 編輯協議 |
| `skill-finder/` | Skill 發現與優先排序 |
| `research/research-document-architecture/` | 多批次文件研究管線 |
| `.archive/document-consistency-check/` | 文件一致性檢查 |
| `.archive/hermes-asset-symlink-mgmt/` | WSL/NTFS 資產 symlink 管理 |
| `.archive/hermes-gateway-autostart/` | Gateway systemd 自動啟動 |
| `.archive/hermes-safety-suite/` | Hermes 安全三件套 |
| `hermes-cross-device-sync/` | 跨設備 sync（恢復） |
| `llm-wiki/` | 知識攝取+查詢工作流 |

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

### research/

| 目錄 | 說明 |
|---|---|
| `research-document-architecture/` | 多批次文件研究管線 |

### .archive/

| 目錄 | 說明 |
|---|---|
| `document-consistency-check/` | 文件一致性檢查 |
| `hermes-asset-symlink-mgmt/` | WSL/NTFS 資產 symlink 管理 |
| `hermes-gateway-autostart/` | Gateway systemd 自動啟動 |
---

## _primitives/（原子技能層）

| 目錄 | 狀態 | 說明 |
|---|---|---|
| `skills-map/` | ✗ | **不存在** — 僅在 discussion/規劃中，尚未建立於磁碟 |

> 注意：`skills-map/` 在早期討論中被規劃為 composed skills registry + primitives 依賴圖，但 SKILL.md 目錄從未建立於 `~/.hermes/skills/_primitives/skills-map/`。`skill_runner.py` 參照此路徑但會無法找到。若要啟動 skills-map orchestration，需先建立該目錄與 JSON 資料。

> **附帶工具**：`references/manifest-alignment-check.py` — 單鍵執行 manifest 對齊檢查（結果同上）。

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




## 已移除項目

| 項目 | 說明 |
|---|---|
| `vault-knowledge-distillation/` | 已從磁碟刪除（2026-05-08），僅留於本記錄 |
| `skills-map/` | 僅在 discussion/規劃中，SKILL.md 目錄從未建立 |

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

## YAML Frontmatter 失效模式（2026-05-08 新增）

### 模式一：引號內嵌雙引號（`_primitives/` 系列集體中招）

**錯誤格式**：`trigger: "要做什麼"時觸發`
YAML 解析器在第2個 `"` 處失敗，因為 `"` 在雙引號字串內部未被轉義。

**正確格式**（二選一）：
- `trigger: "要做什麼時觸發"` — 將「時觸發」一併包入引號
- `trigger: "要做什麼" + "時觸發"` — 拆成陣列

### 模式二：trigger 值用 `|` 或逗號分隔（非陣列語法）

**錯誤格式**：`trigger: "item1" | "item2"` 或 `trigger: "item1", "item2"`
**正確格式**：
```yaml
trigger:
  - "item1"
  - "item2"
```

### 模式三：特殊字元開頭未加引號

**錯誤格式**：`- @chenglou/pretext`（`@` 在 YAML 視為未知 token）
**正確格式**：`- "@chenglou/pretext"`

### 模式四：frontmatter 完全缺少 `name:` 欄位

`pattern-pending` 的 frontmatter 是自訂格式（無 `name:`），導致 hash 比對和 skills_list 掃描都找不到它。

### 全量 YAML + Manifest 對齊驗證腳本

```python
python3 << 'EOF'
import re, yaml, os
from pathlib import Path

skills_dir = Path('/home/misty/.hermes/skills')
manifest = open(skills_dir / '.bundled_manifest').read().strip().split('\n')
bundled = set(line.split(':')[0] for line in manifest if line.strip())

disk_fm, yaml_errors = {}, []
for root, dirs, files in os.walk(skills_dir, followlinks=True):
    dirs[:] = [d for d in dirs if d not in {'.git', '.github', '.hub', '__pycache__'}]
    if 'SKILL.md' not in files:
        continue
    rel = str(Path(root).relative_to(skills_dir))
    content = open(f'{skills_dir}/{rel}/SKILL.md', encoding='utf-8').read()
    m = re.match(r'---\s*\n(.*?)\n---', content, re.DOTALL)
    if m:
        try:
            data = yaml.safe_load(m.group(1))
            name = data.get('name', '?')
            disk_fm[name] = rel
        except Exception as e:
            yaml_errors.append((rel, str(e)[:80]))

only_m = bundled - set(disk_fm.keys())
only_d = set(disk_fm.keys()) - bundled
print(f'Manifest:{len(bundled)} Disk:{len(disk_fm)} YAML errors:{len(yaml_errors)} Gap:{len(only_m)+len(only_d)}')
if yaml_errors:
    for rel, err in yaml_errors:
        print(f'  YAML ERR {rel}: {err}')
    print('Fix: patch YAML frontmatter errors first, then update manifest hashes')
EOF
```

---

## 來源文獻
- SRC-001: Karpathy LLM-Wiki（~/wiki 的精神）
- SRC-002: openclaw llm-wiki-admin（INGEST 流程、5種場景、5個生成檔案）
- SRC-003: sdyckjq lab-v3.3（9個 workflows）
