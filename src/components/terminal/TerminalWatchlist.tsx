
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useYFinanceMultipleQuotes } from "@/hooks/useYFinanceData";
import { TrendingUp, TrendingDown, Plus, X, Eye } from "lucide-react";

interface TerminalWatchlistProps {
  onSymbolSelect: (symbol: string) => void;
  selectedSymbol: string;
}

export const TerminalWatchlist = ({ onSymbolSelect, selectedSymbol }: TerminalWatchlistProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<string | null>(null);
  const [newSymbol, setNewSymbol] = useState("");
  const [loading, setLoading] = useState(false);

  // Default symbols for main watchlist
  const defaultSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"];
  const [watchedSymbols, setWatchedSymbols] = useState(defaultSymbols);

  const { data: quotes, isLoading: quotesLoading } = useYFinanceMultipleQuotes(watchedSymbols);

  useEffect(() => {
    if (user) {
      fetchWatchlists();
    }
  }, [user]);

  const fetchWatchlists = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('terminal_watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setWatchlists(data || []);
      
      // Set active watchlist to first one or create default
      if (data && data.length > 0) {
        setActiveWatchlist(data[0].id);
        setWatchedSymbols(data[0].symbols);
      } else {
        // Create default watchlist
        createDefaultWatchlist();
      }
    } catch (error) {
      console.error('Error fetching watchlists:', error);
    }
  };

  const createDefaultWatchlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('terminal_watchlists')
        .insert({
          user_id: user.id,
          name: 'Main Watchlist',
          symbols: defaultSymbols
        })
        .select()
        .single();

      if (error) throw error;
      
      setWatchlists([data]);
      setActiveWatchlist(data.id);
      setWatchedSymbols(data.symbols);
    } catch (error) {
      console.error('Error creating default watchlist:', error);
    }
  };

  const addSymbol = async () => {
    if (!newSymbol.trim() || !activeWatchlist) return;
    
    const symbol = newSymbol.trim().toUpperCase();
    
    if (watchedSymbols.includes(symbol)) {
      toast({
        title: "Symbol Already Added",
        description: `${symbol} is already in your watchlist`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const updatedSymbols = [...watchedSymbols, symbol];
      
      const { error } = await supabase
        .from('terminal_watchlists')
        .update({ symbols: updatedSymbols })
        .eq('id', activeWatchlist);

      if (error) throw error;
      
      setWatchedSymbols(updatedSymbols);
      setNewSymbol("");
      
      toast({
        title: "Symbol Added",
        description: `${symbol} added to watchlist`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding symbol:', error);
      toast({
        title: "Error",
        description: "Failed to add symbol",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSymbol = async (symbol: string) => {
    if (!activeWatchlist) return;
    
    try {
      const updatedSymbols = watchedSymbols.filter(s => s !== symbol);
      
      const { error } = await supabase
        .from('terminal_watchlists')
        .update({ symbols: updatedSymbols })
        .eq('id', activeWatchlist);

      if (error) throw error;
      
      setWatchedSymbols(updatedSymbols);
      
      toast({
        title: "Symbol Removed",
        description: `${symbol} removed from watchlist`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error removing symbol:', error);
    }
  };

  const formatPrice = (price: number) => price?.toFixed(2) || "0.00";
  const formatChange = (change: number) => (change >= 0 ? "+" : "") + change?.toFixed(2);
  const formatPercent = (percent: number) => (percent >= 0 ? "+" : "") + percent?.toFixed(2) + "%";

  return (
    <div className="space-y-4">
      {/* Watchlist controls */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
            <Eye className="w-5 h-5" />
            MARKET WATCHLIST
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && addSymbol()}
              className="bg-black border-green-600 text-green-400"
            />
            <Button 
              onClick={addSymbol}
              disabled={loading || !newSymbol.trim()}
              className="bg-green-700 hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main watchlist */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              MAIN WATCHLIST
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {quotesLoading ? (
              <div className="text-center text-green-400">LOADING QUOTES...</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="grid grid-cols-5 gap-2 text-xs text-green-400 font-semibold border-b border-green-800 pb-2">
                  <div>SYMBOL</div>
                  <div>PRICE</div>
                  <div>CHANGE</div>
                  <div>CHANGE %</div>
                  <div>ACTION</div>
                </div>
                
                {/* Symbols */}
                {watchedSymbols.map((symbol) => {
                  const quote = quotes?.[symbol];
                  const isSelected = symbol === selectedSymbol;
                  
                  return (
                    <div 
                      key={symbol}
                      className={`grid grid-cols-5 gap-2 text-sm py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${
                        isSelected ? 'bg-green-900 border-green-600' : ''
                      }`}
                      onClick={() => onSymbolSelect(symbol)}
                    >
                      <div className="text-white font-semibold">{symbol}</div>
                      <div className="text-green-400">
                        {quote ? `$${formatPrice(quote.price)}` : 'N/A'}
                      </div>
                      <div className={quote && quote.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {quote ? formatChange(quote.change) : 'N/A'}
                      </div>
                      <div className={quote && quote.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {quote ? formatPercent(quote.changePercent) : 'N/A'}
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSymbol(symbol);
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900 p-1 h-6 w-6"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market movers */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              TOP MARKET MOVERS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Top gainers */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  TOP GAINERS
                </h4>
                <div className="space-y-1">
                  {watchedSymbols
                    .filter(symbol => quotes?.[symbol]?.changePercent > 0)
                    .sort((a, b) => (quotes?.[b]?.changePercent || 0) - (quotes?.[a]?.changePercent || 0))
                    .slice(0, 3)
                    .map((symbol) => {
                      const quote = quotes?.[symbol];
                      return (
                        <div 
                          key={symbol}
                          className="flex justify-between items-center p-2 bg-black border border-green-600 rounded cursor-pointer hover:bg-gray-800"
                          onClick={() => onSymbolSelect(symbol)}
                        >
                          <span className="text-white font-semibold">{symbol}</span>
                          <div className="text-right">
                            <div className="text-green-400 font-semibold">
                              {quote ? formatPercent(quote.changePercent) : 'N/A'}
                            </div>
                            <div className="text-xs text-green-600">
                              {quote ? `$${formatPrice(quote.price)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Top losers */}
              <div>
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  TOP LOSERS
                </h4>
                <div className="space-y-1">
                  {watchedSymbols
                    .filter(symbol => quotes?.[symbol]?.changePercent < 0)
                    .sort((a, b) => (quotes?.[a]?.changePercent || 0) - (quotes?.[b]?.changePercent || 0))
                    .slice(0, 3)
                    .map((symbol) => {
                      const quote = quotes?.[symbol];
                      return (
                        <div 
                          key={symbol}
                          className="flex justify-between items-center p-2 bg-black border border-red-600 rounded cursor-pointer hover:bg-gray-800"
                          onClick={() => onSymbolSelect(symbol)}
                        >
                          <span className="text-white font-semibold">{symbol}</span>
                          <div className="text-right">
                            <div className="text-red-400 font-semibold">
                              {quote ? formatPercent(quote.changePercent) : 'N/A'}
                            </div>
                            <div className="text-xs text-red-600">
                              {quote ? `$${formatPrice(quote.price)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
