---
name: skill-authoring
description: Hermes Skill 創作實戰手冊 — 從構想到落地，包含 tool bug workaround。每一個階段後都有強制停等點，必須有用戶回覆才能繼續。
trigger: 要新建、重建、或大幅修改一個 SKILL.md 時觸發
required_primitives: [01, 02, 06, 08]
produces:
  - SKILL.md 檔案（寫入 ~/.hermes/skills/<name>/，用於定義 Hermes 技能的觸發條件、步驟與交付標準）
consumed_by:
  - Hermes Agent 系統（技能觸發時讀取 SKILL.md 以理解如何執行該技能）
  - hermes-skills-inventory（作為技能清單與狀態的更新依據）
---


# Skill Authoring 實戰手冊

## 核心原則

1. **先確認值不值得建，再動手**：用 Pre-Creation Interview 三題確認這件事真的值得自動化
2. **每個階段後都有停等點**：沒有用户回覆，絕對不自動往下走
3. **SKILL.md = 規格，不是腳本**：步驟用自然語言描述，含決策分支；不要寫成 CI/CD pipeline
4. **落地優先於美觀**：先讓 skill 真的可用，再優化結構
5. **迭代比一次寫完重要 100 倍**：每週只建 1 個，用 3-5 次才微調到 90 分

---

## Pre-Creation Interview（強制前置關卡）

**在動手建任何 skill 之前，先問用戶這三題。沒有用户回答，絕對不往下走。**

### 三題

**問題 1 — 頻率**
> 這類請求你多久會遇到一次？

| 頻率 | 建議 |
|------|------|
| 每天 1 次以上 | 立刻建，回報率最高 |
| 每週 2-5 次 | 很值得建 |
| 每週 1 次 | 值得建但不急 |
| 每月不到 1 次 | 先用筆記，skill 放未來候選 |

**問題 2 — 輸出形式**
> 你希望這個 Skill 做完後交付什麼？

- 一份 Markdown 文件（寫進某個資料夾）
- 一段可以直接複製的文字（貼到社群、Email）
- 一個 JSON / 結構化資料
- 一個帶決策的分析報告

**問題 3 — 確認意圖**
> 這個 skill 建完後，你期望它做什麼？能不能具體描述一次「它成功運作」的畫面？

（如果用戶答不出來，代表還沒想清楚，不應該現在建）

### 停等點：等待用户回覆三題

**收到用户回覆前，絕對不做以下任何事：**
- ❌ 不開始規劃內容結構
- ❌ 不寫 SKILL.md 的任何一行
- ❌ 不假設用户想要什麼

**收到回覆後，根據頻率做判斷：**
- 「每月不到 1 次」→ 寫進 `~/.hermes/tmp/skill-candidates.md` 候選清單，告知用戶「這個 skill 適合未來建，現在先不動手」，**停等點解除，流程結束**
- 「每天」或「每週 2-5 次」且輸出形式清楚 → 告知用戶「根據你的回答，我判斷這個 skill 值得建。現在開始收集資訊。」，**進入 Phase 1**

---

## Phase 1：確認意圖與範圍（停等點 A）

告知用户你對這個 skill 的初步理解，確認方向正確：

> 「根據你的回答，我理解這個 skill 要做的是：[你的摘要]。它應該在 [觸發時機] 時被觸發，輸出 [輸出形式]。我說的對嗎？」

**停等點：等待用户回覆「對」或「不對 / 需要調整」**

- 用户說「對」→ 進入 Phase 2
- 用户說「不對」→ 繼續問「哪裡需要調整」，直到確認清楚再進 Phase 2

---

## Phase 2：規劃內容結構（停等點 B）

根據用戶確認的意圖，規劃 SKILL.md 的內容結構，包含：

```
name: <lowercase-hyphenated>
description: 一句話描述（≤1024 chars）
trigger: 什麼情況觸發此 skill
required_primitives: [01, 02, ...]

# <Skill 名稱>

## 目標
（用一句話說清楚）

## 觸發條件
（具體：被問到 XXX 時、被動觀察到 XXX 時）

## 前置檢查
- [ ] <檢查點 A>
- [ ] <檢查點 B>

## 步驟
（編號，含決策分支）

## 交付標準
（怎麼算完成）
```

**停等點：把規劃的內容呈現給用户，問：**

> 「這是我對這個 skill 的規劃結構。名稱是 [name]，會包含 [步驟數] 個主要步驟。你想批准這個規劃、還是要調整什麼？」

- 用户說「批准」→ 進入 Phase 3
- 用户要求調整 → 根據要求修改規劃，**再次停在停等點 B**，直到批准

