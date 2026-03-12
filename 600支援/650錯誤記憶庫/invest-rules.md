# 財務交易策略編程規則

## 程式語言規範
- **MQL5 檔案**：MetaTrader 5 指標與 EA 開發
- **Pine Script 檔案**：TradingView 指標開發
- 兩種語言需保持邏輯一致性，便於跨平台驗證

## MQL5 編程規範

### 結構體傳遞規則
- **禁止值傳遞**：結構體對象必須通過引用傳遞，不能通過值傳遞
- **正確語法**：
  ```cpp
  // 正確：通過引用傳遞
  void function_name(StructType &parameter);
  
  // 錯誤：值傳遞（會導致編譯錯誤）
  void function_name(StructType parameter);
  ```
- **函數調用**：
  ```cpp
  // 正確的調用方式
  StructType signal;
  function_name(signal);
  
  // 錯誤的調用方式
  StructType signal = function_name(); // 如果函數返回結構體
  ```

### 指針使用限制
- **禁止使用指針**：MQL5 不支持指針操作
- **替代方案**：使用數組索引來引用元素
- **正確做法**：
  ```cpp
  // 正確：使用索引
  int elementIndex = -1;
  for(int i = 0; i < arraySize; i++) {
      if(condition) {
          elementIndex = i;
          break;
      }
  }
  
  // 錯誤：使用指針
  ElementType* pointer = NULL; // 不支持
  ```

### 全局變數管理
- **初始化**：所有全局變數必須在 `OnInit()` 中正確初始化
- **重置機制**：在 `OnDeinit()` 中清理資源
- **狀態追蹤**：使用布林變數追蹤首次運行狀態

### 數組操作規範
- **設置為時間序列**：使用 `ArraySetAsSeries(array, true)`
- **複製數據**：使用 `CopyXXX()` 函數獲取價格數據
- **邊界檢查**：始終檢查數組大小和索引範圍

## 指標開發規範
- 使用標準技術指標庫，避免重複實現基礎功能
- 指標計算必須包含適當的錯誤處理
- 所有輸入參數必須有合理的預設值和範圍限制
- 指標輸出必須清晰標示（上漲/下跌信號）

## EA 開發規範

### 交易信號檢測
- **信號結構**：使用結構體封裝交易信號信息
- **驗證機制**：多重條件驗證，避免假信號
- **時間同步**：確保信號檢測與價格數據同步

### 風險管理實現
- **動態手數計算**：根據風險百分比和止損距離計算
- **止損邏輯**：基於技術分析確定止損位置
- **獲利設定**：使用風險報酬比設定獲利目標

### 訂單管理
- **魔術數字**：使用唯一魔術數字識別EA訂單
- **重複開倉檢查**：防止同一信號重複開倉
- **訂單狀態追蹤**：實時監控訂單狀態

## 風險管理規則
- 強制實作止損機制：單筆最大回撤 ≤ 2%
- 總帳戶風險控制：最大回撤 ≤ 15%
- 禁止硬編碼風險參數，必須使用可配置變數
- 實作資金管理：根據帳戶大小動態調整倉位

### 手數計算公式
```cpp
double CalculateLotSize(double entryPrice, double stopLoss)
{
    double accountBalance = AccountInfoDouble(ACCOUNT_BALANCE);
    double riskAmount = accountBalance * riskPercent / 100.0;
    
    double priceDifference = MathAbs(entryPrice - stopLoss);
    double points = priceDifference / pointSize;
    
    double lotSize = riskAmount / (points * pointValue);
    
    // 調整到合法範圍
    lotSize = MathMax(minLot, MathMin(maxLot, lotSize));
    lotSize = MathRound(lotSize / lotStep) * lotStep;
    
    return lotSize;
}
```

## 回測與驗證
- 自動生成回測報告：年化收益、最大回撤、夏普比率、勝率
- 最小勝率要求：≥ 50%
- 回測期間至少包含一個完整市場週期
- 輸出格式：Excel 或 JSON，便於後續分析

## 命名規範
- 函數：使用 `snake_case`
- 常數：使用大寫，如 `WINDOW_50 = 50`
- 策略類：使用 `PascalCase` 並加上 `Strategy` 後綴
- 變數：使用描述性名稱，避免縮寫
- **MQL5 特定**：
  - 輸入參數：使用 `Inp` 前綴，如 `InpRiskPercent`
  - 全局變數：使用描述性名稱，如 `pointCount`, `trendLineCount`
  - 結構體：使用 `PascalCase`，如 `TradeSignal`, `SwingPoint`

## 日誌與追蹤
- 每筆交易必須記錄：時間戳、商品、價格、信號、損益
- 輸出格式：CSV 或 JSON
- 實盤交易必須加入 `correlation_id` 做追蹤
- 錯誤日誌必須包含詳細的錯誤訊息和堆疊追蹤

### MQL5 日誌規範
```cpp
// 交易執行日誌
Print("訂單發送成功: ", signal.type == 1 ? "多單" : "空單", 
      " 進場價: ", signal.entryPrice,
      " 止損: ", signal.stopLoss,
      " 獲利: ", signal.takeProfit,
      " 手數: ", signal.lotSize);

// 錯誤日誌
Print("訂單發送失敗: ", GetLastError());
```

## API 與安全性
- 禁止在程式碼中硬編碼 API 金鑰
- 使用環境變數或配置檔案管理敏感資訊
- 實作 API 呼叫的錯誤重試機制
- 加入 QPS 限制避免過度請求

## 程式碼品質
- 所有函數必須有適當的註解說明
- 複雜邏輯必須分解為小函數
- 避免重複程式碼，使用函數重構
- 保持程式碼的可讀性和可維護性

### MQL5 代碼組織
```cpp
//+------------------------------------------------------------------+
//| 函數名稱                                                         |
//+------------------------------------------------------------------+
// 函數說明
void FunctionName(parameters)
{
    // 實現邏輯
}
```

## 常見編譯錯誤與解決方案

### 1. 結構體傳遞錯誤
**錯誤訊息**：`'StructType' - objects are passed by reference only`
**解決方案**：將函數參數改為引用傳遞
```cpp
// 修正前
void function(StructType param);

// 修正後
void function(StructType &param);
```

### 2. 指針使用錯誤
**錯誤訊息**：`pointer to type 'Type' is not allowed`
**解決方案**：使用數組索引替代指針
```cpp
// 修正前
Type* pointer = &array[i];

// 修正後
int index = i;
array[index].property;
```

### 3. 數組操作錯誤
**錯誤訊息**：`Array out of bounds`
**解決方案**：添加邊界檢查
```cpp
if(i < ArraySize(array) && i >= 0) {
    // 安全訪問數組
}
```

## 測試與調試
- 使用策略測試器進行回測
- 在模擬帳戶中測試實時交易
- 監控專家顧問日誌
- 定期檢查交易記錄和績效

## 版本控制
- 使用語義化版本號（如 v1.0.0）
- 記錄每次更新的功能和修復
- 保持向後兼容性
- 建立測試用例驗證功能 