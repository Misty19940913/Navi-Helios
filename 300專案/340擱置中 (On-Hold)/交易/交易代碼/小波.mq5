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
#property indicator_plots   0

//--- 輸入參數
input group "SWING"
input bool   ShowSWING = true;        // 顯示 SWING
input int    WidthSWING = 1;          // 線條寬度

input group "樣式/顏色"
input ENUM_LINE_STYLE UPLineStyle = STYLE_SOLID;    // 上漲線條樣式
input ENUM_LINE_STYLE DOWNLineStyle = STYLE_SOLID;  // 下跌線條樣式
input color  UPLineColor = clrRed;                  // 上漲線條顏色
input color  DOWNLineColor = clrLime;               // 下跌線條顏色

//--- 全局變數
struct SwingPoint
{
    datetime time;
    double   price;
    int      type;  // 1=上漲, 2=下跌
};

SwingPoint swingPoints[5];  // 存儲轉折點
int         pointCount = 0; // 當前點數
int         currentType = 0; // 當前趨勢類型
bool        runStart = true;

//+------------------------------------------------------------------+
//| 自定義指標初始化函數                                              |
//+------------------------------------------------------------------+
int OnInit()
{
    // 初始化陣列
    ArrayResize(swingPoints, 5);
    for(int i = 0; i < 5; i++)
    {
        swingPoints[i].time = 0;
        swingPoints[i].price = 0;
        swingPoints[i].type = 0;
    }
    
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| 自定義指標迭代函數                                                |
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
    // 確保有足夠的數據
    if(rates_total < 2) return(0);
    
    int start = prev_calculated > 0 ? prev_calculated - 1 : 1;
    
    for(int i = start; i < rates_total; i++)
    {
        // 判斷趨勢
        bool isBullish = close[i] > open[i];  // 看漲K棒
        bool prevBullish = close[i-1] > open[i-1];  // 前一根K棒
        
        if(isBullish)  // 看漲K棒
        {
            currentType = 1;  // 1為上漲，2為下跌
            
            if(prevBullish)  // 如果前1K棒也是看漲K棒
            {
                // 趨勢延續
                if(high[i] > swingPoints[0].price)  // 新高是否高於前一個最高點
                {
                    swingPoints[0].price = high[i];
                    swingPoints[0].time = time[i];
                    swingPoints[0].type = 1;S
                }
                // 維持舊高之價格與時間
            }
            else
            {
                // 趨勢改變
                InsertSwingPoint(time[i], high[i], 1);
            }
        }
        else  // 看跌K棒
        {
            currentType = 2;  // 1為上漲，2為下跌
            
            if(!prevBullish)  // 如果前1K棒也是看跌K棒
            {
                // 趨勢延續
                if(low[i] < swingPoints[0].price)  // 新低是否低於前一個最低點
                {
                    swingPoints[0].price = low[i];
                    swingPoints[0].time = time[i];
                    swingPoints[0].type = 2;
                }
                // 維持舊低之價格與時間
            }
            else
            {
                // 趨勢改變
                InsertSwingPoint(time[i], low[i], 2);
            }
        }
        
        // 繪製趨勢線
        if(ShowSWING && pointCount >= 2)
        {
            DrawSwingLines();
        }
    }
    
    return(rates_total);
}

//+------------------------------------------------------------------+
//| 插入轉折點                                                        |
//+------------------------------------------------------------------+
void InsertSwingPoint(datetime time, double price, int type)
{
    // 移動現有點
    for(int i = 4; i > 0; i--)
    {
        swingPoints[i] = swingPoints[i-1];
    }
    
    // 插入新點
    swingPoints[0].time = time;
    swingPoints[0].price = price;
    swingPoints[0].type = type;
    
    if(pointCount < 5) pointCount++;
}

//+------------------------------------------------------------------+
//| 繪製SWING線條                                                    |
//+------------------------------------------------------------------+
void DrawSwingLines()
{
    if(pointCount < 2) return;
    
    // 清除舊線條
    ObjectsDeleteAll(0, "SWING_");
    
    // 繪製新線條
    for(int i = 0; i < pointCount - 1; i++)
    {
        string lineName = "SWING_" + IntegerToString(i);
        
        color lineColor = (swingPoints[i].type == 1) ? UPLineColor : DOWNLineColor;
        ENUM_LINE_STYLE lineStyle = (swingPoints[i].type == 1) ? UPLineStyle : DOWNLineStyle;
        
        if(ObjectCreate(0, lineName, OBJ_TREND, 0, 
                       swingPoints[i+1].time, swingPoints[i+1].price,
                       swingPoints[i].time, swingPoints[i].price))
        {
            ObjectSetInteger(0, lineName, OBJPROP_COLOR, lineColor);
            ObjectSetInteger(0, lineName, OBJPROP_STYLE, lineStyle);
            ObjectSetInteger(0, lineName, OBJPROP_WIDTH, WidthSWING);
            ObjectSetInteger(0, lineName, OBJPROP_RAY_RIGHT, true);
        }
    }
}

//+------------------------------------------------------------------+
//| 指標釋放函數                                                      |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    ObjectsDeleteAll(0, "SWING_");
} 