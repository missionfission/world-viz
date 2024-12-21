export interface TradeData {
  country: string;
  countryCode: string;
  year: number;
  exports: number;
  imports: number;
  tradeBalance: number;
  gdp?: number;
  population?: number;
  longitude: number;
  latitude: number;
}

export interface CountryConnection {
  source: string;
  target: string;
  value: number;
  type: 'export' | 'import';
} 