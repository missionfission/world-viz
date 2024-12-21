export interface ManufacturingData {
  countryCode: string;
  production: number;
  year: number;
  sector: string;
}

export interface LogisticsData {
  origin: string;
  destination: string;
  volume: number;
  type: string;
  year: number;
}

export interface CountryData {
  code: string;
  name: string;
  coordinates: [number, number];
}
