
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskMetrics } from "./RiskMetrics";
import { CorrelationAnalysis } from "./CorrelationAnalysis";
import { PerformanceAttribution } from "./PerformanceAttribution";
import { BarChart3, GitBranch, Target } from "lucide-react";

export const PortfolioAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Advanced Portfolio Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive quantitative analysis of your portfolio performance and risk
        </p>
      </div>

      <Tabs defaultValue="risk-metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risk-metrics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Risk Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="correlation" className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>Correlation Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="attribution" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Performance Attribution</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk-metrics" className="space-y-6">
          <RiskMetrics />
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <CorrelationAnalysis />
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <PerformanceAttribution />
        </TabsContent>
      </Tabs>
    </div>
  );
};
