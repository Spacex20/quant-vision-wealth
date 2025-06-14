
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { month: 'Jan', portfolio: 100000, benchmark: 100000 },
  { month: 'Feb', portfolio: 102500, benchmark: 101200 },
  { month: 'Mar', portfolio: 98800, benchmark: 99500 },
  { month: 'Apr', portfolio: 105200, benchmark: 102800 },
  { month: 'May', portfolio: 108900, benchmark: 104500 },
  { month: 'Jun', portfolio: 112300, benchmark: 106200 },
  { month: 'Jul', portfolio: 115600, benchmark: 108900 },
  { month: 'Aug', portfolio: 119200, benchmark: 111500 },
  { month: 'Sep', portfolio: 116800, benchmark: 109800 },
  { month: 'Oct', portfolio: 122400, benchmark: 114200 },
  { month: 'Nov', portfolio: 125100, benchmark: 116800 },
  { month: 'Dec', portfolio: 127432, benchmark: 118500 },
];

export const PortfolioChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === 'portfolio' ? 'Your Portfolio' : 'S&P 500'
            ]}
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
  );
};
