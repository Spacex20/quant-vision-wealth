
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  FileText, 
  Download, 
  Search, 
  TrendingUp, 
  Target, 
  Settings,
  Lightbulb,
  BarChart3,
  Globe,
  Database,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap
} from "lucide-react";

interface ResearchQuery {
  query: string;
  character: string;
  examples: string[];
  adjustments: string;
  outputType: string;
  extras: string;
  timeframe: string;
  assetClasses: string[];
  riskLevel: number;
}

interface ResearchProgress {
  stage: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
}

const RESEARCH_STAGES: ResearchProgress[] = [
  { stage: "Query Analysis", progress: 0, status: 'pending' },
  { stage: "Data Collection", progress: 0, status: 'pending' },
  { stage: "Statistical Analysis", progress: 0, status: 'pending' },
  { stage: "Risk Assessment", progress: 0, status: 'pending' },
  { stage: "Report Generation", progress: 0, status: 'pending' },
  { stage: "PDF Creation", progress: 0, status: 'pending' }
];

const PRESET_CHARACTERS = [
  "Quantitative finance expert targeting institutional investors",
  "ESG investment specialist for sustainable funds",
  "Risk management analyst for hedge funds",
  "Portfolio optimization consultant",
  "Market research analyst for retail investors",
  "Regulatory compliance officer for financial institutions"
];

const ASSET_CLASSES = [
  "Equities", "Fixed Income", "Commodities", "Real Estate", 
  "Alternatives", "Cryptocurrencies", "Derivatives", "Cash"
];

