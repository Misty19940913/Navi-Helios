//+------------------------------------------------------------------+
//|                                              小波趨勢交易EA.mq5 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"

//--- 輸入參數
input double InpRiskPercent = 1.0;        // 風險百分比 (本金1%)
input double InpProfitRatio = 1.0;        // 獲利比例 (1:1)
input int    InpMagicNumber = 12345;      // 魔術數字
input string InpComment = "小波趨勢EA";    // 訂單註釋

//--- 全局變數
struct SwingPoint
{
   datetime time;
   double   price;
   int      type;  // 1=上漲, 2=下跌
};

SwingPoint swingPoints[5];  // 存儲擺動點
int         pointCount = 0; // 當前點數
int         currentType = 0; // 當前趨勢類型
bool        isFirstRun = true;
bool        lastTrendType = 0; // 上次趨勢類型 (0=無, 1=上漲, 2=下跌)
bool        trendChanged = false; // 趨勢是否改變

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   // 初始化擺動點數組
   for(int i = 0; i < 5; i++)
   {
      swingPoints[i].time = 0;
      swingPoints[i].price = 0;
      swingPoints[i].type = 0;
   }
   
   // 檢查輸入參數
   if(InpRiskPercent <= 0 || InpRiskPercent > 10)
   {
      Print("風險百分比必須在 0-10% 之間");
      return(INIT_PARAMETERS_INCORRECT);
   }
   
   if(InpProfitRatio <= 0)
   {
      Print("獲利比例必須大於 0");
      return(INIT_PARAMETERS_INCORRECT);
   }
   
   Print("小波趨勢交易EA 初始化完成");
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                               |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   Print("小波趨勢交易EA 已停止");
}

//+------------------------------------------------------------------+
//| Expert tick function                                            |
//+------------------------------------------------------------------+
void OnTick()
{
   // 檢查是否有足夠的數據
   if(Bars(_Symbol, _Period) < 10) return;
   
   // 更新擺動點
   UpdateSwingPoints();
   
   // 檢查趨勢變化並執行交易
   CheckTrendChangeAndTrade();
}

//+------------------------------------------------------------------+
//| 更新擺動點                                                       |
//+------------------------------------------------------------------+
void UpdateSwingPoints()
{
   // 獲取價格數據
   double close[], open[], high[], low[];
   datetime time[];
   
   ArraySetAsSeries(close, true);
   ArraySetAsSeries(open, true);
   ArraySetAsSeries(high, true);
   ArraySetAsSeries(low, true);
   ArraySetAsSeries(time, true);
   
   CopyClose(_Symbol, _Period, 0, 10, close);
   CopyOpen(_Symbol, _Period, 0, 10, open);
   CopyHigh(_Symbol, _Period, 0, 10, high);
   CopyLow(_Symbol, _Period, 0, 10, low);
   CopyTime(_Symbol, _Period, 0, 10, time);
   
   // 處理每個K線
   for(int i = 1; i < 10; i++)
   {
      ProcessSwingPoint(i, time, open, high, low, close);
   }
}

