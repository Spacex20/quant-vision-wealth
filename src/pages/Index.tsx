
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { PortfolioManager } from "@/components/portfolio/PortfolioManager";
import { ValueInvestingTools } from "@/components/investing/ValueInvestingTools";
import { PortfolioSimulator } from "@/components/simulation/PortfolioSimulator";
import { EducationHub } from "@/components/education/EducationHub";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";
import { MarketIntelligence } from "@/components/market/MarketIntelligence";
import { StockScreener } from "@/components/research/StockScreener";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <DashboardHeader />
      </ErrorBoundary>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quantitative Investment Research Platform</h1>
          <p className="text-xl text-muted-foreground">
            Advanced portfolio management with AI-driven insights and real-time market data
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
            <TabsTrigger value="screener">Screener</TabsTrigger>
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ErrorBoundary>
              <PortfolioOverview />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <ErrorBoundary>
              <PortfolioBuilder />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="manager" className="space-y-6">
            <ErrorBoundary>
              <PortfolioManager />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ErrorBoundary>
              <PortfolioAnalytics />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <ErrorBoundary>
              <MarketIntelligence />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="screener" className="space-y-6">
            <ErrorBoundary>
              <StockScreener />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <ErrorBoundary>
              <PortfolioSimulator />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <ErrorBoundary>
              <EducationHub />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