export const ResearchCopilot = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchStages, setResearchStages] = useState<ResearchProgress[]>(RESEARCH_STAGES);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [activeTab, setActiveTab] = useState("query");
  
  const [query, setQuery] = useState<ResearchQuery>({
    query: "",
    character: PRESET_CHARACTERS[0],
    examples: [],
    adjustments: "",
    outputType: "Formal PDF report with data visualizations",
    extras: "Incorporate Sharpe ratio, max drawdown, and regulatory risk scores",
    timeframe: "2020-2025",
    assetClasses: ["Equities"],
    riskLevel: 5
  });

  const updateStage = (stageIndex: number, status: ResearchProgress['status'], progress: number, details?: string) => {
    setResearchStages(prev => prev.map((stage, index) => 
      index === stageIndex 
        ? { ...stage, status, progress, details }
        : stage
    ));
  };

  const simulateResearchProcess = async () => {
    const stages = [
      { name: "Query Analysis", duration: 2000, details: "Breaking down complex query using chain-of-thought reasoning" },
      { name: "Data Collection", duration: 4000, details: "Gathering real-time market data, news, and financial reports" },
      { name: "Statistical Analysis", duration: 5000, details: "Running quantitative models and risk calculations" },
      { name: "Risk Assessment", duration: 3000, details: "Evaluating portfolio risks and regulatory compliance" },
      { name: "Report Generation", duration: 4000, details: "Structuring findings with CREATE framework" },
      { name: "PDF Creation", duration: 2000, details: "Formatting document with charts and references" }
    ];

    for (let i = 0; i < stages.length; i++) {
      updateStage(i, 'active', 0, stages[i].details);
      
      // Simulate progress within each stage
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, stages[i].duration / 10));
        updateStage(i, 'active', progress, stages[i].details);
      }
      
      updateStage(i, 'completed', 100, `${stages[i].name} completed successfully`);
    }
  };

  const generateReport = async () => {
    if (!query.query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a research query to generate a report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setActiveTab("progress");
    
    // Reset stages
    setResearchStages(RESEARCH_STAGES.map(stage => ({ ...stage, status: 'pending', progress: 0 })));

    try {
      await simulateResearchProcess();
      
      // Generate mock report
      const mockReport = generateMockReport();
      setGeneratedReport(mockReport);
      setActiveTab("report");
      
      toast({
        title: "Report Generated",
        description: "Your comprehensive research report is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReport = () => {
    return `# Comprehensive Financial Research Report

## Executive Summary

**Query**: ${query.query}
**Generated**: ${new Date().toLocaleString()}
**Character**: ${query.character}

## Table of Contents

1. Introduction and Objectives
2. Methodology and Data Sources
3. Statistical Analysis and Findings
4. Risk Assessment
5. Recommendations and Insights
6. References and Appendices

## 1. Introduction and Objectives

This report provides a comprehensive analysis based on the research query: "${query.query}". The analysis targets ${query.character.toLowerCase()} with a focus on ${query.timeframe} timeframe.

### Key Objectives:
- Conduct deep quantitative analysis using statistical rigor
- Integrate real-time market data and third-party sources
- Apply CREATE framework for structured insights
- Generate actionable recommendations with risk assessments

## 2. Methodology and Data Sources

### Data Sources:
- Real-time market data from Yahoo Finance API
- Economic indicators from FRED database
- Corporate financial statements and SEC filings
- ESG ratings and sustainability metrics
- Regulatory filings and compliance data

### Analytical Methods:
- Monte Carlo simulations for risk modeling
- Portfolio optimization using Modern Portfolio Theory
- Factor analysis and regression modeling
- Stress testing and scenario analysis

## 3. Statistical Analysis and Findings

### Portfolio Metrics:
- **Sharpe Ratio**: 1.24 (Above benchmark of 1.0)
- **Maximum Drawdown**: -8.7% (Within acceptable risk tolerance)
- **Volatility**: 12.3% annualized
- **Beta**: 0.89 (Lower systematic risk than market)

### Key Findings:
1. **Risk-Adjusted Returns**: Portfolio demonstrates superior risk-adjusted performance
2. **Diversification Benefits**: Asset allocation shows effective risk reduction
3. **Market Correlation**: Low correlation with major indices indicates good diversification

## 4. Risk Assessment

### Risk Factors Identified:
- **Market Risk**: Medium exposure to systematic market movements
- **Credit Risk**: Low exposure through high-grade fixed income allocation
- **Liquidity Risk**: Minimal due to liquid asset selection
- **Regulatory Risk**: Low impact from current regulatory environment

### Risk Mitigation Strategies:
- Implement dynamic hedging strategies
- Regular portfolio rebalancing (quarterly)
- Stress testing under various market scenarios

## 5. Recommendations and Insights

### Strategic Recommendations:
1. **Maintain Current Allocation**: Current asset mix demonstrates optimal risk-return profile
2. **Increase ESG Exposure**: Consider 5-10% allocation to sustainable investments
3. **Monitor Interest Rate Risk**: Implement duration hedging for fixed income positions
4. **Regular Rebalancing**: Quarterly rebalancing to maintain target allocations

### Tactical Adjustments:
- Consider reducing equity exposure by 2-3% in current market environment
- Increase allocation to defensive sectors (utilities, consumer staples)
- Monitor geopolitical risks and adjust accordingly

## 6. References and Data Sources

1. Federal Reserve Economic Data (FRED) - Economic indicators
2. Yahoo Finance API - Real-time market data
3. SEC EDGAR Database - Corporate filings
4. MSCI ESG Research - Sustainability ratings
5. Bloomberg Terminal - Professional market data

## Appendices

### Appendix A: Statistical Models
- Portfolio optimization code and parameters
- Risk model specifications
- Backtesting results and validation

### Appendix B: Data Tables
- Asset performance metrics
- Correlation matrices
- Risk decomposition analysis

---

*This report was generated using advanced AI research capabilities with real-time data integration and statistical analysis. All recommendations should be considered in the context of individual investment objectives and risk tolerance.*
`;
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    
    const blob = new Blob([generatedReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your research report has been downloaded as a Markdown file.",
    });
  };

  const getStageIcon = (status: ResearchProgress['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active': return <Zap className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Research Copilot
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate comprehensive PDF reports with advanced financial analysis
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Real-time Data
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Statistical Analysis
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Risk Assessment
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <Card className="border-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="border-b">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="query" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Query Setup
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Report
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            <TabsContent value="query" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="research-query" className="text-lg font-semibold">
                    Research Query
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter your research question or analysis request. Be specific about what you want to analyze.
                  </p>
                  <Textarea
                    id="research-query"
                    placeholder="e.g., Analyze ESG portfolio risks in emerging markets for Q4 2024, focusing on renewable energy sector performance and regulatory impact..."
                    value={query.query}
                    onChange={(e) => setQuery(prev => ({ ...prev, query: e.target.value }))}
                    rows={4}
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Character/Perspective</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose the analytical perspective for your report.
                  </p>
                  <Select value={query.character} onValueChange={(value) => setQuery(prev => ({ ...prev, character: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_CHARACTERS.map((character) => (
                        <SelectItem key={character} value={character}>
                          {character}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adjustments" className="text-base font-semibold">
                    Constraints & Adjustments
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Specify any constraints, exclusions, or special requirements.
                  </p>
                  <Textarea
                    id="adjustments"
                    placeholder="e.g., Exclude crypto assets; focus on 2020–2025; minimum market cap $1B..."
                    value={query.adjustments}
                    onChange={(e) => setQuery(prev => ({ ...prev, adjustments: e.target.value }))}
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Time Horizon</Label>
                    <Input
                      value={query.timeframe}
                      onChange={(e) => setQuery(prev => ({ ...prev, timeframe: e.target.value }))}
                      placeholder="e.g., 2020-2025"
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Risk Level (1-10)</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={query.riskLevel}
                        onChange={(e) => setQuery(prev => ({ ...prev, riskLevel: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <Badge variant="outline" className="min-w-12">
                        {query.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Output Type</Label>
                    <Select value={query.outputType} onValueChange={(value) => setQuery(prev => ({ ...prev, outputType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Formal PDF report with data visualizations">Formal PDF Report</SelectItem>
                        <SelectItem value="Executive summary with key insights">Executive Summary</SelectItem>
                        <SelectItem value="Technical analysis with code">Technical Analysis</SelectItem>
                        <SelectItem value="Risk assessment report">Risk Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Additional Metrics</Label>
                    <Textarea
                      value={query.extras}
                      onChange={(e) => setQuery(prev => ({ ...prev, extras: e.target.value }))}
                      placeholder="e.g., Include Sharpe ratio, max drawdown, VaR analysis..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Asset Classes</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {ASSET_CLASSES.map((asset) => (
                        <label key={asset} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={query.assetClasses.includes(asset)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setQuery(prev => ({ ...prev, assetClasses: [...prev.assetClasses, asset] }));
                              } else {
                                setQuery(prev => ({ ...prev, assetClasses: prev.assetClasses.filter(a => a !== asset) }));
                              }
                            }}
                          />
                          <span className="text-sm">{asset}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {isGenerating ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="font-semibold text-blue-900">Generating Research Report...</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {researchStages.map((stage, index) => (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStageIcon(stage.status)}
                            <span className="font-medium">{stage.stage}</span>
                          </div>
                          <Badge variant={stage.status === 'completed' ? 'default' : 'secondary'}>
                            {stage.progress}%
                          </Badge>
                        </div>
                        <Progress value={stage.progress} className="h-2" />
                        {stage.details && (
                          <p className="text-sm text-muted-foreground ml-8">{stage.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Generate Report</h3>
                  <p className="text-muted-foreground mb-6">
                    Click the button below to start the AI-powered research process.
                  </p>
                  <Button size="lg" onClick={generateReport} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Generate Research Report
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              {generatedReport ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Generated Report</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Download MD
                      </Button>
                      <Button onClick={downloadReport}>
                        <FileText className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="border-dashed">
                    <CardContent className="p-6">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                          {generatedReport}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Report Generated</h3>
                  <p className="text-muted-foreground">
                    Generate a research report to view it here.
                  </p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};
