import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { TradeData, CountryConnection, Partner } from '../types/TradeData';
import * as topojson from 'topojson-client';
import { Topology, Objects, GeometryCollection } from 'topojson-specification';
import '../styles/WorldMap.css';
import TradeDataService from '../services/TradeDataService';
import { 
  countryCodeMapping, 
  reverseCountryCodeMapping, 
  logMissingCountry, 
  normalizeCountryCode,
  getCountryName 
} from '../utils/countryCodeMapping';
import { Tab } from '@headlessui/react';

// Define the geometry type for countries
type CountryGeometry = GeometryCollection & { id: string };

// Define the topology type
interface WorldTopology extends Topology<{ countries: GeometryCollection }> {
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: CountryGeometry[];
    };
  };
}

type FeatureType = Feature<Geometry> & { id: string };
type FeatureCollection = { type: "FeatureCollection", features: FeatureType[] };

interface Props {}

export function WorldMap({}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [connections, setConnections] = useState<CountryConnection[]>([]);
  const tradeService = TradeDataService.getInstance();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [allYearsData, setAllYearsData] = useState<Map<number, TradeData[]>>(new Map());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Keep only one useEffect for loading data
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await tradeService.loadAllTradeData();
        setAllYearsData(data);
        setAvailableYears(
          Array.from(data.keys())
            .sort((a: number, b: number) => b - a)
        );
        // Load connections for the selected year
        const connectionData = await tradeService.getTradeConnections(selectedYear);
        setConnections(connectionData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load trade data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [selectedYear]); // Add selectedYear as dependency

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize(); // Initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Separate useEffect for drawing the map
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || isLoading || error) return;

    const currentYearData = allYearsData.get(selectedYear) || [];
    
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    svg.selectAll('*').remove();

    const projection = geoMercator()
      .scale(dimensions.width / 2 / Math.PI)
      .translate([dimensions.width / 2, dimensions.height / 2]);

    const pathGenerator = geoPath(projection);

    // Create color scale for trade balance
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([-1e9, 1e9]);

    // Load world map data
    d3.json<WorldTopology>('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((topology) => {
        if (!topology) {
          setError('Invalid topology data');
          return;
        }

        const geojson = topojson.feature(
          topology,
          topology.objects.countries
        ) as unknown as FeatureCollection;

        const g = svg.append('g');

        // Draw countries
        g.selectAll<SVGPathElement, FeatureType>('path')
          .data(geojson.features)
          .join('path')
          .attr('d', d => pathGenerator(d) || '')
          .attr('class', 'country')
          .style('fill', (d) => {
            if (!currentYearData || !d || !d.id) return '#ccc';

            try {
              const normalizedCode = normalizeCountryCode(d.id);
              const witsCode = reverseCountryCodeMapping[normalizedCode];
              if (!witsCode && !logMissingCountry(d.id)) {
                return '#eee';
              }
              const countryData = currentYearData.find(td => td && td.countryCode === witsCode);
              return countryData ? colorScale(countryData.tradeBalance) : '#ccc';
            } catch (error) {
              console.warn('Error setting fill color:', error);
              return '#ccc';
            }
          })
          .style('stroke', '#fff')
          .style('stroke-width', '0.5px')
          .on('mouseover', (event, d) => {
            if (!currentYearData || !d || !d.id) return;

            try {
              const normalizedCode = normalizeCountryCode(d.id);
              const witsCode = reverseCountryCodeMapping[normalizedCode];
              const countryData = currentYearData.find(td => td && td.countryCode === witsCode);
              
              if (countryData) {
                showTooltip(event, countryData);
                d3.select(event.currentTarget)
                  .style('stroke-width', '2px')
                  .style('stroke', '#000');
              } else {
                showEmptyTooltip(event, d.id);
              }
            } catch (error) {
              console.warn('Error showing tooltip:', error);
              showEmptyTooltip(event, d.id);
            }
          })
          .on('mouseout', (event) => {
            hideTooltip();
            d3.select(event.currentTarget)
              .style('stroke-width', '0.5px')
              .style('stroke', '#fff');
          })
          .on('click', (event, d) => {
            if (!currentYearData || !d || !d.id) return;

            try {
              const normalizedCode = normalizeCountryCode(d.id);
              const witsCode = reverseCountryCodeMapping[normalizedCode];
              const countryData = currentYearData.find(td => td && td.countryCode === witsCode);
              if (countryData) {
                setSelectedCountry(countryData.countryCode);
              }
            } catch (error) {
              console.warn('Error handling click:', error);
            }
          });

        // Draw trade connections
        drawConnections(svg, projection);

        // Add legend
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${dimensions.width - 120}, ${dimensions.height - 100})`);

        legend.append('text')
          .attr('class', 'legend-title')
          .attr('y', -10)
          .text('Trade Balance');

        const legendScale = d3.scaleLinear()
          .domain([-1e9, 1e9])
          .range([0, 100]);

        const legendAxis = d3.axisRight(legendScale)
          .tickSize(15)
          .tickValues([-1e9, 0, 1e9])
          .tickFormat(d3.format('.1s'));

        legend.call(legendAxis);
      })
      .catch((error) => {
        console.error('Error loading map data:', error);
        setError('Failed to load map data');
      });

    return () => {
      svg.selectAll('*').remove();
    };
  }, [dimensions, allYearsData, selectedYear, isLoading, error]);

  const showEmptyTooltip = (event: any, countryCode: string) => {
    const tooltip = d3.select('.tooltip');
    tooltip.style('display', 'block')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(`
        <strong>${getCountryName(countryCode)}</strong><br/>
        No trade data available
      `);
  };

  const showTooltip = (event: any, data: TradeData) => {
    if (!data) return;

    const tooltip = d3.select('.tooltip');
    const formatCurrency = d3.format('$,.0f');
    
    const exports = data.exports !== undefined ? formatCurrency(data.exports) : 'N/A';
    const imports = data.imports !== undefined ? formatCurrency(data.imports) : 'N/A';
    const balance = data.tradeBalance !== undefined ? formatCurrency(data.tradeBalance) : 'N/A';

    tooltip.style('display', 'block')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(`
        <strong>${data.country || getCountryName(data.countryCode)}</strong><br/>
        Exports: ${exports}<br/>
        Imports: ${imports}<br/>
        Trade Balance: ${balance}
      `);
  };

  const hideTooltip = () => {
    d3.select('.tooltip').style('display', 'none');
  };

  const drawConnections = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, projection: d3.GeoProjection) => {
    if (!allYearsData || !connections) return;

    svg.selectAll('.connection').remove();

    const validConnections = connections.filter(conn => {
      if (!conn || !conn.source || !conn.target || !conn.value) return false;
      
      // Check if both source and target countries exist in trade data
      const source = allYearsData.get(selectedYear)?.find(d => d?.countryCode === normalizeCountryCode(conn.source));
      const target = allYearsData.get(selectedYear)?.find(d => d?.countryCode === normalizeCountryCode(conn.target));
      
      return (
        conn.value > 1e8 && 
        source && 
        target && 
        source.longitude != null && 
        source.latitude != null && 
        target.longitude != null && 
        target.latitude != null
      );
    });

    validConnections.forEach(conn => {
      try {
        const source = allYearsData.get(selectedYear)?.find(d => d?.countryCode === normalizeCountryCode(conn.source));
        const target = allYearsData.get(selectedYear)?.find(d => d?.countryCode === normalizeCountryCode(conn.target));

        if (!source || !target) return;

        const sourceCoords = projection([source.longitude, source.latitude]);
        const targetCoords = projection([target.longitude, target.latitude]);

        if (!sourceCoords || !targetCoords) return;

        svg.append('path')
          .attr('class', 'connection')
          .attr('d', `M${sourceCoords[0]},${sourceCoords[1]}L${targetCoords[0]},${targetCoords[1]}`)
          .style('stroke-width', Math.log(conn.value / 1e8))
          .style('opacity', 0.2)
          .style('stroke', conn.type === 'export' ? '#4CAF50' : '#F44336');
      } catch (error) {
        console.warn('Error drawing connection:', error);
      }
    });
  };

  // Update the sidebar content rendering
  const renderSidebar = () => {
    const currentYearData = allYearsData.get(selectedYear) || [];
    const selectedCountryData = currentYearData.find(td => td.countryCode === selectedCountry);
    
    if (!selectedCountryData) return null;

    const formatCurrency = d3.format('$,.0f');
    const topPartners = selectedCountryData.topPartners;

    return (
      <div className="country-sidebar">
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg max-w-md">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedCountry(null)}
          >
            ×
          </button>
          <h3 className="text-lg font-bold mb-2">
            {selectedCountryData.country || getCountryName(selectedCountryData.countryCode)}
          </h3>
          {selectedCountryData.exports !== undefined && (
            <div className="mb-4">
              <h4 className="font-semibold">Exports</h4>
              <p>{formatCurrency(selectedCountryData.exports)}</p>
            </div>
          )}
          {selectedCountryData.imports !== undefined && (
            <div className="mb-4">
              <h4 className="font-semibold">Imports</h4>
              <p>{formatCurrency(selectedCountryData.imports)}</p>
            </div>
          )}
          {selectedCountryData.tradeBalance !== undefined && (
            <div className="mb-4">
              <h4 className="font-semibold">Trade Balance</h4>
              <p>{formatCurrency(selectedCountryData.tradeBalance)}</p>
            </div>
          )}
          {topPartners?.exports && topPartners.exports.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Top Export Partners</h4>
              <ul className="list-disc pl-4">
                {topPartners.exports.map((partner) => (
                  <li key={partner.partner}>
                    {partner.partner}: {formatCurrency(partner.value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {topPartners?.imports && topPartners.imports.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold">Top Import Partners</h4>
              <ul className="list-disc pl-4">
                {topPartners.imports.map((partner) => (
                  <li key={partner.partner}>
                    {partner.partner}: {formatCurrency(partner.value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDataTable = (yearData: TradeData[]) => {
    const formatCurrency = d3.format('$,.0f');
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Exports</th>
              <th className="px-4 py-2">Imports</th>
              <th className="px-4 py-2">Trade Balance</th>
            </tr>
          </thead>
          <tbody>
            {yearData
              .sort((a, b) => b.tradeBalance - a.tradeBalance)
              .map((data) => (
                <tr 
                  key={data.countryCode} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCountry(data.countryCode)}
                >
                  <td className="border px-4 py-2">{data.country}</td>
                  <td className="border px-4 py-2">{formatCurrency(data.exports)}</td>
                  <td className="border px-4 py-2">{formatCurrency(data.imports)}</td>
                  <td className="border px-4 py-2">{formatCurrency(data.tradeBalance)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add loading and error states to the render
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="world-map" ref={containerRef}>
          <div className="controls">
            <label>
              Year:
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                disabled={isLoading}
              >
                {Array.from({length: 22}, (_, i) => 2000 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
            {isLoading && <span className="loading">Loading data...</span>}
            {error && <span className="error">{error}</span>}
          </div>
          <svg ref={svgRef}></svg>
          <div className="tooltip"></div>
          {!isLoading && !error && selectedCountry && renderSidebar()}
        </div>
      </div>
      <div className="w-1/3 min-w-[400px] bg-white border-l border-gray-200 overflow-y-auto">
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200">
            <Tab
              className={({ selected }) =>
                `flex-1 py-2 px-4 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Map View
            </Tab>
            <Tab
              className={({ selected }) =>
                `flex-1 py-2 px-4 text-sm font-medium focus:outline-none ${
                  selected
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              Data View
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {selectedCountry && renderSidebar()}
            </Tab.Panel>
            <Tab.Panel className="p-4">
              <div className="mb-4">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {allYearsData.get(selectedYear) && renderDataTable(allYearsData.get(selectedYear)!)}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
