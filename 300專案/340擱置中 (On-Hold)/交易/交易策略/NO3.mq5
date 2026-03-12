//+------------------------------------------------------------------+
//|                                                  BB_KD_EA.mq5    |
//+------------------------------------------------------------------+
#property copyright "YourName"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//=== 交易參數 ===
input group "=== 交易設定 ==="
input double Lots = 0.01; // 初始手數（會自動調整）
input double RiskPercent = 3.0; // 每次最大虧損百分比
input double TakeProfitRatio = 0.7; // 止盈比例（進場點位到中軌的百分比）

//=== 布林通道參數 ===
input group "=== 布林通道設定 ==="
input int    BBPeriod = 21; // 布林通道週期
input double BBDev1 = 2.1;  // 布林通道偏差1
input double BBDev2 = 1.8;  // 布林通道偏差2

//=== KD指標參數 ===
input group "=== KD指標設定 ==="
input int    KPeriod = 9;   // K值週期
input int    DPeriod = 3;   // D值週期
input int    Slowing = 3;   // 平滑參數
input int    OversoldLevel = 20; // 超賣水平
input int    OverboughtLevel = 80; // 超買水平

int bb_handle_2_1, bb_handle_1_8, stoch_handle;


double GetLots(double stoploss_pips)
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double risk = balance * RiskPercent / 100.0;
   double tick_value = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tick_size = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(stoploss_pips <= 0 || tick_value<=0 || tick_size<=0)
   {
      double min_vol = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
      return NormalizeDouble(min_vol, 2);
   }
   double lot = risk / (stoploss_pips * tick_value / tick_size);
   double vol_min = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double vol_max = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double vol_step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   lot = MathMax(lot, vol_min);
   lot = MathMin(lot, vol_max);
   // 對齊手數步進
   lot = MathFloor(lot / vol_step) * vol_step;
   return NormalizeDouble(lot, 2);
}

int OnInit()
{
    // 初始化指標（iBands: period, bands_shift, deviation, applied_price）
    bb_handle_2_1 = iBands(_Symbol, _Period, BBPeriod, 0, BBDev1, PRICE_CLOSE);
    if(bb_handle_2_1==INVALID_HANDLE)
        return(INIT_FAILED);
    bb_handle_1_8 = iBands(_Symbol, _Period, BBPeriod, 0, BBDev2, PRICE_CLOSE);
    if(bb_handle_1_8==INVALID_HANDLE)
        return(INIT_FAILED);
    stoch_handle  = iStochastic(
        _Symbol,
        (ENUM_TIMEFRAMES)_Period,
        KPeriod, DPeriod, Slowing,
        MODE_SMA,
        STO_LOWHIGH
    );
    if(stoch_handle==INVALID_HANDLE)
        return(INIT_FAILED);
    
    // 面板顯示已移除
    
    return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   IndicatorRelease(bb_handle_2_1);
   IndicatorRelease(bb_handle_1_8);
   IndicatorRelease(stoch_handle);
}

bool HasPosition(string symbol)
{
    // 直接以 symbol 檢查是否已有倉位
    if(PositionSelect(symbol))
        return true;
    
    // 後備：逐一檢查 ticket（避免部分平台不支援 Index 取法）
    int total = PositionsTotal();
    for(int idx=0; idx<total; idx++)
    {
        ulong ticket = PositionGetTicket(idx);
        if(ticket==0) continue;
        if(!PositionSelectByTicket(ticket)) continue;
        string pos_symbol = PositionGetString(POSITION_SYMBOL);
        if(pos_symbol == symbol)
            return true;
    }
    return false;
}

// 在全域宣告
bool signal_k_bar_long = false;  // 多頭信號K棒標記
bool signal_k_bar_short = false; // 空頭信號K棒標記
int last_signal_bar = -1;        // 最後信號K棒的索引

