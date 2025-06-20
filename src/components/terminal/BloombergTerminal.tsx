
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Activity
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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-mono">
      {/* Bloomberg-style header */}
      <div className="relative border-b border-slate-300 bg-slate-200/95 p-4 shadow-lg backdrop-blur-sm">
        {/* Wall Street background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/lovable-uploads/baf93fd5-edaa-4822-8ff5-bd9d7ee8b15a.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl border border-white/20 shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 font-bold text-xl tracking-wide">QUANTVERSE TERMINAL</span>
                <div className="text-slate-700 text-sm font-semibold">Professional Trading Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-lg border border-slate-300 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`} />
                <span className="text-xs font-semibold text-slate-800">{connectionStatus.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-lg border border-slate-300 shadow-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(marketStatus)}`} />
                <span className="text-xs font-semibold text-slate-800">MARKET {marketStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-slate-700 bg-white/80 px-3 py-2 rounded-lg border border-slate-300 shadow-sm">
              <div className="font-semibold">USER: {user?.email?.toUpperCase() || 'GUEST'}</div>
              <div className="font-medium">TIME: {new Date().toLocaleTimeString()}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className="text-xs border-slate-500 text-slate-800 hover:bg-slate-100 font-semibold shadow-sm"
            >
              <Activity className="w-3 h-3 mr-1" />
              {isRealTime ? "REAL-TIME ON" : "REAL-TIME OFF"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main terminal interface */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-slate-200 border border-slate-300 rounded-lg shadow-lg">
            <TabsTrigger value="market" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Monitor className="w-4 h-4 mr-1" />
              MARKET
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Newspaper className="w-4 h-4 mr-1" />
              NEWS
            </TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <BarChart3 className="w-4 h-4 mr-1" />
              CHART
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Target className="w-4 h-4 mr-1" />
              ORDERS
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Briefcase className="w-4 h-4 mr-1" />
              PORTFOLIO
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Search className="w-4 h-4 mr-1" />
              RESEARCH
            </TabsTrigger>
            <TabsTrigger value="macro" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <Globe className="w-4 h-4 mr-1" />
              MACRO
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-800 text-slate-700 hover:text-slate-900 font-semibold transition-all">
              <TrendingUp className="w-4 h-4 mr-1" />
              WATCH
            </TabsTrigger>
          </TabsList>

          {/* Symbol selector and quick actions */}
          <div className="flex items-center justify-between mb-4 mt-4 bg-white/80 p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-slate-900 font-bold text-lg">
                {selectedSymbol} - SELECTED SECURITY
              </div>
              <Badge className="border-slate-500 text-slate-800 bg-slate-100 font-semibold px-2 py-1 shadow-sm">
                <Activity className="w-3 h-3 mr-1" />
                {isRealTime ? "LIVE FEED" : "DELAYED"}
              </Badge>
            </div>
            <div className="flex gap-2">
              {["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA"].map((symbol) => (
                <Button
                  key={symbol}
                  variant={selectedSymbol === symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSymbol(symbol)}
                  className={`text-xs font-semibold transition-all ${
                    selectedSymbol === symbol 
                      ? "bg-emerald-500/20 text-emerald-800 border-emerald-400" 
                      : "border-slate-500 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Contents */}
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
