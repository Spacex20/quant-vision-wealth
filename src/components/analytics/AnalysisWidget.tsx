
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
  Zap
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
    <div className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm ${isMaximized ? '' : 'p-4'}`}>
      <Card className={`bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-2xl ${
        isMaximized ? 'h-full w-full rounded-none' : 'h-[90vh] w-full max-w-7xl mx-auto'
      }`}>
        <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analysis Lab
                </CardTitle>
                <p className="text-sm text-gray-600">Advanced Financial Analysis Tools</p>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                ACTIVE
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-100"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:text-red-600 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {selectedSymbol && (
            <div className="text-sm text-gray-600 mt-2">
              Selected Security: <span className="font-semibold text-blue-600">{selectedSymbol}</span> | 
              Status: <span className="text-green-600">Connected</span> | 
              Time: {new Date().toLocaleTimeString()}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 rounded-none">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <Target className="w-4 h-4" />
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="manager" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <Briefcase className="w-4 h-4" />
                Manager
              </TabsTrigger>
              <TabsTrigger 
                value="screener" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <Search className="w-4 h-4" />
                Screener
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="quantlab" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <Calculator className="w-4 h-4" />
                Quant Lab
              </TabsTrigger>
              <TabsTrigger 
                value="simulator" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <Play className="w-4 h-4" />
                Simulator
              </TabsTrigger>
              <TabsTrigger 
                value="marketdata" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                Market Data
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="builder" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Builder</h3>
                  <p className="text-gray-600">Build and optimize your investment portfolio with advanced allocation tools</p>
                </div>
                <PortfolioBuilder />
              </TabsContent>

              <TabsContent value="manager" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Manager</h3>
                  <p className="text-gray-600">Manage and track your investment portfolios with real-time monitoring</p>
                </div>
                <PortfolioManager />
              </TabsContent>

              <TabsContent value="screener" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Stock Screener</h3>
                  <p className="text-gray-600">Discover investment opportunities with advanced filtering and analysis</p>
                </div>
                <StockScreener />
              </TabsContent>

              <TabsContent value="analytics" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Analytics</h3>
                  <p className="text-gray-600">Advanced quantitative analysis and risk metrics for your investments</p>
                </div>
                <PortfolioAnalytics />
              </TabsContent>

              <TabsContent value="quantlab" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quantitative Lab</h3>
                  <p className="text-gray-600">Research environment for algorithmic trading and quantitative analysis</p>
                </div>
                <QuantLab />
              </TabsContent>

              <TabsContent value="simulator" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Simulator</h3>
                  <p className="text-gray-600">Test your strategies against historical scenarios and market conditions</p>
                </div>
                <PortfolioSimulator />
              </TabsContent>

              <TabsContent value="marketdata" className="h-full m-0 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Market Data</h3>
                  <p className="text-gray-600">Real-time market data and comprehensive security information</p>
                </div>
                <TerminalMarketData 
                  selectedSymbol={selectedSymbol} 
                  isRealTime={true}
                  onSymbolSelect={onSymbolSelect || (() => {})}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
