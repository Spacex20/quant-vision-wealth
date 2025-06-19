
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { TerminalMarketData } from "./TerminalMarketData";
import { TerminalNewsStream } from "./TerminalNewsStream";
import { TerminalChart } from "./TerminalChart";
import { TerminalOrderManagement } from "./TerminalOrderManagement";
import { TerminalWatchlist } from "./TerminalWatchlist";
import { TerminalPortfolio } from "./TerminalPortfolio";
import { TerminalResearch } from "./TerminalResearch";
import { TerminalMacroData } from "./TerminalMacroData";
import { 
  Monitor, 
  TrendingUp, 
  Newspaper, 
  BarChart3, 
  Target, 
  Briefcase, 
  Search, 
  Globe, 
  Settings
} from "lucide-react";

export const BloombergTerminal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("market");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [isRealTime, setIsRealTime] = useState(true);

  // Bloomberg-style status indicators
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market' | 'after-hours'>('open');

  useEffect(() => {
    // Simulate real-time connection status
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setConnectionStatus('connecting');
        setTimeout(() => setConnectionStatus('connected'), 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'open':
        return 'bg-green-500';
      case 'disconnected':
      case 'closed':
        return 'bg-red-500';
      case 'connecting':
      case 'pre-market':
      case 'after-hours':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Wall Street Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage: `url('/lovable-uploads/a1277cc9-a99e-4a39-b408-48d272258d38.png')`
        }}
      />
      
      <div className="relative z-10">
        {/* Bloomberg-style header */}
        <div className="border-b border-green-800 bg-gray-900 p-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">BLOOMBERG TERMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`} />
              <span className="text-xs">{connectionStatus.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(marketStatus)}`} />
              <span className="text-xs">MARKET {marketStatus.toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs">USER: {user?.email?.toUpperCase() || 'GUEST'}</span>
            <span className="text-xs">TIME: {new Date().toLocaleTimeString()}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className="text-xs border-green-600 text-green-400 hover:bg-green-900"
            >
              {isRealTime ? "REAL-TIME ON" : "REAL-TIME OFF"}
            </Button>
          </div>
        </div>

        {/* Main terminal interface */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 bg-gray-900 border-green-800">
              <TabsTrigger value="market" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Monitor className="w-4 h-4 mr-2" />
                MARKET
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Newspaper className="w-4 h-4 mr-2" />
                NEWS
              </TabsTrigger>
              <TabsTrigger value="chart" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <BarChart3 className="w-4 h-4 mr-2" />
                CHART
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Target className="w-4 h-4 mr-2" />
                ORDERS
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Briefcase className="w-4 h-4 mr-2" />
                PORTFOLIO
              </TabsTrigger>
              <TabsTrigger value="research" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Search className="w-4 h-4 mr-2" />
                RESEARCH
              </TabsTrigger>
              <TabsTrigger value="macro" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <Globe className="w-4 h-4 mr-2" />
                MACRO
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="data-[state=active]:bg-green-900 data-[state=active]:text-green-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                WATCH
              </TabsTrigger>
            </TabsList>

            {/* Symbol selector and quick actions */}
            <div className="flex items-center justify-between mb-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="text-yellow-400 font-bold text-lg">
                  {selectedSymbol} - SELECTED SECURITY
                </div>
                <Badge variant="outline" className="border-green-600 text-green-400">
                  {isRealTime ? "LIVE" : "DELAYED"}
                </Badge>
              </div>
              <div className="flex gap-2">
                {["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"].map((symbol) => (
                  <Button
                    key={symbol}
                    variant={selectedSymbol === symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSymbol(symbol)}
                    className="text-xs border-green-600 text-green-400 hover:bg-green-900"
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </div>

            <TabsContent value="market" className="space-y-4">
              <TerminalMarketData 
                selectedSymbol={selectedSymbol} 
                isRealTime={isRealTime}
                onSymbolSelect={setSelectedSymbol}
              />
            </TabsContent>

            <TabsContent value="news" className="space-y-4">
              <TerminalNewsStream 
                selectedSymbol={selectedSymbol}
                isRealTime={isRealTime}
              />
            </TabsContent>

            <TabsContent value="chart" className="space-y-4">
              <TerminalChart 
                selectedSymbol={selectedSymbol}
                isRealTime={isRealTime}
              />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <TerminalOrderManagement 
                selectedSymbol={selectedSymbol}
              />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <TerminalPortfolio />
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              <TerminalResearch 
                selectedSymbol={selectedSymbol}
              />
            </TabsContent>

            <TabsContent value="macro" className="space-y-4">
              <TerminalMacroData />
            </TabsContent>

            <TabsContent value="watchlist" className="space-y-4">
              <TerminalWatchlist 
                onSymbolSelect={setSelectedSymbol}
                selectedSymbol={selectedSymbol}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
