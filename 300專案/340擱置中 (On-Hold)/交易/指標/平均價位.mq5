//+------------------------------------------------------------------+
//|                                         AvgPriceWithLines.mq5    |
//+------------------------------------------------------------------+
#property copyright ""
#property link      ""
#property version   "1.02"
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   2

//--- 輸入參數
input color Buy_Color = clrBlue;           // 買入均價顏色
input color Sell_Color = clrRed;           // 賣出均價顏色
input int   Line_Width = 2;                // 水平線寬度
input int   Font_Size = 12;                // 字體大小
input string Font_Name = "Arial";          // 字體名稱
input int   Corner = 0;                    // 顯示角落 (0-左上, 1-右上, 2-左下, 3-右下)
input int   X_Offset = 100;                 // X軸偏移
input int   Y_Offset = 200;                 // Y軸偏移
input bool  Show_Lines = true;             // 顯示水平線
input bool  Show_Labels = true;            // 顯示價格標籤

//--- 加權方式選單
enum ENUM_AvgPriceMode
{
   MODE_LOTS      = 0,   // 手數加權
   MODE_NOTIONAL  = 1    // 名義價值加權
};
input ENUM_AvgPriceMode AvgPriceMode = MODE_LOTS;   // 加權方式

//--- 指標緩衝區
double BuyPriceBuffer[];
double SellPriceBuffer[];

//--- 全局變量
double avgBuyPrice = 0;
double avgSellPrice = 0;
double totalBuyVolume = 0;
double totalSellVolume = 0;
double totalBuyLots = 0;
double totalSellLots = 0;
double totalProfit = 0;
int buyCount = 0;
int sellCount = 0;
string prefix = "AvgPrice_";

//+------------------------------------------------------------------+
//| 初始化                                                           |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- 緩衝區綁定
   SetIndexBuffer(0, BuyPriceBuffer, INDICATOR_DATA);
   SetIndexBuffer(1, SellPriceBuffer, INDICATOR_DATA);

   //--- 買入線
   PlotIndexSetInteger(0, PLOT_DRAW_TYPE, DRAW_LINE);
   PlotIndexSetInteger(0, PLOT_LINE_STYLE, STYLE_SOLID);
   PlotIndexSetInteger(0, PLOT_LINE_WIDTH, Line_Width);
   PlotIndexSetInteger(0, PLOT_LINE_COLOR, Buy_Color);
   PlotIndexSetString(0, PLOT_LABEL, "平均買入價");

   //--- 賣出線
   PlotIndexSetInteger(1, PLOT_DRAW_TYPE, DRAW_LINE);
   PlotIndexSetInteger(1, PLOT_LINE_STYLE, STYLE_SOLID);
   PlotIndexSetInteger(1, PLOT_LINE_WIDTH, Line_Width);
   PlotIndexSetInteger(1, PLOT_LINE_COLOR, Sell_Color);
   PlotIndexSetString(1, PLOT_LABEL, "平均賣出價");

   if(Show_Labels) CreateDisplayObjects();

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   DeleteDisplayObjects();
   DeleteHorizontalLines();
}

//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   CalculateAveragePrices();
   UpdateBuffers(rates_total);
   if(Show_Lines) UpdateHorizontalLines();
   if(Show_Labels) UpdateDisplay();
   return(rates_total);
}

//+------------------------------------------------------------------+
//| 計算平均價格與盈虧                                                |
//+------------------------------------------------------------------+
void CalculateAveragePrices()
{
   double buySum = 0.0, sellSum = 0.0;
   double buyWeight = 0.0, sellWeight = 0.0;
   double buyLots = 0.0, sellLots = 0.0;
   int buyCnt = 0, sellCnt = 0;
   double profitSum = 0.0;

   int total = PositionsTotal();
   for(int i=0; i<total; i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(!PositionSelectByTicket(ticket)) continue;

      string sym = PositionGetString(POSITION_SYMBOL);
      if(sym != _Symbol) continue;

      long type = PositionGetInteger(POSITION_TYPE);
      double vol = PositionGetDouble(POSITION_VOLUME);
      double price = PositionGetDouble(POSITION_PRICE_OPEN);
      double profit = PositionGetDouble(POSITION_PROFIT);

      double contract_size = SymbolInfoDouble(sym, SYMBOL_TRADE_CONTRACT_SIZE);
      double weight = (AvgPriceMode == MODE_NOTIONAL) ? (vol * contract_size) : vol;

      profitSum += profit;

      if(type == POSITION_TYPE_BUY)
      {
         buySum += price * weight;
         buyWeight += weight;
         buyLots += vol;
         buyCnt++;
      }
      else if(type == POSITION_TYPE_SELL)
      {
         sellSum += price * weight;
         sellWeight += weight;
         sellLots += vol;
         sellCnt++;
      }
   }

   avgBuyPrice = (buyWeight > 0) ? (buySum / buyWeight) : 0.0;
   avgSellPrice = (sellWeight > 0) ? (sellSum / sellWeight) : 0.0;
   totalBuyVolume = buyWeight;
   totalSellVolume = sellWeight;
   totalBuyLots = buyLots;
   totalSellLots = sellLots;
   buyCount = buyCnt;
   sellCount = sellCnt;
   totalProfit = profitSum;
}

