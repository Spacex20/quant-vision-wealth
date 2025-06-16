
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Clock, Database, TrendingUp } from 'lucide-react';
import { yfinanceService } from '@/services/yfinanceService';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  data?: any;
}

interface PerformanceMetrics {
  apiLatency: number[];
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

export const SystemsCheck = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    apiLatency: [],
    cacheHitRate: 0,
    errorRate: 0,
    throughput: 0
  });
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const testSymbols = ['AAPL', 'MSFT', 'GOOGL', 'INFY.NS', 'TCS.NS', 'RELIANCE.NS'];
  const invalidSymbols = ['INVALID', 'BADTICKER', 'NOTREAL'];

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setSystemLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`Systems Check: ${message}`);
  };

  const updateTestResult = (name: string, status: TestResult['status'], message: string, duration?: number, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      const newResult = { name, status, message, duration, data };
      
      if (existing) {
        return prev.map(r => r.name === name ? newResult : r);
      } else {
        return [...prev, newResult];
      }
    });
  };

  const testApiConnectivity = async () => {
    addLog('Testing API connectivity...');
    const startTime = Date.now();
    
    try {
      const quote = await yfinanceService.getQuote('AAPL');
      const duration = Date.now() - startTime;
      
      updateTestResult(
        'API Connectivity',
        'success',
        `Successfully fetched AAPL quote in ${duration}ms`,
        duration,
        quote
      );
      
      setPerformanceMetrics(prev => ({
        ...prev,
        apiLatency: [...prev.apiLatency, duration]
      }));
      
      addLog(`API connectivity test passed - ${duration}ms latency`);
    } catch (error) {
      updateTestResult(
        'API Connectivity',
        'error',
        `Failed to connect to API: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`API connectivity test failed: ${error.message}`);
    }
  };

  const testDataValidation = async () => {
    addLog('Testing data validation and structure...');
    const startTime = Date.now();
    
    try {
      const quote = await yfinanceService.getQuote('AAPL');
      const historical = await yfinanceService.getHistorical('AAPL', '1m', '1d');
      const fundamentals = await yfinanceService.getFundamentals('AAPL');
      
      // Validate quote structure
      const requiredQuoteFields = ['symbol', 'price', 'change', 'changePercent', 'volume', 'timestamp'];
      const missingQuoteFields = requiredQuoteFields.filter(field => !(field in quote));
      
      // Validate historical structure
      const historicalValid = Array.isArray(historical) && historical.length > 0 &&
        historical[0].hasOwnProperty('date') && historical[0].hasOwnProperty('close');
      
      // Validate fundamentals structure
      const requiredFundamentalFields = ['symbol', 'marketCap', 'peRatio', 'sector'];
      const missingFundamentalFields = requiredFundamentalFields.filter(field => !(field in fundamentals));
      
      if (missingQuoteFields.length === 0 && historicalValid && missingFundamentalFields.length === 0) {
        updateTestResult(
          'Data Validation',
          'success',
          `All data structures valid - Quote: ${Object.keys(quote).length} fields, Historical: ${historical.length} records`,
          Date.now() - startTime,
          { quote, historical: historical.slice(0, 5), fundamentals }
        );
        addLog('Data validation test passed');
      } else {
        updateTestResult(
          'Data Validation',
          'warning',
          `Some fields missing - Quote: ${missingQuoteFields.join(', ')}, Fundamentals: ${missingFundamentalFields.join(', ')}`,
          Date.now() - startTime
        );
        addLog('Data validation test had warnings');
      }
    } catch (error) {
      updateTestResult(
        'Data Validation',
        'error',
        `Data validation failed: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`Data validation test failed: ${error.message}`);
    }
  };

  const testCachingPerformance = async () => {
    addLog('Testing caching performance...');
    const startTime = Date.now();
    
    try {
      // First request (cache miss)
      const start1 = Date.now();
      await yfinanceService.getQuote('MSFT');
      const firstRequestTime = Date.now() - start1;
      
      // Second request (should hit cache)
      const start2 = Date.now();
      await yfinanceService.getQuote('MSFT');
      const secondRequestTime = Date.now() - start2;
      
      const cacheHitRate = secondRequestTime < firstRequestTime * 0.5 ? 100 : 0;
      
      setPerformanceMetrics(prev => ({
        ...prev,
        cacheHitRate
      }));
      
      updateTestResult(
        'Caching Performance',
        cacheHitRate > 0 ? 'success' : 'warning',
        `First request: ${firstRequestTime}ms, Second request: ${secondRequestTime}ms (${cacheHitRate}% cache hit rate)`,
        Date.now() - startTime,
        { firstRequestTime, secondRequestTime, cacheHitRate }
      );
      
      addLog(`Caching test completed - ${cacheHitRate}% hit rate`);
    } catch (error) {
      updateTestResult(
        'Caching Performance',
        'error',
        `Caching test failed: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`Caching test failed: ${error.message}`);
    }
  };

  const testErrorHandling = async () => {
    addLog('Testing error handling with invalid tickers...');
    const startTime = Date.now();
    let errorCount = 0;
    
    for (const symbol of invalidSymbols) {
      try {
        await yfinanceService.getQuote(symbol);
      } catch (error) {
        errorCount++;
        addLog(`Expected error for ${symbol}: ${error.message}`);
      }
    }
    
    const errorRate = (errorCount / invalidSymbols.length) * 100;
    setPerformanceMetrics(prev => ({
      ...prev,
      errorRate
    }));
    
    updateTestResult(
      'Error Handling',
      errorRate === 100 ? 'success' : 'warning',
      `${errorCount}/${invalidSymbols.length} invalid tickers properly rejected (${errorRate}% error rate)`,
      Date.now() - startTime,
      { errorCount, totalTested: invalidSymbols.length, errorRate }
    );
    
    addLog(`Error handling test completed - ${errorRate}% error rate`);
  };

  const testBacktestEngine = async () => {
    addLog('Testing backtest engine...');
    const startTime = Date.now();
    
    try {
      const backtestRequest = {
        symbols: ['AAPL', 'MSFT'],
        strategy: 'buy_and_hold',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        initialAmount: 10000,
        parameters: {}
      };
      
      const results = await yfinanceService.runBacktest(backtestRequest);
      
      const isValidBacktest = results.finalValue > 0 && 
        results.portfolioValues.length > 0 && 
        results.totalReturn !== undefined;
      
      updateTestResult(
        'Backtest Engine',
        isValidBacktest ? 'success' : 'error',
        `Backtest completed - Final value: $${results.finalValue.toLocaleString()}, Return: ${results.totalReturn.toFixed(2)}%`,
        Date.now() - startTime,
        results
      );
      
      addLog(`Backtest test completed - ${results.totalReturn.toFixed(2)}% return`);
    } catch (error) {
      updateTestResult(
        'Backtest Engine',
        'error',
        `Backtest failed: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`Backtest test failed: ${error.message}`);
    }
  };

  const testDatabaseStorage = async () => {
    addLog('Testing database storage and caching...');
    const startTime = Date.now();
    
    try {
      // Check if yfinance_cache table exists and is accessible
      const { data, error } = await supabase
        .from('yfinance_cache')
        .select('*')
        .limit(1);
      
      if (error) {
        updateTestResult(
          'Database Storage',
          'error',
          `Database access failed: ${error.message}`,
          Date.now() - startTime
        );
        addLog(`Database test failed: ${error.message}`);
      } else {
        updateTestResult(
          'Database Storage',
          'success',
          `Database accessible - Cache table contains ${data?.length || 0} records`,
          Date.now() - startTime,
          data
        );
        addLog('Database storage test passed');
      }
    } catch (error) {
      updateTestResult(
        'Database Storage',
        'error',
        `Database test failed: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`Database test failed: ${error.message}`);
    }
  };

  const testHighFrequencyRequests = async () => {
    addLog('Testing high-frequency requests for system stability...');
    const startTime = Date.now();
    const requestCount = 10;
    const promises = [];
    
    try {
      // Fire multiple concurrent requests
      for (let i = 0; i < requestCount; i++) {
        const symbol = testSymbols[i % testSymbols.length];
        promises.push(yfinanceService.getQuote(symbol));
      }
      
      const results = await Promise.allSettled(promises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const throughput = successCount / ((Date.now() - startTime) / 1000);
      
      setPerformanceMetrics(prev => ({
        ...prev,
        throughput
      }));
      
      updateTestResult(
        'High-Frequency Load',
        successCount === requestCount ? 'success' : 'warning',
        `${successCount}/${requestCount} requests successful (${throughput.toFixed(2)} req/sec)`,
        Date.now() - startTime,
        { successCount, requestCount, throughput }
      );
      
      addLog(`High-frequency test completed - ${throughput.toFixed(2)} req/sec throughput`);
    } catch (error) {
      updateTestResult(
        'High-Frequency Load',
        'error',
        `High-frequency test failed: ${error.message}`,
        Date.now() - startTime
      );
      addLog(`High-frequency test failed: ${error.message}`);
    }
  };

  const runFullSystemsCheck = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    setSystemLogs([]);
    addLog('Starting comprehensive systems check...');
    
    const tests = [
      testApiConnectivity,
      testDatabaseStorage,
      testDataValidation,
      testCachingPerformance,
      testErrorHandling,
      testBacktestEngine,
      testHighFrequencyRequests
    ];
    
    for (let i = 0; i < tests.length; i++) {
      await tests[i]();
      setProgress(((i + 1) / tests.length) * 100);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    addLog('Systems check completed');
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Chart data for latency visualization
  const latencyChartData = performanceMetrics.apiLatency.map((latency, index) => ({
    request: index + 1,
    latency
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span>yFinance Integration Systems Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runFullSystemsCheck}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Running Systems Check...' : 'Run Complete Systems Check'}
            </Button>
            
            {isRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Progress: {progress.toFixed(0)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.name}</h4>
                        <Badge variant="outline" className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.message}
                      </p>
                      {result.duration && (
                        <p className="text-xs text-muted-foreground">
                          Duration: {result.duration}ms
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {performanceMetrics.apiLatency.length > 0 
                        ? Math.round(performanceMetrics.apiLatency.reduce((a, b) => a + b, 0) / performanceMetrics.apiLatency.length)
                        : 0}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Latency</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {performanceMetrics.cacheHitRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {performanceMetrics.throughput.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Req/Sec</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {performanceMetrics.errorRate.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Error Rate</div>
                  </div>
                </div>

                {latencyChartData.length > 0 && (
                  <div className="h-48">
                    <h4 className="text-sm font-medium mb-2">API Latency Trend</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={latencyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="request" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="latency" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {systemLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Systems check completed. {testResults.filter(r => r.status === 'success').length}/{testResults.length} tests passed. 
            Review the detailed results above and check logs for any issues.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
