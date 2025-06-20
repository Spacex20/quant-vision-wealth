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
  Building2,
  Activity,
  Zap
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
        return 'bg-emerald-500';
      case 'disconnected':
      case 'closed':
        return 'bg-red-500';
      case 'connecting':
      case 'pre-market':
      case 'after-hours':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-emerald-400 font-mono">
      {/* Enhanced Bloomberg-style header with Wall Street theme */}
      <div className="relative border-b-2 border-emerald-400/30 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-4 shadow-2xl backdrop-blur-sm">
        {/* Wall Street background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/lovable-uploads/28d28b0f-debf-4eed-82f2-28eb42a09799.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.2)'
          }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-400/30 shadow-lg backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-emerald-400 font-bold text-2xl tracking-wider">BLOOMBERG TERMINAL</span>
                <div className="text-gray-400 text-sm">Professional Trading Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-600/30">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)} shadow-lg`} />
                <span className="text-sm font-semibold">{connectionStatus.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-600/30">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(marketStatus)} shadow-lg`} />
                <span className="text-sm font-semibold">MARKET {marketStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right text-sm text-gray-400 bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-600/30">
              <div>USER: {user?.email?.toUpperCase() || 'GUEST'}</div>
              <div>TIME: {new Date().toLocaleTimeString()}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className="text-sm border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 backdrop-blur-sm font-semibold"
            >
              <Activity className="w-4 h-4 mr-2" />
              {isRealTime ? "REAL-TIME ON" : "REAL-TIME OFF"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main terminal interface */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-slate-800/80 border-2 border-emerald-400/20 backdrop-blur-sm rounded-xl shadow-2xl">
            <TabsTrigger value="market" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Monitor className="w-5 h-5 mr-2" />
              MARKET
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 data-[state=active]:border-blue-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Newspaper className="w-5 h-5 mr-2" />
              NEWS
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <BarChart3 className="w-5 h-5 mr-2" />
              CHART
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 data-[state=active]:border-amber-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Target className="w-5 h-5 mr-2" />
              ORDERS
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300 data-[state=active]:border-pink-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Briefcase className="w-5 h-5 mr-2" />
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-cyan-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              RESEARCH
            </TabsTrigger>
            <TabsTrigger value="macro" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <Globe className="w-5 h-5 mr-2" />
              MACRO
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300 data-[state=active]:border-teal-400 text-gray-400 hover:text-gray-200 font-semibold transition-all duration-300">
              <TrendingUp className="w-5 h-5 mr-2" />
              WATCH
            </TabsTrigger>
          </TabsList>

          {/* Symbol selector and quick actions */}
          <div className="flex items-center justify-between mb-6 mt-6 bg-slate-800/30 p-4 rounded-xl backdrop-blur-sm border border-gray-600/30">
            <div className="flex items-center gap-6">
              <div className="text-emerald-400 font-bold text-2xl tracking-wider">
                {selectedSymbol} - SELECTED SECURITY
              </div>
              <Badge className="border-emerald-400/50 text-emerald-400 bg-emerald-400/10 backdrop-blur-sm font-semibold px-3 py-1">
                <Zap className="w-4 h-4 mr-1 animate-pulse" />
                {isRealTime ? "LIVE FEED" : "DELAYED"}
              </Badge>
            </div>
            <div className="flex gap-3">
              {["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"].map((symbol) => (
                <Button
                  key={symbol}
                  variant={selectedSymbol === symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSymbol(symbol)}
                  className={`text-sm font-semibold transition-all duration-300 ${
                    selectedSymbol === symbol 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400" 
                      : "border-gray-600/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                  }`}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Contents remain the same */}
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
  );
};
