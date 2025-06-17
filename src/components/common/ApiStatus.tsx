
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { validateApiConfig } from '@/services/apiConfig';

export const ApiStatus = () => {
  const apiStatus = validateApiConfig();

  const getStatusIcon = (hasKey: boolean) => {
    return hasKey ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (hasKey: boolean) => {
    return (
      <Badge variant={hasKey ? 'default' : 'destructive'}>
        {hasKey ? 'Connected' : 'Missing'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>API Configuration Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(apiStatus.hasAlphaVantage)}
            <span>Alpha Vantage</span>
          </div>
          {getStatusBadge(apiStatus.hasAlphaVantage)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(apiStatus.hasFMP)}
            <span>Financial Modeling Prep</span>
          </div>
          {getStatusBadge(apiStatus.hasFMP)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(apiStatus.hasFinnhub)}
            <span>Finnhub</span>
          </div>
          {getStatusBadge(apiStatus.hasFinnhub)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(apiStatus.hasMarketAux)}
            <span>MarketAux</span>
          </div>
          {getStatusBadge(apiStatus.hasMarketAux)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(apiStatus.hasNewsAPI)}
            <span>NewsAPI</span>
          </div>
          {getStatusBadge(apiStatus.hasNewsAPI)}
        </div>

        {apiStatus.missingKeys.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Some API services are using demo keys. 
              Add production keys for full functionality.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
