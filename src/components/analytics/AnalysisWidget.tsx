
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  Search, 
  Briefcase, 
  Calculator, 
  Target,
  X,
  Maximize2,
  Minimize2,
  Play,
  Zap,
  Building2,
  Activity,
  Monitor
} from "lucide-react";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { PortfolioManager } from "@/components/portfolio/PortfolioManager";
import { StockScreener } from "@/components/research/StockScreener";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";
import QuantLab from "@/components/research/QuantLab";
import { TerminalMarketData } from "@/components/terminal/TerminalMarketData";
import { PortfolioSimulator } from "@/components/simulation/PortfolioSimulator";

interface AnalysisWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol?: string;
  onSymbolSelect?: (symbol: string) => void;
}

export const AnalysisWidget = ({ isOpen, onClose, selectedSymbol = "AAPL", onSymbolSelect }: AnalysisWidgetProps) => {
  const [activeTab, setActiveTab] = useState("builder");
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className={`relative bg-gradient-to-br from-white/95 via-slate-50/95 to-blue-50/95 shadow-2xl border-2 border-slate-300/50 ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-7xl h-[90vh] rounded-2xl'
        }`}
      >
        {/* Header with Enhanced Wall Street Theme */}
        <div className="relative bg-gradient-to-r from-slate-100/95 via-blue-100/95 to-slate-100/95 text-slate-800 border-b-2 border-slate-300/50 rounded-t-2xl overflow-hidden">
          {/* Wall Street Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('/lovable-uploads/baf93fd5-edaa-4822-8ff5-bd9d7ee8b15a.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.2) contrast(0.9)'
            }}
          />
          
          {/* Financial Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M20 20.5V18H10v-2h10v-2.5L26 20l-6 6.5V24H10v-2h10v-1.5zM8 4v2h24V4H8zm0 32h24v-2H8v2z'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-slate-800/95 to-blue-900/95 rounded-2xl shadow-xl border-2 border-white/40 backdrop-blur-sm">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-bold text-slate-900 drop-shadow-sm">
                      QUANTVERSE LAB
                    </h1>
                    <Badge className="bg-gradient-to-r from-slate-700 to-blue-800 text-white text-sm font-bold px-4 py-2 shadow-lg border border-white/20">
                      <Activity className="w-4 h-4 mr-2 animate-pulse" />
                      LIVE TERMINAL
                    </Badge>
                  </div>
                  <p className="text-slate-800 text-lg font-semibold drop-shadow-sm">Professional Wall Street Analysis Suite</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right text-sm text-slate-700 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-800 font-semibold">MARKET OPEN</span>
                  </div>
                  <div className="font-medium">NYSE • {new Date().toLocaleTimeString()}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-slate-700 hover:text-blue-800 hover:bg-blue-100/80 transition-colors border border-slate-300/50 backdrop-blur-sm shadow-sm"
                >
                  {isMaximized ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-700 hover:text-red-700 hover:bg-red-100/80 transition-colors border border-slate-300/50 backdrop-blur-sm shadow-sm"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            {selectedSymbol && (
              <div className="mt-4 flex items-center gap-6 text-sm bg-white/80 px-4 py-3 rounded-lg backdrop-blur-sm border border-slate-200/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-slate-700 font-medium">Active Symbol:</span>
                  <span className="text-slate-900 font-bold text-xl">{selectedSymbol}</span>
                </div>
                <div className="h-6 w-px bg-slate-400" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
                  <span className="text-emerald-800 font-semibold">CONNECTED</span>
                </div>
                <div className="h-6 w-px bg-slate-400" />
                <span className="text-slate-700 font-medium">NYSE • Real-time Data Feed</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-full bg-gradient-to-br from-white/96 via-slate-50/96 to-blue-50/96">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Enhanced Tab Navigation */}
            <div className="bg-slate-100/90 border-b-2 border-slate-200/50 shadow-lg backdrop-blur-sm">
              <TabsList className="w-full bg-transparent p-0 h-auto">
                <div className="grid w-full grid-cols-7 divide-x divide-slate-300/50">
                  {[
                    { value: "builder", icon: Target, label: "Portfolio Builder", color: "blue" },
                    { value: "manager", icon: Briefcase, label: "Manager", color: "purple" },
                    { value: "screener", icon: Search, label: "Screener", color: "emerald" },
                    { value: "analytics", icon: BarChart3, label: "Analytics", color: "amber" },
                    { value: "quantlab", icon: Calculator, label: "Quant Lab", color: "red" },
                    { value: "simulator", icon: Play, label: "Simulator", color: "indigo" },
                    { value: "marketdata", icon: Monitor, label: "Market Data", color: "teal" }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className={`
                        flex-1 px-6 py-5 rounded-none border-0 
                        data-[state=active]:bg-gradient-to-br 
                        data-[state=active]:from-white/95 
                        data-[state=active]:to-slate-100/95
                        data-[state=active]:text-slate-800
                        data-[state=active]:border-b-3 
                        data-[state=active]:border-${tab.color}-500
                        data-[state=active]:shadow-lg
                        text-slate-600 hover:text-slate-800 hover:bg-slate-200/60
                        transition-all duration-300 font-semibold backdrop-blur-sm
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <tab.icon className="w-6 h-6" />
                        <span className="text-xs font-bold tracking-wide">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>

            {/* Tab Content with Proper Styling */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <TabsContent value="builder" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Portfolio Builder</h2>
                    <p className="text-slate-600 text-lg">Build and optimize your investment portfolio with advanced allocation tools and institutional-grade risk management.</p>
                  </div>
                  <PortfolioBuilder />
                </TabsContent>

                <TabsContent value="manager" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Portfolio Manager</h2>
                    <p className="text-slate-600 text-lg">Manage and track your investment portfolios with real-time monitoring and professional performance analytics.</p>
                  </div>
                  <PortfolioManager />
                </TabsContent>

                <TabsContent value="screener" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Stock Screener</h2>
                    <p className="text-slate-600 text-lg">Discover investment opportunities with advanced filtering, technical analysis, and fundamental screening tools.</p>
                  </div>
                  <StockScreener />
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Portfolio Analytics</h2>
                    <p className="text-slate-600 text-lg">Advanced quantitative analysis, risk metrics, and performance attribution for institutional-level insights.</p>
                  </div>
                  <PortfolioAnalytics />
                </TabsContent>

                <TabsContent value="quantlab" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Quantitative Lab</h2>
                    <p className="text-slate-600 text-lg">Professional research environment for algorithmic trading, quantitative analysis, and strategy development.</p>
                  </div>
                  <QuantLab />
                </TabsContent>

                <TabsContent value="simulator" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Portfolio Simulator</h2>
                    <p className="text-slate-600 text-lg">Test your strategies against historical scenarios, stress tests, and market conditions with Wall Street precision.</p>
                  </div>
                  <PortfolioSimulator />
                </TabsContent>

                <TabsContent value="marketdata" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8 bg-white/80 p-6 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Market Data Terminal</h2>
                    <p className="text-slate-600 text-lg">Real-time market data, comprehensive security information, and Bloomberg-grade charting tools.</p>
                  </div>
                  <TerminalMarketData 
                    selectedSymbol={selectedSymbol} 
                    isRealTime={true}
                    onSymbolSelect={onSymbolSelect || (() => {})}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
