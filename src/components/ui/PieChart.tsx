import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  emoji: string;
  count: number;
  color: string;
}

interface PieChartProps {
  data: DataPoint[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Setup dimensions
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.emoji))
      .range(data.map(d => d.color));
    
    // Create pie generator
    const pie = d3.pie<DataPoint>()
      .value(d => d.count)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.5) // Donut chart
      .outerRadius(radius * 0.8);
    
    // Create outer arc for labels
    const outerArc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    
    // Generate pie chart
    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    // Add path
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease-out')
      .on('mouseover', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
      });
    
    // Add emoji labels in the center of each arc
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('pointer-events', 'none')
      .text(d => d.data.emoji);
    
    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        return `translate(${pos[0]}, ${pos[1]})`;
      })
      .attr('dy', '0.35em')
      .attr('text-anchor', d => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return (midangle < Math.PI) ? 'start' : 'end';
      })
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text(d => {
        const totalCount = data.reduce((sum, item) => sum + item.count, 0);
        const percentage = Math.round((d.data.count / totalCount) * 100);
        return `${percentage}%`;
      });
      
  }, [data]);
  
  return (
    <div className="relative flex justify-center items-center">
      <svg 
        ref={svgRef} 
        className="w-full max-w-md h-auto"
        style={{ minHeight: '300px' }}
      ></svg>
    </div>
  );
};

export default PieChart;