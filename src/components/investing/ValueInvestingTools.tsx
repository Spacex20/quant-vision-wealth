
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp } from "lucide-react";
import { DCFCalculator } from "./DCFCalculator";
import { ValueMetrics } from "./ValueMetrics";

export const ValueInvestingTools = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Value Investing Toolkit</h2>
        <p className="text-muted-foreground">
          Advanced tools for fundamental analysis and intrinsic value calculation
        </p>
      </div>

      <Tabs defaultValue="dcf" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dcf">DCF Calculator</TabsTrigger>
          <TabsTrigger value="metrics">Value Metrics</TabsTrigger>
          <TabsTrigger value="screener">Stock Screener</TabsTrigger>
        </TabsList>

        <TabsContent value="dcf" className="space-y-6">
          <DCFCalculator />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <ValueMetrics />
        </TabsContent>

        <TabsContent value="screener" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Value Stock Screener</CardTitle>
              <CardDescription>Find undervalued opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Stock screening functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
