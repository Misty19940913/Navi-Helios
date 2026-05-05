# Session JSONL 格式參考（2026-04-30 實測）

## 檔案位置

```
~/.hermes/sessions/{timestamp}_{hash}.jsonl
~/.hermes/sessions/session_{timestamp}_{hash}.json
~/.hermes/sessions/session_cron_{hash}_{timestamp}.json  ← cron job session
```

## Entry 格式

每行是一個 JSON 物件，共 4 種 role：

### 1. `session_meta`
```json
{"role": "session_meta", "content": ""}
```
幾乎為空，session 開頭的 metadata 標記。

### 2. `user`
```json
{"role": "user", "content": "[DreadxMisty] 你目前運行在哪裡"}
```
`content` 是**字串**。中文字為真實對話，英文可能摻雜 system prompt。

### 3. `assistant`
```json
{"role": "assistant", "content": "回覆文字..."}
```
或結構化格式：
```json
{"role": "assistant", "content": [
  {"type": "text", "text": "回覆文字第一段..."},
  {"type": "text", "text": "回覆文字第二段..."},
  {"type": "tool_use", "name": "google-workspace", "input": {"description": "...", "tags": [], ...}}
]}
```

### 4. `tool`
```json
{"role": "tool", "content": "{\"success\": true, \"name\": \"obsidian\", ...}"}
```
`content` 是**字串化的 JSON**（不是物件），包含 `success`、`name`、`output`、`exit_code` 等欄位。

## Tool Call Block 結構（assistant content 內）

```json
{
  "type": "tool_use",
  "name": "google-workspace",       // 技能名或工具名
  "input": {
    "description": "Gmail, Calendar, Drive...",
    "tags": [],
    "related_skills": [],
    "content": "..."               // 技能完整描述
  }
}
```

## Session 讀取程式碼

```python
import json

def read_entries(path):
    entries = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                entries.append(json.loads(line))
    return entries

# 收集 user messages
user_msgs = [e['content'] for e in entries if e['role'] == 'user' and isinstance(e['content'], str)]

# 收集 tool calls
tool_calls = []
for e in entries:
    if e['role'] == 'assistant' and isinstance(e['content'], list):
        for block in e['content']:
            if isinstance(block, dict) and block.get('type') == 'tool_use':
                tool_calls.append({'name': block['name'], 'input': block.get('input')})

# 收集 assistant 文字
asst_texts = []
for e in entries:
    if e['role'] == 'assistant' and isinstance(e['content'], str):
        asst_texts.append(e['content'])
    elif e['role'] == 'assistant' and isinstance(e['content'], list):
        for block in e['content']:
            if block.get('type') == 'text':
                asst_texts.append(block['text'])
```

## 實測資料（2026-04-30）

| Session | Entries | User Msgs | 特色 |
|---------|---------|-----------|------|
| `20260425_114026` | 108 | 7 | Google Workspace OAuth 設定 |
| `20260425_115026` | 3 | 1 | 「在嗎」（trivial，跳過）|
| `20260425_190327` | 209 | 32 | 最大 session，涵蓋 OAuth + Node.js 版本 |
| `20260426_003829` | 64 | 3 | Obsidian vault 探索、OpenClaw workspace 結構 |

## 蒸餾時過濾 trivial user message 的方法

```python
def is_meaningful_user_message(content):
    if not content or not isinstance(content, str):
        return False
    content = content.strip()
    if len(content) < 15:
        return False
    skip_patterns = ['在嗎', '好', '繼續', '是的', 'ok', '嗯', '好哦', '/sethome', '/home']
    for p in skip_patterns:
        if len(p) > 3 and content.startswith(p) and (len(content) < 30 or ' ' not in content):
            return False
    return True
```

## Timestamp 解析

Session 檔名格式：`{YYYYMMDD}_{HHMMSS}_{hash}.jsonl`

```python
import re
ts_match = re.match(r'(\d{8}_\d{6})', session_filename)
ts = ts_match.group(1) if ts_match else "unknown"  # e.g., "20260425_190327"
```

## Progress Marker

```
~/.hermes/memories/.distill_progress  ← 純數字（處理的 session 數量）
```

範例：`echo "10" > ~/.hermes/memories/.distill_progress`（下次從第 10 個 session 繼續）