//+------------------------------------------------------------------+
void UpdateBuffers(int rates_total)
{
   for(int i=0; i<rates_total; i++)
   {
      BuyPriceBuffer[i] = avgBuyPrice;
      SellPriceBuffer[i] = avgSellPrice;
   }
}

//+------------------------------------------------------------------+
void CreateDisplayObjects()
{
   ObjectCreate(0, prefix + "Buy_Label", OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, prefix + "Buy_Label", OBJPROP_CORNER, Corner);
   ObjectSetInteger(0, prefix + "Buy_Label", OBJPROP_XDISTANCE, X_Offset);
   ObjectSetInteger(0, prefix + "Buy_Label", OBJPROP_YDISTANCE, Y_Offset);
   ObjectSetInteger(0, prefix + "Buy_Label", OBJPROP_COLOR, Buy_Color);
   ObjectSetInteger(0, prefix + "Buy_Label", OBJPROP_FONTSIZE, Font_Size);
   ObjectSetString(0, prefix + "Buy_Label", OBJPROP_FONT, Font_Name);

   ObjectCreate(0, prefix + "Sell_Label", OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, prefix + "Sell_Label", OBJPROP_CORNER, Corner);
   ObjectSetInteger(0, prefix + "Sell_Label", OBJPROP_XDISTANCE, X_Offset);
   ObjectSetInteger(0, prefix + "Sell_Label", OBJPROP_YDISTANCE, Y_Offset + Font_Size + 5);
   ObjectSetInteger(0, prefix + "Sell_Label", OBJPROP_COLOR, Sell_Color);
   ObjectSetInteger(0, prefix + "Sell_Label", OBJPROP_FONTSIZE, Font_Size);
   ObjectSetString(0, prefix + "Sell_Label", OBJPROP_FONT, Font_Name);

   ObjectCreate(0, prefix + "Count_Label", OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, prefix + "Count_Label", OBJPROP_CORNER, Corner);
   ObjectSetInteger(0, prefix + "Count_Label", OBJPROP_XDISTANCE, X_Offset);
   ObjectSetInteger(0, prefix + "Count_Label", OBJPROP_YDISTANCE, Y_Offset + (Font_Size + 5) * 2);
   ObjectSetInteger(0, prefix + "Count_Label", OBJPROP_COLOR, clrWhite);
   ObjectSetInteger(0, prefix + "Count_Label", OBJPROP_FONTSIZE, Font_Size);
   ObjectSetString(0, prefix + "Count_Label", OBJPROP_FONT, Font_Name);
   
   ObjectCreate(0, prefix + "Profit_Label", OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, prefix + "Profit_Label", OBJPROP_CORNER, Corner);
   ObjectSetInteger(0, prefix + "Profit_Label", OBJPROP_XDISTANCE, X_Offset);
   ObjectSetInteger(0, prefix + "Profit_Label", OBJPROP_YDISTANCE, Y_Offset + (Font_Size + 5) * 3);
   ObjectSetInteger(0, prefix + "Profit_Label", OBJPROP_COLOR, clrYellow);
   ObjectSetInteger(0, prefix + "Profit_Label", OBJPROP_FONTSIZE, Font_Size);
   ObjectSetString(0, prefix + "Profit_Label", OBJPROP_FONT, Font_Name);
}

