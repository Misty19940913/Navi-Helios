//+------------------------------------------------------------------+
//|                                                  BB_KD_EA.mq5    |
//+------------------------------------------------------------------+
#property copyright "YourName"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

input double Lots = 0.1; // 初始手數（會自動調整）
input int    BBPeriod = 21;
input double BBDev1 = 2.1;
input double BBDev2 = 1.9;
input int    KPeriod = 9;
input int    DPeriod = 3;
input int    Slowing = 3;
input double RiskPercent = 3.0; // 每次最大虧損百分比

int bb_handle_2_1, bb_handle_1_9, stoch_handle;

double GetLots(double stoploss_pips)
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double risk = balance * RiskPercent / 100.0;
   double tick_value = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tick_size = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double lot = risk / (stoploss_pips * tick_value / tick_size);
   lot = MathMax(lot, SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN));
   lot = MathMin(lot, SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX));
   return NormalizeDouble(lot, 2);
}

int OnInit()
{
    bb_handle_2_1 = iBands(_Symbol, _Period, 21, 0, 2.1, PRICE_CLOSE);
    bb_handle_1_9 = iBands(_Symbol, _Period, 21, 0, 1.9, PRICE_CLOSE);
    stoch_handle  = iStochastic(
        _Symbol,
        (ENUM_TIMEFRAMES)_Period,
        9, 3, 3,
        MODE_SMA,
        STO_LOWHIGH
    );
    return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   IndicatorRelease(bb_handle_2_1);
   IndicatorRelease(bb_handle_1_9);
   IndicatorRelease(stoch_handle);
}

bool HasPosition(string symbol)
{
    for(int i=0; i<PositionsTotal(); i++)
    {
        if(PositionGetString(POSITION_SYMBOL) == symbol)
            return true;
    }
    return false;
}

// 在全域宣告
bool price_in_range_long = false;
bool price_in_range_short = false;

void OnTick()
{
   double bb_upper_2_1[], bb_middle_2_1[], bb_lower_2_1[];
   double bb_upper_1_9[], bb_middle_1_9[], bb_lower_1_9[];
   double k[], d[];

   // 取得布林通道
   if(CopyBuffer(bb_handle_2_1, 0, 0, 2, bb_upper_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_2_1, 1, 0, 2, bb_middle_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_2_1, 2, 0, 2, bb_lower_2_1) <= 0) return;
   if(CopyBuffer(bb_handle_1_9, 0, 0, 2, bb_upper_1_9) <= 0) return;
   if(CopyBuffer(bb_handle_1_9, 1, 0, 2, bb_middle_1_9) <= 0) return;
   if(CopyBuffer(bb_handle_1_9, 2, 0, 2, bb_lower_1_9) <= 0) return;

   // 取得KD
   if(CopyBuffer(stoch_handle, 0, 0, 2, k) <= 0) return;
   if(CopyBuffer(stoch_handle, 1, 0, 2, d) <= 0) return;

   double price = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   // 更新旗標
   if(price <= bb_upper_2_1[0] && price >= bb_upper_1_9[0])
       price_in_range_long = true;
   else
       price_in_range_long = false;

   if(price >= bb_lower_2_1[0] && price <= bb_lower_1_9[0])
       price_in_range_short = true;
   else
       price_in_range_short = false;

   // 多單進場
   if(price_in_range_long && (k[1] < 20 && d[1] < 20) && (k[1] < d[1] && k[0] > d[0]) && !HasPosition(_Symbol))
   {
      double stoploss = iLow(_Symbol, _Period, iLowest(_Symbol, _Period, MODE_LOW, 10, 1)); // 最近10根最低
      double takeprofit = bb_middle_2_1[1]; // 使用中軌作為止盈
      double sl_pips = (price - stoploss) / _Point;
      double lots = GetLots(sl_pips);
      if(trade.Buy(lots, _Symbol, price, stoploss, takeprofit, "BB_KD_Long"))
         Print("Buy order sent successfully");
      else
         Print("Buy order failed: ", GetLastError());
   }
   // 空單進場
   if(price_in_range_short && (k[1] > 80 && d[1] > 80) && (k[1] > d[1] && k[0] < d[0]) && !HasPosition(_Symbol))
   {
      double stoploss = iHigh(_Symbol, _Period, iHighest(_Symbol, _Period, MODE_HIGH, 10, 1)); // 最近10根最高
      double takeprofit = bb_middle_1_9[1]; // 使用中軌作為止盈
      double sl_pips = (stoploss - price) / _Point;
      double lots = GetLots(sl_pips);
      trade.Sell(lots, _Symbol, price, stoploss, takeprofit, "BB_KD_Short");
   }
}
