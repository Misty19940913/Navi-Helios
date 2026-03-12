//+------------------------------------------------------------------+
//|                                     MA突破雙向入出場策略 EA.mq5  |
//|                        轉換自 TradingView Pine Script 策略      |
//+------------------------------------------------------------------+
#property copyright "2025"
#property link      ""
#property version   "1.00"
#property strict    

#include <Trade\Trade.mqh>  // 添加交易類別庫

//--- input parameters
input int    EntryTicks   = 200;      // 突破 MA 入場點數（Tick 數）
input int    ExitTicks    = 100;      // 反向突破出場點數（Tick 數）
input double LotSize      = 0.1;      // 每筆交易手數

//--- global variables
double entryOffset;                   // 價格偏移入場
double exitOffset;                    // 價格偏移出場
int    maPeriod = 21;                 // MA 周期
CTrade trade;                         // 交易物件

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   // 計算價格偏移
   double point = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   entryOffset = EntryTicks * point;
   exitOffset  = ExitTicks  * point;

   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
  }

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
  {
   // 1. 計算日線 MA21
   int    maHandle = iMA(_Symbol, PERIOD_D1, maPeriod, 0, MODE_SMA, PRICE_CLOSE);
   double ma[1];
   if(CopyBuffer(maHandle, 0, 0, 1, ma) <= 0)
     {
      // 複製失敗
      return;
     }
   double maValue = ma[0];

   // 2. 取得市場價格
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

   // 3. 檢查現有持倉
   bool hasLong  = false;
   bool hasShort = false;
   int totalPositions = PositionsTotal();
   for(int i=0; i<totalPositions; i++)
     {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket))
        {
         if(PositionGetString(POSITION_SYMBOL) == _Symbol)
           {
            if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY) hasLong = true;
            if(PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_SELL) hasShort = true;
           }
        }
     }

   // 4. 無持倉時：檢查多空入場條件
   if(!hasLong && !hasShort)
     {
      // 多頭入場
      if(bid > maValue + entryOffset)
        {
         trade.Buy(LotSize, _Symbol, ask, 0, 0, "Long Entry");
        }
      // 空頭入場
      else if(ask < maValue - entryOffset)
        {
         trade.Sell(LotSize, _Symbol, bid, 0, 0, "Short Entry");
        }
     }

   // 5. 多頭持倉時：出場條件
   if(hasLong)
     {
      if(bid < maValue - 100 * _Point)  // 跌破均線100點
        {
         // 平多
         trade.PositionClose(_Symbol, POSITION_TYPE_BUY);
        }
     }

   // 6. 空頭持倉時：出場條件
   if(hasShort)
     {
      if(ask > maValue + 100 * _Point)  // 漲破均線100點
        {
         // 平空
         trade.PositionClose(_Symbol, POSITION_TYPE_SELL);
        }
     }
  }

//+------------------------------------------------------------------+