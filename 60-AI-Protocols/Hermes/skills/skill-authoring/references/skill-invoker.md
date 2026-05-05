# Skill Invoker — Composed Skill 執行器

## 功能

透過 `skill_runner.py` 自動執行 composed skill：
- 查 skills-map 取得 primitive chain
- 依序執行每個 primitive
- 全程串上 chain-tracker（start / step / done）
- 返回結構化結果

## 使用方式

### Agent 內部呼叫
```bash
python3 /home/misty/.hermes/scripts/skill_runner.py invoke <skill_name> <goal>
```

### CLI 指令
```bash
# 查可用 skills
python3 /home/misty/.hermes/scripts/skill_runner.py list-skills

# 查某 skill 的 chain
python3 /home/misty/.hermes/scripts/skill_runner.py suggest <skill_name>

# 執行 skill
python3 /home/misty/.hermes/scripts/skill_runner.py invoke <skill_name> <goal>

# 查詢執行歷史
python3 /home/misty/.hermes/scripts/hermes_chain.py query <primitive>
```

## 可用 Skills

| Skill | Chain |
|---|---|
| cards | 01 → 05 → 06 → 08 |
| journal | 01 → 06 → 05 → 07 → 08 |
| content-audit | 01 → 02 → 04 → 05 → 08 |
| narrative-refactor | 01 → 03 → 05 → 06 → 08 |
| wiki-driven-content-editing | 01 → 02 → 03 → 05 → 06 → 08 |
| llm-wiki | 01 → 02 → 03 → 05 → 06 → 08 |
| hermes-cross-device-sync | 06 → 07 → 08 |
| obsidian-plugin-dev | 01 → 03 → 04 → 06 → 08 |
| vault-duplicate-finder | 06 → 03 → 08 |
| vault-gap-analyzer | 06 → 03 → 08 |

## invoke 結果格式

```json
{
  "skill": "cards",
  "chain_id": "chain-xxx",
  "status": "success|failure",
  "steps": [
    {"primitive": "01", "status": "success", "result": {...}},
    {"primitive": "05", "status": "success", "result": {...}}
  ],
  "final_result": {...},
  "duration_ms": 1234
}
```

## 流程

1. 收到 Agent 執行請求（skill name + goal）
2. `invoke()` 查 skills-map JSON → 取得 composition list
3. 依序呼叫每個 primitive 的實作函數
4. 每步成功：`hermes_chain.py step <primitive> success`
5. 每步失敗：`hermes_chain.py step <primitive> failure <error>` → `hermes_chain.py done <error>`
6. 全部完成：`hermes_chain.py done`
7. 回傳結構化結果

## 注意事項

- 執行時工作目錄無限制（vault 在 `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`）
- 若 skill 不存在於 skills-map，回傳 `{"error": "Skill not found"}`
- `05_content-generation` 和 `07_external-publishing` 的真實執行需要上游 LLM API
- chain-tracker 的 events 存在 `~/.hermes/skills/_primitives/08_logging/events/YYYY-MM-DD.jsonl`
- chains 記錄存在 `~/.hermes/skills/_primitives/08_logging/chains/chain-*.json`
