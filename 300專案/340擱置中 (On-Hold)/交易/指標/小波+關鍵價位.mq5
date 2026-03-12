//+------------------------------------------------------------------+
//|                                                 小波关键价位.mq5 |
//|                                      Copyright 2024, MetaQuotes |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, MetaQuotes Ltd."
#property link      "https://www.mql5.com"
#property version   "1.33"
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots 0

//--- 输入参数
input bool   InpShowSWING = true;        // 显示 SWING
input int    InpWidthSWING = 1;          // 线条宽度
input color  InpUPlineColor = clrRed;    // 上涨线条颜色
input color  InpDOWNlineColor = clrLime; // 下跌线条颜色
input color  InpBullKeyColor = clrBlue;  // 多方关键价位颜色
input color  InpBearKeyColor = clrOrange;// 空方关键价位颜色
input int    InpHLWidth = 1;             // 水平线宽度
input int    LabelFontSize = 10;         // 标签文字大小
input int    LabelOffsetBars = 1;        // 标签放在当前bar右方几个时间单位

//--- 结构
struct SwingPoint
{
   datetime time;
   double   price;
   int      type;  // 1=上涨, 2=下跌
};

// 全局变量
SwingPoint swingPoints[5];
int         pointCount = 0;
int         currentType = 0;
int         swingSegmentCount = 0;
double      lastBullEnd = 0;
double      lastBearEnd = 0;

//+------------------------------------------------------------------+
//| 初始化                                                           |
//+------------------------------------------------------------------+
int OnInit()
{
   for(int i = 0; i < ArraySize(swingPoints); i++)
   {
      swingPoints[i].time = 0;
      swingPoints[i].price = 0.0;
      swingPoints[i].type = 0;
   }
   pointCount = 0;
   currentType = 0;
   swingSegmentCount = 0;
   lastBullEnd = 0.0;
   lastBearEnd = 0.0;
   
   ObjectsDeleteAll(0, 0, -1, "SwingSegment_");
   ObjectsDeleteAll(0, 0, -1, "BullKey_");
   ObjectsDeleteAll(0, 0, -1, "BearKey_");
   
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| 计算指标                                                         |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double   &open[],
                const double   &high[],
                const double   &low[],
                const double   &close[],
                const long     &tick_volume[],
                const long     &volume[],
                const int      &spread[])
{
   if(rates_total < 2) return(0);

   // 初始化（僅首次）：用最新一根作為起點
   if(prev_calculated == 0)
   {
      int last = rates_total - 1;
      if(close[last] > open[last])
         AddSwingPoint(time[last], high[last], 1);
      else
         AddSwingPoint(time[last], low[last], 2);
   }

   // 增量計算：回退一根避免邊界遺漏
   int start = (prev_calculated > 1) ? (prev_calculated - 1) : 1;

   // 標準順序（非 series）：0 最舊 → rates_total-1 最新
   for(int i = start; i < rates_total; i++)
   {
      ProcessSwingPoint(i, time, open, high, low, close);
   }

   // 當前 K 棒處理：使用最新索引
   ProcessCurrentBar(rates_total - 1, time, open, high, low, close);
   UpdateKeyLabelsPosition();

   return(rates_total);
}

