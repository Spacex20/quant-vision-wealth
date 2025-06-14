
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Strategy } from '@/data/strategies';

interface StrategyChartProps {
  data: Strategy['chartData'];
}

const formatYAxis = (tick: any) => {
    if (tick >= 1000000) return `${tick / 1000000}M`;
    if (tick >= 1000) return `${tick / 1000}K`;
    return tick;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
            <span className="font-bold">{label}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Return</span>
             <span className="font-bold text-primary">{payload[0].value.toFixed(2)}</span>
          </div>
           <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Drawdown</span>
            <span className="font-bold text-destructive">{(payload[1].value * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const StrategyChart = ({ data }: StrategyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>10-Year Performance Simulation</CardTitle>
      </CardHeader>
      <CardContent className="h-96 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="value" name="Rolling Return" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} dot={false} />
            <Area yAxisId="right" type="monotone" dataKey="drawdown" name="Drawdown" stroke="#dc2626" fill="#fee2e2" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