---

## Phase 3：寫入磁碟（停等點 C）

### 寫入前最後一次警告

> 「即將把 SKILL.md 寫入 `~/.hermes/skills/<category>/<name>/`。寫入後我會驗證檔案是否存在。這是最後一次回覆機會——如果現在說『停』還來得及。」

**停等點：等待用户回覆「好，寫」或「停」**

- 用户說「停」→ 停在這裡，告知「已取消」
- 用户說「好，寫」→「好，我現在寫入」→ 執行寫入

### 寫入執行

```bash
mkdir -p ~/.hermes/skills/<category>/<name>/
write_file("~/.hermes/skills/<category>/<name>/SKILL.md", content)
```

### 停等點：驗證確認

寫入完成後，立即執行驗證：

```bash
find ~/.hermes/skills/ -name "SKILL.md" | grep <name>
wc -l ~/.hermes/skills/<category>/<name>/SKILL.md
```

**停等點：把驗證結果呈現給用户，問：**

> 「檔案已寫入，驗證結果：[find output]。看起來正常。你確認交付嗎？」

- 用户說「確認」→ 進入 Phase 4
- 用户說「有問題」→ 根據問題修復，再次停在停等點 C

---

## Phase 4：更新庫存與候選清單

### 更新 inventory

在對應分類下新增一行，包含：目錄/檔名、狀態（✓ 或行數）、說明。

### 寫入候選清單（如有必要）

如果這次訪談過程中有其他構想但頻率不夠高，寫進 `~/.hermes/tmp/skill-candidates.md`：

```markdown
## [YYYY-MM-DD] 建議未來建的 Skill

- **/[候選名]** — [做什麼 / 為什麼適合] / 頻率
```

### 告知用戶迭代節奏

告知用户：

> 「這個 skill 建好了。建議迭代節奏：第 1 週每天用 1-2 次觀察哪裡不順，第 2 週根據觀察改 description / 步驟，不要急著一次建很多個 skill。」

**此為流程終點。**

---

## 強制停等點摘要

| 停等點 | 位置 | 通行條件 |
|--------|------|---------|
| Pre-Creation Interview | Phase 0 | 收到三題回覆 |
| Phase 1 確認 | 規劃前 | 用户說「對」 |
| Phase 2 批准 | 結構規劃後 | 用户說「批准」 |
| Phase 3 寫 | 磁碟寫入前 | 用户說「好，寫」 |
| Phase 3 確認 | 寫入驗證後 | 用户說「確認」 |

**沒有在停等點收到用户回覆，絕對不自動往下走。**

---

## 標準流程（被跳過時的備案）

如果用户沒有辦法一次回答完所有問題（例如只想先討論方向），停在最近的有效停等點，等用戶準備好再繼續。

如果用戶想中途放棄，在任何停等點說「取消」，告知「流程已終止，如有需要下次再開始」。

---

## 陷阱與限制

### Step 3：寫入磁碟（重要）

**嚴禁依賴 `skill_manage create`**。實測失效 2 次：回傳成功但檔案未落地。

正確做法：
```bash
mkdir -p ~/.hermes/skills/<name>/
write_file("~/.hermes/skills/<name>/SKILL.md", content)
```

### Step 4：驗證內容正確

- `terminal cat ~/.hermes/skills/<name>/SKILL.md | wc -l` 確認行數
- `terminal grep -n "^[0-9]" ~/.hermes/skills/<name>/SKILL.md` 確認步驟存在

---

## skill_manage tool 現況

| 操作 | 安全性 | 建議 |
|------|--------|------|
| `view` | ⚠️ 偶爾回報目錄不存在 | 改用 `terminal cat` |
| `create` | ❌ 嚴重失效（新建目錄後寫入失敗）| 用 `terminal mkdir + write_file` |
| `write` | ❌ 同上 | 用 `terminal mkdir + write_file` |
| `patch` | ✅ 可用（已存在檔案）| 安全 |
| `edit` | ✅ 可用（完整重寫）| 安全 |

---

## 特殊情境

### 重建 ghost skill（存在於 inventory 但磁碟不存在）

1. 先 `terminal find` 確認磁碟無檔案
2. 用 `terminal mkdir + write_file` 重建
3. 寫入完成後立即 `find` 驗證
4. 更新 inventory 狀態（如有必要）

### 大量建立多個 skill（batch）

使用 `delegate_task` 並行，每個 subagent 各自：
1. `terminal mkdir`
2. `write_file`
3. `terminal find` 驗證

最後主執行緒統一更新 inventory。

### 技能組合（composed skill）

