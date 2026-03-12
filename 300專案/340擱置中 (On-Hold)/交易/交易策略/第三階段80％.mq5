//+------------------------------------------------------------------+
//|                                                BB_KD_Strategy.mq5|
//|   轉換自 TradingView Pine Script                                 |
//+------------------------------------------------------------------+
#property script_show_inputs

input int    lengthBB   = 21;      // 布林通道期數
input double mult       = 2.1;     // 布林通道倍率
input int    lengthK    = 9;       // KD K 長度
input int    smoothK    = 3;       // K 平滑
input int    smoothD    = 3;       // D 平滑
input int    slLookback = 5;       // 止損回看K棒數
input double riskPercent= 1.0;     // 風險百分比

#include <Trade\Trade.mqh>
CTrade trade;

// 計算倉位大小
double CalculatePositionSize(double entryPrice, double stopPrice)
{
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double riskAmount = equity * riskPercent / 100.0;
   double stopDistance = MathAbs(entryPrice - stopPrice);
   double lotSize = 0.0;
   if(stopDistance > 0)
   {
      double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
      double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
      lotSize = riskAmount / (stopDistance / tickSize * tickValue);
      // 根據最小手數調整
      double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
      double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
      lotSize = MathMax(minLot, MathFloor(lotSize/lotStep)*lotStep);
   }
   return lotSize;
}

int OnInit()
{
   // 初始化
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   // 取得最新K線
   int    bars = Bars(_Symbol, PERIOD_CURRENT);
   if(bars < MathMax(lengthBB, lengthK)+10) return;

   double close[], high[], low[];
   ArraySetAsSeries(close, true); ArraySetAsSeries(high, true); ArraySetAsSeries(low, true);
   CopyClose(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, close);
   CopyHigh(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, high);
   CopyLow(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, low);

   // 布林通道
   int ma_handle = iMA(_Symbol, PERIOD_CURRENT, lengthBB, 0, MODE_SMA, PRICE_CLOSE);
   double ma_buffer[];
   ArraySetAsSeries(ma_buffer, true);
   CopyBuffer(ma_handle, 0, 0, 2, ma_buffer);
   double basis = ma_buffer[0];

   int std_handle = iStdDev(_Symbol, PERIOD_CURRENT, lengthBB, 0, MODE_SMA, PRICE_CLOSE);
   double std_buffer[];
   ArraySetAsSeries(std_buffer, true);
   CopyBuffer(std_handle, 0, 0, 2, std_buffer);
   double dev = mult * std_buffer[0];

   double upper = basis + dev;
   double lower = basis - dev;

   // KD 指標
   int stoch_handle = iStochastic(
    _Symbol, 
    PERIOD_CURRENT, 
    lengthK,      // Kperiod
    smoothD,      // Dperiod
    smoothK,      // slowing
    MODE_SMA,     // method
    STO_LOWHIGH   // price_field
);
   double k[], d[];
   ArraySetAsSeries(k, true); ArraySetAsSeries(d, true);
   CopyBuffer(stoch_handle, 0, 0, 2, k); // K 線
   CopyBuffer(stoch_handle, 1, 0, 2, d); // D 線
   double k0 = k[0], d0 = d[0], k1 = k[1], d1 = d[1];

   // 多單條件
   bool longCondition = (k1 < d1 && k0 > d0) && (close[0] <= lower && close[0] < basis);
   if(longCondition && PositionsTotal()==0)
   {
      double entry_price = close[0];
      double long_stop = low[ArrayMinimum(low, slLookback)];
      double long_take = lower + (basis - lower) * 0.8;
      double lot = CalculatePositionSize(entry_price, long_stop);
      if(lot > 0)
      {
         trade.Buy(lot, _Symbol, entry_price, long_stop, long_take, "多單進場");
      }
   }

   // 空單條件
   bool shortCondition = (k1 > d1 && k0 < d0) && (close[0] >= upper && close[0] > basis);
   if(shortCondition && PositionsTotal()==0)
   {
      double entry_price = close[0];
      double short_stop = high[ArrayMaximum(high, slLookback)];
      double short_take = upper - (upper - basis) * 0.8;
      double lot = CalculatePositionSize(entry_price, short_stop);
      if(lot > 0)
      {
         trade.Sell(lot, _Symbol, entry_price, short_stop, short_take, "空單進場");
      }
   }
}