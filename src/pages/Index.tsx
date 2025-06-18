
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { PortfolioManager } from "@/components/portfolio/PortfolioManager";
import { PortfolioSimulator } from "@/components/simulation/PortfolioSimulator";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";
import { MarketIntelligence } from "@/components/market/MarketIntelligence";
import { StockScreener } from "@/components/research/StockScreener";
import QuantLab from "@/components/research/QuantLab";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PersonalizedStockIdeasModal } from "@/components/stock-ideas/PersonalizedStockIdeasModal";
import { Sparkles } from "lucide-react";
import { OnboardingTourProvider, useOnboardingTour } from "@/components/onboarding/OnboardingTour";
import { UserStreakWidget } from "@/components/gamification/UserStreakWidget";
import { UserBadgesWidget } from "@/components/gamification/UserBadgesWidget";
import { LeaderboardWidget } from "@/components/gamification/LeaderboardWidget";
import { Card, CardContent } from "@/components/ui/card";

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
        </Button>
        <PersonalizedStockIdeasModal open={showIdeasModal} onOpenChange={setShowIdeasModal} />
        <div className="container mx-auto px-0 py-6 max-w-6xl">
          {/* GAMIFICATION ROW: Streak, Badges, Leaderboard */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch">
            <Card className="flex-1 min-w-[260px] bg-white/90 dark:bg-card/80 shadow-md">
              <CardContent className="p-4">
                <UserStreakWidget />
                <UserBadgesWidget />
              </CardContent>
            </Card>
            <Card className="min-w-[320px] w-full max-w-xs bg-white/90 dark:bg-card/80 shadow-md flex flex-col">
              <CardContent className="p-3 h-full flex flex-col">
                <LeaderboardWidget />
              </CardContent>
            </Card>
          </div>
          {/* Hero/Info section in a Card */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50/60 to-purple-50/70 dark:from-card dark:to-card">
            <CardContent className="flex flex-col lg:flex-row justify-between items-center gap-2 py-8 px-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-playfair drop-shadow-lg tracking-tight animate-fade-in">
                  One Dashboard. Infinite Strategies.
                </h1>
                <div
                  className="text-xl font-semibold mt-1 bg-gradient-to-r from-fuchsia-500 via-blue-600 to-purple-600 bg-clip-text text-transparent font-sans tracking-tight drop-shadow-md animate-fade-in"
                  style={{
                    letterSpacing: "0.01em",
                    lineHeight: "1.45"
                  }}
                >
                  Test, tweak, and track your portfolio —&nbsp;
                  <span className="font-bold">powered by quant models and real data.</span>
                </div>
              </div>
              {!user && (
                <Button 
                  onClick={() => navigate('/login')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4 lg:mt-0"
                >
                  Get Started Free 🚀
                </Button>
              )}
            </CardContent>
          </Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList id="mainNavbarTabs" className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="market">Market Data</TabsTrigger>
              <TabsTrigger value="screener">Screener</TabsTrigger>
              <TabsTrigger value="quantlab">Quant Lab</TabsTrigger>
              <TabsTrigger value="simulator">Simulator</TabsTrigger>
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
          </Tabs>
        </div>
        <RestartTourBtn />
      </div>
    </OnboardingTourProvider>
  );
};

export default Index;
