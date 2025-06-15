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
import { PersonalizedStockIdeasModal } from "@/components/stock-ideas/PersonalizedStockIdeasModal";
import { Sparkles } from "lucide-react";
import { OnboardingTourProvider, useOnboardingTour } from "@/components/onboarding/OnboardingTour";

function RestartTourBtn() {
  const { startTour } = useOnboardingTour();
  return (
    <Button
      onClick={startTour}
      className="fixed bottom-16 right-6 z-50 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold rounded shadow-lg hover:scale-105 transition focus:outline-none"
      aria-label="Show onboarding tour again"
    >
      <Sparkles className="w-5 h-5 mr-2" /> Show Tour
    </Button>
  );
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showIdeasModal, setShowIdeasModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <OnboardingTourProvider>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        <ErrorBoundary>
          <div id="dashboardHeader">
            <DashboardHeader />
          </div>
        </ErrorBoundary>
        {/* Floating Stock Ideas Button */}
        <button
          id="personalizedFab"
          onClick={() => {
            if (user) setShowIdeasModal(true);
            else navigate("/login");
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 shadow-lg rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-base hover:scale-105 hover:shadow-2xl transition-all outline-none border-2 border-white"
          aria-label="Show personalized stock ideas"
          style={{ boxShadow: "0 6px 24px 0 rgba(80,60,210,.18)" }}
        >
          <Sparkles className="w-5 h-5 mr-1 -ml-1" />
          Personalized Ideas
        </button>
        <PersonalizedStockIdeasModal open={showIdeasModal} onOpenChange={setShowIdeasModal} />
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
            <TabsList id="mainNavbarTabs" className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="market">Market Data</TabsTrigger>
              <TabsTrigger value="screener">Screener</TabsTrigger>
              <TabsTrigger value="quantlab">Quant Lab</TabsTrigger>
              <TabsTrigger value="simulator">Simulator</TabsTrigger>
              <TabsTrigger value="community" id="communityTab">Community</TabsTrigger>
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
            <TabsContent value="community" className="space-y-6">
              <ErrorBoundary>
                <CommunityHub />
              </ErrorBoundary>
            </TabsContent>
            <TabsContent value="education" className="space-y-6">
              <ErrorBoundary>
                <EducationHub />
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
        <RestartTourBtn />
      </div>
    </OnboardingTourProvider>
  );
};

export default Index;
