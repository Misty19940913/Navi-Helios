//+------------------------------------------------------------------+
//|                                                 MT5交易策略.mq5 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict

// 輸入參數
input double LotSize = 0.01;           // 交易手數
input int EntryPoints = 200;           // 入場點數（價格超過均線的點數）
input int StopLossPoints = 100;        // 止損點數（均線的點數）
input int TrailingStart = 300;         // 開始移動止損的點數
input ENUM_TIMEFRAMES TimeFrame1 = PERIOD_H1;    // 時間週期1
input ENUM_TIMEFRAMES TimeFrame2 = PERIOD_H4;    // 時間週期2
input ENUM_TIMEFRAMES TimeFrame3 = PERIOD_D1;    // 時間週期3
input int MagicNumber = 123456;        // 魔術數字（用於識別此EA的訂單）

// 全局變量
int ma_handle1, ma_handle2, ma_handle3;          // 指標句柄
double ma_buffer1[], ma_buffer2[], ma_buffer3[]; // 移動平均線緩衝區
double entry_price = 0;                          // 入場價格
bool trailing_active = false;                    // 移動止損是否激活

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // 初始化三個時間週期的移動平均線指標
    ma_handle1 = iMA(_Symbol, TimeFrame1, 21, 0, MODE_SMA, PRICE_CLOSE);
    ma_handle2 = iMA(_Symbol, TimeFrame2, 21, 0, MODE_SMA, PRICE_CLOSE);
    ma_handle3 = iMA(_Symbol, TimeFrame3, 21, 0, MODE_SMA, PRICE_CLOSE);
    
    if(ma_handle1 == INVALID_HANDLE || ma_handle2 == INVALID_HANDLE || ma_handle3 == INVALID_HANDLE)
    {
        Print("指標創建失敗");
        return(INIT_FAILED);
    }
    
    // 分配緩衝區
    ArraySetAsSeries(ma_buffer1, true);
    ArraySetAsSeries(ma_buffer2, true);
    ArraySetAsSeries(ma_buffer3, true);
    
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // 釋放指標句柄
    if(ma_handle1 != INVALID_HANDLE) IndicatorRelease(ma_handle1);
    if(ma_handle2 != INVALID_HANDLE) IndicatorRelease(ma_handle2);
    if(ma_handle3 != INVALID_HANDLE) IndicatorRelease(ma_handle3);
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
    // 複製移動平均線數據
    if(CopyBuffer(ma_handle1, 0, 0, 2, ma_buffer1) < 2) return;
    if(CopyBuffer(ma_handle2, 0, 0, 2, ma_buffer2) < 2) return;
    if(CopyBuffer(ma_handle3, 0, 0, 2, ma_buffer3) < 2) return;
        
    // 獲取當前價格
    double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    
    // 檢查是否有此EA的開放訂單
    if(!HasOpenPosition())
    {
        // 重置全局變量
        entry_price = 0;
        trailing_active = false;
        
        // 檢查多頭入場條件
        if(IsLongEntryCondition(current_price))
        {
            OpenBuy(ma_buffer3[0]);  // 傳遞日線圖均線值用於設置止損
        }
        // 檢查空頭入場條件
        else if(IsShortEntryCondition(current_price))
        {
            OpenSell(ma_buffer3[0]);  // 傳遞日線圖均線值用於設置止損
        }
    }
    else
    {
        // 管理現有倉位
        ManagePositions(current_price);
    }
}

