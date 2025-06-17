
// API Configuration - Now using production Alpha Vantage key
export const API_CONFIG = {
  ALPHA_VANTAGE: 'LGMV7GX6J901QF06', // Your production Alpha Vantage API key
  FMP: 'demo', // Replace with Financial Modeling Prep API key when available
  FINNHUB: 'demo', // Replace with Finnhub API key when available
  MARKETAUX: 'demo', // Replace with MarketAux API key when available
  NEWS_API: 'demo' // Replace with NewsAPI key when available
};

// API Endpoints
export const API_ENDPOINTS = {
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FMP: 'https://financialmodelingprep.com/api/v3',
  FINNHUB: 'https://finnhub.io/api/v1',
  MARKETAUX: 'https://api.marketaux.com/v1',
  NEWS_API: 'https://newsapi.org/v2'
};

// Helper function to get API key with fallback
export const getApiKey = (service: keyof typeof API_CONFIG): string => {
  return API_CONFIG[service];
};

// Validation function to check if API keys are properly configured
export const validateApiConfig = () => {
  const missingKeys = Object.entries(API_CONFIG)
    .filter(([key, value]) => value === 'demo' || !value)
    .map(([key]) => key);
  
  if (missingKeys.length > 0) {
    console.warn('Missing production API keys for:', missingKeys.join(', '));
  }
  
  return {
    hasAlphaVantage: API_CONFIG.ALPHA_VANTAGE !== 'demo' && !!API_CONFIG.ALPHA_VANTAGE,
    hasFMP: API_CONFIG.FMP !== 'demo' && !!API_CONFIG.FMP,
    hasFinnhub: API_CONFIG.FINNHUB !== 'demo' && !!API_CONFIG.FINNHUB,
    hasMarketAux: API_CONFIG.MARKETAUX !== 'demo' && !!API_CONFIG.MARKETAUX,
    hasNewsAPI: API_CONFIG.NEWS_API !== 'demo' && !!API_CONFIG.NEWS_API,
    missingKeys
  };
};
