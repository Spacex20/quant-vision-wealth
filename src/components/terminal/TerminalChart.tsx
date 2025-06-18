
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useYFinanceHistorical } from "@/hooks/useYFinanceData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, CandlestickChart } from "recharts";
import { BarChart3, TrendingUp, Volume2, Settings, Maximize2 } from "lucide-react";

interface TerminalChartProps {
  selectedSymbol: string;
  isRealTime: boolean;
}

export const TerminalChart = ({ selectedSymbol, isRealTime }: TerminalChartProps) => {
  const [period, setPeriod] = useState("1mo");
  const [interval, setInterval] = useState("1d");
  const [chartType, setChartType] = useState("line");
  const [showVolume, setShowVolume] = useState(true);
  const [indicators, setIndicators] = useState<string[]>([]);

  const { data: historicalData, isLoading } = useYFinanceHistorical(selectedSymbol, period, interval);

  // Process data for chart
  const chartData = historicalData?.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.close,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    // Technical indicators (mock calculations)
    sma20: item.close * (0.98 + Math.random() * 0.04),
    sma50: item.close * (0.95 + Math.random() * 0.1),
    rsi: 30 + Math.random() * 40,
  })) || [];

  const periods = [
    { value: "1d", label: "1D" },
    { value: "5d", label: "5D" },
    { value: "1mo", label: "1M" },
    { value: "3mo", label: "3M" },
    { value: "6mo", label: "6M" },
    { value: "1y", label: "1Y" },
    { value: "2y", label: "2Y" },
    { value: "5y", label: "5Y" },
  ];

  const chartTypes = [
    { value: "line", label: "LINE" },
    { value: "candlestick", label: "CANDLESTICK" },
    { value: "bar", label: "BAR" },
  ];

  const technicalIndicators = [
    { value: "sma20", label: "SMA 20", color: "#22c55e" },
    { value: "sma50", label: "SMA 50", color: "#f59e0b" },
    { value: "bollinger", label: "BOLLINGER", color: "#8b5cf6" },
    { value: "rsi", label: "RSI", color: "#ef4444" },
  ];

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const renderChart = () => {
    if (chartType === "candlestick") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#16a34a" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#22c55e" 
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#22c55e" 
              fontSize={10}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000', 
                border: '1px solid #22c55e',
                color: '#22c55e' 
              }}
            />
            {/* Main price line */}
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#ffffff" 
              strokeWidth={2}
              dot={false}
            />
            {/* Technical indicators */}
            {indicators.includes("sma20") && (
              <Line 
                type="monotone" 
                dataKey="sma20" 
                stroke="#22c55e" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
            {indicators.includes("sma50") && (
              <Line 
                type="monotone" 
                dataKey="sma50" 
                stroke="#f59e0b" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#16a34a" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#22c55e" 
            fontSize={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#22c55e" 
            fontSize={10}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#000', 
              border: '1px solid #22c55e',
              color: '#22c55e' 
            }}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#ffffff" 
            strokeWidth={2}
            dot={false}
          />
          {indicators.includes("sma20") && (
            <Line 
              type="monotone" 
              dataKey="sma20" 
              stroke="#22c55e" 
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          )}
          {indicators.includes("sma50") && (
            <Line 
              type="monotone" 
              dataKey="sma50" 
              stroke="#f59e0b" 
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-4">
      {/* Chart controls */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              ADVANCED CHARTING - {selectedSymbol}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isRealTime && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  LIVE CHART
                </Badge>
              )}
              <Button variant="outline" size="sm" className="border-green-600 text-green-400">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Time period selector */}
            <div className="flex gap-1">
              {periods.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(p.value)}
                  className="text-xs border-green-600 text-green-400 hover:bg-green-900"
                >
                  {p.label}
                </Button>
              ))}
            </div>

            {/* Chart type selector */}
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32 bg-black border-green-600 text-green-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-800">
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Volume toggle */}
            <Button
              variant={showVolume ? "default" : "outline"}
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
              className="border-green-600 text-green-400 hover:bg-green-900"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              VOLUME
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main chart area */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-3 bg-gray-900 border-green-800">
          <CardContent className="p-4">
            <div className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-green-400">
                  LOADING CHART DATA...
                </div>
              ) : (
                renderChart()
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical indicators panel */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              TECHNICAL INDICATORS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {technicalIndicators.map((indicator) => (
                <Button
                  key={indicator.value}
                  variant={indicators.includes(indicator.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.value)}
                  className="w-full justify-start text-xs border-green-600 text-green-400 hover:bg-green-900"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: indicator.color }}
                  />
                  {indicator.label}
                </Button>
              ))}
            </div>

            {/* Chart settings */}
            <div className="mt-4 space-y-2 border-t border-green-800 pt-4">
              <h4 className="text-green-400 font-semibold text-xs">CHART SETTINGS</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-green-600 text-green-400"
              >
                <Settings className="w-4 h-4 mr-2" />
                CUSTOMIZE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volume chart */}
      {showVolume && (
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              VOLUME ANALYSIS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#16a34a" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#22c55e" 
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#22c55e" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e' 
                    }}
                  />
                  <Bar dataKey="volume" fill="#22c55e" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
