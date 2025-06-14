
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, BookCopy, BarChart, PieChart as PieChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
} from "recharts";
import { ScenarioResult, saveToLibrary } from "@/services/scenarioAnalysisService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

interface ScenarioResultsProps {
  result: ScenarioResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Month
            </span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Value
            </span>
            <span className="font-bold">
              ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ScenarioResults = ({ result }: ScenarioResultsProps) => {
  const {
    initialValue,
    finalValue,
    valueChange,
    percentChange,
    beforeAllocation,
    afterAllocation,
    portfolioTrajectory,
    assetPerformance,
    recommendation,
  } = result;

  const isPositive = percentChange >= 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Simulation Outcome
            <Badge variant={isPositive ? "default" : "destructive"}>
              {isPositive ? "Positive Outlook" : "Negative Outlook"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Estimated portfolio performance over a 6-month period under the selected scenario.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-secondary">
            <div className="text-sm text-muted-foreground">Initial Value</div>
            <div className="text-2xl font-bold">${initialValue.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="text-sm text-muted-foreground">Estimated Final Value</div>
            <div className="text-2xl font-bold">${finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="text-sm text-muted-foreground">Change</div>
            <div className={`text-2xl font-bold flex items-center justify-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-6 w-6 mr-2" /> : <TrendingDown className="h-6 w-6 mr-2" />}
              <span>
                {isPositive ? '+' : ''}{(percentChange * 100).toFixed(2)}%
                <span className="text-base font-normal text-muted-foreground ml-2">(${valueChange.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle className="flex items-center space-x-2"><TrendingUp className="h-5 w-5" /><span>Portfolio Value Trajectory</span></CardTitle>
          </CardHeader>
          <CardContent>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolioTrajectory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="value" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><PieChartIcon className="h-5 w-5" /><span>Allocation Shift</span></CardTitle>
                  <CardDescription>Comparison of asset allocation before and after the simulation.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                      <h3 className="text-center font-semibold mb-2">Before</h3>
                      <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                              <Pie data={beforeAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                  {beforeAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
                   <div>
                      <h3 className="text-center font-semibold mb-2">After</h3>
                      <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                              <Pie data={afterAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d">
                                {afterAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><BarChart className="h-5 w-5" /><span>Asset Performance</span></CardTitle>
                  <CardDescription>Winners and losers within your portfolio under this scenario.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                      <RechartsBarChart data={assetPerformance} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={['auto', 'auto']} tickFormatter={(value) => `${value}%`} />
                          <YAxis type="category" dataKey="symbol" width={60} tick={{ fontSize: 12 }} />
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                          <Bar dataKey="change">
                              {assetPerformance.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.change >= 0 ? "#22c55e" : "#ef4444"} />
                              ))}
                          </Bar>
                      </RechartsBarChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><BookCopy className="h-5 w-5 text-blue-600" /><span>Recommendations & Actions</span></CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 mb-4">{recommendation}</p>
          <div className="flex items-center space-x-2">
            <Switch id="save-insight" onCheckedChange={saveToLibrary} />
            <Label htmlFor="save-insight">Save Scenario Insight to Library</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
