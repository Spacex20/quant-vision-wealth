
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { useState } from "react";

export const DCFCalculator = () => {
  const [inputs, setInputs] = useState({
    freeCashFlow: "1000000000",
    growthRate: "5",
    terminalGrowthRate: "2.5",
    discountRate: "10",
    sharesOutstanding: "1000000000",
  });

  const calculateDCF = () => {
    const fcf = parseFloat(inputs.freeCashFlow);
    const growthRate = parseFloat(inputs.growthRate) / 100;
    const terminalGrowthRate = parseFloat(inputs.terminalGrowthRate) / 100;
    const discountRate = parseFloat(inputs.discountRate) / 100;
    const shares = parseFloat(inputs.sharesOutstanding);

    // Simplified DCF calculation (5-year projection)
    let totalPV = 0;
    const projectionYears = 5;

    for (let year = 1; year <= projectionYears; year++) {
      const projectedFCF = fcf * Math.pow(1 + growthRate, year);
      const presentValue = projectedFCF / Math.pow(1 + discountRate, year);
      totalPV += presentValue;
    }

    // Terminal value
    const terminalFCF = fcf * Math.pow(1 + growthRate, projectionYears + 1);
    const terminalValue = (terminalFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
    const terminalPV = terminalValue / Math.pow(1 + discountRate, projectionYears);

    const enterpriseValue = totalPV + terminalPV;
    const intrinsicValue = enterpriseValue / shares;

    return {
      intrinsicValue: intrinsicValue.toFixed(2),
      enterpriseValue: (enterpriseValue / 1000000000).toFixed(2),
    };
  };

  const result = calculateDCF();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>DCF Model Inputs</span>
          </CardTitle>
          <CardDescription>Enter company financial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fcf">Free Cash Flow ($)</Label>
            <Input
              id="fcf"
              type="number"
              value={inputs.freeCashFlow}
              onChange={(e) => setInputs({ ...inputs, freeCashFlow: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="growth">Growth Rate (%)</Label>
            <Input
              id="growth"
              type="number"
              value={inputs.growthRate}
              onChange={(e) => setInputs({ ...inputs, growthRate: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="terminal">Terminal Growth Rate (%)</Label>
            <Input
              id="terminal"
              type="number"
              value={inputs.terminalGrowthRate}
              onChange={(e) => setInputs({ ...inputs, terminalGrowthRate: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="discount">Discount Rate (WACC) (%)</Label>
            <Input
              id="discount"
              type="number"
              value={inputs.discountRate}
              onChange={(e) => setInputs({ ...inputs, discountRate: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="shares">Shares Outstanding</Label>
            <Input
              id="shares"
              type="number"
              value={inputs.sharesOutstanding}
              onChange={(e) => setInputs({ ...inputs, sharesOutstanding: e.target.value })}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valuation Results</CardTitle>
          <CardDescription>Intrinsic value calculation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Intrinsic Value per Share</p>
              <p className="text-4xl font-bold text-green-600">${result.intrinsicValue}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Enterprise Value</p>
              <p className="text-2xl font-semibold">${result.enterpriseValue}B</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Market Price</span>
              <Badge variant="outline">$150.00</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Margin of Safety</span>
              <Badge variant="outline" className="text-green-600">
                {((parseFloat(result.intrinsicValue) - 150) / 150 * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Investment Recommendation</span>
              <Badge variant={parseFloat(result.intrinsicValue) > 150 ? "default" : "destructive"}>
                {parseFloat(result.intrinsicValue) > 150 ? "UNDERVALUED" : "OVERVALUED"}
              </Badge>
            </div>
          </div>

          <Button className="w-full">
            Save to Watchlist
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
