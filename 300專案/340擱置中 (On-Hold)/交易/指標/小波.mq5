//+------------------------------------------------------------------+
//|                                                        小波.mq5 |
//|                                  Copyright 2024, MetaQuotes Ltd. |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots 0
#property indicator_calculate INDICATOR_CALCULATE_BASED_ON_PRICE_DATA

//--- 輸入參數
input bool   InpShowSWING = true;        // 顯示 SWING
input int    InpWidthSWING = 1;          // 線條寬度
input color  InpUPlineColor = clrRed;    // 上漲線條顏色
input color  InpDOWNlineColor = clrLime; // 下跌線條顏色

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

//+------------------------------------------------------------------+
//| 自定義指標初始化函數                                               |
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
   
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| 自定義指標迭代函數                                                 |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const int begin,
                const double &price[])
{
   // 檢查數據是否足夠
   if(rates_total < 2) return(0);
   
   // 獲取價格數據
   double close[], open[], high[], low[];
   datetime time[];
   
   ArraySetAsSeries(close, true);
   ArraySetAsSeries(open, true);
   ArraySetAsSeries(high, true);
   ArraySetAsSeries(low, true);
   ArraySetAsSeries(time, true);
   
   CopyClose(_Symbol, _Period, 0, rates_total, close);
   CopyOpen(_Symbol, _Period, 0, rates_total, open);
   CopyHigh(_Symbol, _Period, 0, rates_total, high);
   CopyLow(_Symbol, _Period, 0, rates_total, low);
   CopyTime(_Symbol, _Period, 0, rates_total, time);
   
   int start = prev_calculated;
   if(start == 0)
   {
      start = 1;
      isFirstRun = true;
   }
   
   // 處理每個K線
   for(int i = start; i < rates_total; i++)
   {
      // 如果是第一次運行，需要初始化第一個擺動點
      if(isFirstRun && i == start)
      {
         if(close[i] > open[i])  // 看漲K棒
         {
            AddSwingPoint(time[i], high[i], 1);
         }
         else  // 看跌K棒
         {
            AddSwingPoint(time[i], low[i], 2);
         }
         isFirstRun = false;
      }
      else
      {
         ProcessSwingPoint(i, time, open, high, low, close);
      }
   }
   
   // 處理當前K棒的即時更新
   if(rates_total > 0)
   {
      int currentIndex = rates_total - 1;
      ProcessCurrentBar(currentIndex, time, open, high, low, close);
   }
   
   // 設置指標為即時更新模式
   ChartSetInteger(0, CHART_EVENT_MOUSE_MOVE, true);
   
   return(rates_total);
}

