
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { ValueInvestingTools } from "@/components/investing/ValueInvestingTools";
import { PortfolioSimulator } from "@/components/simulation/PortfolioSimulator";
import { EducationHub } from "@/components/education/EducationHub";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Navigation } from "@/components/layout/Navigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quantitative Investment Platform</h1>
          <p className="text-xl text-muted-foreground">
            Advanced portfolio management with AI-driven insights and quantitative strategies
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="builder">Smart Builder</TabsTrigger>
            <TabsTrigger value="value-tools">Value Investing</TabsTrigger>
            <TabsTrigger value="simulator">Simulation Lab</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <PortfolioBuilder />
          </TabsContent>

          <TabsContent value="value-tools" className="space-y-6">
            <ValueInvestingTools />
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <PortfolioSimulator />
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <EducationHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
