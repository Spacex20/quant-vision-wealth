
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
          <h1 className="text-4xl font-bold mb-2">Quantitative Investment Platform</h1>
          <p className="text-xl text-muted-foreground">
            Advanced portfolio management with AI-driven insights and quantitative strategies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="builder">Smart Builder</TabsTrigger>
            <TabsTrigger value="manager">Portfolio Manager</TabsTrigger>
            <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
            <TabsTrigger value="value-tools">Value Investing</TabsTrigger>
            <TabsTrigger value="simulator">Simulation Lab</TabsTrigger>
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

          <TabsContent value="value-tools" className="space-y-6">
            <ErrorBoundary>
              <ValueInvestingTools />
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
