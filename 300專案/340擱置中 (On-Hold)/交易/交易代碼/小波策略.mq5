//+------------------------------------------------------------------+
//|                                                    小波策略.mq5 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict

//--- 輸入參數
input group "交易參數"
input double LotSize = 0.1;           // 交易手數
input int    MagicNumber = 12345;     // 魔術數字
input int    Slippage = 3;            // 滑點

input group "風險管理"
input double MaxRiskPercent = 2.0;    // 最大風險百分比
input double StopLossMultiplier = 1.0; // 止損倍數

input group "小波指標參數"
input bool   ShowSWING = true;        // 顯示 SWING
input int    WidthSWING = 1;          // 線條寬度
input ENUM_LINE_STYLE UPLineStyle = STYLE_SOLID;    // 上漲線條樣式
input ENUM_LINE_STYLE DOWNLineStyle = STYLE_SOLID;  // 下跌線條樣式
input color  UPLineColor = clrRed;                  // 上漲線條顏色
input color  DOWNLineColor = clrLime;               // 下跌線條顏色

//--- 全局變數
struct SwingPoint
{
    datetime time;
    double   price;
    int      type;  // 1=上漲, 2=下跌
};

SwingPoint swingPoints[5];  // 存儲轉折點
int         pointCount = 0; // 當前點數
int         currentType = 0; // 當前趨勢類型
bool        runStart = true;

// 交易狀態變數
bool        lastTrendWasDown = false;  // 前一個趨勢是否為下跌
bool        lastTrendWasUp = false;    // 前一個趨勢是否為上漲
double      lastDownHigh = 0;          // 前一個下跌趨勢的最高點
double      lastUpLow = 0;             // 前一個上漲趨勢的最低點
bool        longSignalTriggered = false; // 多單信號已觸發
bool        shortSignalTriggered = false; // 空單信號已觸發

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // 初始化陣列
    ArrayResize(swingPoints, 5);
    for(int i = 0; i < 5; i++)
    {
        swingPoints[i].time = 0;
        swingPoints[i].price = 0;
        swingPoints[i].type = 0;
    }
    
    Print("小波策略 EA 初始化完成");
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    ObjectsDeleteAll(0, "SWING_");
    Print("小波策略 EA 已停止");
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
    // 檢查是否有足夠的歷史數據
    if(Bars(_Symbol, PERIOD_CURRENT) < 10) return;
    
    // 更新小波指標
    UpdateSwingPoints();
    
    // 檢查交易信號
    CheckTradeSignals();
    
    // 管理現有倉位
    ManagePositions();
}

//+------------------------------------------------------------------+
//| 更新轉折點                                                       |
//+------------------------------------------------------------------+
void UpdateSwingPoints()
{
    double close[], open[], high[], low[];
    datetime time[];
    
    // 獲取最近的K線數據
    ArraySetAsSeries(close, true);
    ArraySetAsSeries(open, true);
    ArraySetAsSeries(high, true);
    ArraySetAsSeries(low, true);
    ArraySetAsSeries(time, true);
    
    CopyClose(_Symbol, PERIOD_CURRENT, 0, 3, close);
    CopyOpen(_Symbol, PERIOD_CURRENT, 0, 3, open);
    CopyHigh(_Symbol, PERIOD_CURRENT, 0, 3, high);
    CopyLow(_Symbol, PERIOD_CURRENT, 0, 3, low);
    CopyTime(_Symbol, PERIOD_CURRENT, 0, 3, time);
    
    if(ArraySize(close) < 2) return;
    
    // 判斷趨勢
    bool isBullish = close[0] > open[0];  // 看漲K棒
    bool prevBullish = close[1] > open[1];  // 前一根K棒
    
    if(isBullish)  // 看漲K棒
    {
        currentType = 1;  // 1為上漲，2為下跌
        
        if(prevBullish)  // 如果前1K棒也是看漲K棒
        {
            // 趨勢延續
            if(high[0] > swingPoints[0].price)  // 新高是否高於前一個最高點
            {
                swingPoints[0].price = high[0];
                swingPoints[0].time = time[0];
                swingPoints[0].type = 1;
            }
        }
        else
        {
            // 趨勢改變
            InsertSwingPoint(time[0], high[0], 1);
        }
    }
    else  // 看跌K棒
    {
        currentType = 2;  // 1為上漲，2為下跌
        
        if(!prevBullish)  // 如果前1K棒也是看跌K棒
        {
            // 趨勢延續
            if(low[0] < swingPoints[0].price)  // 新低是否低於前一個最低點
            {
                swingPoints[0].price = low[0];
                swingPoints[0].time = time[0];
                swingPoints[0].type = 2;
            }
        }
        else
        {
            // 趨勢改變
            InsertSwingPoint(time[0], low[0], 2);
        }
    }
    
    // 繪製趨勢線
    if(ShowSWING && pointCount >= 2)
    {
        DrawSwingLines();
    }
}

