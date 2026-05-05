# DOM/CSS Clone Debug 法

## 觸發條件
當需要讓 A plugin 的 UI 渲染完全匹配 B plugin 的外觀，而:
- 嘗試過 patch/incremental 修改，效果不如預期
- 不確定 B plugin 的 DOM 結構或 CSS 優先級
- 需要在 DevTools 中比對 computed style

## 核心原則
**Clone 整個 source tree，不只是參考幾個檔案。**

「用 B 的命名自己發明實作」是失敗模式——
你猜測的 DOM 結構、CSS 優先級、CSS 具體數值，沒有一個是確定的。

## 工作流程

### Step 1 — Clone 完整 source
```bash
cd /tmp
git clone <B-plugin-repo-url> /tmp/tasknotes-src
```
目標：拿到所有相關 source、styles、templates。

### Step 2 — 識別相關檔案
從關鍵字搜尋出發，找出：
- `*.ts` 中建立 DOM 的程式碼（通常 `create*`、`render*`、`build*` 函數）
- `styles/*.css` 中視覺相關的 CSS 檔案
- editor/widget 相關的擴展程式碼

### Step 3 — 完整閱讀 DOM 結構檔案
不要只看「關鍵部分」——從頭讀到尾，確認：
- 外層 wrapper 的 HTML tag 和 class
- 內層元素的 nested 結構
- 事件監聽器的 attachment 位置
- conditional 邏輯（哪些 element 在哪些條件下才存在）

### Step 4 — 完整閱讀 CSS 檔案
不要只找 `display` 屬性——
- 優先級規則（`!important`、specificity）
- `:not(:empty)`、`:hover`、`:focus-visible` 等 pseudo-class
- `inline` vs `block` vs `inline-block` 的使用位置
- 各狀態（default、hover、focus、selected）的完整樣式

### Step 5 — DevTools 驗證（比對用）
在已正常運作的 B plugin 頁面：
1. `document.querySelectorAll('.target-class')` 確認元素存在
2. `getComputedStyle(el)` 取得 computed values
3. 記錄 DOM tree 結構（parent/children 關係）

### Step 6 — 結構性移植（非 patch）
不是對現有檔案做 patch，而是：
1. 建立新的實作檔案（完整rewrite）
2. 完整複製 B 的 DOM 結構
3. 完整移植 B 的 CSS（含所有 `!important`）
4. 確認移植後再整合

### Step 7 — 隔離變數
每次只驗證一個維度：
1. 先確認 DOM 結構完全一致（不改 CSS）
2. 再確認 CSS 完全一致（不變 DOM）
3. 若還有差異，在 DevTools 中比對 computed style

## 常見失敗模式
- 只 clone 「關鍵幾個檔案」→ 忽略了關鍵的 helper function 或 CSS 變數
- 用 patch 修改現有檔案 → 無法隔離變數，不知道哪個改動造成什麼效果
- 只看 DOM 不看 CSS → 忽略了 `:empty` check、hover 樣式、優先級問題
- 不在 DevTools 驗證 → 所有假設都是猜測
- **CSS inline model 的脆弱性**：`display: inline` 的元素內部不能有 `display: block` 的子元素。用 `div`（預設 block）當作 inline span 的子元素，會在內部產生換行。Inline widget 的所有元素必須是 `span`（inline）或 `display: inline/inline-block`。

## 驗證清單
- [ ] DOM wrapper tag 和 class 完全一致
- [ ] 所有 nested element 結構完全一致
- [ ] CSS `!important` 規則已移植
- [ ] `:not(:empty)` 等 pseudo-class 條件已確認
- [ ] `inline` vs `block` 明確區分（inline widget 內部杜絕 block 元素）
- [ ] DevTools 中 computed style 比對無差異
- [ ] 事件監聽器位置一致
- [ ] 確認 `WidgetType.block` 屬性（CodeMirror 決定 inline vs block 的根源）
