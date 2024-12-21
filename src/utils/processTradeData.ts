import { TradeDataRow, ProcessedTradeData } from '../types/TradeData';

export function processTradeData(data: TradeDataRow[]): ProcessedTradeData {
  const result: ProcessedTradeData = {
    exports: {},
    imports: {},
    topPartners: {
      exports: [],
      imports: []
    },
    productCategories: {
      exports: [],
      imports: []
    }
  };

  // Process total exports and imports by year
  data.forEach(row => {
    if (row['Indicator Type'] === 'Export' && row.Partner === 'World' && row['Product categories'] === 'All Products') {
      Object.keys(row).forEach(key => {
        if (!isNaN(parseInt(key))) {
          result.exports[key] = parseFloat(row[key] as string) || 0;
        }
      });
    }
    if (row['Indicator Type'] === 'Import' && row.Partner === 'World' && row['Product categories'] === 'All Products') {
      Object.keys(row).forEach(key => {
        if (!isNaN(parseInt(key))) {
          result.imports[key] = parseFloat(row[key] as string) || 0;
        }
      });
    }
  });

  // Process top trading partners
  const latestYear = Math.max(...Object.keys(result.exports).map(Number));
  
  data.forEach(row => {
    if (row.Partner !== 'World' && row[latestYear.toString()]) {
      if (row['Indicator Type'] === 'Export') {
        result.topPartners.exports.push({
          partner: row.Partner,
          value: parseFloat(row[latestYear.toString()] as string) || 0
        });
      }
      if (row['Indicator Type'] === 'Import') {
        result.topPartners.imports.push({
          partner: row.Partner,
          value: parseFloat(row[latestYear.toString()] as string) || 0
        });
      }
    }
  });

  // Sort and limit to top 5 partners
  result.topPartners.exports.sort((a, b) => b.value - a.value);
  result.topPartners.imports.sort((a, b) => b.value - a.value);
  result.topPartners.exports = result.topPartners.exports.slice(0, 5);
  result.topPartners.imports = result.topPartners.imports.slice(0, 5);

  // Process product categories
  data.forEach(row => {
    if (row.Partner === 'World' && row['Product categories'] !== 'All Products') {
      if (row['Indicator Type'] === 'Export') {
        result.productCategories.exports.push({
          category: row['Product categories'],
          value: parseFloat(row[latestYear.toString()] as string) || 0
        });
      }
      if (row['Indicator Type'] === 'Import') {
        result.productCategories.imports.push({
          category: row['Product categories'],
          value: parseFloat(row[latestYear.toString()] as string) || 0
        });
      }
    }
  });

  return result;
} 