//+------------------------------------------------------------------+
//| 插入轉折點                                                        |
//+------------------------------------------------------------------+
void InsertSwingPoint(datetime time, double price, int type)
{
    // 記錄前一個趨勢類型
    if(pointCount > 0)
    {
        if(swingPoints[0].type == 2) // 前一個是下跌趨勢
        {
            lastTrendWasDown = true;
            lastDownHigh = swingPoints[0].price;
            lastTrendWasUp = false;
        }
        else if(swingPoints[0].type == 1) // 前一個是上漲趨勢
        {
            lastTrendWasUp = true;
            lastUpLow = swingPoints[0].price;
            lastTrendWasDown = false;
        }
    }
    
    // 移動現有點
    for(int i = 4; i > 0; i--)
    {
        swingPoints[i] = swingPoints[i-1];
    }
    
    // 插入新點
    swingPoints[0].time = time;
    swingPoints[0].price = price;
    swingPoints[0].type = type;
    
    if(pointCount < 5) pointCount++;
}

//+------------------------------------------------------------------+
//| 繪製SWING線條                                                    |
//+------------------------------------------------------------------+
void DrawSwingLines()
{
    if(pointCount < 2) return;
    
    // 清除舊線條
    ObjectsDeleteAll(0, "SWING_");
    
    // 繪製新線條
    for(int i = 0; i < pointCount - 1; i++)
    {
        string lineName = "SWING_" + IntegerToString(i);
        
        color lineColor = (swingPoints[i].type == 1) ? UPLineColor : DOWNLineColor;
        ENUM_LINE_STYLE lineStyle = (swingPoints[i].type == 1) ? UPLineStyle : DOWNLineStyle;
        
        if(ObjectCreate(0, lineName, OBJ_TREND, 0, 
                       swingPoints[i+1].time, swingPoints[i+1].price,
                       swingPoints[i].time, swingPoints[i].price))
        {
            ObjectSetInteger(0, lineName, OBJPROP_COLOR, lineColor);
            ObjectSetInteger(0, lineName, OBJPROP_STYLE, lineStyle);
            ObjectSetInteger(0, lineName, OBJPROP_WIDTH, WidthSWING);
            ObjectSetInteger(0, lineName, OBJPROP_RAY_RIGHT, true);
        }
    }
}

//+------------------------------------------------------------------+
//| 檢查交易信號                                                     |
//+------------------------------------------------------------------+
void CheckTradeSignals()
{
    if(pointCount < 2) return;
    
    double currentPrice = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    
    // 檢查多單信號：向下趨勢線結束，轉折後出現向上趨勢線，超過前一個向下趨勢線的高點
    if(lastTrendWasDown && swingPoints[0].type == 1 && currentPrice > lastDownHigh)
    {
        if(!longSignalTriggered && !HasOpenPosition(POSITION_TYPE_BUY))
        {
            OpenLongPosition();
            longSignalTriggered = true;
            shortSignalTriggered = false;
        }
    }
    
    // 檢查空單信號：向上趨勢線結束，轉折後出現向下趨勢線，跌破前一個向上趨勢線的低點
    if(lastTrendWasUp && swingPoints[0].type == 2 && currentPrice < lastUpLow)
    {
        if(!shortSignalTriggered && !HasOpenPosition(POSITION_TYPE_SELL))
        {
            OpenShortPosition();
            shortSignalTriggered = true;
            longSignalTriggered = false;
        }
    }
    
    // 重置信號標誌
    if(swingPoints[0].type == 2 && lastTrendWasDown)
    {
        longSignalTriggered = false;
    }
    if(swingPoints[0].type == 1 && lastTrendWasUp)
    {
        shortSignalTriggered = false;
    }
}

