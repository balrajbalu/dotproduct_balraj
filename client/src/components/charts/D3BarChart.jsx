import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material/styles';
export const D3BarChart = ({ data, series, width = 580, height = 240 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const theme = useTheme();

  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); 

    const allLabels = series.map(s => s.label);
    const preparedData = data.map((month, i) => {
      const entry = { month };
      series.forEach(s => {
        entry[s.label] = s.data[i] || 0;
      });
      return entry;
    });

    const stack = d3.stack().keys(allLabels);
    const stackedSeries = stack(preparedData);

    const xScale = d3.scaleBand()
      .domain(data)
      .range([0, innerWidth])
      .padding(0.3);

    const yMax = d3.max(preparedData, d =>
      allLabels.reduce((acc, key) => acc + (d[key] || 0), 0)
    );

    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])
      .nice();

    const color = d3.scaleOrdinal()
      .domain(allLabels)
      .range([
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.info.main
      ]);

    const svgG = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    svgG.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '12px');

    // Y axis
    svgG.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Bars
    svgG.selectAll('g.series')
      .data(stackedSeries)
      .enter()
      .append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d.map(v => ({ ...v, key: d.key })))
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.data.month))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .on('mousemove', (event, d) => {
        tooltip
          .style('display', 'block')
          .style('left', `${event.offsetX - 100}px`)
          .style('top', `${event.offsetY}px`)
          .style('color', `black`)
          .html(`
        <strong>${d.key}</strong><br/>
        ${d.data.month}: ₹${(d[1] - d[0]).toLocaleString()}
      `);
      })
      .on('mouseleave', () => tooltip.style('display', 'none'));
  }, [data, series, innerWidth, innerHeight, theme]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        // viewBox={0 0 ${width} ${height}}
        style={{ overflow: 'visible' }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          background: '#fff',
          border: '1px solid #ccc',
          padding: '4px 8px',
          borderRadius: 4,
          fontSize: '12px',
          display: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 999,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      />
    </div>
  );
}