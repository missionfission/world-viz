import { TradeData, Partner } from '../types/TradeData';

interface RawTradeData {
  Reporter: string;
  Year: string;
  Partner: string;
  'Product categories': string;
  'Indicator Type': string;
  Indicator: string;
  'Indicator Value': string;
}

export function processTradeData(data: RawTradeData[]): TradeData {
  const result: TradeData = {
    country: data[0].Reporter,
    countryCode: '', // You'll need to add logic to get the country code
    year: parseInt(data[0].Year),
    exports: 0,
    imports: 0,
    tradeBalance: 0,
    latitude: 0,
    longitude: 0,
    topPartners: {
      exports: [],
      imports: []
    }
  };

  // Process the data...

  // Sort and limit to top 5 partners with proper typing
  result.topPartners?.exports.sort((a: Partner, b: Partner) => b.value - a.value);
  result.topPartners?.imports.sort((a: Partner, b: Partner) => b.value - a.value);
  
  if (result.topPartners) {
    result.topPartners.exports = result.topPartners.exports.slice(0, 5);
    result.topPartners.imports = result.topPartners.imports.slice(0, 5);
  }

  return result;
} 