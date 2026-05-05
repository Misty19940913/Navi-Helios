---
name: vault-bulk-translation
description: 批次翻譯 Obsidian vault 資料夾（英文→繁體中文）的工作流 — 包含語言偵測、優先級分類、超時處理、Template/Kit 保護
trigger:
  - "翻譯 vault"
  - "翻譯所有檔案"
  - "translate.*vault"
  - "批次翻譯"
  - "全部翻成中文"
  - "600支援"
required_primitives:
  - 02_data-retrieval
  - 03_format-parsing
  - 06_file-operations
  - delegate_task
produces:
  - 翻譯完成的檔案（in-place 覆寫）
  - 翻譯狀態報告
consumed_by:
  - vault-folder-evaluator（蒸餾/刪除/翻譯三軌之一）
last-updated: 2026-05-03
---

# Vault 批次翻譯工作流

## 觸發條件

用戶要求將 vault 中某資料夾的所有 .md 檔案翻譯成繁體中文。

典型句式：
- 「翻譯 600支援」
- 「將這個資料夾全部翻成中文」
- 「translate all files in X to Traditional Chinese」

## 核心原則

1. **Obsidian CLI 不可用時的降級策略**：直接用 `read_file` + `write_file` + `delegate_task` 處理，不依赖 CLI
2. **語言偵測後只翻譯英文檔**：中文檔跳過，節省時間
3. **Template/Kit/Example 檔保留原文**：這些檔案的英文是功能性需求
4. **批次委派防超時**：每批 ≤50 個檔案，避免 subagent timeout

---

## Step 1 — 語言偵測（快速掃描）

在開始翻譯前，先用執行緒對目標資料夾的所有 .md 檔案做語言分類：

```python
import subprocess, re

result = subprocess.run(['find', '<vault-path>', '-name', '*.md'], capture_output=True, text=True)
files = [f for f in result.stdout.strip().split('\n') if f]

zh_files, en_files = [], []
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        chinese = len(re.findall(r'[\u4e00-\u9fff]', content))
        if chinese > 50:
            zh_files.append(f)  # 已是中文，跳過
        else:
            en_files.append(f)  # 需要翻譯
    except:
        pass

print(f"總檔案: {len(files)}, 已是中文: {len(zh_files)}, 需要翻譯: {len(en_files)}")
```

**門檻解釋**：
- `>50` 中文字 → 視為已翻譯（跳過）
- `≤50` 中文字 → 可能原文或極短內容，列入翻譯

**⚠️ 注意**：有些中文檔案 body 極短（如只有 frontmatter），仍會被歸入「英文」。實際上這些檔案內容極少，翻譯價值低。

---

## Step 2 — 識別不應翻譯的檔案

以下類型的檔案**應保留原文**（不等同「全部跳過」，而是選擇性翻譯主內容）：

| 類型 | 辨識關鍵詞 | 原因 |
|:---|:---|:---|
| **Template 檔** | `Template, Properties` | Obsidian 屬性語法需要英文關鍵字 |
| **Kit 檔** | `(kit)` | 教學/範本套件，功能依賴原文 |
| **Example 檔** | `(Example)` | 範例說明，可選是否翻譯 |
| **Plugin/Theme 源檔** | `.css`, `.ts` source | 程式碼保持英文 |

**例外**：若 Example 檔案內容為長篇文章（如用戶自媒體內容），仍應翻譯。

---

## Step 2.5 — 抽樣預檢（避免浪費翻譯）

語言偵測的 `≤50` 中文字門檻**並不等於「需要翻譯」**。常見情況：
- 檔案本體已是繁體中文，只有 frontmatter 含英文
- 檔案極短（如 dataview query 結果展示頁）
- 檔案主體是中文摻少量英文術語

**在委派翻譯前，先抽樣 `en_files` 確認是否真有英文內容：**

