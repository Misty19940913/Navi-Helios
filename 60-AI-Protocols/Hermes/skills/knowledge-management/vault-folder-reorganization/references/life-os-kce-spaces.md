# Life-OS KCE 空間歸屬發現記錄（2026-05-05）

## 核心問題

跨文件交叉閱讀時發現：同一元件（Goal）在不同章節被歸屬於不同 KCE 空間。

## 矛盾細節

| 元件 | 1.4（KCE 對應表）| 1.2（執行鏈）| 狀態 |
|------|----------------|-----------|------|
| Vision | Knowledge（願景沉澱）| 横跨三空間 | ✗ |
| Goal | Knowledge（願景沉澱）| **Efforts 空間** | ✗ 矛盾 |
| Area | 未明確定義 | 未定義 | — |
| Effort | **Efforts 空間** | Efforts 空間 | ✓ |
| Task | **Efforts 空間** | Efforts 空間 | ✓ |
| Log | Calendar 空間 | Calendar 空間 | ✓ |

## 正確歸屬（基於執行鏈 1.2）

```
Vision（願景）→ 横跨 Knowledge / Calendar / Efforts 三空間
Goal（目標）→ 隸屬 Efforts 空間（戰略規劃層，催生 Task/Effort）
Effort（努力）→ 隸屬 Efforts 空間
Task（任務）→ 隸屬 Efforts 空間
Log（日誌）→ 隸屬 Calendar 空間
```

## 系統串聯圖（修訂前）的其他問題

1. `北極星（Vision）←── 五宮格` → Vision 被 Area 五宮格催生，方向反了
2. `Area_MOC ←── 五宮格` → 五宮格就是 Area，應為 `Area → Area_MOC`
3. `←── 催生 ──→` → 催生是單向不是雙向
4. `沉澱` 只標在 Calendar，但 Task/Effort 也會沉澱
5. `HQ Center（MOC）← 處理中心入口` → 三空間外無此元件

## lesson

跨文件架構審查不只要查「立場 vs 行動」，還要查：
- **圖 vs 文**：口述定義與圖示是否一致
- **空間歸屬**：KCE 三空間對應表（1.4）與執行鏈（1.2）是否一致
- **箭頭方向**：催生（單向）vs 沉澱（單向）不可標成雙向
