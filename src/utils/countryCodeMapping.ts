// Create a new file for country code mapping
export const countryCodeMapping: { [key: string]: string } = {
  // Map WITS country codes to ISO3 codes used in the GeoJSON
  'ABW': 'ABW', // Aruba
  'AFG': 'AFG', // Afghanistan
  'AGO': 'AGO', // Angola
  'AIA': 'AIA', // Anguilla
  'ALB': 'ALB', // Albania
  'AND': 'AND', // Andorra
  'ANT': 'ANT', // Netherlands Antilles
  'ARE': 'ARE', // UAE
  'ARG': 'ARG', // Argentina
  'ARM': 'ARM', // Armenia
  'ATG': 'ATG', // Antigua and Barbuda
  'AUS': 'AUS', // Australia
  'AUT': 'AUT', // Austria
  'AZE': 'AZE', // Azerbaijan
  'BDI': 'BDI', // Burundi
  'BEL': 'BEL', // Belgium
  'BEN': 'BEN', // Benin
  'BFA': 'BFA', // Burkina Faso
  'BGD': 'BGD', // Bangladesh
  'BGR': 'BGR', // Bulgaria
  'BHR': 'BHR', // Bahrain
  'BHS': 'BHS', // Bahamas
  'BIH': 'BIH', // Bosnia and Herzegovina
  'BLR': 'BLR', // Belarus
  'BLZ': 'BLZ', // Belize
  'BMU': 'BMU', // Bermuda
  'BOL': 'BOL', // Bolivia
  'BRA': 'BRA', // Brazil
  'BRB': 'BRB', // Barbados
  'BRN': 'BRN', // Brunei
  'BTN': 'BTN', // Bhutan
  'BWA': 'BWA', // Botswana
  'CAF': 'CAF', // Central African Republic
  'CAN': 'CAN', // Canada
  'CHE': 'CHE', // Switzerland
  'CHL': 'CHL', // Chile
  'CHN': 'CHN', // China
  'CIV': 'CIV', // Côte d'Ivoire
  'CMR': 'CMR', // Cameroon
  'COD': 'COD', // DR Congo
  'COG': 'COG', // Congo
  'COK': 'COK', // Cook Islands
  'COL': 'COL', // Colombia
  'COM': 'COM', // Comoros
  'CPV': 'CPV', // Cape Verde
  'CRI': 'CRI', // Costa Rica
  'CUB': 'CUB', // Cuba
  'CYM': 'CYM', // Cayman Islands
  'CYP': 'CYP', // Cyprus
  'CZE': 'CZE', // Czech Republic
  'DEU': 'DEU', // Germany
  'DJI': 'DJI', // Djibouti
  'DMA': 'DMA', // Dominica
  'DNK': 'DNK', // Denmark
  'DOM': 'DOM', // Dominican Republic
  'DZA': 'DZA', // Algeria
  'ECU': 'ECU', // Ecuador
  'EGY': 'EGY', // Egypt
  'ERI': 'ERI', // Eritrea
  'ESP': 'ESP', // Spain
  'EST': 'EST', // Estonia
  'ETH': 'ETH', // Ethiopia
  'FIN': 'FIN', // Finland
  'FJI': 'FJI', // Fiji
  'FRA': 'FRA', // France
  'FRO': 'FRO', // Faroe Islands
  'FSM': 'FSM', // Micronesia
  'GAB': 'GAB', // Gabon
  'GBR': 'GBR', // United Kingdom
  'GEO': 'GEO', // Georgia
  'GHA': 'GHA', // Ghana
  'GIN': 'GIN', // Guinea
  'GMB': 'GMB', // Gambia
  'GNB': 'GNB', // Guinea-Bissau
  'GNQ': 'GNQ', // Equatorial Guinea
  'GRC': 'GRC', // Greece
  'GRD': 'GRD', // Grenada
  'GRL': 'GRL', // Greenland
  'GTM': 'GTM', // Guatemala
  'GUY': 'GUY', // Guyana
  'HKG': 'HKG', // Hong Kong
  'HND': 'HND', // Honduras
  'HRV': 'HRV', // Croatia
  'HTI': 'HTI', // Haiti
  'HUN': 'HUN', // Hungary
  'IDN': 'IDN', // Indonesia
  'IND': 'IND', // India
  'IRL': 'IRL', // Ireland
  'IRN': 'IRN', // Iran
  'IRQ': 'IRQ', // Iraq
  'ISL': 'ISL', // Iceland
  'ISR': 'ISR', // Israel
  'ITA': 'ITA', // Italy
  'JAM': 'JAM', // Jamaica
  'JOR': 'JOR', // Jordan
  'JPN': 'JPN', // Japan
  'KAZ': 'KAZ', // Kazakhstan
  'KEN': 'KEN', // Kenya
  'KGZ': 'KGZ', // Kyrgyzstan
  'KHM': 'KHM', // Cambodia
  'KIR': 'KIR', // Kiribati
  'KNA': 'KNA', // Saint Kitts and Nevis
  'KOR': 'KOR', // South Korea
  'KWT': 'KWT', // Kuwait
  'LAO': 'LAO', // Laos
  'LBN': 'LBN', // Lebanon
  'LBR': 'LBR', // Liberia
  'LBY': 'LBY', // Libya
  'LCA': 'LCA', // Saint Lucia
  'LKA': 'LKA', // Sri Lanka
  'LSO': 'LSO', // Lesotho
  'LTU': 'LTU', // Lithuania
  'LUX': 'LUX', // Luxembourg
  'LVA': 'LVA', // Latvia
  'MAC': 'MAC', // Macao
  'MAR': 'MAR', // Morocco
  'MDA': 'MDA', // Moldova
  'MDG': 'MDG', // Madagascar
  'MDV': 'MDV', // Maldives
  'MEX': 'MEX', // Mexico
  'MKD': 'MKD', // North Macedonia
  'MLI': 'MLI', // Mali
  'MLT': 'MLT', // Malta
  'MMR': 'MMR', // Myanmar
  'MNG': 'MNG', // Mongolia
  'MOZ': 'MOZ', // Mozambique
  'MRT': 'MRT', // Mauritania
  'MSR': 'MSR', // Montserrat
  'MUS': 'MUS', // Mauritius
  'MWI': 'MWI', // Malawi
  'MYS': 'MYS', // Malaysia
  'NAM': 'NAM', // Namibia
  'NCL': 'NCL', // New Caledonia
  'NER': 'NER', // Niger
  'NGA': 'NGA', // Nigeria
  'NIC': 'NIC', // Nicaragua
  'NLD': 'NLD', // Netherlands
  'NOR': 'NOR', // Norway
  'NPL': 'NPL', // Nepal
  'NZL': 'NZL', // New Zealand
  'OMN': 'OMN', // Oman
  'PAK': 'PAK', // Pakistan
  'PAN': 'PAN', // Panama
  'PER': 'PER', // Peru
  'PHL': 'PHL', // Philippines
  'PNG': 'PNG', // Papua New Guinea
  'POL': 'POL', // Poland
  'PRI': 'PRI', // Puerto Rico
  'PRT': 'PRT', // Portugal
  'PRY': 'PRY', // Paraguay
  'PSE': 'PSE', // Palestine
  'QAT': 'QAT', // Qatar
  'ROU': 'ROU', // Romania
  'RUS': 'RUS', // Russia
  'RWA': 'RWA', // Rwanda
  'SAU': 'SAU', // Saudi Arabia
  'SDN': 'SDN', // Sudan
  'SEN': 'SEN', // Senegal
  'SGP': 'SGP', // Singapore
  'SLB': 'SLB', // Solomon Islands
  'SLE': 'SLE', // Sierra Leone
  'SLV': 'SLV', // El Salvador
  'SOM': 'SOM', // Somalia
  'SRB': 'SRB', // Serbia
  'SSD': 'SSD', // South Sudan
  'STP': 'STP', // São Tomé and Príncipe
  'SUR': 'SUR', // Suriname
  'SVK': 'SVK', // Slovakia
  'SVN': 'SVN', // Slovenia
  'SWE': 'SWE', // Sweden
  'SWZ': 'SWZ', // Eswatini
  'SYC': 'SYC', // Seychelles
  'SYR': 'SYR', // Syria
  'TCD': 'TCD', // Chad
  'TGO': 'TGO', // Togo
  'THA': 'THA', // Thailand
  'TJK': 'TJK', // Tajikistan
  'TKM': 'TKM', // Turkmenistan
  'TLS': 'TLS', // Timor-Leste
  'TON': 'TON', // Tonga
  'TTO': 'TTO', // Trinidad and Tobago
  'TUN': 'TUN', // Tunisia
  'TUR': 'TUR', // Turkey
  'TUV': 'TUV', // Tuvalu
  'TWN': 'TWN', // Taiwan
  'TZA': 'TZA', // Tanzania
  'UGA': 'UGA', // Uganda
  'UKR': 'UKR', // Ukraine
  'URY': 'URY', // Uruguay
  '840': 'USA', // United States
  'UZB': 'UZB', // Uzbekistan
  'VCT': 'VCT', // Saint Vincent and the Grenadines
  'VEN': 'VEN', // Venezuela
  'VNM': 'VNM', // Vietnam
  'VUT': 'VUT', // Vanuatu
  'WSM': 'WSM', // Samoa
  'YEM': 'YEM', // Yemen
  'ZAF': 'ZAF', // South Africa
  'ZMB': 'ZMB', // Zambia
  'ZWE': 'ZWE', // Zimbabwe
};

