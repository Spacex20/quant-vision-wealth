
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Target, Percent } from "lucide-react";

interface Position {
  symbol: string;
  quantity: number;
  avg_entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  market_value: number;
  weight: number;
}

export const TerminalPortfolio = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [accountData, setAccountData] = useState({
    totalValue: 100000,
    totalPnL: 0,
    dayChange: 0,
    dayChangePercent: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock portfolio data for demonstration
  const mockPositions: Position[] = [
    {
      symbol: "AAPL",
      quantity: 100,
      avg_entry_price: 145.00,
      current_price: 155.23,
      unrealized_pnl: 1023.00,
      realized_pnl: 0,
      market_value: 15523.00,
      weight: 0.25
    },
    {
      symbol: "MSFT",
      quantity: 75,
      avg_entry_price: 280.00,
      current_price: 295.45,
      unrealized_pnl: 1158.75,
      realized_pnl: 0,
      market_value: 22158.75,
      weight: 0.35
    },
    {
      symbol: "GOOGL",
      quantity: 50,
      avg_entry_price: 120.00,
      current_price: 138.92,
      unrealized_pnl: 946.00,
      realized_pnl: 0,
      market_value: 6946.00,
      weight: 0.15
    },
    {
      symbol: "TSLA",
      quantity: 80,
      avg_entry_price: 200.00,
      current_price: 185.67,
      unrealized_pnl: -1146.40,
      realized_pnl: 0,
      market_value: 14853.60,
      weight: 0.25
    }
  ];

  useEffect(() => {
    if (user) {
      loadPortfolioData();
    }
  }, [user]);

  const loadPortfolioData = async () => {
    // For demo, use mock data
    setPositions(mockPositions);
    
    const totalValue = mockPositions.reduce((sum, pos) => sum + pos.market_value, 0);
    const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.unrealized_pnl, 0);
    
    setAccountData({
      totalValue,
      totalPnL,
      dayChange: totalPnL * 0.3, // Mock daily change
      dayChangePercent: (totalPnL * 0.3 / totalValue) * 100
    });
    
    setLoading(false);
  };

  const pieData = positions.map(pos => ({
    name: pos.symbol,
    value: pos.market_value,
    weight: pos.weight
  }));

  const performanceData = positions.map(pos => ({
    symbol: pos.symbol,
    pnl: pos.unrealized_pnl,
    pnlPercent: ((pos.current_price - pos.avg_entry_price) / pos.avg_entry_price) * 100
  }));

  const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-4">
      {/* Portfolio summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">TOTAL VALUE</span>
            </div>
            <div className="text-2xl font-bold text-white">
              ${accountData.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">TOTAL P&L</span>
            </div>
            <div className={`text-2xl font-bold ${accountData.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {accountData.totalPnL >= 0 ? '+' : ''}${accountData.totalPnL.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {accountData.dayChange >= 0 ? 
                <TrendingUp className="w-5 h-5 text-green-400" /> : 
                <TrendingDown className="w-5 h-5 text-red-400" />
              }
              <span className="text-green-400 font-semibold">DAY CHANGE</span>
            </div>
            <div className={`text-2xl font-bold ${accountData.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {accountData.dayChange >= 0 ? '+' : ''}${accountData.dayChange.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">DAY CHANGE %</span>
            </div>
            <div className={`text-2xl font-bold ${accountData.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {accountData.dayChangePercent >= 0 ? '+' : ''}{accountData.dayChangePercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio composition and performance */}
      <div className="grid grid-cols-3 gap-4">
        {/* Positions table */}
        <Card className="col-span-2 bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              PORTFOLIO POSITIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="text-center text-green-400">LOADING POSITIONS...</div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-7 gap-2 text-xs text-green-400 font-semibold border-b border-green-800 pb-2">
                  <div>SYMBOL</div>
                  <div>QTY</div>
                  <div>AVG PRICE</div>
                  <div>CURRENT</div>
                  <div>MKT VALUE</div>
                  <div>P&L</div>
                  <div>P&L %</div>
                </div>
                
                {/* Positions */}
                {positions.map((position) => {
                  const pnlPercent = ((position.current_price - position.avg_entry_price) / position.avg_entry_price) * 100;
                  const isPositive = position.unrealized_pnl >= 0;
                  
                  return (
                    <div 
                      key={position.symbol}
                      className="grid grid-cols-7 gap-2 text-sm py-2 border-b border-gray-700 hover:bg-gray-800"
                    >
                      <div className="text-white font-semibold">{position.symbol}</div>
                      <div className="text-green-400">{position.quantity}</div>
                      <div className="text-green-400">${position.avg_entry_price.toFixed(2)}</div>
                      <div className="text-white">${position.current_price.toFixed(2)}</div>
                      <div className="text-white">${position.market_value.toLocaleString()}</div>
                      <div className={isPositive ? 'text-green-400' : 'text-red-400'}>
                        {isPositive ? '+' : ''}${position.unrealized_pnl.toFixed(2)}
                      </div>
                      <div className={isPositive ? 'text-green-400' : 'text-red-400'}>
                        {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio allocation chart */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              ALLOCATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, weight}) => `${name} ${(weight * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e' 
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance analysis */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono">
            PERFORMANCE ANALYSIS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#16a34a" opacity={0.3} />
                <XAxis dataKey="symbol" stroke="#22c55e" fontSize={12} />
                <YAxis stroke="#22c55e" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #22c55e',
                    color: '#22c55e' 
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'pnl' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`,
                    name === 'pnl' ? 'P&L' : 'P&L %'
                  ]}
                />
                <Bar 
                  dataKey="pnl" 
                  fill={(entry) => entry.pnl >= 0 ? '#22c55e' : '#ef4444'} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