由多個 sub-skill 組成的大型 workflow：
- 命名 convention：`main-skill-name/sub-skill-name/`
- 各自的 `required_primitives` 不重疊（蒸餾後各自承擔不同職責）
- 主 skill 的步驟為：`load skill A → execute → load skill B → execute → ...`

---

## 陷阱筆記

### 陷阱 1：SYMLINK 路徑
`~/.hermes/skills/` 是 symlink，指向 vault 路徑。
- `ls ~/.hermes/skills/` 和 `ls <vault-path>/skills/` 是同一目錄
- Windows 端 OneDrive 同步 = WSL 端直接改寫（两边是同一个目录）
- 驗證：`readlink -f ~/.hermes/skills/`

### 陷阱 2：vault 寫入延遲
OneDrive 同步有延遲，WSL 寫入後 Windows 端可能 5-30 秒才看到。Clinton 實測最慢 2 分鐘。

### 陷阱 3：inventory 落後
inventory 每季更新一次，但 skill 狀態可能隨時變化。**永遠以磁碟 find 結果為準**。

### 陷阱 4：trigger 描述太模糊
壞例子：`trigger: "被問到相關問題時"`（太廣，會被錯誤觸發）
好例子：`trigger: "用戶明確說「我要建立一個新 skill」或「XXX skill 不存在」時"`

### 陷阱 5：停等點被穿越
**當前威脅：Agent 可能假裝「自然規劃」直接略過 Pre-Creation Interview 而不停等用户回覆。**

緩解：每個 Phase 結束時明確說「我現在停下來等你回覆」，把對話主導權交給用户。

### 陷阱 6：`memory` tool 的 `old_text` 比對失效

**現象**：`memory` tool 的 `replace` action 要求 `old_text` 參數，但即使传入完全精確的字串也比對失敗。

**觸發條件**：
- MEMORY 容量高於 95%（2,100+ / 2,200 chars）時最常見
- 任何時候都可能發生

**Workaround（已驗證可行）**：
1. 找到實際 MEMORY.md 檔案位置：`~/.hermes/memories/` → `memories` symlink → `/home/misty/Hermes-Brain/.hermes/memories/MEMORY.md`
2. 用 `patch` tool 直接寫入：`patch(mode="replace", path="/home/misty/Hermes-Brain/.hermes/memories/MEMORY.md", old_string="...", new_string="...")`
3. 驗證：`wc -c /home/misty/Hermes-Brain/.hermes/memories/MEMORY.md`

**預防**：
- MEMORY 超過 80%（1,760 chars）就開始合併/壓縮
- 每次更新前先 `wc -c` 檢查容量

### 陷阱 7：步驟缺少決策分支

沒有 if/else 的步驟列表會在非標準情境下失效。
每個步驟後要自問：「如果失敗呢？如果找不到呢？如果用戶否決呢？」

---

## 迭代節奏（從雷蒙的 Skill Creator Bootstrap 學到的）

**核心原則：一次只養一個 skill，用熟了再下一個。**

| 階段 | 時間 | 動作 |
|------|------|------|
| 建完後第 1 週 | 每天用 1-2 次 | 觀察「哪裡不順」，不回饋給 AI |
| 建完後第 2 週 | 根據觀察改 | 改 description、改步驟、加範例 |
| 建完後第 3 週 | 從候選清單挑下一個 | 開始建第二個 |
| 每個月 1 號 | 複習整個 skill 庫 | 砍掉上個月沒觸發過的 |

**為什麼不能一次建很多個**：
- 你還不知道哪些真的會用到。很多你「以為會常用」的 skill，建了才發現一個月才觸發一次。
- 每個 skill 第一次跑出來通常只有 60 分，要用 3-5 次才會到 90 分。同時養 10 個 skill，10 個都卡在 60 分。
- 你的工作習慣會變。現在覺得重要的流程，3 個月後可能就換了。Skill 庫越精煉越好。

**健康信號**：一個 skill 的健康狀態是「每週有被用一次、每週有被改一次」。不是寫完就完美。

---

## 驗收清單（每次 skill 建立後跑一次）

- [ ] `find ~/.hermes/skills/ -name SKILL.md | grep <name>` 有結果
- [ ] `wc -l` 行數符合預期（>50 行 content skill、>30 行 meta skill）
- [ ] frontmatter 含 `name`, `description`, `trigger`, `required_primitives`
- [ ] inventory 已更新（或已標記「下次更新」）
- [ ] trigger 描述具體到不會被誤觸發
- [ ] 步驟含決策分支
- [ ] 陷阱章節有記錄本次發現的問題
- [ ] 5 個停等點全部有用户回覆才通過
