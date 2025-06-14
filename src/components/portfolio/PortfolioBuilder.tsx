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

export const PortfolioBuilder = () => {
  const { user, profile, refreshProfile, updateProfile } = useAuth();
  const isLoggedIn = !!user;

  const [portfolioValue, setPortfolioValue] = useState(profile?.portfolio_value || "");
  const [riskLevel, setRiskLevel] = useState([profile?.risk_tolerance ? parseInt(profile.risk_tolerance) : 5]);
  const [timeHorizon, setTimeHorizon] = useState([profile?.time_horizon ? parseInt(profile.time_horizon) : 10]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Sync local state to profile when profile changes
    setPortfolioValue(profile?.portfolio_value || "");
    setRiskLevel([profile?.risk_tolerance ? parseInt(profile.risk_tolerance) : 5]);
    setTimeHorizon([profile?.time_horizon ? parseInt(profile.time_horizon) : 10]);
  }, [profile?.portfolio_value, profile?.risk_tolerance, profile?.time_horizon]);

  const handleSavePreferences = async () => {
    if (!isLoggedIn) return;
    setSaving(true);
    await updateProfile({
      portfolio_value: portfolioValue,
      risk_tolerance: riskLevel[0]?.toString(),
      time_horizon: timeHorizon[0]?.toString(),
    });
    await refreshProfile();
    setSaving(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="rounded-lg p-6 bg-white shadow flex flex-col items-center gap-5">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2">Smart Portfolio Builder</h2>
        <p className="text-muted-foreground text-center">
          {isLoggedIn
            ? "Personalize your portfolio with your own investment amount and preferences, just like Groww!"
            : "Sign in to personalize your portfolio. Default values are shown below."}
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (isLoggedIn) handleSavePreferences();
          }}
          className="w-full flex flex-col md:flex-row gap-4 items-center justify-between"
        >
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
              disabled={!isLoggedIn}
              placeholder="Enter amount (₹ / $)"
            />
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
          <InteractiveBuilder />
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

                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Optimal Portfolio
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
                      <Badge variant="outline">8.2% annually</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expected Volatility</span>
                      <Badge variant="outline">12.4% annually</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharpe Ratio</span>
                      <Badge variant="outline">1.42</Badge>
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
                    {[
                      { asset: "US Large Cap", allocation: 35, amount: 35000 },
                      { asset: "International Developed", allocation: 20, amount: 20000 },
                      { asset: "Emerging Markets", allocation: 10, amount: 10000 },
                      { asset: "Bonds", allocation: 25, amount: 25000 },
                      { asset: "REITs", allocation: 7, amount: 7000 },
                      { asset: "Commodities", allocation: 3, amount: 3000 },
                    ].map((item) => (
                      <div key={item.asset} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{item.asset}</span>
                          <div className="text-sm text-muted-foreground">${item.amount.toLocaleString()}</div>
                        </div>
                        <Badge>{item.allocation}%</Badge>
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