//+------------------------------------------------------------------+
//| 處理擺動點                                                       |
//+------------------------------------------------------------------+
void ProcessSwingPoint(int index, const datetime &time[], const double &open[], 
                      const double &high[], const double &low[], const double &close[])
{
   bool isBullish = close[index] > open[index];  // 看漲K棒
   bool prevBullish = (index > 0) ? close[index-1] > open[index-1] : false;
   
   if(isBullish)  // 看漲K棒
   {
      currentType = 1; // 上漲
      
      if(prevBullish)  // 前一根也是看漲K棒
      {
         // 趨勢延續
         if(high[index] > swingPoints[0].price)
         {
            swingPoints[0].price = high[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 1;
         }
      }
      else
      {
         // 趨勢改變
         AddSwingPoint(time[index], high[index], 1);
      }
   }
   else  // 看跌K棒
   {
      currentType = 2; // 下跌
      
      if(!prevBullish)  // 前一根也是看跌K棒
      {
         // 趨勢延續
         if(low[index] < swingPoints[0].price)
         {
            swingPoints[0].price = low[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 2;
         }
      }
      else
      {
         // 趨勢改變
         AddSwingPoint(time[index], low[index], 2);
      }
   }
}

//+------------------------------------------------------------------+
//| 添加擺動點                                                       |
//+------------------------------------------------------------------+
void AddSwingPoint(datetime time, double price, int type)
{
   // 移動現有數據
   for(int i = 4; i > 0; i--)
   {
      swingPoints[i] = swingPoints[i-1];
   }
   
   // 添加新點
   swingPoints[0].time = time;
   swingPoints[0].price = price;
   swingPoints[0].type = type;
   
   if(pointCount < 5) pointCount++;
}

//+------------------------------------------------------------------+
//| 檢查趨勢變化並執行交易                                           |
//+------------------------------------------------------------------+
void CheckTrendChangeAndTrade()
{
   if(pointCount < 2) return;
   
   // 檢查趨勢是否改變
   if(lastTrendType != 0 && lastTrendType != currentType)
   {
      trendChanged = true;
      
      // 根據趨勢變化執行交易
      if(lastTrendType == 2 && currentType == 1)  // 下跌轉上漲
      {
         ExecuteBuyOrder();
      }
      else if(lastTrendType == 1 && currentType == 2)  // 上漲轉下跌
      {
         ExecuteSellOrder();
      }
   }
   
   lastTrendType = currentType;
}

//+------------------------------------------------------------------+
//| 執行買入訂單                                                     |
//+------------------------------------------------------------------+
void ExecuteBuyOrder()
{
   if(pointCount < 2) return;
   
   // 找到下跌趨勢線的高點和低點
   double entryPrice = 0;  // 進場價格 (下跌趨勢線高點)
   double stopLoss = 0;    // 止損價格 (下跌趨勢線低點)
   
   // 尋找下跌趨勢線的點
   for(int i = 0; i < pointCount; i++)
   {
      if(swingPoints[i].type == 2)  // 下跌點
      {
         if(entryPrice == 0 || swingPoints[i].price > entryPrice)
         {
            entryPrice = swingPoints[i].price;  // 最高點
         }
         if(stopLoss == 0 || swingPoints[i].price < stopLoss)
         {
            stopLoss = swingPoints[i].price;    // 最低點
         }
      }
   }
   
   if(entryPrice == 0 || stopLoss == 0) return;
   
   // 計算手數
   double lotSize = CalculateLotSize(entryPrice, stopLoss);
   
   // 計算獲利價格
   double profitPrice = entryPrice + (entryPrice - stopLoss) * InpProfitRatio;
   
   // 執行買入訂單
   MqlTradeRequest request = {};
   MqlTradeResult result = {};
   
   request.action = TRADE_ACTION_DEAL;
   request.symbol = _Symbol;
   request.volume = lotSize;
   request.type = ORDER_TYPE_BUY;
   request.price = entryPrice;
   request.sl = stopLoss;
   request.tp = profitPrice;
   request.deviation = 3;
   request.magic = InpMagicNumber;
   request.comment = InpComment;
   request.type_filling = ORDER_FILLING_FOK;
   
   bool success = OrderSend(request, result);
   
   if(success && result.retcode == TRADE_RETCODE_DONE)
   {
      Print("買入訂單執行成功: 進場=", entryPrice, " 止損=", stopLoss, " 獲利=", profitPrice);
   }
   else
   {
      Print("買入訂單執行失敗: ", result.retcode);
   }
}

//+------------------------------------------------------------------+
//| 執行賣出訂單                                                     |
//+------------------------------------------------------------------+
void ExecuteSellOrder()
{
   if(pointCount < 2) return;
   
   // 找到上漲趨勢線的低點和高點
   double entryPrice = 0;  // 進場價格 (上漲趨勢線低點)
   double stopLoss = 0;    // 止損價格 (上漲趨勢線高點)
   
   // 尋找上漲趨勢線的點
   for(int i = 0; i < pointCount; i++)
   {
      if(swingPoints[i].type == 1)  // 上漲點
      {
         if(entryPrice == 0 || swingPoints[i].price < entryPrice)
         {
            entryPrice = swingPoints[i].price;  // 最低點
         }
         if(stopLoss == 0 || swingPoints[i].price > stopLoss)
         {
            stopLoss = swingPoints[i].price;    // 最高點
         }
      }
   }
   
   if(entryPrice == 0 || stopLoss == 0) return;
   
   // 計算手數
   double lotSize = CalculateLotSize(entryPrice, stopLoss);
   
   // 計算獲利價格
   double profitPrice = entryPrice - (stopLoss - entryPrice) * InpProfitRatio;
   
   // 執行賣出訂單
   MqlTradeRequest request = {};
   MqlTradeResult result = {};
   
   request.action = TRADE_ACTION_DEAL;
   request.symbol = _Symbol;
   request.volume = lotSize;
   request.type = ORDER_TYPE_SELL;
   request.price = entryPrice;
   request.sl = stopLoss;
   request.tp = profitPrice;
   request.deviation = 3;
   request.magic = InpMagicNumber;
   request.comment = InpComment;
   request.type_filling = ORDER_FILLING_FOK;
   
   bool success = OrderSend(request, result);
   
   if(ticket > 0)
   {
      Print("賣出訂單執行成功: 進場=", entryPrice, " 止損=", stopLoss, " 獲利=", profitPrice);
   }
   else
   {
      Print("賣出訂單執行失敗: ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| 計算手數大小                                                     |
//+------------------------------------------------------------------+
double CalculateLotSize(double entryPrice, double stopLoss)
{
   double accountBalance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskAmount = accountBalance * InpRiskPercent / 100.0;
   
   double pointValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   
   // 計算點差
   double priceDifference = MathAbs(entryPrice - stopLoss);
   double points = priceDifference / tickSize;
   
   // 計算每手風險
   double riskPerLot = points * pointValue;
   
   // 計算所需手數
   double lotSize = riskAmount / riskPerLot;
   
   // 調整到最小手數
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   
   lotSize = MathMax(minLot, MathMin(maxLot, lotSize));
   lotSize = NormalizeDouble(lotSize / lotStep, 0) * lotStep;
   
   return lotSize;
}

//+------------------------------------------------------------------+
//| 檢查是否有開倉訂單                                               |
//+------------------------------------------------------------------+
bool HasOpenOrders()
{
   for(int i = 0; i < OrdersTotal(); i++)
   {
      if(OrderSelect(OrderGetTicket(i)))
      {
         if(OrderGetString(ORDER_SYMBOL) == _Symbol && 
            OrderGetInteger(ORDER_MAGIC) == InpMagicNumber)
         {
            return true;
         }
      }
   }
   return false;
} 