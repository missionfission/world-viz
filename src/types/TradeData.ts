export interface TradeData {
  country: string;
  countryCode: string;
  year: number;
  exports: number;
  imports: number;
  tradeBalance: number;
  latitude: number;
  longitude: number;
  topPartners?: {
    exports: Partner[];
    imports: Partner[];
  };
}

export interface Partner {
  partner: string;
  value: number;
}

export type TradeType = "export" | "import";

export interface CountryConnection {
  source: string;
  target: string;
  value: number;
  type: TradeType;
} 