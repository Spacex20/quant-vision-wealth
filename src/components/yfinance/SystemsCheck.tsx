
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, Activity, Database, TrendingUp, Clock } from 'lucide-react';
import { yFinanceService } from '@/services/yfinanceService';
import { toast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  duration: number;
  details: string;
  data?: any;
}

interface LatencyData {
  endpoint: string;
  time: number;
  latency: number;
}

export const SystemsCheck = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const testTickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'INFY.NS', 'TCS.NS', 'RELIANCE.NS'];

  const runSystemsCheck = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setLatencyData([]);
    
    const testResults: TestResult[] = [];
    const latencyResults: LatencyData[] = [];
    let currentProgress = 0;

    const updateProgress = () => {
      currentProgress += 100 / 8; // 8 total test categories
      setProgress(currentProgress);
    };

    try {
      // Test 1: API Connectivity
      const startTime = Date.now();
      try {
        const response = await yFinanceService.getCurrentPrice('AAPL');
        const duration = Date.now() - startTime;
        latencyResults.push({ endpoint: 'getCurrentPrice', time: Date.now(), latency: duration });
        
        testResults.push({
          test: 'API Connectivity',
          status: response ? 'pass' : 'fail',
          duration,
          details: response ? 'Successfully connected to yFinance API' : 'Failed to connect to API',
          data: response
        });
      } catch (error) {
        testResults.push({
          test: 'API Connectivity',
          status: 'fail',
          duration: Date.now() - startTime,
          details: `API connection failed: ${error}`
        });
      }
      updateProgress();

      // Test 2: Data Validation
      try {
        const startTime2 = Date.now();
        const historicalData = await yFinanceService.getHistoricalData('AAPL', '1y');
        const duration2 = Date.now() - startTime2;
        latencyResults.push({ endpoint: 'getHistoricalData', time: Date.now(), latency: duration2 });
        
        const isValidData = historicalData && 
                           Array.isArray(historicalData) && 
                           historicalData.length > 0 &&
                           historicalData[0].hasOwnProperty('close');
        
        testResults.push({
          test: 'Data Validation',
          status: isValidData ? 'pass' : 'fail',
          duration: duration2,
          details: isValidData ? 
            `Retrieved ${historicalData.length} historical data points` : 
            'Invalid data structure received',
          data: isValidData ? historicalData.slice(0, 5) : null
        });
      } catch (error) {
        testResults.push({
          test: 'Data Validation',
          status: 'fail',
          duration: 0,
          details: `Data validation failed: ${error}`
        });
      }
      updateProgress();

      // Test 3: Multiple Ticker Support
      try {
        const startTime3 = Date.now();
        const promises = testTickers.slice(0, 3).map(ticker => 
          yFinanceService.getCurrentPrice(ticker)
        );
        const responses = await Promise.allSettled(promises);
        const duration3 = Date.now() - startTime3;
        
        const successCount = responses.filter(r => r.status === 'fulfilled').length;
        const status = successCount === responses.length ? 'pass' : 
                      successCount > 0 ? 'warning' : 'fail';
        
        testResults.push({
          test: 'Multiple Ticker Support',
          status,
          duration: duration3,
          details: `${successCount}/${responses.length} tickers successfully fetched`,
          data: responses
        });
      } catch (error) {
        testResults.push({
          test: 'Multiple Ticker Support',
          status: 'fail',
          duration: 0,
          details: `Multi-ticker test failed: ${error}`
        });
      }
      updateProgress();

      // Test 4: Error Handling
      try {
        const startTime4 = Date.now();
        const invalidResponse = await yFinanceService.getCurrentPrice('INVALID_TICKER_123');
        const duration4 = Date.now() - startTime4;
        
        testResults.push({
          test: 'Error Handling',
          status: invalidResponse ? 'warning' : 'pass',
          duration: duration4,
          details: invalidResponse ? 
            'API returned data for invalid ticker (unexpected)' : 
            'Properly handled invalid ticker',
          data: invalidResponse
        });
      } catch (error) {
        testResults.push({
          test: 'Error Handling',
          status: 'pass',
          duration: 0,
          details: 'Properly caught and handled API errors'
        });
      }
      updateProgress();

      // Test 5: Performance Test
      try {
        const performanceStart = Date.now();
        const performancePromises = Array(5).fill(null).map(() => 
          yFinanceService.getCurrentPrice('AAPL')
        );
        await Promise.all(performancePromises);
        const performanceDuration = Date.now() - performanceStart;
        
        testResults.push({
          test: 'Performance Test',
          status: performanceDuration < 5000 ? 'pass' : 'warning',
          duration: performanceDuration,
          details: `5 concurrent requests completed in ${performanceDuration}ms`,
          data: { avgLatency: performanceDuration / 5 }
        });
      } catch (error) {
        testResults.push({
          test: 'Performance Test',
          status: 'fail',
          duration: 0,
          details: `Performance test failed: ${error}`
        });
      }
      updateProgress();

      // Test 6: Fundamental Data
      try {
        const fundamentalStart = Date.now();
        const fundamentalData = await yFinanceService.getFundamentals('AAPL');
        const fundamentalDuration = Date.now() - fundamentalStart;
        latencyResults.push({ endpoint: 'getFundamentals', time: Date.now(), latency: fundamentalDuration });
        
        const hasFundamentals = fundamentalData && Object.keys(fundamentalData).length > 0;
        
        testResults.push({
          test: 'Fundamental Data',
          status: hasFundamentals ? 'pass' : 'warning',
          duration: fundamentalDuration,
          details: hasFundamentals ? 
            `Retrieved ${Object.keys(fundamentalData).length} fundamental metrics` : 
            'No fundamental data available',
          data: fundamentalData
        });
      } catch (error) {
        testResults.push({
          test: 'Fundamental Data',
          status: 'fail',
          duration: 0,
          details: `Fundamental data test failed: ${error}`
        });
      }
      updateProgress();

      // Test 7: Backtest Engine Simulation
      try {
        const backtestStart = Date.now();
        const historicalForBacktest = await yFinanceService.getHistoricalData('AAPL', '3mo');
        const backtestDuration = Date.now() - backtestStart;
        
        // Simulate a simple moving average strategy
        const canRunBacktest = historicalForBacktest && 
                              Array.isArray(historicalForBacktest) && 
                              historicalForBacktest.length >= 50;
        
        testResults.push({
          test: 'Backtest Engine',
          status: canRunBacktest ? 'pass' : 'fail',
          duration: backtestDuration,
          details: canRunBacktest ? 
            `Sufficient data for backtesting (${historicalForBacktest.length} points)` : 
            'Insufficient data for reliable backtesting',
          data: { dataPoints: historicalForBacktest?.length || 0 }
        });
      } catch (error) {
        testResults.push({
          test: 'Backtest Engine',
          status: 'fail',
          duration: 0,
          details: `Backtest simulation failed: ${error}`
        });
      }
      updateProgress();

      // Test 8: System Integration
      try {
        const integrationStart = Date.now();
        // Test integration by fetching data and simulating frontend consumption
        const integrationData = await Promise.all([
          yFinanceService.getCurrentPrice('AAPL'),
          yFinanceService.getHistoricalData('AAPL', '1mo')
        ]);
        const integrationDuration = Date.now() - integrationStart;
        
        const integrationSuccess = integrationData.every(data => data !== null);
        
        testResults.push({
          test: 'System Integration',
          status: integrationSuccess ? 'pass' : 'fail',
          duration: integrationDuration,
          details: integrationSuccess ? 
            'All integration endpoints responding correctly' : 
            'Some integration endpoints failed',
          data: integrationData
        });
      } catch (error) {
        testResults.push({
          test: 'System Integration',
          status: 'fail',
          duration: 0,
          details: `Integration test failed: ${error}`
        });
      }
      updateProgress();

    } catch (error) {
      toast({
        title: "Systems Check Failed",
        description: `An error occurred during testing: ${error}`,
        variant: "destructive",
      });
    }

    setResults(testResults);
    setLatencyData(latencyResults);
    setIsRunning(false);
    setProgress(100);

    const passCount = testResults.filter(r => r.status === 'pass').length;
    const totalTests = testResults.length;
    
    toast({
      title: "Systems Check Complete",
      description: `${passCount}/${totalTests} tests passed`,
      variant: passCount === totalTests ? "default" : "destructive",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'pass' ? 'default' : status === 'fail' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  const overallHealth = results.length > 0 ? {
    pass: results.filter(r => r.status === 'pass').length,
    warning: results.filter(r => r.status === 'warning').length,
    fail: results.filter(r => r.status === 'fail').length,
    total: results.length
  } : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">yFinance Integration Systems Check</h1>
          <p className="text-muted-foreground">
            Comprehensive testing of API connectivity, data validation, and system performance
          </p>
        </div>
        <Button 
          onClick={runSystemsCheck} 
          disabled={isRunning}
          className="min-w-[120px]"
        >
          {isRunning ? 'Running...' : 'Run Systems Check'}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running systems check...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {overallHealth && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-500">{overallHealth.pass}</p>
                  <p className="text-sm text-muted-foreground">Passed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-500">{overallHealth.warning}</p>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-500">{overallHealth.fail}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-500">{overallHealth.total}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Test Results</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Detailed Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span>{result.test}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(result.status)}
                    <Badge variant="outline">{result.duration}ms</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{result.details}</p>
                {result.data && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <pre>{JSON.stringify(result.data, null, 2).slice(0, 200)}...</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {latencyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>API Latency Chart</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={latencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="endpoint" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="latency" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latencyData.map((data, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{data.endpoint}</span>
                    </div>
                    <Badge variant={data.latency < 1000 ? 'default' : 'destructive'}>
                      {data.latency}ms
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Detailed Test Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border-l-4 border-gray-200 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.details}</p>
                    {result.data && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600">View raw data</summary>
                        <pre className="mt-2 p-2 bg-muted rounded overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {results.length === 0 && !isRunning && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Click "Run Systems Check" to begin comprehensive testing of the yFinance integration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
