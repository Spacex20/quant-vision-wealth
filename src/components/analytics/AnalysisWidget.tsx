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
        className={`relative bg-white/95 shadow-2xl border border-slate-300 ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-7xl h-[90vh] rounded-2xl'
        }`}
      >
        {/* Header */}
        <div className="relative bg-slate-100/95 text-slate-800 border-b border-slate-300 rounded-t-2xl overflow-hidden">
          {/* Wall Street Background Pattern */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url('/lovable-uploads/eb3351e4-f6ef-4e49-a715-2d78114e0d15.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">
                      QuantVerse Lab
                    </h1>
                    <Badge className="bg-slate-700 text-white text-xs font-bold px-2 py-1 shadow-lg">
                      <Activity className="w-3 h-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                  <p className="text-slate-800 font-semibold">Professional Analysis Suite</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-slate-700 bg-white/80 px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-800 font-semibold">MARKET OPEN</span>
                  </div>
                  <div className="font-medium">NYSE • {new Date().toLocaleTimeString()}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-slate-700 hover:text-blue-800 hover:bg-blue-100 transition-colors border border-slate-300 backdrop-blur-sm shadow-sm"
                >
                  {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-700 hover:text-red-700 hover:bg-red-100 transition-colors border border-slate-300 backdrop-blur-sm shadow-sm"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {selectedSymbol && (
              <div className="mt-3 flex items-center gap-4 text-sm bg-white/80 px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium">Active Symbol:</span>
                  <span className="text-slate-900 font-bold">{selectedSymbol}</span>
                </div>
                <div className="h-4 w-px bg-slate-400" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-800 font-semibold">CONNECTED</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-full bg-white/96">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-slate-100 border-b border-slate-200 shadow-sm">
              <TabsList className="w-full bg-transparent p-0 h-auto">
                <div className="grid w-full grid-cols-7 divide-x divide-slate-300">
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
                        flex-1 px-4 py-3 rounded-none border-0 
                        data-[state=active]:bg-white
                        data-[state=active]:text-slate-800
                        data-[state=active]:border-b-2 
                        data-[state=active]:border-${tab.color}-500
                        data-[state=active]:shadow-sm
                        text-slate-600 hover:text-slate-800 hover:bg-slate-200
                        transition-all duration-300 font-semibold
                      `}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <tab.icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <TabsContent value="builder" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Portfolio Builder</h2>
                    <p className="text-slate-600">Build and optimize your investment portfolio with advanced allocation tools.</p>
                  </div>
                  <PortfolioBuilder />
                </TabsContent>

                <TabsContent value="manager" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Portfolio Manager</h2>
                    <p className="text-slate-600">Manage and track your investment portfolios with real-time monitoring.</p>
                  </div>
                  <PortfolioManager />
                </TabsContent>

                <TabsContent value="screener" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Stock Screener</h2>
                    <p className="text-slate-600">Discover investment opportunities with advanced filtering tools.</p>
                  </div>
                  <StockScreener />
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Portfolio Analytics</h2>
                    <p className="text-slate-600">Advanced quantitative analysis and risk metrics.</p>
                  </div>
                  <PortfolioAnalytics />
                </TabsContent>

                <TabsContent value="quantlab" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Quantitative Lab</h2>
                    <p className="text-slate-600">Professional research environment for algorithmic trading.</p>
                  </div>
                  <QuantLab />
                </TabsContent>

                <TabsContent value="simulator" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Portfolio Simulator</h2>
                    <p className="text-slate-600">Test your strategies against historical scenarios.</p>
                  </div>
                  <PortfolioSimulator />
                </TabsContent>

                <TabsContent value="marketdata" className="h-full m-0 p-6 space-y-4">
                  <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Market Data Terminal</h2>
                    <p className="text-slate-600">Real-time market data and comprehensive security information.</p>
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