//+------------------------------------------------------------------+
//| 檢查是否有此EA的開放訂單                                          |
//+------------------------------------------------------------------+
bool HasOpenPosition()
{
    for(int i = 0; i < PositionsTotal(); i++)
    {
        ulong ticket = PositionGetTicket(i);
        if(ticket > 0)
        {
            if(PositionSelectByTicket(ticket))
            {
                // 檢查是否是當前交易品種
                if(PositionGetString(POSITION_SYMBOL) == _Symbol)
                {
                    // 檢查是否是此EA的訂單
                    if(PositionGetInteger(POSITION_MAGIC) == MagicNumber)
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//+------------------------------------------------------------------+
//| 檢查多頭入場條件                                                  |
//+------------------------------------------------------------------+
bool IsLongEntryCondition(double price)
{
    // 價格上穿日線圖的21日均線往上200點位，且價格在4小時圖的21日均線之上
    return (price > ma_buffer3[0] && 
            (price - ma_buffer3[0]) >= (EntryPoints * _Point) && 
            price > ma_buffer2[0]);
}

//+------------------------------------------------------------------+
//| 檢查空頭入場條件                                                  |
//+------------------------------------------------------------------+
bool IsShortEntryCondition(double price)
{
    // 價格下穿日線圖的21日均線往下200點位，且價格在4小時圖的21日均線之下
    return (price < ma_buffer3[0] && 
            (ma_buffer3[0] - price) >= (EntryPoints * _Point) && 
            price < ma_buffer2[0]);
}

//+------------------------------------------------------------------+
//| 管理現有倉位                                                      |
//+------------------------------------------------------------------+
void ManagePositions(double current_price)
{
    // 查找此EA的倉位
    ulong ticket = 0;
    for(int i = 0; i < PositionsTotal(); i++)
    {
        ulong pos_ticket = PositionGetTicket(i);
        if(pos_ticket > 0)
        {
            if(PositionSelectByTicket(pos_ticket))
            {
                if(PositionGetString(POSITION_SYMBOL) == _Symbol && 
                   PositionGetInteger(POSITION_MAGIC) == MagicNumber)
                {
                    ticket = pos_ticket;
                    break;
                }
            }
        }
    }
    
    if(ticket <= 0) return;
    
    if(!PositionSelectByTicket(ticket)) return;
    
    double position_sl = PositionGetDouble(POSITION_SL);
    double position_tp = PositionGetDouble(POSITION_TP);
    ENUM_POSITION_TYPE position_type = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
    
    // 如果入場價格為0，設置入場價格
    if(entry_price == 0)
    {
        entry_price = PositionGetDouble(POSITION_PRICE_OPEN);
    }
    
    // 檢查是否需要激活移動止損
    if(!trailing_active)
    {
        if(position_type == POSITION_TYPE_BUY && 
           (current_price - entry_price) >= (TrailingStart * _Point))
        {
            trailing_active = true;
            // 先將止損移動至入場位置
            ModifyPosition(ticket, entry_price, position_tp);
        }
        else if(position_type == POSITION_TYPE_SELL && 
                (entry_price - current_price) >= (TrailingStart * _Point))
        {
            trailing_active = true;
            // 先將止損移動至入場位置
            ModifyPosition(ticket, entry_price, position_tp);
        }
    }
    // 如果移動止損已激活，更新止損位置
    else if(trailing_active)
    {
        if(position_type == POSITION_TYPE_BUY)
        {
            // 計算新的止損位置（均線下方100點）
            double new_sl = ma_buffer3[0] - (StopLossPoints * _Point);
            
            // 只向上更新止損
            if(new_sl > position_sl)
            {
                ModifyPosition(ticket, new_sl, position_tp);
            }
        }
        else if(position_type == POSITION_TYPE_SELL)
        {
            // 計算新的止損位置（均線上方100點）
            double new_sl = ma_buffer3[0] + (StopLossPoints * _Point);
            
            // 只向下更新止損
            if(new_sl < position_sl || position_sl == 0)
            {
                ModifyPosition(ticket, new_sl, position_tp);
            }
        }
    }
}

//+------------------------------------------------------------------+
//| 修改倉位                                                          |
//+------------------------------------------------------------------+
bool ModifyPosition(ulong ticket, double sl, double tp)
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_SLTP;
    request.position = ticket;
    request.symbol = _Symbol;
    request.sl = sl;
    request.tp = tp;
    
    return OrderSend(request, result);
}

//+------------------------------------------------------------------+
//| 開倉買入函數                                                      |
//+------------------------------------------------------------------+
void OpenBuy(double ma_value)
{
    double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
    double sl = ma_value - StopLossPoints * _Point;  // 在均線下方100點設置止損
    double tp = 0;  // 不設置獲利目標，使用移動止損
    
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = LotSize;
    request.type = ORDER_TYPE_BUY;
    request.price = ask;
    request.sl = sl;
    request.tp = tp;
    request.deviation = 10;
    request.magic = MagicNumber;  // 使用魔術數字標識此EA的訂單
    
    if(!OrderSend(request, result))
        Print("買入訂單發送失敗. 錯誤碼: ", GetLastError());
}

//+------------------------------------------------------------------+
//| 開倉賣出函數                                                      |
//+------------------------------------------------------------------+
void OpenSell(double ma_value)
{
    double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    double sl = ma_value + StopLossPoints * _Point;  // 在均線上方100點設置止損
    double tp = 0;  // 不設置獲利目標，使用移動止損
    
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_DEAL;
    request.symbol = _Symbol;
    request.volume = LotSize;
    request.type = ORDER_TYPE_SELL;
    request.price = bid;
    request.sl = sl;
    request.tp = tp;
    request.deviation = 10;
    request.magic = MagicNumber;  // 使用魔術數字標識此EA的訂單
    
    if(!OrderSend(request, result))
        Print("賣出訂單發送失敗. 錯誤碼: ", GetLastError());
} 