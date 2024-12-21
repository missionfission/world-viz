import { TradeData, CountryConnection } from '../types/TradeData';
import * as d3 from 'd3';
import { countryCoordinates } from '../data/countryCoordinates';

interface WITSDataRow {
  Reporter: string;
  Year: string;
  Partner: string;
  'Product categories': string;
  'Indicator Type': string;
  Indicator: string;
  'Indicator Value': string;
}

export class TradeDataService {
  private static instance: TradeDataService;
  private tradeData: Map<number, TradeData[]> = new Map();
  private connections: Map<number, CountryConnection[]> = new Map();

  private constructor() {}

  public static getInstance(): TradeDataService {
    if (!TradeDataService.instance) {
      TradeDataService.instance = new TradeDataService();
    }
    return TradeDataService.instance;
  }

  public async loadTradeData(year: number): Promise<TradeData[]> {
    if (this.tradeData.has(year)) {
      return this.tradeData.get(year)!;
    }

    try {
      const countryData = new Map<string, TradeData>();
      
      // Load CSV data for each country
      const response = await fetch(`/wits_en_at-a-glance_allcountries_allyears/en_ABW_At-a-Glance.csv`);
      const csvText = await response.text();
      const rows = d3.csvParse(csvText) as WITSDataRow[];
      
      // Filter rows for the specified year
      const yearData = rows.filter(row => Number(row.Year) === year);
      
      // Process the data
      const exports = yearData.find(row => 
        row['Indicator Type'] === 'Export' && 
        row.Partner === 'World' && 
        row['Product categories'] === 'All Products' &&
        row.Indicator === 'Exports (in US$ Mil)'
      );

      const imports = yearData.find(row => 
        row['Indicator Type'] === 'Import' && 
        row.Partner === 'World' && 
        row['Product categories'] === 'All Products' &&
        row.Indicator === 'Imports (in US$ Mil)'
      );

      if (exports && imports) {
        const countryCode = 'ABW'; // For now, just using Aruba as an example
        const coordinates = countryCoordinates[countryCode] || { latitude: 0, longitude: 0 };
        
        countryData.set(countryCode, {
          country: yearData[0].Reporter,
          countryCode: countryCode,
          year: year,
          exports: Number(exports['Indicator Value']) * 1e6,
          imports: Number(imports['Indicator Value']) * 1e6,
          tradeBalance: (Number(exports['Indicator Value']) - Number(imports['Indicator Value'])) * 1e6,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        });
      }

      const processedData = Array.from(countryData.values());
      this.tradeData.set(year, processedData);
      return processedData;

    } catch (error) {
      console.error('Error loading trade data:', error);
      return [];
    }
  }

  public async getTradeConnections(year: number): Promise<CountryConnection[]> {
    if (this.connections.has(year)) {
      return this.connections.get(year)!;
    }

    try {
      const connections: CountryConnection[] = [];
      
      // Load CSV data
      const response = await fetch(`/wits_en_at-a-glance_allcountries_allyears/en_ABW_At-a-Glance.csv`);
      const csvText = await response.text();
      const rows = d3.csvParse(csvText) as WITSDataRow[];
      
      // Filter for trade partners
      const tradePartners = rows.filter(row => 
        Number(row.Year) === year &&
        row.Partner !== 'World' &&
        row['Product categories'] === 'All Products' &&
        (row.Indicator.includes('Trade (US$ Mil)-Top 5 Export Partner') ||
         row.Indicator.includes('Trade (US$ Mil)-Top 5 Import Partner'))
      );

      tradePartners.forEach(row => {
        if (row.Partner !== 'Unspecified') {
          connections.push({
            source: 'ABW',
            target: row.Partner,
            value: Number(row['Indicator Value']) * 1e6,
            type: row.Indicator.includes('Export') ? 'export' : 'import'
          });
        }
      });

      this.connections.set(year, connections);
      return connections;

    } catch (error) {
      console.error('Error loading trade connections:', error);
      return [];
    }
  }
}

export default TradeDataService; 