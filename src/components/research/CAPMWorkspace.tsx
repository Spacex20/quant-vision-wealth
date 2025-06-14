
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calculator, BarChart3, Target, PieChart, Activity } from 'lucide-react';
import { BetaCalculator } from './capm/BetaCalculator';
import { ExpectedReturnCalculator } from './capm/ExpectedReturnCalculator';
import { SMLVisualizer } from './capm/SMLVisualizer';
import { AlphaTracker } from './capm/AlphaTracker';
import { RiskDecomposition } from './capm/RiskDecomposition';
import { PortfolioCAPM } from './capm/PortfolioCAPM';

export const CAPMWorkspace = () => {
  const [activeTab, setActiveTab] = useState('beta');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">CAPM Workspace</h2>
        <p className="text-muted-foreground">
          Capital Asset Pricing Model tools for risk-return analysis and portfolio optimization
        </p>
      </div>

      {/* CAPM Formula Display */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            CAPM Formula
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg inline-block">
              E(R<sub>i</sub>) = R<sub>f</sub> + β<sub>i</sub> × (E(R<sub>m</sub>) - R<sub>f</sub>)
            </div>
            <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <strong>E(R<sub>i</sub>)</strong><br />
                Expected Return
              </div>
              <div>
                <strong>R<sub>f</sub></strong><br />
                Risk-Free Rate
              </div>
              <div>
                <strong>β<sub>i</sub></strong><br />
                Beta (Systematic Risk)
              </div>
              <div>
                <strong>E(R<sub>m</sub>)</strong><br />
                Expected Market Return
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="beta" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Beta Calculator
          </TabsTrigger>
          <TabsTrigger value="expected-return" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Expected Return
          </TabsTrigger>
          <TabsTrigger value="sml" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            SML Chart
          </TabsTrigger>
          <TabsTrigger value="alpha" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Alpha Tracker
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Portfolio CAPM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="beta" className="space-y-4">
          <BetaCalculator />
        </TabsContent>

        <TabsContent value="expected-return" className="space-y-4">
          <ExpectedReturnCalculator />
        </TabsContent>

        <TabsContent value="sml" className="space-y-4">
          <SMLVisualizer />
        </TabsContent>

        <TabsContent value="alpha" className="space-y-4">
          <AlphaTracker />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskDecomposition />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <PortfolioCAPM />
        </TabsContent>
      </Tabs>
    </div>
  );
};
