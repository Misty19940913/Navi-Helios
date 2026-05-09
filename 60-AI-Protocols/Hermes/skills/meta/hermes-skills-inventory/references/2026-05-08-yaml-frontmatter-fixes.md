# YAML Frontmatter 失效修復記錄（2026-05-08）

## 本次維修：12 個 SKILL.md

### 集體失效：`_primitives/01~08` trigger 引號內嵌
全部 8 個都是 `trigger: "要做什麼"時觸發` — 夾雜在雙引號字串內的「時觸發」導致 YAML 解析在第2個 `"` 處失敗。

| 檔案 | 修復前 | 修復後 |
|---|---|---|
| `01_flow-planning` | `"需要規劃執行步驟"時觸發` | `"需要規劃執行步驟時觸發"` |
| `02_data-retrieval` | `"需要查詢資料"時觸發` | `"需要查詢資料時觸發"` |
| `03_format-parsing` | `"需要解析或轉換格式"時觸發` | `"需要解析或轉換格式時觸發"` |
| `04_format-validation` | `"需要驗證格式正確性"時觸發` | `"需要驗證格式正確性時觸發"` |
| `05_content-generation` | `"需要生成內容"時觸發` | `"需要生成內容時觸發"` |
| `06_file-operations` | `"需要讀取或寫入檔案"時觸發` | `"需要讀取或寫入檔案時觸發"` |
| `07_external-publishing` | `"需要發布到外部平台"時觸發` | `"需要發布到外部平台時觸發"` |
| `08_logging` | `"需要記錄操作日誌"時觸發` | `"需要記錄操作日誌時觸發"` |

### 個別失效

**`creative/pretext`** — `@` 字元在 YAML 視為未知 token
- 錯誤：`- @chenglou/pretext`
- 修復：`- "@chenglou/pretext"`

**`creative/baoyu-comic`** — trigger 用 `|` 連結多個字串（在引號內）
- 錯誤：`trigger: "知識漫畫" | "教育漫畫" | ...`
- 修復：改為 YAML 陣列格式

**`mlops/inference/vllm`** — trigger 用逗號分隔（在引號內，非陣列語法）
- 錯誤：`trigger: "deploy vllm", "serve model with vllm", ...`
- 修復：改為 YAML 陣列格式

**`workflow/pattern-pending`** — frontmatter 完全缺少 `name:` 欄位
- 錯誤：frontmatter 從 `version:` 開始，無 `name:`
- 修復：插入 `name: pattern-pending`，並註冊進 manifest

## manifest hash 更新（11 個）

| name | 舊 hash | 新 hash |
|---|---|---|
| `pretext` | `1a72b0c0` | `f4ae7fdf` |
| `baoyu-comic` | `0be1250d` | `9559feef` |
| `serving-llms-vllm` | `5a6bdfec` | `c712f528` |
| `01_flow-planning` | `8e62263f` | `8e62263f`（內容未變）|
| `02_data-retrieval` | `9ab9bdf4` | `36bb7d1e` |
| `03_format-parsing` | `e9d59eb6` | `ceb9a4ee` |
| `04_format-validation` | `520572f1` | `fc6044cd` |
| `05_content-generation` | `e7dabae4` | `a90e10fd` |
| `06_file-operations` | `4e82a28c` | `5da8ac44` |
| `07_external-publishing` | `b1f01edb` | `0219de5d` |
| `08_logging` | `4458f0ac` | `4458f0ac`（內容未變）|
| `pattern-pending` |（新註冊）| `db8742d5` |

## 維修後狀態
```
Manifest: 120 | Disk: 120 | YAML errors: 0 | Gap: 0 ✓
```

## 根本原因分析
`_primitives/` 系列建立時，trigger 表達意圖是「"要做什麼"時觸發」，但格式寫成了 `"要做什麼"時觸發` — 兩個雙引號在 YAML 字串內部未被視為轉義，導致解析失敗。這是系統性格式錯誤，非內容問題。
