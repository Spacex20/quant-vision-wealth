
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
import QuantLab from "@/components/research/QuantLab";
import { CommunityHub } from "@/components/community/CommunityHub";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <DashboardHeader />
      </ErrorBoundary>
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 flex justify-between flex-wrap gap-2 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfolio Intelligence Platform
            </h1>
            <p className="text-xl text-muted-foreground">
              Build wealth with AI-driven insights and proven investment strategies 💎
            </p>
          </div>
          {!user && (
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started Free 🚀
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
            <TabsTrigger value="screener">Screener</TabsTrigger>
            <TabsTrigger value="quantlab">Quant Lab</TabsTrigger>
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

          <TabsContent value="quantlab" className="space-y-6">
            <ErrorBoundary>
              <QuantLab />
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