//+------------------------------------------------------------------+
//| 处理摆动点                                                       |
//+------------------------------------------------------------------+
void ProcessSwingPoint(int index, const datetime &time[], const double &open[],
                       const double &high[], const double &low[], const double &close[])
{
   if(index < 1) return;

   bool isBullish = close[index] > open[index];
   bool prevBullish = close[index-1] > open[index-1];

   if(isBullish)
   {
      if(prevBullish)
      {
         if(pointCount > 0 && high[index] > swingPoints[0].price)
         {
            swingPoints[0].price = high[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 1;
            if(InpShowSWING && pointCount >= 2)
               UpdateTrendLine();
         }
      }
      else
      {
         AddSwingPoint(time[index], high[index], 1);
         if(InpShowSWING && pointCount >= 2)
            CreateTrendLine();
      }
   }
   else
   {
      if(!prevBullish)
      {
         if(pointCount > 0 && low[index] < swingPoints[0].price)
         {
            swingPoints[0].price = low[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 2;
            if(InpShowSWING && pointCount >= 2)
               UpdateTrendLine();
         }
      }
      else
      {
         AddSwingPoint(time[index], low[index], 2);
         if(InpShowSWING && pointCount >= 2)
            CreateTrendLine();
      }
   }
}

//+------------------------------------------------------------------+
//| 处理当前K棒                                                      |
//+------------------------------------------------------------------+
void ProcessCurrentBar(int index, const datetime &time[], const double &open[],
                       const double &high[], const double &low[], const double &close[])
{
   if(pointCount < 1) return;

   bool isBullish = close[index] > open[index];
   bool prevBullish = (index > 0) ? close[index-1] > open[index-1] : false;

   if(isBullish)
   {
      if(prevBullish)
      {
         if(high[index] > swingPoints[0].price)
         {
            swingPoints[0].price = high[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 1;
            if(InpShowSWING && pointCount >= 2)
               UpdateTrendLine();
         }
      }
      else
      {
         if(pointCount == 0 || high[index] > swingPoints[0].price)
         {
            AddSwingPoint(time[index], high[index], 1);
            if(InpShowSWING && pointCount >= 2)
               CreateTrendLine();
         }
      }
   }
   else
   {
      if(!prevBullish)
      {
         if(low[index] < swingPoints[0].price)
         {
            swingPoints[0].price = low[index];
            swingPoints[0].time = time[index];
            swingPoints[0].type = 2;
            if(InpShowSWING && pointCount >= 2)
               UpdateTrendLine();
         }
      }
      else
      {
         if(pointCount == 0 || low[index] < swingPoints[0].price)
         {
            AddSwingPoint(time[index], low[index], 2);
            if(InpShowSWING && pointCount >= 2)
               CreateTrendLine();
         }
      }
   }
}

//+------------------------------------------------------------------+
//| 添加摆动点                                                       |
//+------------------------------------------------------------------+
void AddSwingPoint(datetime time_val, double price, int type)
{
   for(int i = ArraySize(swingPoints)-1; i > 0; i--)
      swingPoints[i] = swingPoints[i-1];
   
   swingPoints[0].time = time_val;
   swingPoints[0].price = price;
   swingPoints[0].type = type;
   
   if(pointCount < ArraySize(swingPoints)) 
      pointCount++;
}

//+------------------------------------------------------------------+
//| 创建趋势线                                                       |
//+------------------------------------------------------------------+
void CreateTrendLine()
{
   if(pointCount < 2) return;

   color lineColor = (swingPoints[0].type == 1) ? InpUPlineColor : InpDOWNlineColor;
   int idx = swingSegmentCount;
   string baseName = "SwingSegment_" + IntegerToString(idx);
   
   if(ObjectFind(0, baseName) >= 0) 
      ObjectDelete(0, baseName);

   bool ok = ObjectCreate(0, baseName, OBJ_TREND, 0,
                          swingPoints[1].time, swingPoints[1].price,
                          swingPoints[0].time, swingPoints[0].price);
   if(ok)
   {
      ObjectSetInteger(0, baseName, OBJPROP_COLOR, lineColor);
      ObjectSetInteger(0, baseName, OBJPROP_WIDTH, InpWidthSWING);
      ObjectSetInteger(0, baseName, OBJPROP_RAY_RIGHT, false);
      ObjectSetInteger(0, baseName, OBJPROP_BACK, false);
   }

   if(swingPoints[0].type == 1)
   {
      if(lastBullEnd == 0.0 || swingPoints[0].price > lastBullEnd)
      {
         if(lastBullEnd > 0.0)
         {
            string keyName = "BearKey_" + IntegerToString(idx);
            DrawKeyLevel(keyName, swingPoints[1].price, InpBearKeyColor);
         }
         lastBullEnd = swingPoints[0].price;
      }
   }
   else if(swingPoints[0].type == 2)
   {
      if(lastBearEnd == 0.0 || swingPoints[0].price < lastBearEnd)
      {
         if(lastBearEnd > 0.0)
         {
            string keyName = "BullKey_" + IntegerToString(idx);
            DrawKeyLevel(keyName, swingPoints[1].price, InpBullKeyColor);
         }
         lastBearEnd = swingPoints[0].price;
      }
   }

   swingSegmentCount++;
   CleanupOldObjects();
}

//+------------------------------------------------------------------+
//| 更新趋势线                                                       |
//+------------------------------------------------------------------+
void UpdateTrendLine()
{
   if(pointCount < 2) return;
   
   int idx = swingSegmentCount - 1;
   if(idx < 0) return;
   
   string baseName = "SwingSegment_" + IntegerToString(idx);
   if(ObjectFind(0, baseName) >= 0)
   {
      ObjectMove(0, baseName, 1, swingPoints[0].time, swingPoints[0].price);
   }
}

//+------------------------------------------------------------------+
//| 绘制关键价位                                                     |
//+------------------------------------------------------------------+
void DrawKeyLevel(string name, double price, color clr)
{
   if(ObjectFind(0, name) >= 0) 
      ObjectDelete(0, name);
   
   if(!ObjectCreate(0, name, OBJ_HLINE, 0, 0, price))
      return;
   
   ObjectSetDouble(0, name, OBJPROP_PRICE, price);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, InpHLWidth);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);

   string lblName = name + "_lbl";
   if(ObjectFind(0, lblName) >= 0) 
      ObjectDelete(0, lblName);

   datetime labelTime = iTime(_Symbol, _Period, 0) + PeriodSeconds() * LabelOffsetBars;
   
   if(ObjectCreate(0, lblName, OBJ_TEXT, 0, labelTime, price))
   {
      int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
      string text = DoubleToString(price, digits);
      
      // 修正 ObjectSetText 语法 - MQL5 正确用法
      ObjectSetString(0, lblName, OBJPROP_TEXT, text);
      ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, LabelFontSize);
      ObjectSetString(0, lblName, OBJPROP_FONT, "Arial");
      ObjectSetInteger(0, lblName, OBJPROP_COLOR, clr);
      ObjectSetInteger(0, lblName, OBJPROP_ANCHOR, ANCHOR_LEFT_UPPER);
      ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, lblName, OBJPROP_BACK, false);
   }
}

