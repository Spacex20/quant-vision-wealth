
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Scaling, BrainCircuit } from 'lucide-react';
import { MPTOptimizer } from './mpt/MPTOptimizer';
import { RiskParityAllocator } from './mpt/RiskParityAllocator';
import { BlackLittermanModel } from './mpt/BlackLittermanModel';

export const MPTWorkspace = () => {
  const [activeTab, setActiveTab] = useState('optimizer');

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">MPT Workspace</h2>
        <p className="text-muted-foreground">
          Tools for modern portfolio theory, optimization, and advanced allocation strategies.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="optimizer" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            MPT Optimizer
          </TabsTrigger>
          <TabsTrigger value="risk-parity" className="flex items-center gap-2">
            <Scaling className="w-4 h-4" />
            Risk Parity
          </TabsTrigger>
          <TabsTrigger value="black-litterman" className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            Black-Litterman
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer">
          <MPTOptimizer />
        </TabsContent>
        <TabsContent value="risk-parity">
          <RiskParityAllocator />
        </TabsContent>
        <TabsContent value="black-litterman">
          <BlackLittermanModel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
