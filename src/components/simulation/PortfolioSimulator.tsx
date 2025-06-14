import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioAnalysis } from "./ScenarioAnalysis";
import { HistoricalAnalysis } from "./HistoricalAnalysis";
import { PlayCircle, History } from "lucide-react";
import { StrategyLibrary } from "@/components/strategies/StrategyLibrary";

export const PortfolioSimulator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Portfolio Simulation Lab</h2>
        <p className="text-muted-foreground">
          Stress test your portfolio against historical and hypothetical market scenarios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            <span>Hypothetical Scenario Engine</span>
          </CardTitle>
          <CardDescription>
            Select a macroeconomic scenario to see how your portfolio might perform over a 6-month period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioAnalysis />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-primary" />
            <span>Historical Crisis Simulation</span>
          </CardTitle>
          <CardDescription>
            Test your portfolio's resilience against major financial crises from the past.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoricalAnalysis />
        </CardContent>
      </Card>

      {/* Strategy Library Section */}
      <div>
        <StrategyLibrary />
      </div>
    </div>
  );
};