```python
import re

sample = en_files[:5]  # 抽前5個
for f in sample:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    # 移除 frontmatter 後檢查 body 是否為英文
    body = re.sub(r'^---\n[\s\S]*?---\n', '', content)
    english_words = len(re.findall(r'\b[a-zA-Z]{3,}\b', body))
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', body))
    print(f"{'⚠️ 全英文' if english_words > 50 and chinese_chars < 10 else '✅ 已是中文'} | {f.split('/')[-1]}")
```

- 若抽樣顯示 `en_files` 大量已是中文 → 整批跳過，直接報告「已是繁體，無需翻譯」
- 若抽樣顯示真有英文內容 → 繼續 Step 3

**本 session 案例**：600支援 vault 的 39 個 `en_files` 抽檢發現全部本體已是繁體中文，全數跳過翻譯。

---

## Step 3 — 批次委派翻譯

將 `en_files` 分成每批 **≤50 個檔案**，委派給 subagent：

```
批次大小：≤50 檔案（防止 600s timeout）
每批使用 1 個 delegate_task（max_concurrent_children=3）
```

### 委派提示詞模板

```
Translate these N .md files to 繁體中文 (Traditional Chinese).

For each file:
1. Read the file
2. Translate body content to Traditional Chinese
3. Preserve: frontmatter YAML, wikilinks [[ ]], markdown formatting
4. Write back to the same file

Files:
<逐行列出檔案路徑>

Report total count translated.
```

### ⚠️ 防止超時的技巧

- **每批 ≤50 檔**：subagent 預設 timeout 600s，太大批會失敗
- **每批一個 delegate_task**：用 3 個平行 worker 處理 3 批
- **若仍超時**：減少到每批 ≤30 檔

---

## Step 4 — 驗證與報告

翻譯完成後，重新執行語言偵測，報告最終狀態：

```python
# 驗證翻譯結果
for f in en_files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    chinese = len(re.findall(r'[\u4e00-\u9fff]', content))
    status = "✅ 已翻" if chinese > 50 else "⚠️ 仍為英文"
    print(f"{status} {f.split('/')[-1]}")
```

---

## 翻譯品質要點

翻譯時應保留：
- ✅ YAML frontmatter（含 tags, dates, links）
- ✅ Wikilinks `[[ ]]`
- ✅ Markdown 標題、列表、粗體、斜體
- ✅ Callout 語法 `>[!type]`
- ✅ Dataview/良渚查詢語法
- ✅ 程式碼區塊
- ✅ 英文書名/電影名/術語（保留原文）

翻譯時應轉換：
- 英文內文 → 繁體中文
- 描述性標題 → 中文標題（可選）
- 英文 URL 保持不變

---

## 陷阱與限制

| 陷阱 | 嚴重程度 | 規則 |
|:---|:---|:---|
| obsidian CLI 未安裝 | 高 | 必須用 `read_file`/`write_file` + `delegate_task`，不放棄 |
| 批次太大導致超時 | 高 | 每批 ≤50 檔，超時立刻減少到 30 檔 |
| Template/Kit 檔被翻譯 | 中 | 這類檔案的 Obsidian 屬性語法需要英文關鍵字，翻譯會破壞功能 |
| 語言偵測門檻過低 | 低 | 50 個中文字是合理的起始門檻，太低會大量誤判，太高會漏掉已翻檔案 |
| 一次委派太多批次 | 中 | max_concurrent_children=3，最多同時 3 個 subagent |

---

## 驗證清單

- [ ] 已執行語言偵測（英文/中文分類）
- [ ] 已識別並跳過 Template/Kit/Example 檔（保留了原文）
- [ ] 每批檔案數 ≤50
- [ ] 委派完成後驗證譯文（中文字數 >50）
- [ ] 報告最終翻譯率

---

## 與 obsidian-cli 的關係

**本 workflow 不依賴 obsidian-cli**，因為：
1. CLI binary 可能未安裝（`command not found`）
2. CLI 需要 Obsidian app 在 Windows 端運行
3. 直接檔案讀寫 + subagent 委派更穩定

**obsidian-cli 適用場景**：用戶vault 已打開 + CLI 已安裝 + 需要即時查詢/搜尋/vault 操作。

**本 workflow 適用場景**：批次翻譯、vault 遷移、大量檔案處理。
