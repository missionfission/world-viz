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

  // List of all country codes from the data folder
  private readonly countryCodes = [
    'ABW', 'AFG', 'AGO', 'AIA', 'ALB', 'AND', 'ANT', 'ARE', 'ARG', 'ARM',
    'ATG', 'AUS', 'AUT', 'AZE', 'BDI', 'BEL', 'BEN', 'BFA', 'BGD', 'BGR',
    'BHR', 'BHS', 'BIH', 'BLR', 'BLX', 'BLZ', 'BMU', 'BOL', 'BRA', 'BRB',
    'BRN', 'BTN', 'BWA', 'CAF', 'CAN', 'CHE', 'CHL', 'CHN', 'CIV', 'CMR',
    'COG', 'COK', 'COL', 'COM', 'CPV', 'CRI', 'CUB', 'CYM', 'CYP', 'CZE',
    'DEU', 'DJI', 'DMA', 'DNK', 'DOM', 'DZA', 'ECU', 'EGY', 'ERI', 'ESP',
    'EST', 'ETH', 'FIN', 'FJI', 'FRA', 'FRO', 'FSM', 'GAB', 'GBR', 'GEO',
    'GHA', 'GIN', 'GLP', 'GMB', 'GNB', 'GRC', 'GRD', 'GRL', 'GTM', 'GUF',
    'GUY', 'HKG', 'HND', 'HRV', 'HUN', 'IDN', 'IND', 'IRL', 'IRN', 'IRQ',
    'ISL', 'ISR', 'ITA', 'JAM', 'JOR', 'JPN', 'KAZ', 'KEN', 'KGZ', 'KHM',
    'KIR', 'KNA', 'KOR', 'KWT', 'LBN', 'LBY', 'LCA', 'LKA', 'LSO', 'LTU',
    'LUX', 'LVA', 'MAC', 'MAR', 'MDA', 'MDG', 'MDV', 'MEX', 'MKD', 'MLI',
    'MLT', 'MMR', 'MNG', 'MOZ', 'MRT', 'MSR', 'MTQ', 'MUS', 'MWI', 'MYS',
    'MYT', 'NAM', 'NCL', 'NER', 'NGA', 'NIC', 'NLD', 'NOR', 'NPL', 'NZL',
    'OMN', 'PAK', 'PAN', 'PER', 'PHL', 'PLW', 'PNG', 'POL', 'PRT', 'PRY',
    'PSE', 'PYF', 'QAT', 'REU', 'ROM', 'RUS', 'RWA', 'SAU', 'SDN', 'SEN',
    'SER', 'SGP', 'SLB', 'SLE', 'SLV', 'STP', 'SUR', 'SVK', 'SVN', 'SWE',
    'SWZ', 'SYC', 'SYR', 'TCA', 'TCD', 'TGO', 'THA', 'TJK', 'TKM', 'TMP',
    'TON', 'TTO', 'TUN', 'TUR', 'TUV', 'TZA', 'UGA', 'UKR', 'URY', 'USA',
    'VCT', 'VEN', 'VNM', 'VUT', 'WLF', 'WSM', 'YEM', 'ZAF', 'ZMB', 'ZWE'
  ];

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
      // Load data for each country in parallel
      const promises = this.countryCodes.map(async (countryCode) => {
        try {
          const response = await fetch(`/wits_en_at-a-glance_allcountries_allyears/en_${countryCode}_At-a-Glance.csv`);
          const csvText = await response.text();
          const rows = d3.csvParse(csvText) as WITSDataRow[];
          
          // Filter rows for the specified year
          const yearData = rows.filter(row => Number(row.Year) === year);
          
          // Get total exports and imports
          const exports = yearData.find(row => 
            row.Partner === 'World' && 
            row['Product categories'] === 'All Products' &&
            row.Indicator === 'Exports (in US$ Mil)'
          );

          const imports = yearData.find(row => 
            row.Partner === 'World' && 
            row['Product categories'] === 'All Products' &&
            row.Indicator === 'Imports (in US$ Mil)'
          );

          // Get top export partners
          const exportPartners = yearData
            .filter(row => 
              row.Indicator === 'Trade (US$ Mil)-Top 5 Export Partner' &&
              row.Partner !== 'Unspecified'
            )
            .map(row => ({
              partner: row.Partner,
              value: Number(row['Indicator Value']) * 1e6 // Convert to actual dollars
            }));

          // Get top import partners
          const importPartners = yearData
            .filter(row => 
              row.Indicator === 'Trade (US$ Mil)-Top 5 Import Partner' &&
              row.Partner !== 'Unspecified'
            )
            .map(row => ({
              partner: row.Partner,
              value: Number(row['Indicator Value']) * 1e6 // Convert to actual dollars
            }));

          if (exports && imports) {
            const coordinates = countryCoordinates[countryCode] || { latitude: 0, longitude: 0 };
            
            return {
              country: exports.Reporter,
              countryCode: countryCode,
              year: year,
              exports: Number(exports['Indicator Value']) * 1e6, // Convert millions to actual dollars
              imports: Number(imports['Indicator Value']) * 1e6,
              tradeBalance: (Number(exports['Indicator Value']) - Number(imports['Indicator Value'])) * 1e6,
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              topPartners: {
                exports: exportPartners,
                imports: importPartners
              }
            } as TradeData;
          }
        } catch (error) {
          console.error(`Error loading data for ${countryCode}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const processedData = results.filter((data): data is TradeData => data !== null);
      
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
      // Use the same countryCodes list for consistency
      const promises = this.countryCodes.map(async (countryCode) => {
        try {
          const response = await fetch(`/wits_en_at-a-glance_allcountries_allyears/en_${countryCode}_At-a-Glance.csv`);
          const csvText = await response.text();
          const rows = d3.csvParse(csvText) as WITSDataRow[];
          
          const tradePartners = rows.filter(row => 
            Number(row.Year) === year &&
            row.Partner !== 'World' &&
            row['Product categories'] === 'All Products' &&
            (row.Indicator.includes('Trade (US$ Mil)-Top 5 Export Partner') ||
             row.Indicator.includes('Trade (US$ Mil)-Top 5 Import Partner'))
          );

          return tradePartners.map(row => ({
            source: countryCode,
            target: row.Partner,
            value: Number(row['Indicator Value']) * 1e6,
            type: row.Indicator.includes('Export') ? 'export' as const : 'import' as const
          }));
        } catch (error) {
          console.error(`Error loading connections for ${countryCode}:`, error);
          return [];
        }
      });

      const results = await Promise.all(promises);
      const allConnections = results.flat().filter(conn => 
        conn.target !== 'Unspecified' && conn.value > 0
      ) as CountryConnection[];

      this.connections.set(year, allConnections);
      return allConnections;
    } catch (error) {
      console.error('Error loading trade connections:', error);
      return [];
    }
  }
}

export default TradeDataService; 