//+------------------------------------------------------------------+
//|                                                  第二階段.mq5 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property strict

// 輸入參數
input double LotSize = 0.01;           // 交易手數
input int MagicNumber = 234567;        // 魔術數字（用於識別此EA的訂單）
input int KD_Period = 14;              // KD指標週期
input int KD_Slowing = 3;              // KD指標平滑
input int KD_Method = MODE_SMA;        // KD指標方法
input int MA_Period = 21;              // 日線均線週期
input int HighLow_Period = 5;          // 高低點計算週期（天）
input int TrailingStart = 300;         // 開始移動止損的點數

// 全局變量
int kd_handle;                         // KD指標句柄
int ma_handle;                         // 均線指標句柄
double kd_main[], kd_signal[];         // KD指標緩衝區
double ma_buffer[];                    // 均線緩衝區
double high_buffer[];                  // 高點緩衝區
double low_buffer[];                   // 低點緩衝區
double entry_price = 0;                // 入場價格
bool trailing_active = false;          // 移動止損是否激活
ulong pending_order_ticket = 0;        // 預掛單票號

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // 初始化KD指標
    kd_handle = iStochastic(_Symbol, PERIOD_D1, KD_Period, KD_Slowing, KD_Slowing, KD_Method, MODE_SMA, STO_LOWHIGH);
    if(kd_handle == INVALID_HANDLE)
    {
        Print("KD指標創建失敗");
        return(INIT_FAILED);
    }
    
    // 初始化均線指標
    ma_handle = iMA(_Symbol, PERIOD_D1, MA_Period, 0, MODE_SMA, PRICE_CLOSE);
    if(ma_handle == INVALID_HANDLE)
    {
        Print("均線指標創建失敗");
        return(INIT_FAILED);
    }
    
    // 分配緩衝區
    ArraySetAsSeries(kd_main, true);
    ArraySetAsSeries(kd_signal, true);
    ArraySetAsSeries(ma_buffer, true);
    ArraySetAsSeries(high_buffer, true);
    ArraySetAsSeries(low_buffer, true);
    
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // 釋放指標句柄
    if(kd_handle != INVALID_HANDLE) IndicatorRelease(kd_handle);
    if(ma_handle != INVALID_HANDLE) IndicatorRelease(ma_handle);
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
    // 複製KD指標數據
    if(CopyBuffer(kd_handle, 0, 0, 3, kd_main) < 3) return;    // 主線
    if(CopyBuffer(kd_handle, 1, 0, 3, kd_signal) < 3) return;  // 信號線
    
    // 複製均線數據
    if(CopyBuffer(ma_handle, 0, 0, 1, ma_buffer) < 1) return;
    
    // 複製高低點數據
    if(CopyHigh(_Symbol, PERIOD_D1, 0, HighLow_Period, high_buffer) < HighLow_Period) return;
    if(CopyLow(_Symbol, PERIOD_D1, 0, HighLow_Period, low_buffer) < HighLow_Period) return;
    
    // 獲取當前價格
    double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    
    // 檢查是否有此EA的開放訂單
    if(!HasOpenPosition())
    {
        // 重置全局變量
        entry_price = 0;
        trailing_active = false;
        
        // 檢查空單入場條件
        if(IsShortEntryCondition())
        {
            OpenSell();
        }
        // 檢查多單入場條件
        else if(IsLongEntryCondition())
        {
            OpenBuy();
        }
    }
    else
    {
        // 管理現有倉位
        ManagePositions(current_price);
    }
    
    // 檢查預掛單
    CheckPendingOrders();
}

