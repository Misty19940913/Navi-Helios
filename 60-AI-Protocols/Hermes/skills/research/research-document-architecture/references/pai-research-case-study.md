# PAI Research Case Study — Life-OS Project (2026-05-08)

> **Source**: Direct session execution (no subagent delegation — orchestrator was executor)
> **Purpose**: Document non-trivial findings from analyzing a multi-batch research output with parallel index corruption

---

## 發現：兩個平行研究資料夾

**情境**：在 `/PAI_Research/` 之外發現 `/PAI_Research(1)/`，兩者都聲稱是 PAI 研究。

| 資料夾 | 檔案數 | index 狀態 | 與 Life-OS 對應 |
|:---|:---:|:---|:---|
| `PAI_Research/` | 32 份報告 | 索引聲稱30/30完成，但實際標記僅15/30 | 獨立 |
| `PAI_Research(1)/` | 17 份報告 | 索引聲稱13/30（43.3%） | 可能是備份或中斷的複製品 |

**原則**：
- 發現平行資料夾時，**先假設有一個是損壞的**，不要假設兩者都正確
- 比較 index 文件的完成度百分比：較低的那個通常是真實進度，較高的可能是過期狀態
- 保留 `PAI_Research/`（行數更多），標記 `PAI_Research(1)/` 為「歷史/備份」

---

## 發現：index 文件腐敗（Index Rot）

### 兩份 index 的不一致

**`PAI_Research/00_框架索引.md`**：
- 標題：`_PAI v5.0.0 研究框架索引`
- 狀態行：**進度總覽：總報告數：60，完成數：30 ✅**
- 但內容只列到 T40，T41-T60 僅有名稱無檔案

**`PAI_Research(1)/00_框架索引.md`**：
- 標題：`# PAI Research 框架索引`
- 狀態行：**已完成：13 / 30（43.3%）**
- 內容一致，標記正確

**根本原因**：單一 LLM session 同時寫入 index 和進度，但 index 更新落後於 progress.json，導致 index 聲稱完成但內容未對應。

---

## 發現：物理驗證成功，但 index 落後

### 驗證結果（T15-T22 確認）

| 報告 | 行數 | 狀態 |
|:---|:---:|:---:|
| T15_DA_IDENTITY.md | 153 | ✅ 完整 |
| T16_Agents_Pack.md | 278 | ✅ 完整 |
| T17_Council_Pack.md | 174 | ✅ 完整 |
| T18_Research_Pack.md | 193 | ✅ 完整 |
| T19_CreateSkill_Pack.md | 235 | ✅ 完整 |
| T20_Science_Pack.md | 222 | ✅ 完整 |
| T21_Art_Pack.md | 263 | ✅ 完整 |
| T22_Thinking_Skills.md | 326 | ✅ 完整 |

**結論**：`PAI_Research/` 內所有 T01-T30 報告均已寫入且內容完整。

**問題**：`PAI_Research(1)/` 只到 T14，沒有 T15-T30。

---

## 教訓：Pipeline 設計更新

### 1. Index 腐敗的早期檢測

在 batch 完成後加入：

```python
def verify_index_consistency(index_path, progress_json):
    index_rows = count_checkmarks(index_path)  # ✅ 的數量
    with open(progress_json) as f:
        progress = json.load(f)
    completed = len(progress.get("completed", []))
    
    if index_rows != completed:
        print(f"INDEX ROT DETECTED: index={index_rows}, completed={completed}")
        # 自動重建 index
        rebuild_index(index_path, progress_json)
        return False
    return True
```

### 2. 平行資料夾預檢

在 Phase 1（Design Typed-Report Schema）加入：

```python
def check_parallel_folders(root):
    """檢測並標記平行 research 資料夾"""
    parent = os.path.dirname(root)
    name = os.path.basename(root)
    stem = name.rsplit('_', 1)[0]  # "PAI"
    
    parallels = []
    for entry in os.listdir(parent):
        if entry.startswith(stem) and entry != name:
            # 排除字尾數字差異（PAI_Research vs PAI_Research(1)）
            parallels.append(entry)
    
    if parallels:
        print(f"⚠️  發現平行資料夾: {parallels}")
        print(f"   建議：審計並合併，或標記較小者為歷史文件")
        return parallels
    return []
```

### 3. 當 pipeline 執行者同時是 orchestrator 時

反模式「LLM subagent 會謊報進度」在直接執行時不適用。改用：
- 自己寫入、自己驗證、自己更新 progress
- 沒有「代理信任」問題，但有「情緒 bias」風險（不想驗證自己剛寫的東西）

---

## 與 Life-OS 的對應發現

此 session 的 PAI 分析揭示：

1. **PAI 30 份報告已全部完成**，但 index 文件腐敗導致狀態不明
2. **task_plan.md v4.2 已將 PAI 定義為「外部素材」**，非研究目標
3. **Life-OS 的 KCE 底層優先於 PAI 吸收** — 立場已確認
4. **PAI 的 TELOS 框架可借鑒**（Phase 1 → Vision, Phase 2 → Goal）

---

*記錄時間：2026-05-08 20:30*