//+------------------------------------------------------------------+
void DeleteDisplayObjects()
{
   ObjectDelete(0, prefix + "Buy_Label");
   ObjectDelete(0, prefix + "Sell_Label");
   ObjectDelete(0, prefix + "Count_Label");
   ObjectDelete(0, prefix + "Profit_Label");
   ObjectDelete(0, prefix + "Mode_Label");
}

void DeleteHorizontalLines()
{
   ObjectDelete(0, prefix + "Buy_Line");
   ObjectDelete(0, prefix + "Sell_Line");
}

//+------------------------------------------------------------------+
void UpdateHorizontalLines()
{
   if(avgBuyPrice > 0)
   {
      if(ObjectFind(0, prefix + "Buy_Line") < 0)
      {
         ObjectCreate(0, prefix + "Buy_Line", OBJ_HLINE, 0, 0, avgBuyPrice);
         ObjectSetInteger(0, prefix + "Buy_Line", OBJPROP_COLOR, Buy_Color);
         ObjectSetInteger(0, prefix + "Buy_Line", OBJPROP_STYLE, STYLE_SOLID);
         ObjectSetInteger(0, prefix + "Buy_Line", OBJPROP_WIDTH, Line_Width);
      }
      ObjectSetDouble(0, prefix + "Buy_Line", OBJPROP_PRICE, avgBuyPrice);
   }
   else ObjectDelete(0, prefix + "Buy_Line");

   if(avgSellPrice > 0)
   {
      if(ObjectFind(0, prefix + "Sell_Line") < 0)
      {
         ObjectCreate(0, prefix + "Sell_Line", OBJ_HLINE, 0, 0, avgSellPrice);
         ObjectSetInteger(0, prefix + "Sell_Line", OBJPROP_COLOR, Sell_Color);
         ObjectSetInteger(0, prefix + "Sell_Line", OBJPROP_STYLE, STYLE_SOLID);
         ObjectSetInteger(0, prefix + "Sell_Line", OBJPROP_WIDTH, Line_Width);
      }
      ObjectSetDouble(0, prefix + "Sell_Line", OBJPROP_PRICE, avgSellPrice);
   }
   else ObjectDelete(0, prefix + "Sell_Line");
}

//+------------------------------------------------------------------+
void UpdateDisplay()
{
   string buyText   = "平均買入價: " + (avgBuyPrice > 0 ? DoubleToString(avgBuyPrice, _Digits) : "無持倉");
   string sellText  = "平均賣出價: " + (avgSellPrice > 0 ? DoubleToString(avgSellPrice, _Digits) : "無持倉");
   string countText = "持倉手數: 買(" + DoubleToString(totalBuyLots, 2) + ") 賣(" + DoubleToString(totalSellLots, 2) + ")";
   string profitText= "總盈虧: " + DoubleToString(totalProfit, 2);
   string modeText  = (AvgPriceMode == MODE_NOTIONAL) ? "計算方式: 名義價值加權" : "計算方式: 手數加權";

   ObjectSetString(0, prefix + "Buy_Label", OBJPROP_TEXT, buyText);
   ObjectSetString(0, prefix + "Sell_Label", OBJPROP_TEXT, sellText);
   ObjectSetString(0, prefix + "Count_Label", OBJPROP_TEXT, countText);
   ObjectSetString(0, prefix + "Profit_Label", OBJPROP_TEXT, profitText);

   if(ObjectFind(0, prefix + "Mode_Label") < 0)
   {
      ObjectCreate(0, prefix + "Mode_Label", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, prefix + "Mode_Label", OBJPROP_CORNER, Corner);
      ObjectSetInteger(0, prefix + "Mode_Label", OBJPROP_XDISTANCE, X_Offset);
      ObjectSetInteger(0, prefix + "Mode_Label", OBJPROP_YDISTANCE, Y_Offset + (Font_Size + 5) * 4);
      ObjectSetInteger(0, prefix + "Mode_Label", OBJPROP_COLOR, clrAqua);
      ObjectSetInteger(0, prefix + "Mode_Label", OBJPROP_FONTSIZE, Font_Size);
      ObjectSetString(0, prefix + "Mode_Label", OBJPROP_FONT, Font_Name);
   }
   ObjectSetString(0, prefix + "Mode_Label", OBJPROP_TEXT, modeText);
}
