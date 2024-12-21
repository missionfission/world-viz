import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { TradeData, CountryConnection, CountryTradeData } from '../types/TradeData';
import * as topojson from 'topojson-client';
import { Topology, Objects, GeometryCollection } from 'topojson-specification';
import '../styles/WorldMap.css';
import TradeDataService from '../services/TradeDataService';

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

interface Props {
  width: number;
  height: number;
  tradeData: CountryTradeData;
}

export function WorldMap({ width, height, tradeData }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [tradeData, setTradeData] = useState<TradeData[]>([]);
  const [connections, setConnections] = useState<CountryConnection[]>([]);
  const tradeService = TradeDataService.getInstance();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [worldData, setWorldData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await tradeService.loadTradeData(selectedYear);
        setTradeData(data);
        
        const connectionData = await tradeService.getTradeConnections(selectedYear);
        setConnections(connectionData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedYear]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    
    const width = containerWidth || 960;
    const height = containerHeight || 500;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const projection = geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

    const pathGenerator = geoPath(projection);

    // Create color scale for trade balance
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([-1e9, 1e9]);

    // Load world map data
    d3.json<WorldTopology>('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((topology) => {
        if (!topology) {
          console.error('Invalid topology data');
          return;
        }

        // Convert TopoJSON to GeoJSON with proper typing
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
            const countryData = tradeData.find(td => td.countryCode === d.id);
            return countryData ? colorScale(countryData.tradeBalance) : '#ccc';
          })
          .style('stroke', '#fff')
          .style('stroke-width', '0.5px')
          .on('mouseover', (event, d) => {
            const countryData = tradeData.find(td => td.countryCode === d.id);
            if (countryData) {
              showTooltip(event, countryData);
            }
          })
          .on('mouseout', hideTooltip);

        // Draw trade connections
        drawConnections(svg, projection);

        // Add legend
        const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${width - 120}, ${height - 100})`);

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
      });

    return () => {
      svg.selectAll('*').remove();
    };
  }, [tradeData, selectedYear]);

  const showTooltip = (event: any, data: TradeData) => {
    const tooltip = d3.select('.tooltip');
    tooltip.style('display', 'block')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(`
        <strong>${data.country}</strong><br/>
        Exports: ${d3.format('$,.0f')(data.exports)}<br/>
        Imports: ${d3.format('$,.0f')(data.imports)}<br/>
        Trade Balance: ${d3.format('$,.0f')(data.tradeBalance)}
      `);
  };

  const hideTooltip = () => {
    d3.select('.tooltip').style('display', 'none');
  };

  const drawConnections = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, projection: d3.GeoProjection) => {
    svg.selectAll('.connection').remove();

    connections
      .filter(conn => conn.value > 1e8) // Only show significant trade relationships
      .forEach(conn => {
        const source = tradeData.find(d => d.countryCode === conn.source);
        const target = tradeData.find(d => d.countryCode === conn.target);

        if (source?.longitude !== undefined && 
            source?.latitude !== undefined && 
            target?.longitude !== undefined && 
            target?.latitude !== undefined) {
          const sourceCoords = projection([source.longitude, source.latitude]);
          const targetCoords = projection([target.longitude, target.latitude]);

          if (sourceCoords && targetCoords) {
            svg.append('path')
              .attr('class', 'connection')
              .attr('d', `M${sourceCoords[0]},${sourceCoords[1]}L${targetCoords[0]},${targetCoords[1]}`)
              .style('stroke-width', Math.log(conn.value / 1e8))
              .style('opacity', 0.2)
              .style('stroke', conn.type === 'export' ? '#4CAF50' : '#F44336');
          }
        }
      });
  };

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  return (
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
        {isLoading && <span className="loading">Loading...</span>}
      </div>
      <svg ref={svgRef}></svg>
      <div className="tooltip"></div>
      
      {selectedCountry && tradeData[selectedCountry] && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Trade Statistics</h3>
          <div className="mb-4">
            <h4 className="font-semibold">Latest Exports</h4>
            <p>${Math.round(Object.values(tradeData[selectedCountry].exports).pop() || 0).toLocaleString()} Million</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Latest Imports</h4>
            <p>${Math.round(Object.values(tradeData[selectedCountry].imports).pop() || 0).toLocaleString()} Million</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Top Export Partners</h4>
            <ul>
              {tradeData[selectedCountry].topPartners.exports.map(partner => (
                <li key={partner.partner}>
                  {partner.partner}: ${Math.round(partner.value).toLocaleString()}M
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
