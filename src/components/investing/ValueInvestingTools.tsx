
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { DCFCalculator } from "./DCFCalculator";
import { ValueMetrics } from "./ValueMetrics";
import { useState } from "react";

export const ValueInvestingTools = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Value Investing Toolkit</h2>
        <p className="text-muted-foreground">
          Advanced tools for fundamental analysis and intrinsic value calculation
        </p>
      </div>

      <Tabs defaultValue="dcf" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dcf">DCF Calculator</TabsTrigger>
          <TabsTrigger value="metrics">Value Metrics</TabsTrigger>
          <TabsTrigger value="ddm">Dividend Model</TabsTrigger>
          <TabsTrigger value="benjamin-graham">Graham Formula</TabsTrigger>
        </TabsList>

        <TabsContent value="dcf" className="space-y-6">
          <DCFCalculator />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <ValueMetrics />
        </TabsContent>

        <TabsContent value="ddm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Dividend Discount Model
              </CardTitle>
              <CardDescription>Calculate stock value based on future dividends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-dividend">Current Annual Dividend ($)</Label>
                    <Input id="current-dividend" type="number" step="0.01" defaultValue="0.96" />
                  </div>
                  <div>
                    <Label htmlFor="dividend-growth">Expected Dividend Growth Rate (%)</Label>
                    <Input id="dividend-growth" type="number" step="0.1" defaultValue="5" />
                  </div>
                  <div>
                    <Label htmlFor="required-return">Required Rate of Return (%)</Label>
                    <Input id="required-return" type="number" step="0.1" defaultValue="10" />
                  </div>
                  <div>
                    <Label htmlFor="growth-years">High Growth Period (years)</Label>
                    <Input id="growth-years" type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label htmlFor="terminal-growth">Terminal Growth Rate (%)</Label>
                    <Input id="terminal-growth" type="number" step="0.1" defaultValue="3" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Fair Value per Share</p>
                    <p className="text-4xl font-bold text-green-600">$28.50</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current Market Price</span>
                      <span className="font-semibold">$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dividend Yield</span>
                      <span className="font-semibold">0.64%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Years to Payback</span>
                      <span className="font-semibold">156 years</span>
                    </div>
                  </div>
                  <Button className="w-full">Calculate DDM Value</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benjamin-graham" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Benjamin Graham Formula
              </CardTitle>
              <CardDescription>Classic value investing formula: V = EPS × (8.5 + 2g)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-eps">Current EPS ($)</Label>
                    <Input id="current-eps" type="number" step="0.01" defaultValue="6.15" />
                  </div>
                  <div>
                    <Label htmlFor="growth-rate">Expected Annual Growth Rate (%)</Label>
                    <Input id="growth-rate" type="number" step="0.1" defaultValue="8.5" />
                  </div>
                  <div>
                    <Label htmlFor="current-yield">Current AAA Bond Yield (%)</Label>
                    <Input id="current-yield" type="number" step="0.1" defaultValue="4.4" />
                  </div>
                  <div>
                    <Label htmlFor="base-yield">Base AAA Bond Yield (%)</Label>
                    <Input id="base-yield" type="number" step="0.1" defaultValue="4.4" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Graham Intrinsic Value</p>
                    <p className="text-4xl font-bold text-blue-600">$155.25</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Value (8.5 × EPS)</span>
                      <span className="font-semibold">$52.28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Premium</span>
                      <span className="font-semibold">$104.55</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bond Yield Adjustment</span>
                      <span className="font-semibold">×1.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin of Safety</span>
                      <span className="font-semibold text-green-600">3.5%</span>
                    </div>
                  </div>
                  <Button className="w-full">Calculate Graham Value</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
