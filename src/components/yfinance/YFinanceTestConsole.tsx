
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3, Calculator, RefreshCw } from 'lucide-react';
import { useYFinanceQuote, useYFinanceHistorical, useYFinanceFundamentals, useYFinanceBacktest, useSymbolValidation, useYFinanceBatch } from '@/hooks/useYFinanceData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function YFinanceTestConsole() {
  const [testSymbol, setTestSymbol] = useState('AAPL');
  const [backtestSymbols, setBacktestSymbols] = useState('AAPL,MSFT');
  const [backtestStartDate, setBacktestStartDate] = useState('2023-01-01');
  const [backtestEndDate, setBacktestEndDate] = useState('2024-01-01');
  const [backtestAmount, setBacktestAmount] = useState(10000);
  const [period, setPeriod] = useState('1y');
  const [testResults, setTestResults] = useState<any[]>([]);

  // Hooks
  const quoteQuery = useYFinanceQuote(testSymbol);
  const historicalQuery = useYFinanceHistorical(testSymbol, period);
  const fundamentalsQuery = useYFinanceFundamentals(testSymbol);
  const backtestMutation = useYFinanceBacktest();
  const validateMutation = useSymbolValidation();
  const { refreshAllData, clearCache } = useYFinanceBatch();

  const addTestResult = (test: string, result: 'success' | 'error', message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [{
      id: Date.now(),
      test,
      result,
      message,
      data,
      timestamp
    }, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const runQuoteTest = async () => {
    try {
      const result = await quoteQuery.refetch();
      if (result.data) {
        addTestResult('Quote Test', 'success', `Successfully fetched quote for ${testSymbol}`, result.data);
      }
    } catch (error) {
      addTestResult('Quote Test', 'error', `Failed to fetch quote: ${error.message}`);
    }
  };

  const runHistoricalTest = async () => {
    try {
      const result = await historicalQuery.refetch();
      if (result.data) {
        addTestResult('Historical Test', 'success', `Fetched ${result.data.length} data points for ${testSymbol}`, result.data.slice(0, 3));
      }
    } catch (error) {
      addTestResult('Historical Test', 'error', `Failed to fetch historical data: ${error.message}`);
    }
  };

  const runFundamentalsTest = async () => {
    try {
      const result = await fundamentalsQuery.refetch();
      if (result.data) {
        addTestResult('Fundamentals Test', 'success', `Successfully fetched fundamentals for ${testSymbol}`, result.data);
      }
    } catch (error) {
      addTestResult('Fundamentals Test', 'error', `Failed to fetch fundamentals: ${error.message}`);
    }
  };

  const runBacktest = async () => {
    const symbols = backtestSymbols.split(',').map(s => s.trim());
    
    try {
      const result = await backtestMutation.mutateAsync({
        symbols,
        strategy: 'buy_and_hold',
        startDate: backtestStartDate,
        endDate: backtestEndDate,
        initialAmount: backtestAmount,
        parameters: {}
      });

      addTestResult('Backtest', 'success', 
        `Backtest completed: ${result.totalReturn.toFixed(2)}% return`, 
        result
      );
    } catch (error) {
      addTestResult('Backtest', 'error', `Backtest failed: ${error.message}`);
    }
  };

  const validateSymbol = async () => {
    try {
      const isValid = await validateMutation.mutateAsync(testSymbol);
      addTestResult('Symbol Validation', isValid ? 'success' : 'error', 
        `Symbol ${testSymbol} is ${isValid ? 'valid' : 'invalid'}`
      );
    } catch (error) {
      addTestResult('Symbol Validation', 'error', `Validation failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    await runQuoteTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    await runHistoricalTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    await runFundamentalsTest();
    await new Promise(resolve => setTimeout(resolve, 500));
    await validateSymbol();
  };

  const chartData = historicalQuery.data?.slice(-30).map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    price: item.close,
    volume: item.volume
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            yFinance API Test Console
          </CardTitle>
          <CardDescription>
            Test and validate yFinance API integration for U.S. and Indian stocks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="testing" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="testing">API Testing</TabsTrigger>
              <TabsTrigger value="data">Live Data</TabsTrigger>
              <TabsTrigger value="backtest">Backtesting</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
            </TabsList>

            <TabsContent value="testing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symbol">Test Symbol</Label>
                    <Input
                      id="symbol"
                      value={testSymbol}
                      onChange={(e) => setTestSymbol(e.target.value.toUpperCase())}
                      placeholder="AAPL, INFY.NS, etc."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Try: AAPL, MSFT, GOOGL, INFY.NS, TCS.NS, RELIANCE.NS
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="period">Historical Period</Label>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3m">3 Months</SelectItem>
                        <SelectItem value="6m">6 Months</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={runQuoteTest} className="w-full" disabled={quoteQuery.isLoading}>
                    {quoteQuery.isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                    Test Quote API
                  </Button>
                  
                  <Button onClick={runHistoricalTest} variant="outline" className="w-full" disabled={historicalQuery.isLoading}>
                    {historicalQuery.isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                    Test Historical API
                  </Button>
                  
                  <Button onClick={runFundamentalsTest} variant="outline" className="w-full" disabled={fundamentalsQuery.isLoading}>
                    {fundamentalsQuery.isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Calculator className="w-4 h-4 mr-2" />}
                    Test Fundamentals API
                  </Button>
                  
                  <Button onClick={validateSymbol} variant="outline" className="w-full" disabled={validateMutation.isPending}>
                    {validateMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Validate Symbol
                  </Button>
                  
                  <Separator />
                  
                  <Button onClick={runAllTests} variant="default" className="w-full">
                    Run All Tests
                  </Button>
                  
                  <Button onClick={clearCache} variant="ghost" className="w-full">
                    Clear Cache
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Quote Data */}
                {quoteQuery.data && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quote Data - {testSymbol}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-mono">${quoteQuery.data.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Change:</span>
                        <Badge variant={quoteQuery.data.change >= 0 ? "default" : "destructive"}>
                          {quoteQuery.data.change >= 0 ? '+' : ''}{quoteQuery.data.change.toFixed(2)} ({quoteQuery.data.changePercent.toFixed(2)}%)
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="font-mono">{quoteQuery.data.volume.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Cap:</span>
                        <span className="font-mono">${(quoteQuery.data.marketCap! / 1e9).toFixed(2)}B</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Fundamentals Data */}
                {fundamentalsQuery.data && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fundamentals - {testSymbol}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>P/E Ratio:</span>
                        <span className="font-mono">{fundamentalsQuery.data.peRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P/B Ratio:</span>
                        <span className="font-mono">{fundamentalsQuery.data.priceToBook.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROE:</span>
                        <span className="font-mono">{fundamentalsQuery.data.roe.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt/Equity:</span>
                        <span className="font-mono">{fundamentalsQuery.data.debtToEquity.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Price Chart */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Price Chart - Last 30 Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="backtest" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backtest-symbols">Symbols (comma-separated)</Label>
                    <Input
                      id="backtest-symbols"
                      value={backtestSymbols}
                      onChange={(e) => setBacktestSymbols(e.target.value)}
                      placeholder="AAPL,MSFT,GOOGL"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={backtestStartDate}
                        onChange={(e) => setBacktestStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={backtestEndDate}
                        onChange={(e) => setBacktestEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="initial-amount">Initial Amount ($)</Label>
                    <Input
                      id="initial-amount"
                      type="number"
                      value={backtestAmount}
                      onChange={(e) => setBacktestAmount(Number(e.target.value))}
                    />
                  </div>

                  <Button 
                    onClick={runBacktest} 
                    className="w-full"
                    disabled={backtestMutation.isPending}
                  >
                    {backtestMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Calculator className="w-4 h-4 mr-2" />
                    )}
                    Run Backtest
                  </Button>
                </div>

                {backtestMutation.data && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Backtest Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Return:</span>
                        <Badge variant={backtestMutation.data.totalReturn >= 0 ? "default" : "destructive"}>
                          {backtestMutation.data.totalReturn.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Value:</span>
                        <span className="font-mono">${backtestMutation.data.finalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility:</span>
                        <span className="font-mono">{backtestMutation.data.volatility.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sharpe Ratio:</span>
                        <span className="font-mono">{backtestMutation.data.sharpeRatio.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Drawdown:</span>
                        <span className="font-mono text-red-600">{backtestMutation.data.maxDrawdown.toFixed(2)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Test Results Log</h3>
                <Button onClick={() => setTestResults([])} variant="outline" size="sm">
                  Clear Log
                </Button>
              </div>

              <div className="space-y-2">
                {testResults.map((result) => (
                  <Card key={result.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {result.result === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-medium">{result.test}</span>
                        <Badge variant={result.result === 'success' ? 'default' : 'destructive'}>
                          {result.result}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {result.timestamp}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-blue-600">View Data</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </Card>
                ))}

                {testResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No test results yet. Run some tests to see results here.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
