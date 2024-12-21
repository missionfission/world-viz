interface CountryCoordinates {
  [key: string]: {
    latitude: number;
    longitude: number;
  };
}

export const countryCoordinates: CountryCoordinates = {
  'USA': { latitude: 37.0902, longitude: -95.7129 },
  'CHN': { latitude: 35.8617, longitude: 104.1954 },
  'JPN': { latitude: 36.2048, longitude: 138.2529 },
  'DEU': { latitude: 51.1657, longitude: 10.4515 },
  'GBR': { latitude: 55.3781, longitude: -3.4360 },
  'FRA': { latitude: 46.2276, longitude: 2.2137 },
  'IND': { latitude: 20.5937, longitude: 78.9629 },
  'ITA': { latitude: 41.8719, longitude: 12.5674 },
  'BRA': { latitude: -14.2350, longitude: -51.9253 },
  'CAN': { latitude: 56.1304, longitude: -106.3468 },
  'RUS': { latitude: 61.5240, longitude: 105.3188 },
  'KOR': { latitude: 35.9078, longitude: 127.7669 },
  'AUS': { latitude: -25.2744, longitude: 133.7751 },
  'ESP': { latitude: 40.4637, longitude: -3.7492 },
  'MEX': { latitude: 23.6345, longitude: -102.5528 },
  'IDN': { latitude: -0.7893, longitude: 113.9213 },
  'NLD': { latitude: 52.1326, longitude: 5.2913 },
  'SAU': { latitude: 23.8859, longitude: 45.0792 },
  'CHE': { latitude: 46.8182, longitude: 8.2275 },
  'TUR': { latitude: 38.9637, longitude: 35.2433 },
  // Add more countries as needed
}; 