//+------------------------------------------------------------------+
//| 更新关键价位标签位置                                              |
//+------------------------------------------------------------------+
void UpdateKeyLabelsPosition()
{
   datetime currentTime = iTime(_Symbol, _Period, 0);
   datetime labelTime = currentTime + PeriodSeconds() * LabelOffsetBars;
   
   for(int i = 0; i <= swingSegmentCount; i++)
   {
      string bullKey = "BullKey_" + IntegerToString(i);
      string bearKey = "BearKey_" + IntegerToString(i);
      
      UpdateSingleKeyLabel(bullKey, labelTime);
      UpdateSingleKeyLabel(bearKey, labelTime);
   }
}

//+------------------------------------------------------------------+
//| 更新单个关键价位标签                                              |
//+------------------------------------------------------------------+
void UpdateSingleKeyLabel(string keyName, datetime labelTime)
{
   string lblName = keyName + "_lbl";
   
   if(ObjectFind(0, keyName) >= 0 && ObjectFind(0, lblName) >= 0)
   {
      double price = ObjectGetDouble(0, keyName, OBJPROP_PRICE);
      ObjectMove(0, lblName, 0, labelTime, price);
   }
}

//+------------------------------------------------------------------+
//| 清理旧物件                                                       |
//+------------------------------------------------------------------+
void CleanupOldObjects()
{
   int keepCount = 5;
   
   for(int i = swingSegmentCount - keepCount; i >= 0; i--)
   {
      string segmentName = "SwingSegment_" + IntegerToString(i);
      string bullKey = "BullKey_" + IntegerToString(i);
      string bearKey = "BearKey_" + IntegerToString(i);
      string bullLabel = bullKey + "_lbl";
      string bearLabel = bearKey + "_lbl";
      
      if(ObjectFind(0, segmentName) >= 0) ObjectDelete(0, segmentName);
      if(ObjectFind(0, bullKey) >= 0) ObjectDelete(0, bullKey);
      if(ObjectFind(0, bearKey) >= 0) ObjectDelete(0, bearKey);
      if(ObjectFind(0, bullLabel) >= 0) ObjectDelete(0, bullLabel);
      if(ObjectFind(0, bearLabel) >= 0) ObjectDelete(0, bearLabel);
   }
}

//+------------------------------------------------------------------+
//| 清理函数                                                         |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   ObjectsDeleteAll(0, 0, -1, "SwingSegment_");
   ObjectsDeleteAll(0, 0, -1, "BullKey_");
   ObjectsDeleteAll(0, 0, -1, "BearKey_");
}