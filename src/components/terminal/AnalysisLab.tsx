
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
  Minimize2
} from "lucide-react";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { PortfolioManager } from "@/components/portfolio/PortfolioManager";
import { StockScreener } from "@/components/research/StockScreener";
import { PortfolioAnalytics } from "@/components/analytics/PortfolioAnalytics";
import QuantLab from "@/components/research/QuantLab";
import { TerminalMarketData } from "./TerminalMarketData";

interface AnalysisLabProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  onSymbolSelect: (symbol: string) => void;
}

export const AnalysisLab = ({ isOpen, onClose, selectedSymbol, onSymbolSelect }: AnalysisLabProps) => {
  const [activeTab, setActiveTab] = useState("builder");
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${isMaximized ? '' : 'p-4'}`}>
      <Card className={`bg-gray-900 border-green-600 text-green-400 font-mono ${
        isMaximized ? 'h-full w-full rounded-none' : 'h-[90vh] w-full max-w-7xl mx-auto'
      }`}>
        <CardHeader className="border-b border-green-800 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <CardTitle className="text-yellow-400 font-bold text-xl">
                ANALYSIS LAB - TERMINAL
              </CardTitle>
              <Badge variant="outline" className="border-green-600 text-green-400">
                ACTIVE SESSION
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-yellow-400 hover:bg-green-900"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-red-400 hover:bg-red-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-green-300 mt-2">
            SELECTED SECURITY: <span className="text-yellow-400 font-bold">{selectedSymbol}</span> | 
            STATUS: <span className="text-green-400">CONNECTED</span> | 
            TIME: {new Date().toLocaleTimeString()}
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-b border-green-800 rounded-none">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                BUILDER
              </TabsTrigger>
              <TabsTrigger 
                value="manager" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                MANAGER
              </TabsTrigger>
              <TabsTrigger 
                value="screener" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                SCREENER
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                ANALYTICS
              </TabsTrigger>
              <TabsTrigger 
                value="quantlab" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                QUANT LAB
              </TabsTrigger>
              <TabsTrigger 
                value="marketdata" 
                className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                MARKET DATA
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto bg-gray-900">
              <TabsContent value="builder" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">PORTFOLIO BUILDER TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      BUILD AND OPTIMIZE YOUR INVESTMENT PORTFOLIO
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-[calc(100%-60px)]">
                    <PortfolioBuilder />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manager" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">PORTFOLIO MANAGER TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      MANAGE AND TRACK YOUR INVESTMENT PORTFOLIOS
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-[calc(100%-60px)]">
                    <PortfolioManager />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="screener" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">STOCK SCREENER TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      DISCOVER AND FILTER INVESTMENT OPPORTUNITIES
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-[calc(100%-60px)]">
                    <StockScreener />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">PORTFOLIO ANALYTICS TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      ADVANCED QUANTITATIVE ANALYSIS AND RISK METRICS
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-[calc(100%-60px)]">
                    <PortfolioAnalytics />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="quantlab" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">QUANTITATIVE LAB TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      RESEARCH ENVIRONMENT FOR ALGORITHMIC TRADING
                    </div>
                  </div>
                  <div className="bg-white rounded-lg h-[calc(100%-60px)]">
                    <QuantLab />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="marketdata" className="h-full m-0 p-4">
                <div className="h-full bg-gray-900 text-green-400 rounded-lg p-4 border border-green-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">MARKET DATA TERMINAL</h3>
                    <div className="text-xs text-green-300">
                      REAL-TIME MARKET DATA AND PRICING INFORMATION
                    </div>
                  </div>
                  <TerminalMarketData 
                    selectedSymbol={selectedSymbol} 
                    isRealTime={true}
                    onSymbolSelect={onSymbolSelect}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