//+------------------------------------------------------------------+
//| 開多單                                                           |
//+------------------------------------------------------------------+
void OpenLongPosition()
{
    double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
    double stopLoss = lastUpLow * StopLossMultiplier;
    
    // 計算倉位大小
    double lotSize = CalculateLotSize(ask, stopLoss);
    
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = lotSize;
    request.type = ORDER_TYPE_BUY;
    request.price = ask;
    request.sl = stopLoss;
    request.deviation = Slippage;
    request.magic = MagicNumber;
    request.comment = "小波策略多單";
    
    if(OrderSend(request, result))
    {
        Print("多單開倉成功: 價格=", ask, " 止損=", stopLoss, " 手數=", lotSize);
    }
    else
    {
        Print("多單開倉失敗: ", GetLastError());
    }
}

//+------------------------------------------------------------------+
//| 開空單                                                           |
//+------------------------------------------------------------------+
void OpenShortPosition()
{
    double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    double stopLoss = lastDownHigh * StopLossMultiplier;
    
    // 計算倉位大小
    double lotSize = CalculateLotSize(stopLoss, bid);
    
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = lotSize;
    request.type = ORDER_TYPE_SELL;
    request.price = bid;
    request.sl = stopLoss;
    request.deviation = Slippage;
    request.magic = MagicNumber;
    request.comment = "小波策略空單";
    
    if(OrderSend(request, result))
    {
        Print("空單開倉成功: 價格=", bid, " 止損=", stopLoss, " 手數=", lotSize);
    }
    else
    {
        Print("空單開倉失敗: ", GetLastError());
    }
}

//+------------------------------------------------------------------+
//| 計算倉位大小                                                     |
//+------------------------------------------------------------------+
double CalculateLotSize(double entryPrice, double stopLoss)
{
    double accountBalance = AccountInfoDouble(ACCOUNT_BALANCE);
    double riskAmount = accountBalance * MaxRiskPercent / 100.0;
    
    double pointValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
    double stopLossPoints = MathAbs(entryPrice - stopLoss) / _Point;
    
    if(stopLossPoints <= 0) return LotSize;
    
    double lotSize = riskAmount / (stopLossPoints * pointValue);
    
    // 確保在最小和最大手數範圍內
    double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
    double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
    double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
    
    lotSize = MathMax(minLot, MathMin(maxLot, lotSize));
    lotSize = NormalizeDouble(lotSize / lotStep, 0) * lotStep;
    
    return lotSize;
}

//+------------------------------------------------------------------+
//| 檢查是否有開倉位置                                               |
//+------------------------------------------------------------------+
bool HasOpenPosition(ENUM_POSITION_TYPE positionType)
{
    for(int i = 0; i < PositionsTotal(); i++)
    {
        if(PositionSelectByIndex(i))
        {
            if(PositionGetString(POSITION_SYMBOL) == _Symbol && 
               PositionGetInteger(POSITION_MAGIC) == MagicNumber &&
               PositionGetInteger(POSITION_TYPE) == positionType)
            {
                return true;
            }
        }
    }
    return false;
}

//+------------------------------------------------------------------+
//| 管理現有倉位                                                     |
//+------------------------------------------------------------------+
void ManagePositions()
{
    for(int i = 0; i < PositionsTotal(); i++)
    {
        if(PositionSelectByIndex(i))
        {
            if(PositionGetString(POSITION_SYMBOL) == _Symbol && 
               PositionGetInteger(POSITION_MAGIC) == MagicNumber)
            {
                // 這裡可以添加額外的倉位管理邏輯
                // 例如：移動止損、部分平倉等
            }
        }
    }
} 