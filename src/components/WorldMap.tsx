import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { Feature } from 'geojson';

const WorldMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;

    const projection = geoMercator()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = geoPath().projection(projection);

    // Load world map data
    d3.json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then((data: any) => {
        const countries = (data as any).features;

        svg.selectAll('path')
          .data(countries)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', 'country')
          .on('mouseover', (event, d) => {
            // Handle hover events
          });
      });
  }, []);

  return (
    <div className="world-map">
      <svg ref={svgRef} width="960" height="500"></svg>
    </div>
  );
};

export default WorldMap;
