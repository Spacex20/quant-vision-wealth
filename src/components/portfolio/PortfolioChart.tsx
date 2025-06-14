
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { financialApi, HistoricalData } from '@/services/financialApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChartData {
  date: string;
  portfolio: number;
  benchmark: number;
}

export const PortfolioChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('1y');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch historical data for portfolio simulation
        // In a real app, this would combine multiple holdings
        const portfolioData = await financialApi.getHistoricalData('AAPL', period);
        const benchmarkData = await financialApi.getHistoricalData('MSFT', period);

        // Transform data for chart
        const chartData = portfolioData.map((item, index) => {
          const benchmarkItem = benchmarkData[index];
          return {
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            portfolio: item.close,
            benchmark: benchmarkItem?.close || item.close * 0.95
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const latestData = data[data.length - 1];
  const firstData = data[0];
  const portfolioReturn = latestData && firstData 
    ? ((latestData.portfolio - firstData.portfolio) / firstData.portfolio * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant={portfolioReturn >= 0 ? "default" : "destructive"}>
            {portfolioReturn >= 0 ? '+' : ''}{portfolioReturn.toFixed(2)}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            Portfolio Return ({period})
          </span>
        </div>
        <div className="flex space-x-2">
          {['1m', '3m', '6m', '1y'].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === 'portfolio' ? 'Your Portfolio' : 'Benchmark'
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="portfolio"
              stackId="2"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
