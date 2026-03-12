//+------------------------------------------------------------------+
//|                                                BB_KD_Strategy.mq5|
//|   轉換自 TradingView Pine Script                                 |
//+------------------------------------------------------------------+
#property copyright   "YourName"
#property link        "https://your.link"
#property version     "1.00"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//--- input parameters
input int    lengthBB   = 21;      // 布林通道期數
input double mult       = 2.1;     // 布林通道倍率
input int    lengthK    = 9;       // KD K 長度
input int    smoothK    = 3;       // K 平滑
input int    smoothD    = 3;       // D 平滑
input int    slLookback = 5;       // 止損回看K棒數
input double riskPercent= 1.0;     // 風險百分比

//+------------------------------------------------------------------+
//| 計算倉位大小                                                      |
//+------------------------------------------------------------------+
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

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   // 初始化
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   // 刪除圖表上的布林通道線
   ObjectDelete(0, "BB_upper");
   ObjectDelete(0, "BB_basis");
   ObjectDelete(0, "BB_lower");
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   int bars = Bars(_Symbol, PERIOD_CURRENT);
   if(bars < MathMax(lengthBB, lengthK)+10) return;

   // 取得K線資料
   double close[], high[], low[];
   datetime time[];
   ArraySetAsSeries(close, true); ArraySetAsSeries(high, true); ArraySetAsSeries(low, true); ArraySetAsSeries(time, true);
   CopyClose(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, close);
   CopyHigh(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, high);
   CopyLow(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, low);
   CopyTime(_Symbol, PERIOD_CURRENT, 0, lengthBB+10, time);

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
      int    idxMin = ArrayMinimum(low, 0, slLookback);
      double long_stop = low[idxMin];
      double risk = entry_price - long_stop;
      double long_take = entry_price + risk; // 1:1 停利
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
      int    idxMax = ArrayMaximum(high, 0, slLookback);
      double short_stop = high[idxMax];
      double risk = short_stop - entry_price;
      double short_take = entry_price - risk; // 1:1 停利
      double lot = CalculatePositionSize(entry_price, short_stop);
      if(lot > 0)
      {
         trade.Sell(lot, _Symbol, entry_price, short_stop, short_take, "空單進場");
      }
   }

   // 畫出布林通道三條線（每根K線只保留一組）
   ObjectDelete(0, "BB_upper");
   ObjectDelete(0, "BB_basis");
   ObjectDelete(0, "BB_lower");

   datetime t0 = time[0];
   datetime t1 = time[1];

   ObjectCreate(0, "BB_upper", OBJ_TREND, 0, t1, upper, t0, upper);
   ObjectSetInteger(0, "BB_upper", OBJPROP_COLOR, clrBlue);

   ObjectCreate(0, "BB_basis", OBJ_TREND, 0, t1, basis, t0, basis);
   ObjectSetInteger(0, "BB_basis", OBJPROP_COLOR, clrGreen);

   ObjectCreate(0, "BB_lower", OBJ_TREND, 0, t1, lower, t0, lower);
   ObjectSetInteger(0, "BB_lower", OBJPROP_COLOR, clrRed);
}