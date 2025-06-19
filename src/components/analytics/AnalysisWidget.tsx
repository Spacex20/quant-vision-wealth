
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
  Activity
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={`relative bg-white shadow-2xl border border-gray-200 ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-7xl h-[90vh] rounded-xl'
        }`}
        style={{
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          backgroundSize: 'cover'
        }}
      >
        {/* Header with Wall Street Theme */}
        <div className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white border-b border-gray-700 rounded-t-xl overflow-hidden">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ANALYSIS LAB
                    </h1>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1">
                      <Activity className="w-3 h-3 mr-1 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Professional Financial Analysis Suite</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-gray-400">
                  <div>Market Status: <span className="text-green-400 font-medium">OPEN</span></div>
                  <div>Time: {new Date().toLocaleTimeString()}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {selectedSymbol && (
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Active Symbol:</span>
                  <span className="text-blue-400 font-bold text-lg">{selectedSymbol}</span>
                </div>
                <div className="h-4 w-px bg-gray-600" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                <div className="h-4 w-px bg-gray-600" />
                <span className="text-gray-400">NYSE • Real-time Data</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            {/* Enhanced Tab Navigation */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <TabsList className="w-full bg-transparent p-0 h-auto">
                <div className="grid w-full grid-cols-7 divide-x divide-gray-200">
                  {[
                    { value: "builder", icon: Target, label: "Portfolio Builder", color: "blue" },
                    { value: "manager", icon: Briefcase, label: "Manager", color: "purple" },
                    { value: "screener", icon: Search, label: "Screener", color: "green" },
                    { value: "analytics", icon: BarChart3, label: "Analytics", color: "orange" },
                    { value: "quantlab", icon: Calculator, label: "Quant Lab", color: "red" },
                    { value: "simulator", icon: Play, label: "Simulator", color: "indigo" },
                    { value: "marketdata", icon: TrendingUp, label: "Market Data", color: "teal" }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className={`
                        flex-1 px-4 py-4 rounded-none border-0 
                        data-[state=active]:bg-gradient-to-r 
                        data-[state=active]:from-${tab.color}-50 
                        data-[state=active]:to-${tab.color}-100
                        data-[state=active]:text-${tab.color}-800
                        data-[state=active]:border-b-2 
                        data-[state=active]:border-${tab.color}-500
                        text-gray-600 hover:text-gray-800 hover:bg-gray-50
                        transition-all duration-200 font-medium
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <tab.icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>

            {/* Tab Content with Proper Padding and Overflow Handling */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <TabsContent value="builder" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Builder</h2>
                    <p className="text-gray-600 text-lg">Build and optimize your investment portfolio with advanced allocation tools and risk management.</p>
                  </div>
                  <PortfolioBuilder />
                </TabsContent>

                <TabsContent value="manager" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Manager</h2>
                    <p className="text-gray-600 text-lg">Manage and track your investment portfolios with real-time monitoring and performance analytics.</p>
                  </div>
                  <PortfolioManager />
                </TabsContent>

                <TabsContent value="screener" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Stock Screener</h2>
                    <p className="text-gray-600 text-lg">Discover investment opportunities with advanced filtering, technical analysis, and fundamental screening.</p>
                  </div>
                  <StockScreener />
                </TabsContent>

                <TabsContent value="analytics" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Analytics</h2>
                    <p className="text-gray-600 text-lg">Advanced quantitative analysis, risk metrics, and performance attribution for your investments.</p>
                  </div>
                  <PortfolioAnalytics />
                </TabsContent>

                <TabsContent value="quantlab" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Quantitative Lab</h2>
                    <p className="text-gray-600 text-lg">Research environment for algorithmic trading, quantitative analysis, and strategy development.</p>
                  </div>
                  <QuantLab />
                </TabsContent>

                <TabsContent value="simulator" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Simulator</h2>
                    <p className="text-gray-600 text-lg">Test your strategies against historical scenarios, stress tests, and market conditions.</p>
                  </div>
                  <PortfolioSimulator />
                </TabsContent>

                <TabsContent value="marketdata" className="h-full m-0 p-8 space-y-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Market Data Terminal</h2>
                    <p className="text-gray-600 text-lg">Real-time market data, comprehensive security information, and advanced charting tools.</p>
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
