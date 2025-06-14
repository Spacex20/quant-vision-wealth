
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, PieChart, BarChart } from "lucide-react";
import { PortfolioChart } from "./PortfolioChart";
import { AssetAllocation } from "./AssetAllocation";
import { PerformanceMetrics } from "./PerformanceMetrics";

export const PortfolioOverview = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Portfolio Summary */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Portfolio Performance</span>
            </CardTitle>
            <CardDescription>Historical performance and growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart />
          </CardContent>
        </Card>

        <PerformanceMetrics />
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Asset Allocation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocation />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rebalancing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Rebalance</span>
              <Badge variant="outline">3 days ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Next Scheduled</span>
              <Badge variant="secondary">27 days</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Portfolio Drift</span>
                <span className="text-orange-600">2.3%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your portfolio shows strong momentum indicators. Consider increasing tech allocation by 2-3%.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Correlation analysis suggests adding emerging market exposure for better diversification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
