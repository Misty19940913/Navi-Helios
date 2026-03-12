---
name: obsidian-bases
description: 使用檢視 (Views)、篩選器 (Filters)、公式 (Formulas) 與摘要 (Summaries) 建立與編輯 Obsidian Bases (.base 檔案)。當處理 .base 檔案、建立筆記的資料庫式檢視，或使用者提及 Bases、表格檢視、卡片檢視、篩選器或 Obsidian 中的公式時，請使用此技能。
---

# Obsidian Bases 技能

此技能使具備技能相容性的代理人能夠建立和編輯有效的 Obsidian Bases (`.base` 檔案)，包括檢視、篩選器、公式以及所有相關配置。

## 概覽

Obsidian Bases 是基於 YAML 的檔案，定義了 Obsidian 資源庫中筆記的動態檢視。一個 Base 檔案可以包含多個檢視、全域篩選器、公式、屬性配置以及自定義摘要。

## 檔案格式

Base 檔案使用 `.base` 副檔名並包含有效的 YAML 內容。它們也可以嵌入在 Markdown 代碼塊中。

## 完整架構 (Schema)

```yaml
# 全域篩選器適用於 Base 中的所有檢視
filters:
  # 可以是單一篩選字串
  # 或具備 and/or/not 的遞歸篩選物件
  and: []
  or: []
  not: []

# 定義可在所有檢視中使用的公式屬性
formulas:
  公式名稱: '表達式'

# 配置屬性的顯示名稱與設定
properties:
  屬性名稱:
    displayName: "顯示名稱"
  formula.公式名稱:
    displayName: "公式顯示名稱"
  file.ext:
    displayName: "副檔名"

# 定義自定義摘要公式
summaries:
  自定義摘要名稱: 'values.mean().round(3)'

# 定義一個或多個檢視
views:
  - type: table | cards | list | map
    name: "檢視名稱"
    limit: 10                    # 選填：限制結果數量
    groupBy:                     # 選填：分組結果
      property: 屬性名稱
      direction: ASC | DESC
    filters:                     # 檢視特定篩選器
      and: []
    order:                       # 依序顯示的屬性
      - file.name
      - 屬性名稱
      - formula.公式名稱
    summaries:                   # 將屬性映射到摘要公式
      屬性名稱: Average
```

## 篩選器語法 (Filter Syntax)

篩選器用於縮小結果範圍。它們可以全域套用或按檢視套用。

### 篩選器結構

```yaml
# 單一篩選器
filters: 'status == "done"'

# AND - 所有條件皆須成立
filters:
  and:
    - 'status == "done"'
    - 'priority > 3'

# OR - 任一條件成立即可
filters:
  or:
    - 'file.hasTag("book")'
    - 'file.hasTag("article")'

# NOT - 排除符合的項目
filters:
  not:
    - 'file.hasTag("archived")'
```

### 篩選運算子

| 運算子 | 描述 |
|----------|-------------|
| `==` | 等於 |
| `!=` | 不等於 |
| `>` | 大於 |
| `<` | 小於 |
| `>=` | 大於等於 |
| `<=` | 小於等於 |
| `&&` | 邏輯且 (And) |
| `||` | 邏輯或 (Or) |
| `!` | 邏輯非 (Not) |

## 屬性 (Properties)

### 三種屬性類型

1. **筆記屬性 (Note properties)** - 來自 Frontmatter：`note.author` 或僅寫 `author`
2. **檔案屬性 (File properties)** - 檔案元數據：`file.name`, `file.mtime` 等
3. **公式屬性 (Formula properties)** - 計算值：`formula.我的公式`

### 檔案屬性參考表

| 屬性 | 類型 | 描述 |
|----------|------|-------------|
| `file.name` | 字串 | 檔名 |
| `file.basename` | 字串 | 不含副檔名的檔名 |
| `file.path` | 字串 | 完整檔案路徑 |
| `file.folder` | 字串 | 父資料夾路徑 |
| `file.ext` | 字串 | 副檔名 |
| `file.size` | 數字 | 檔案大小 (位元組) |
| `file.ctime` | 日期 | 建立時間 |
| `file.mtime` | 日期 | 修改時間 |
| `file.tags` | 清單 | 檔案中的所有標籤 |
| `file.links` | 清單 | 檔案中的內部連結 |
| `file.properties` | 物件 | 所有 Frontmatter 屬性 |

## 公式語法 (Formula Syntax)

公式從屬性運算得出數值。於 `formulas` 區塊定義。

```yaml
formulas:
  # 簡單算術
  total: "price * quantity"

  # 條件邏輯
  status_icon: 'if(done, "✅", "⏳")'

  # 日期格式化
  created: 'file.ctime.format("YYYY-MM-DD")'

  # 計算自建立以來的天數 (使用 .days 取得時段數值)
  days_old: '(now() - file.ctime).days'
```

### 重要：時長 (Duration) 類型處理

當兩個日期相減時，結果是 **Duration** 類型（而非純數字）。Duration 擁有自己的欄位：
- `duration.days`: 總天數
- `duration.hours`: 總時數
- `duration.minutes`: 總分鐘數

**注意**：你必須先存取數字欄位（如 `.days`），然後才能套用 `round()` 等數字函數。
*   **正確**：`(date(due) - today()).days.round(0)`
*   **錯誤**：`(date(due) - today()).round(0)`

## 常用函數參考

| 函數 | 簽章 | 描述 |
|----------|-----------|-------------|
| `date()` | `date(string)` | 解析字串為日期 (YYYY-MM-DD HH:mm:ss) |
| `now()` | `now()` | 當前日期與時間 |
| `today()` | `today()` | 當前日期 (時間為 00:00:00) |
| `if()` | `if(條件, 真值, 假值?)` | 條件判斷 |
| `link()` | `link(路徑, 顯示?)` | 建立連結 |
| `file()` | `file(路徑)` | 取得檔案物件 |
| `format()` | `date.format(字串)` | 使用 Moment.js 格式化日期 |

## 檢視類型 (View Types)

*   **Table (表格)**：標準列/欄佈局。
*   **Cards (卡片)**：視覺化網格，適合圖片或摘要。
*   **List (清單)**：簡潔的單欄列表。
*   **Map (地圖)**：需要經緯度屬性與 Maps 插件。

## 完整範例：任務追蹤器

```yaml
filters:
  and:
    - file.hasTag("task")
    - 'file.ext == "md"'

formulas:
  days_until_due: 'if(due, (date(due) - today()).days, "")'
  priority_label: 'if(priority == 1, "🔴 高", if(priority == 2, "🟡 中", "🟢 低"))'

properties:
  status:
    displayName: 狀態
  formula.days_until_due:
    displayName: "剩餘天數"

views:
  - type: table
    name: "活躍任務"
    filters:
      and:
        - 'status != "done"'
    order:
      - file.name
      - status
      - formula.priority_label
      - due
      - formula.days_until_due
    groupBy:
      property: status
      direction: ASC
```

## 嵌入 Bases

在 Markdown 檔案中嵌入：
```markdown
![[我的檢視.base]]

<!-- 指定特定檢視 -->
![[我的檢視.base#檢視名稱]]
```

## 參考資料

- [Bases 語法](https://help.obsidian.md/bases/syntax)
- [檢視](https://help.obsidian.md/bases/views)
- [公式](https://help.obsidian.md/formulas)
