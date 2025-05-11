/**
 * D3 chart logic referenced from D3 Gallery examples.
 * Source: https://observablehq.com/@d3/gallery
 * Custom modifications included for project-specific interactivity and data.
 */

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3SparkLineChart = ({ data, labels, color = '#1976d2', height = 60 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    const width = svgRef.current.clientWidth;
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([innerHeight, 0]);

    const line = d3.line()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    const area = d3.area()
      .x((_, i) => x(i))
      .y0(innerHeight)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);

    const defs = svg.append('defs');
    defs.append('linearGradient')
      .attr('id', 'spark-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color, opacity: 0.3 },
        { offset: '100%', color, opacity: 0 },
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)
      .attr('stop-opacity', d => d.opacity);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#spark-gradient)')
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('d', area);

    const circle = g.append('circle')
      .attr('r', 3.5)
      .attr('fill', color)
      .style('display', 'none');

    const tooltip = d3.select(tooltipRef.current);

    svg
      .on('mousemove', function (event) {
        const [mouseX] = d3.pointer(event);
        const i = Math.round(x.invert(mouseX - margin.left));
        if (i >= 0 && i < data.length) {
          const cx = x(i);
          const cy = y(data[i]);
          circle
            .attr('cx', cx)
            .attr('cy', cy)
            .style('display', 'block');

          tooltip
            .style('display', 'block')
            .style('left', `${cx + margin.left -60}px`)
            .style('top', `${cy + margin.top -50}px`)
            .style('color', 'black')
            .html(`<strong>${labels[i]}</strong><br/>${data[i]}`);
        }
      })
      .on('mouseleave', () => {
        tooltip.style('display', 'none');
        circle.style('display', 'none');
      });

  }, [data, labels, color, height]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <svg ref={svgRef} width="100%" height={height} />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          color:'#0000',
          display: 'none',
          pointerEvents: 'none',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default D3SparkLineChart;
