
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Plus, Save, Share, Code, BarChart3, TrendingUp, Users } from 'lucide-react';
import { quantLabService, ResearchNotebook, NotebookCell, TradingStrategy, PaperTradingAccount } from '@/services/quantLabService';

const QuantLab = () => {
  const [notebooks, setNotebooks] = useState<ResearchNotebook[]>([]);
  const [currentNotebook, setCurrentNotebook] = useState<ResearchNotebook | null>(null);
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [paperAccounts, setPaperAccounts] = useState<PaperTradingAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const mockUserId = 'user123'; // In real app, get from auth context
      
      const [userNotebooks, userStrategies, userAccounts] = await Promise.all([
        quantLabService.getUserNotebooks(mockUserId),
        quantLabService.getStrategies(mockUserId),
        quantLabService.getPaperAccounts(mockUserId)
      ]);

      setNotebooks(userNotebooks);
      setStrategies(userStrategies);
      setPaperAccounts(userAccounts);

      if (userNotebooks.length > 0) {
        setCurrentNotebook(userNotebooks[0]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewNotebook = async () => {
    try {
      const name = `Research Notebook ${notebooks.length + 1}`;
      const notebook = await quantLabService.createNotebook('user123', name, 'New quantitative research notebook');
      setNotebooks([...notebooks, notebook]);
      setCurrentNotebook(notebook);
    } catch (error) {
      console.error('Error creating notebook:', error);
    }
  };

  const executeCell = async (cellId: string) => {
    if (!currentNotebook) return;

    try {
      const result = await quantLabService.executeCell(currentNotebook.id, cellId);
      console.log('Cell execution result:', result);
      
      // Update the notebook with execution results
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        setCurrentNotebook(updatedNotebook);
      }
    } catch (error) {
      console.error('Error executing cell:', error);
    }
  };

  const addNewCell = async (type: NotebookCell['type']) => {
    if (!currentNotebook) return;

    try {
      await quantLabService.addCell(currentNotebook.id, type);
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        setCurrentNotebook(updatedNotebook);
      }
    } catch (error) {
      console.error('Error adding cell:', error);
    }
  };

  const updateCellContent = async (cellId: string, content: string) => {
    if (!currentNotebook) return;

    try {
      await quantLabService.updateCell(currentNotebook.id, cellId, { content });
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const runBacktest = async (strategyId: string) => {
    try {
      setLoading(true);
      const result = await quantLabService.backtest(
        strategyId,
        '2023-01-01',
        '2024-01-01',
        100000
      );
      console.log('Backtest result:', result);
      alert(`Backtest completed! Total Return: ${(result.totalReturn * 100).toFixed(2)}%`);
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPaperAccount = async () => {
    try {
      const name = `Paper Account ${paperAccounts.length + 1}`;
      const account = await quantLabService.createPaperAccount('user123', name, 100000);
      setPaperAccounts([...paperAccounts, account]);
    } catch (error) {
      console.error('Error creating paper account:', error);
    }
  };

  if (loading && notebooks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading Quant Lab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quant Lab</h1>
          <p className="text-gray-600">Advanced research environment for quantitative analysis</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createNewNotebook} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Notebook
          </Button>
          <Button onClick={createPaperAccount} variant="outline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Paper Account
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notebooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notebooks" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Notebooks
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="paper-trading" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Paper Trading
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaboration
          </TabsTrigger>
        </TabsList>

        {/* Notebooks Tab */}
        <TabsContent value="notebooks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Notebook List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notebooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {notebooks.map((notebook) => (
                    <div
                      key={notebook.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentNotebook?.id === notebook.id 
                          ? 'bg-blue-50 border-blue-200 border' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentNotebook(notebook)}
                    >
                      <h4 className="font-medium">{notebook.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{notebook.description}</p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {notebook.language}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notebook.cells.length} cells
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {notebooks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No notebooks yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notebook Editor */}
            <div className="lg:col-span-3">
              {currentNotebook ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{currentNotebook.name}</CardTitle>
                      <p className="text-sm text-gray-600">{currentNotebook.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentNotebook.cells.map((cell, index) => (
                      <div key={cell.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {cell.type}
                          </Badge>
                          {cell.type === 'code' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => executeCell(cell.id)}
                              disabled={cell.isExecuting}
                              className="flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              {cell.isExecuting ? 'Running...' : 'Run'}
                            </Button>
                          )}
                        </div>
                        <div className="p-4">
                          {cell.type === 'code' ? (
                            <Textarea
                              value={cell.content}
                              onChange={(e) => updateCellContent(cell.id, e.target.value)}
                              className="font-mono text-sm"
                              rows={4}
                              placeholder="Enter your code here..."
                            />
                          ) : (
                            <Textarea
                              value={cell.content}
                              onChange={(e) => updateCellContent(cell.id, e.target.value)}
                              className="text-sm"
                              rows={3}
                              placeholder="Enter markdown content..."
                            />
                          )}
                          {cell.output && (
                            <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                              <pre className="text-sm">{JSON.stringify(cell.output, null, 2)}</pre>
                            </div>
                          )}
                          {cell.error && (
                            <div className="mt-4 p-3 bg-red-50 rounded border-l-4 border-red-500">
                              <p className="text-sm text-red-700">{cell.error}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Cell Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline" onClick={() => addNewCell('code')}>
                        + Code Cell
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addNewCell('markdown')}>
                        + Markdown Cell
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addNewCell('chart')}>
                        + Chart Cell
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Notebook Selected</h3>
                      <p className="text-gray-600 mb-4">Select a notebook from the list or create a new one to start your analysis.</p>
                      <Button onClick={createNewNotebook}>Create New Notebook</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                    <Badge variant={strategy.isActive ? "default" : "secondary"}>
                      {strategy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Language:</span>
                      <Badge variant="outline">{strategy.language}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Backtests:</span>
                      <span>{strategy.backtest_results?.length || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => runBacktest(strategy.id)}
                        disabled={loading}
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Backtest
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {strategies.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No strategies created yet</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Paper Trading Tab */}
        <TabsContent value="paper-trading" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paperAccounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Current Balance:</span>
                      <span className="font-medium">${account.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total P&L:</span>
                      <span className={`font-medium ${account.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${account.totalPnL.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Return:</span>
                      <span className={`font-medium ${account.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {account.totalReturn.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Positions:</span>
                      <span>{account.positions.length}</span>
                    </div>
                    <Separator />
                    <Button size="sm" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {paperAccounts.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No paper trading accounts created yet</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Collaboration Features</h3>
                <p className="text-gray-600 mb-4">Share notebooks, collaborate on strategies, and work together with your team.</p>
                <Button>
                  <Share className="w-4 h-4 mr-2" />
                  Start Collaboration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantLab;
