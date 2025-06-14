import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { InteractiveBuilder } from "./InteractiveBuilder";
import { Calculator, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { portfolioManager } from "@/services/portfolioManager";
import { portfolioOptimization, OptimizationResult, OptimizationConstraints } from "@/services/portfolioOptimization";
import { toast } from "sonner";

const TEMPLATES = portfolioManager.getDefaultPortfolios();
const ASSETS_FOR_OPTIMIZATION = [
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', allocation: 20, expectedReturn: 0.10, volatility: 0.18 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', allocation: 20, expectedReturn: 0.18, volatility: 0.28 },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', allocation: 20, expectedReturn: 0.07, volatility: 0.15 },
    { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', allocation: 20, expectedReturn: 0.09, volatility: 0.22 },
    { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: 20, expectedReturn: 0.03, volatility: 0.05 },
];


export const PortfolioBuilder = () => {
  const { user, profile, refreshProfile, updateProfile } = useAuth();
  const isLoggedIn = !!user;

  // Selected template for starting configuration
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0]?.id || "");
  const [portfolioValue, setPortfolioValue] = useState(TEMPLATES[0].totalValue.toString());
  const [riskLevel, setRiskLevel] = useState([
    profile?.risk_tolerance ? parseInt(profile.risk_tolerance) : 5
  ]);
  const [timeHorizon, setTimeHorizon] = useState([
    profile?.time_horizon ? parseInt(profile.time_horizon) : 10
  ]);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<OptimizationResult | null>(null);

  // Set initial state to match selected template on mount or when template is changed
  useEffect(() => {
    const template = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (template) {
      setPortfolioValue(template.totalValue.toString());
    }
  }, [selectedTemplateId]);

  useEffect(() => {
    setRiskLevel([profile?.risk_tolerance ? parseInt(profile.risk_tolerance) : 5]);
    setTimeHorizon([profile?.time_horizon ? parseInt(profile.time_horizon) : 10]);
  }, [profile?.risk_tolerance, profile?.time_horizon]);

  const handleSavePreferences = async () => {
    if (!isLoggedIn) return;
    setSaving(true);
    await updateProfile({
      risk_tolerance: riskLevel[0]?.toString(),
      time_horizon: timeHorizon[0]?.toString(),
    });
    await refreshProfile();
    setSaving(false);
  };

  const handleGeneratePortfolio = () => {
    setOptimizing(true);
    // Map risk level (1-10) to max risk (e.g., 8% - 25% volatility)
    const maxRisk = 0.08 + (riskLevel[0] / 10) * 0.17;
    
    const constraints: OptimizationConstraints = {
      minAllocation: 0,
      maxAllocation: 50, // Max 50% in any single asset
      maxAssets: 10,
      maxRisk: maxRisk,
    };
  
    // Simulate async optimization
    setTimeout(() => {
      const result = portfolioOptimization.optimizePortfolio(ASSETS_FOR_OPTIMIZATION, constraints);
      setOptimizedPortfolio(result);
      setOptimizing(false);
      toast.success("Portfolio Optimized!", {
        description: "AI-Recommended allocation has been updated based on your risk profile.",
      });
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="rounded-lg p-6 bg-white shadow flex flex-col items-center gap-5">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2">Smart Portfolio Builder</h2>
        <p className="text-muted-foreground text-center">
          {isLoggedIn
            ? "Personalize your portfolio with your own investment amount and preferences, just like Groww!"
            : "Sign in to personalize your portfolio or start with one of our optimized templates below."}
        </p>
        {/* Template selection UI */}
        <form
          onSubmit={e => {
            e.preventDefault();
            if (isLoggedIn) handleSavePreferences();
          }}
          className="w-full flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label htmlFor="template-select">Start from a template</Label>
            <select
              id="template-select"
              className="rounded-md border px-3 py-2 font-semibold"
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
            >
              {TEMPLATES.map(template => (
                <option value={template.id} key={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label htmlFor="portfolio-value">Portfolio Value</Label>
            <Input
              id="portfolio-value"
              type="number"
              min={0}
              step={100}
              className="rounded-md border px-3 py-2 text-lg font-semibold"
              value={portfolioValue}
              onChange={e => setPortfolioValue(e.target.value)}
              placeholder="Enter amount (₹ / $)"
            />
            <span className="text-xs text-muted-foreground">
              <strong>Note:</strong> This amount is not saved to your profile (demo only)
            </span>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label>Risk</Label>
            <Slider
              value={riskLevel}
              onValueChange={isLoggedIn ? setRiskLevel : () => {}}
              max={10}
              min={1}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span className="font-bold">{riskLevel[0]}/10</span>
              <span>Aggressive</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label>Time Horizon</Label>
            <Slider
              value={timeHorizon}
              onValueChange={isLoggedIn ? setTimeHorizon : () => {}}
              max={30}
              min={1}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 year</span>
              <span className="font-bold">{timeHorizon[0]} yr</span>
              <span>30+ yrs</span>
            </div>
          </div>
          {isLoggedIn && (
            <Button type="submit" className="self-end" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
        </form>
        {/* Template Details below selector */}
        <div className="w-full mt-2">
          {(() => {
            const tpl = TEMPLATES.find(t => t.id === selectedTemplateId);
            if (!tpl) return null;
            return (
              <Card className="mt-3 shadow-sm border-2 border-indigo-100">
                <CardHeader>
                  <CardTitle>{tpl.name}</CardTitle>
                  <CardDescription>{tpl.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tpl.assets.map(asset => (
                      <div key={asset.symbol} className="flex justify-between text-sm">
                        <span className="font-medium">{asset.name} ({asset.symbol})</span>
                        <Badge>{asset.allocation}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>

      <Tabs defaultValue="interactive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interactive" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Interactive Builder</span>
          </TabsTrigger>
          <TabsTrigger value="classic" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Classic Builder</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interactive" className="space-y-6">
          {/* Pass template to InteractiveBuilder for editable starting point */}
          <InteractiveBuilder
            initialAssets={
              TEMPLATES.find(t => t.id === selectedTemplateId)?.assets.map(a => ({
                symbol: a.symbol,
                name: a.name,
                allocation: a.allocation,
                price: 0,
                change: 0,
                changePercent: 0
              })) || []
            }
            initialValue={Number(portfolioValue) || 
              TEMPLATES.find(t => t.id === selectedTemplateId)?.totalValue || 0
            }
          />
        </TabsContent>
        <TabsContent value="classic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Portfolio Configuration</span>
                  </CardTitle>
                  <CardDescription>Define your investment parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="portfolio-value">Initial Portfolio Value</Label>
                    <Input
                      id="portfolio-value"
                      type="number"
                      value={portfolioValue}
                      onChange={(e) => setPortfolioValue(e.target.value)}
                      placeholder="Enter your portfolio value (e.g., 50000)"
                      className="mt-1"
                      min={0}
                    />
                    <span className="text-xs text-muted-foreground">
                      <strong>Note:</strong> This amount is not saved to your profile (demo only)
                    </span>
                  </div>

                  <div>
                    <Label>Risk Tolerance: {riskLevel[0]}/10</Label>
                    <div className="mt-2">
                      <Slider
                        value={riskLevel}
                        onValueChange={setRiskLevel}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Conservative</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Time Horizon: {timeHorizon[0]} years</Label>
                    <div className="mt-2">
                      <Slider
                        value={timeHorizon}
                        onValueChange={setTimeHorizon}
                        max={30}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 year</span>
                        <span>30+ years</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleGeneratePortfolio} disabled={optimizing}>
                    <Zap className="h-4 w-4 mr-2" />
                    {optimizing ? 'Optimizing...' : 'Generate Optimal Portfolio'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modern Portfolio Theory</CardTitle>
                  <CardDescription>Efficient frontier optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expected Return</span>
                      <Badge variant="outline">
                        {((optimizedPortfolio?.expectedReturn || 0.082) * 100).toFixed(1)}% annually
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expected Volatility</span>
                      <Badge variant="outline">
                         {((optimizedPortfolio?.expectedRisk || 0.124) * 100).toFixed(1)}% annually
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharpe Ratio</span>
                      <Badge variant="outline">
                        {(optimizedPortfolio?.sharpeRatio || 1.42).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Recommended Allocation</CardTitle>
                  <CardDescription>Optimized for your risk profile</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {(optimizedPortfolio?.assets || [
                      { asset: "US Large Cap", name: "US Large Cap", symbol: 'LC', allocation: 35, amount: 35000 },
                      { asset: "International Developed", name: 'International Developed', symbol: 'ID', allocation: 20, amount: 20000 },
                      { asset: "Emerging Markets", name: 'Emerging Markets', symbol: 'EM', allocation: 10, amount: 10000 },
                      { asset: "Bonds", name: 'Bonds', symbol: 'BND', allocation: 25, amount: 25000 },
                      { asset: "REITs", name: 'REITs', symbol: 'REIT', allocation: 7, amount: 7000 },
                      { asset: "Commodities", name: 'Commodities', symbol: 'CMD', allocation: 3, amount: 3000 },
                    ]).map((item) => (
                      <div key={item.symbol} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-muted-foreground">${((item.allocation / 100) * Number(portfolioValue)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                        </div>
                        <Badge>{item.allocation.toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategy Templates</CardTitle>
                  <CardDescription>Pre-built quantitative strategies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "All Weather", description: "Ray Dalio's risk parity approach" },
                    { name: "Minimum Volatility", description: "Low-risk equity portfolio" },
                    { name: "Value Tilt", description: "Factor-based value investing" },
                    { name: "Momentum", description: "Trend-following strategy" },
                  ].map((strategy) => (
                    <Button key={strategy.name} variant="outline" className="w-full justify-start">
                      <div className="text-left">
                        <div className="font-medium">{strategy.name}</div>
                        <div className="text-xs text-muted-foreground">{strategy.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
