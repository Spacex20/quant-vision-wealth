
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export const BlackLittermanModel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          Black-Litterman Model
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-muted-foreground">
            This feature is under construction.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This tool will allow you to combine market equilibrium returns with your own views to create a custom-tailored portfolio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
