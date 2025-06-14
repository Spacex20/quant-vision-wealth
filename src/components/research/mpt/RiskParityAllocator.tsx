
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scaling } from 'lucide-react';

export const RiskParityAllocator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scaling className="w-5 h-5" />
          Risk Parity Allocator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-muted-foreground">
            This feature is under construction.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This tool will help you build portfolios where each asset contributes equally to the total risk.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