void OnTick()
{
   double bb_upper_2_1[], bb_middle_2_1[], bb_lower_2_1[];
   double bb_upper_1_8[], bb_middle_1_8[], bb_lower_1_8[];
   double k[], d[];

   // 檢查資料足夠
   if(Bars(_Symbol, _Period) < 50) return;
   if(BarsCalculated(bb_handle_2_1) < 3 || BarsCalculated(bb_handle_1_8) < 3 || BarsCalculated(stoch_handle) < 3) return;

   // 取得布林通道
   if(CopyBuffer(bb_handle_2_1, 0, 0, 3, bb_upper_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_2_1, 1, 0, 3, bb_middle_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_2_1, 2, 0, 3, bb_lower_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_1_8, 0, 0, 3, bb_upper_1_8) <= 0) return;
   if(CopyBuffer(bb_handle_1_8, 1, 0, 3, bb_middle_1_8) <= 0) return;
   if(CopyBuffer(bb_handle_1_8, 2, 0, 3, bb_lower_1_8) <= 0) return;

   // 取得KD
   if(CopyBuffer(stoch_handle, 0, 0, 3, k) <= 0) return;
   if(CopyBuffer(stoch_handle, 1, 0, 3, d) <= 0) return;

   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double high_price = iHigh(_Symbol, _Period, 0);  // 當前K棒高點
   double low_price = iLow(_Symbol, _Period, 0);    // 當前K棒低點

   // 檢查是否為新的K棒
   static datetime last_bar_time = 0;
   datetime current_bar_time = iTime(_Symbol, _Period, 0);
   bool is_new_bar = (current_bar_time != last_bar_time);
   
   if(is_new_bar)
   {
      last_bar_time = current_bar_time;
      
      // 檢查前一根K棒是否到達步林通道
      double prev_high = iHigh(_Symbol, _Period, 1);
      double prev_low = iLow(_Symbol, _Period, 1);
      
      // 檢查是否到達上軌2.1或1.8（多頭信號K棒）
      if(prev_high >= bb_upper_2_1[1] || prev_high >= bb_upper_1_8[1])
      {
         signal_k_bar_long = true;
         signal_k_bar_short = false;
         last_signal_bar = 1;
         
      }
      // 檢查是否到達下軌2.1或1.8（空頭信號K棒）
      else if(prev_low <= bb_lower_2_1[1] || prev_low <= bb_lower_1_8[1])
      {
         signal_k_bar_short = true;
         signal_k_bar_long = false;
         last_signal_bar = 1;
         
      }
   }

   // 多單進場條件：有信號K棒 + 當前價格反向穿越下軌1.8 + KD在超賣區
   if(signal_k_bar_long && !HasPosition(_Symbol))
   {
      // 檢查是否反向穿越下軌1.8
      bool cross_below_lower = (high_price > bb_lower_1_8[0] && low_price < bb_lower_1_8[0]);
      
      // 檢查D是否在超賣區（只看D）
      bool kd_oversold = (d[0] < OversoldLevel);
      
      if(cross_below_lower && kd_oversold)
      {
         double stoploss = iLow(_Symbol, _Period, iLowest(_Symbol, _Period, MODE_LOW, 10, 1));
         // 止盈位置：進場點位到中軌的指定比例
         double distance_to_middle = bb_middle_1_8[0] - ask;
         double takeprofit = ask + (distance_to_middle * TakeProfitRatio);
         
         // 正規化價格
         int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
         stoploss = NormalizeDouble(stoploss, digits);
         takeprofit = NormalizeDouble(takeprofit, digits);
         
         double sl_pips = (ask - stoploss) / _Point;
         if(sl_pips <= 0) return;
         // 檢查最小止損距離
         int stops_level_pts = (int)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
         double min_stop = stops_level_pts * _Point;
         if((ask - stoploss) < min_stop || (takeprofit - ask) < min_stop) return;
         double lots = GetLots(sl_pips);
         
         if(trade.Buy(lots, _Symbol, ask, stoploss, takeprofit, "BB_KD_Long_v2"))
            signal_k_bar_long = false; // 重置信號
      }
   }
   
   // 空單進場條件：有信號K棒 + 當前價格反向穿越上軌1.8 + KD在超買區
   if(signal_k_bar_short && !HasPosition(_Symbol))
   {
      // 檢查是否反向穿越上軌1.8
      bool cross_above_upper = (high_price > bb_upper_1_8[0] && low_price < bb_upper_1_8[0]);
      
      // 檢查D是否在超買區（只看D）
      bool kd_overbought = (d[0] > OverboughtLevel);
      
      if(cross_above_upper && kd_overbought)
      {
         double stoploss = iHigh(_Symbol, _Period, iHighest(_Symbol, _Period, MODE_HIGH, 10, 1));
         // 止盈位置：進場點位到中軌的指定比例
         double distance_to_middle = bid - bb_middle_1_8[0];
         double takeprofit = bid - (distance_to_middle * TakeProfitRatio);
         
         // 正規化價格
         int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
         stoploss = NormalizeDouble(stoploss, digits);
         takeprofit = NormalizeDouble(takeprofit, digits);
         
         double sl_pips = (stoploss - bid) / _Point;
         if(sl_pips <= 0) return;
         int stops_level_pts = (int)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
         double min_stop = stops_level_pts * _Point;
         if((stoploss - bid) < min_stop || (bid - takeprofit) < min_stop) return;
         double lots = GetLots(sl_pips);
         
         if(trade.Sell(lots, _Symbol, bid, stoploss, takeprofit, "BB_KD_Short_v2"))
            signal_k_bar_short = false; // 重置信號
      }
   }
}