//+------------------------------------------------------------------+
//| 處理擺動點                                                         |
//+------------------------------------------------------------------+
void ProcessSwingPoint(int index, const datetime &time[], const double &open[], 
                      const double &high[], const double &low[], const double &close[])
{
   bool isBullish = close[index] > open[index];  // 看漲K棒
   bool prevBullish = (index > 0) ? close[index-1] > open[index-1] : false;
   
   int drawLineType = 0; // 0=無動作, 1=趨勢延續, 2=趨勢改變
   
   if(isBullish)  // 看漲K棒
   {
      currentType = 1; // 上漲
      
      if(prevBullish)  // 前一根也是看漲K棒
      {
         drawLineType = 1; // 趨勢延續
         
         if(high[index] > swingPoints[0].price)  // 新高是否高於前一個最高點
         {
            swingPoints[0].price = high[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 1;
         }
         // 否則維持舊高點 - 不需要任何操作
      }
      else
      {
         drawLineType = 2; // 趨勢改變
         AddSwingPoint(time[index], high[index], 1);
      }
   }
   else  // 看跌K棒
   {
      currentType = 2; // 下跌
      
      if(!prevBullish)  // 前一根也是看跌K棒
      {
         drawLineType = 1; // 趨勢延續
         
         if(low[index] < swingPoints[0].price)  // 新低是否低於前一個最低點
         {
            swingPoints[0].price = low[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 2;
         }
         // 否則維持舊低點 - 不需要任何操作
      }
      else
      {
         drawLineType = 2; // 趨勢改變
         AddSwingPoint(time[index], low[index], 2);
      }
   }
   
   // 繪製趨勢線
   if(InpShowSWING && pointCount >= 2)
   {
      if(drawLineType == 1)
      {
         // 更新現有線條
         UpdateTrendLine();
      }
      else if(drawLineType == 2)
      {
         // 創建新線條
         CreateTrendLine();
      }
   }
   else if(InpShowSWING && pointCount == 1 && drawLineType == 2)
   {
      // 當只有一個點且趨勢改變時，需要等待下一個點
      // 這裡不需要繪製線條，因為需要兩個點才能繪製
   }
}

//+------------------------------------------------------------------+
//| 處理當前K棒的即時更新                                               |
//+------------------------------------------------------------------+
void ProcessCurrentBar(int index, const datetime &time[], const double &open[], 
                      const double &high[], const double &low[], const double &close[])
{
   if(pointCount < 1) return;  // 需要至少一個擺動點
   
   bool isBullish = close[index] > open[index];  // 看漲K棒
   bool prevBullish = (index > 0) ? close[index-1] > open[index-1] : false;
   
   // 檢查是否需要更新現有擺動點
   if(isBullish)  // 看漲K棒
   {
      if(prevBullish)  // 前一根也是看漲K棒
      {
         // 趨勢延續 - 檢查是否需要更新高點
         if(high[index] > swingPoints[0].price)
         {
            swingPoints[0].price = high[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 1;
            
            // 即時更新線條
            if(InpShowSWING && pointCount >= 2)
            {
               UpdateTrendLine();
            }
         }
      }
      else
      {
         // 趨勢改變 - 檢查是否需要添加新點
         if(high[index] > swingPoints[0].price)
         {
            AddSwingPoint(time[index], high[index], 1);
            
            // 即時創建新線條
            if(InpShowSWING && pointCount >= 2)
            {
               CreateTrendLine();
            }
         }
      }
   }
   else  // 看跌K棒
   {
      if(!prevBullish)  // 前一根也是看跌K棒
      {
         // 趨勢延續 - 檢查是否需要更新低點
         if(low[index] < swingPoints[0].price)
         {
            swingPoints[0].price = low[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 2;
            
            // 即時更新線條
            if(InpShowSWING && pointCount >= 2)
            {
               UpdateTrendLine();
            }
         }
      }
      else
      {
         // 趨勢改變 - 檢查是否需要添加新點
         if(low[index] < swingPoints[0].price)
         {
            AddSwingPoint(time[index], low[index], 2);
            
            // 即時創建新線條
            if(InpShowSWING && pointCount >= 2)
            {
               CreateTrendLine();
            }
         }
      }
   }
   
   // 強制重繪圖表以顯示即時更新
   ChartRedraw();
}

//+------------------------------------------------------------------+
//| 添加擺動點                                                         |
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
//| 創建趨勢線                                                         |
//+------------------------------------------------------------------+
void CreateTrendLine()
{
   if(pointCount < 2) return;
   
   color lineColor = (swingPoints[0].type == 1) ? InpUPlineColor : InpDOWNlineColor;
   
   string lineName = "SwingLine_" + TimeToString(swingPoints[1].time);
   
   ObjectCreate(0, lineName, OBJ_TREND, 0, swingPoints[1].time, swingPoints[1].price, 
                swingPoints[0].time, swingPoints[0].price);
   
   ObjectSetInteger(0, lineName, OBJPROP_COLOR, lineColor);
   ObjectSetInteger(0, lineName, OBJPROP_STYLE, STYLE_SOLID);
   ObjectSetInteger(0, lineName, OBJPROP_WIDTH, InpWidthSWING);
   ObjectSetInteger(0, lineName, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, lineName, OBJPROP_BACK, false);
}

//+------------------------------------------------------------------+
//| 更新趨勢線                                                         |
//+------------------------------------------------------------------+
void UpdateTrendLine()
{
   if(pointCount < 2) return;
   
   // 查找對應的線條並更新
   string lineName = "SwingLine_" + TimeToString(swingPoints[1].time);
   
   if(ObjectFind(0, lineName) >= 0)
   {
      ObjectSetInteger(0, lineName, OBJPROP_TIME, 1, swingPoints[0].time);
      ObjectSetDouble(0, lineName, OBJPROP_PRICE, 1, swingPoints[0].price);
   }
}

//+------------------------------------------------------------------+
//| 指標清理函數                                                       |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   // 清理創建的線條對象
   ObjectsDeleteAll(0, "SwingLine_");
} 