// Reverse mapping for looking up WITS codes from GeoJSON codes
export const reverseCountryCodeMapping: { [key: string]: string } = 
  Object.entries(countryCodeMapping).reduce((acc, [wits, geo]) => {
    acc[geo] = wits;
    return acc;
  }, {} as { [key: string]: string });

// Add logging to help identify missing mappings
export const logMissingCountry = (code: string) => {
  const normalizedCode = normalizeCountryCode(code);
  if (!countryCodeMapping[normalizedCode] && !reverseCountryCodeMapping[normalizedCode]) {
    console.warn(`Missing country code mapping for: ${code} (normalized: ${normalizedCode})`);
    return false;
  }
  return true;
};

// Add a function to get country name if available
export const getCountryName = (code: string): string => {
  const normalizedCode = normalizeCountryCode(code);
  if (countryCodeAliases[normalizedCode]) {
    return countryCodeAliases[normalizedCode].name;
  }
  return code; // Return the code if no name is found
};

// Add these utility functions at the top of the file
interface CountryCodeInfo {
  code: string;
  name: string;
  alternativeCodes?: string[];
}

// Map of special cases and alternative codes
const countryCodeAliases: { [key: string]: CountryCodeInfo } = {
  // Special cases for historical or disputed territories
  'ROM': { code: 'ROU', name: 'Romania', alternativeCodes: ['ROM', 'ROU'] },
  'TMP': { code: 'TLS', name: 'Timor-Leste', alternativeCodes: ['TMP', 'TLS'] },
  'ZAR': { code: 'COD', name: 'DR Congo', alternativeCodes: ['ZAR', 'COD'] },
  'BUR': { code: 'MMR', name: 'Myanmar', alternativeCodes: ['BUR', 'MMR'] },
  'TLS': { code: 'TLS', name: 'Timor-Leste', alternativeCodes: ['TMP', 'TLS'] },
  // Add regional groupings that might appear in the data
  'EUN': { code: 'EU', name: 'European Union' },
  'WLD': { code: 'WLD', name: 'World' },
  // Add more special cases as needed
};

// Function to normalize country codes
export const normalizeCountryCode = (code: string): string => {
  if (!code) return '';
  
  const upperCode = code.toUpperCase();
  
  // Check if it's a special case
  if (countryCodeAliases[upperCode]) {
    return countryCodeAliases[upperCode].code;
  }
  
  // Check if it's in our main mapping
  if (countryCodeMapping[upperCode]) {
    return upperCode;
  }
  
  // Check if it's in our reverse mapping
  if (reverseCountryCodeMapping[upperCode]) {
    return reverseCountryCodeMapping[upperCode];
  }
  
  return upperCode;
};