//+------------------------------------------------------------------+
//| 檢查是否有此EA的開放訂單                                          |
//+------------------------------------------------------------------+
bool HasOpenPosition()
{
    for(int i = 0; i < PositionsTotal(); i++)
    {
        if(PositionSelectByIndex(i))
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
    return false;
}

//+------------------------------------------------------------------+
//| 檢查預掛單                                                        |
//+------------------------------------------------------------------+
void CheckPendingOrders()
{
    // 如果沒有預掛單，則返回
    if(pending_order_ticket == 0) return;
    
    // 檢查預掛單是否存在
    if(!OrderSelect(pending_order_ticket))
    {
        // 預掛單不存在，重置票號
        pending_order_ticket = 0;
        return;
    }
    
    // 檢查預掛單是否已觸發
    if(OrderGetInteger(ORDER_STATE) == ORDER_STATE_FILLED)
    {
        // 預掛單已觸發，重置票號
        pending_order_ticket = 0;
        
        // 設置入場價格
        entry_price = OrderGetDouble(ORDER_PRICE_OPEN);
    }
}

//+------------------------------------------------------------------+
//| 檢查空單入場條件                                                  |
//+------------------------------------------------------------------+
bool IsShortEntryCondition()
{
    // 獲取當前價格
    double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    
    // 檢查價格是否在日線均線上方
    bool price_above_ma = current_price > ma_buffer[0];
    
    // 檢查KD指標是否在80之上死亡交叉
    bool kd_above_80 = kd_main[1] > 80 && kd_signal[1] > 80;
    bool death_cross = kd_main[1] > kd_signal[1] && kd_main[2] < kd_signal[2];
    
    return price_above_ma && kd_above_80 && death_cross;
}

//+------------------------------------------------------------------+
//| 檢查多單入場條件                                                  |
//+------------------------------------------------------------------+
bool IsLongEntryCondition()
{
    // 獲取當前價格
    double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    
    // 檢查價格是否在日線均線下方
    bool price_below_ma = current_price < ma_buffer[0];
    
    // 檢查KD指標是否在20之下死亡交叉
    bool kd_below_20 = kd_main[1] < 20 && kd_signal[1] < 20;
    bool death_cross = kd_main[1] < kd_signal[1] && kd_main[2] > kd_signal[2];
    
    return price_below_ma && kd_below_20 && death_cross;
}

//+------------------------------------------------------------------+
//| 獲取5日內高點                                                     |
//+------------------------------------------------------------------+
double GetHighPrice()
{
    double high = high_buffer[0];
    for(int i = 1; i < HighLow_Period; i++)
    {
        if(high_buffer[i] > high)
            high = high_buffer[i];
    }
    return high;
}

//+------------------------------------------------------------------+
//| 獲取5日內低點                                                     |
//+------------------------------------------------------------------+
double GetLowPrice()
{
    double low = low_buffer[0];
    for(int i = 1; i < HighLow_Period; i++)
    {
        if(low_buffer[i] < low)
            low = low_buffer[i];
    }
    return low;
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
        if(PositionSelectByIndex(i))
        {
            if(PositionGetString(POSITION_SYMBOL) == _Symbol && 
               PositionGetInteger(POSITION_MAGIC) == MagicNumber)
            {
                ticket = PositionGetTicket(i);
                break;
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
            double new_sl = ma_buffer[0] - (100 * _Point);
            
            // 只向上更新止損
            if(new_sl > position_sl)
            {
                ModifyPosition(ticket, new_sl, position_tp);
            }
        }
        else if(position_type == POSITION_TYPE_SELL)
        {
            // 計算新的止損位置（均線上方100點）
            double new_sl = ma_buffer[0] + (100 * _Point);
            
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
void OpenBuy()
{
    double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
    double sl = GetLowPrice();  // 止損在5日內低點
    double tp = ma_buffer[0];   // 獲利目標在日線均線
    
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
    {
        Print("買入訂單發送失敗. 錯誤碼: ", GetLastError());
        return;
    }
    
    // 設置入場價格
    entry_price = ask;
    
    // 在止損位置預掛空單
    PlacePendingSell(sl, ask);
}

//+------------------------------------------------------------------+
//| 開倉賣出函數                                                      |
//+------------------------------------------------------------------+
void OpenSell()
{
    double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
    double sl = GetHighPrice();  // 止損在5日內高點
    double tp = ma_buffer[0];    // 獲利目標在日線均線
    
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
    {
        Print("賣出訂單發送失敗. 錯誤碼: ", GetLastError());
        return;
    }
    
    // 設置入場價格
    entry_price = bid;
    
    // 在止損位置預掛多單
    PlacePendingBuy(sl, bid);
}

//+------------------------------------------------------------------+
//| 預掛空單                                                          |
//+------------------------------------------------------------------+
void PlacePendingSell(double price, double sl)
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_PENDING;
    request.symbol = _Symbol;
    request.volume = LotSize;
    request.type = ORDER_TYPE_SELL_STOP;
    request.price = price;
    request.sl = sl;
    request.deviation = 10;
    request.magic = MagicNumber;  // 使用魔術數字標識此EA的訂單
    
    if(!OrderSend(request, result))
    {
        Print("預掛空單發送失敗. 錯誤碼: ", GetLastError());
        return;
    }
    
    // 保存預掛單票號
    pending_order_ticket = result.order;
}

//+------------------------------------------------------------------+
//| 預掛多單                                                          |
//+------------------------------------------------------------------+
void PlacePendingBuy(double price, double sl)
{
    MqlTradeRequest request = {};
    MqlTradeResult result = {};
    
    request.action = TRADE_ACTION_PENDING;
    request.symbol = _Symbol;
    request.volume = LotSize;
    request.type = ORDER_TYPE_BUY_STOP;
    request.price = price;
    request.sl = sl;
    request.deviation = 10;
    request.magic = MagicNumber;  // 使用魔術數字標識此EA的訂單
    
    if(!OrderSend(request, result))
    {
        Print("預掛多單發送失敗. 錯誤碼: ", GetLastError());
        return;
    }
    
    // 保存預掛單票號
    pending_order_ticket = result.order;
}
