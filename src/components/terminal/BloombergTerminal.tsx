
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-slate-800 font-mono">
      {/* Enhanced Bloomberg-style header with Wall Street theme */}
      <div className="relative border-b-2 border-blue-300/50 bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 p-4 shadow-2xl backdrop-blur-sm">
        {/* Wall Street background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/lovable-uploads/28d28b0f-debf-4eed-82f2-28eb42a09799.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600/90 to-purple-600/90 rounded-xl border-2 border-white/30 shadow-lg backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-slate-800 font-bold text-2xl tracking-wider">BLOOMBERG TERMINAL</span>
                <div className="text-slate-600 text-sm">Professional Trading Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/70 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-300/50 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)} shadow-lg`} />
                <span className="text-sm font-semibold text-slate-700">{connectionStatus.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/70 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-300/50 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(marketStatus)} shadow-lg`} />
                <span className="text-sm font-semibold text-slate-700">MARKET {marketStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right text-sm text-slate-600 bg-white/70 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-300/50 shadow-sm">
              <div>USER: {user?.email?.toUpperCase() || 'GUEST'}</div>
              <div>TIME: {new Date().toLocaleTimeString()}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className="text-sm border-blue-400/50 text-blue-700 hover:bg-blue-100 backdrop-blur-sm font-semibold shadow-sm"
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
          <TabsList className="grid w-full grid-cols-8 bg-slate-200/80 border-2 border-blue-200/50 backdrop-blur-sm rounded-xl shadow-2xl">
            <TabsTrigger value="market" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Monitor className="w-5 h-5 mr-2" />
              MARKET
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-700 data-[state=active]:border-blue-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Newspaper className="w-5 h-5 mr-2" />
              NEWS
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-700 data-[state=active]:border-purple-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <BarChart3 className="w-5 h-5 mr-2" />
              CHART
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-700 data-[state=active]:border-amber-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Target className="w-5 h-5 mr-2" />
              ORDERS
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-700 data-[state=active]:border-pink-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Briefcase className="w-5 h-5 mr-2" />
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              RESEARCH
            </TabsTrigger>
            <TabsTrigger value="macro" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-700 data-[state=active]:border-indigo-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <Globe className="w-5 h-5 mr-2" />
              MACRO
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-700 data-[state=active]:border-teal-400 text-slate-600 hover:text-slate-800 font-semibold transition-all duration-300">
              <TrendingUp className="w-5 h-5 mr-2" />
              WATCH
            </TabsTrigger>
          </TabsList>

          {/* Symbol selector and quick actions */}
          <div className="flex items-center justify-between mb-6 mt-6 bg-white/70 p-4 rounded-xl backdrop-blur-sm border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-slate-800 font-bold text-2xl tracking-wider">
                {selectedSymbol} - SELECTED SECURITY
              </div>
              <Badge className="border-blue-400/50 text-blue-700 bg-blue-100/70 backdrop-blur-sm font-semibold px-3 py-1 shadow-sm">
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
                      ? "bg-emerald-500/20 text-emerald-700 border-emerald-400" 
                      : "border-slate-400/50 text-slate-600 hover:bg-slate-100/50 hover:text-slate-800"
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
