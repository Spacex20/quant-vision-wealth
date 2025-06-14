
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Plus, 
  Save, 
  Download,
  Upload,
  Code2,
  LineChart,
  Calculator,
  Database,
  Settings,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { quantLabService, ResearchNotebook, NotebookCell } from '@/services/quantLabService';

interface QuantLabWorkspaceProps {
  currentNotebook: ResearchNotebook;
  onNotebookUpdate: (notebook: ResearchNotebook) => void;
}

export function QuantLabWorkspace({ currentNotebook, onNotebookUpdate }: QuantLabWorkspaceProps) {
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [variables, setVariables] = useState<Record<string, any>>({});

  const executeCell = async (cellId: string) => {
    try {
      const result = await quantLabService.executeCell(currentNotebook.id, cellId);
      setExecutionOutput(result);
      
      // Update the notebook with execution results
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        onNotebookUpdate(updatedNotebook);
      }
    } catch (error) {
      console.error('Error executing cell:', error);
    }
  };

  const addNewCell = async (type: NotebookCell['type']) => {
    try {
      await quantLabService.addCell(currentNotebook.id, type);
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        onNotebookUpdate(updatedNotebook);
      }
    } catch (error) {
      console.error('Error adding cell:', error);
    }
  };

  const updateCellContent = async (cellId: string, content: string) => {
    try {
      await quantLabService.updateCell(currentNotebook.id, cellId, { content });
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        onNotebookUpdate(updatedNotebook);
      }
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const deleteCell = async (cellId: string) => {
    try {
      await quantLabService.deleteCell(currentNotebook.id, cellId);
      const updatedNotebook = await quantLabService.getNotebook(currentNotebook.id);
      if (updatedNotebook) {
        onNotebookUpdate(updatedNotebook);
      }
    } catch (error) {
      console.error('Error deleting cell:', error);
    }
  };

  const exportNotebook = () => {
    const notebookData = JSON.stringify(currentNotebook, null, 2);
    const blob = new Blob([notebookData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNotebook.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Main Editor */}
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                {currentNotebook.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{currentNotebook.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportNotebook}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentNotebook.cells.map((cell, index) => (
              <div 
                key={cell.id} 
                className={`border rounded-lg overflow-hidden ${
                  selectedCellId === cell.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCellId(cell.id)}
              >
                <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {cell.type}
                    </Badge>
                    {cell.executionCount && (
                      <Badge variant="secondary" className="text-xs">
                        [{cell.executionCount}]
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {cell.type === 'code' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          executeCell(cell.id);
                        }}
                        disabled={cell.isExecuting}
                        className="flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        {cell.isExecuting ? 'Running...' : 'Run'}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCell(cell.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  {cell.type === 'code' ? (
                    <Textarea
                      value={cell.content}
                      onChange={(e) => updateCellContent(cell.id, e.target.value)}
                      className="font-mono text-sm min-h-[100px] resize-none"
                      placeholder="// Enter your quantitative analysis code here
// Available libraries: marketData, portfolio, analytics
// Example:
const data = await marketData.getQuote('AAPL');
console.log(data);"
                    />
                  ) : cell.type === 'data' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={cell.content}
                        onChange={(e) => updateCellContent(cell.id, e.target.value)}
                        className="text-sm min-h-[80px]"
                        placeholder="// Data source configuration
// Example: data = loadCSV('data.csv')"
                      />
                    </div>
                  ) : cell.type === 'chart' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={cell.content}
                        onChange={(e) => updateCellContent(cell.id, e.target.value)}
                        className="text-sm min-h-[80px]"
                        placeholder="// Chart configuration
// Example: chart({ type: 'line', data: portfolio.returns, title: 'Returns' })"
                      />
                    </div>
                  ) : (
                    <Textarea
                      value={cell.content}
                      onChange={(e) => updateCellContent(cell.id, e.target.value)}
                      className="text-sm min-h-[80px]"
                      placeholder="# Markdown content
Add your analysis notes, explanations, and documentation here."
                    />
                  )}
                  
                  {cell.output && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Output</span>
                      </div>
                      <pre className="text-sm overflow-auto max-h-48">
                        {typeof cell.output === 'object' 
                          ? JSON.stringify(cell.output, null, 2)
                          : cell.output
                        }
                      </pre>
                    </div>
                  )}
                  
                  {cell.error && (
                    <div className="mt-4 p-3 bg-red-50 rounded border-l-4 border-red-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-red-700">Error</span>
                      </div>
                      <p className="text-sm text-red-700">{cell.error}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Cell Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button size="sm" variant="outline" onClick={() => addNewCell('code')}>
                <Code2 className="w-4 h-4 mr-2" />
                Code
              </Button>
              <Button size="sm" variant="outline" onClick={() => addNewCell('markdown')}>
                <FileText className="w-4 h-4 mr-2" />
                Markdown
              </Button>
              <Button size="sm" variant="outline" onClick={() => addNewCell('data')}>
                <Database className="w-4 h-4 mr-2" />
                Data
              </Button>
              <Button size="sm" variant="outline" onClick={() => addNewCell('chart')}>
                <LineChart className="w-4 h-4 mr-2" />
                Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Tabs defaultValue="variables" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="variables">Vars</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="variables">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="font-mono text-blue-600">{key}</div>
                    <div className="text-gray-600 truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>
                  </div>
                ))}
                {Object.keys(variables).length === 0 && (
                  <p className="text-xs text-gray-500">No variables defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Market Data
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Portfolio Data
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Economic Data
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tools">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Analysis Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Calculator className="w-4 h-4 mr-2" />
                  Risk Calculator
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <LineChart className="w-4 h-4 mr-2" />
                  Correlation Matrix
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Backtest Engine
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Optimization
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full" onClick={() => addNewCell('code')}>
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
            <Button size="sm" variant="outline" className="w-full" onClick={exportNotebook}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
