/**
 * D3 chart logic referenced from D3 Gallery examples.
 * Source: https://observablehq.com/@d3/gallery
 * Custom modifications included for project-specific interactivity and data.
 */

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

const SpendingByCategoryD3Chart = ({ categoryData, totalSpent }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); 

    const width = 260;
    const height = 260;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal()
      .domain(categoryData.map(d => d.label))
      .range([
        'hsl(220, 20%, 65%)',
        'hsl(220, 20%, 42%)',
        'hsl(220, 20%, 35%)',
        'hsl(220, 20%, 28%)',
        'hsl(220, 20%, 20%)',
      ]);

    const arc = d3.arc()
      .innerRadius(radius - 25)
      .outerRadius(radius);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const tooltip = d3.select('#d3-tooltip');
    if (tooltip.empty()) {
      d3.select('body')
        .append('div')
        .attr('id', 'd3-tooltip')
        .style('position', 'absolute')
        .style('padding', '6px 12px')
        .style('background', 'rgba(0,0,0,0.7)')
        .style('color', '#fff')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('font-size', '12px')
        .style('display', 'none');
    }

    const chart = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    chart.selectAll('path')
      .data(pie(categoryData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .on('mouseover', function (event, d) {
        d3.select('#d3-tooltip')
          .style('display', 'block')
          .html(`<strong>${d.data.label}</strong><br/>₹${d.data.value}`);
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
      })
      .on('mousemove', function (event) {
        d3.select('#d3-tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 20 + 'px');
      })
      .on('mouseout', function () {
        d3.select('#d3-tooltip').style('display', 'none');
        d3.select(this).attr('stroke', null);
      });

    // Center label
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .style('font-size', '18px')
      .style('font-weight', 600)
      .style('fill', '#444')
      .text(totalSpent);

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#777')
      .text('Total Spent');
  }, [categoryData, totalSpent]);

  const color = d3.scaleOrdinal()
    .domain(categoryData.map(d => d.label))
    .range([
      'hsl(220, 20%, 65%)',
      'hsl(220, 20%, 42%)',
      'hsl(220, 20%, 35%)',
      'hsl(220, 20%, 28%)',
      'hsl(220, 20%, 20%)',
    ]);

  return (
    <Card variant="outlined" sx={{ width: '100%', height: 380 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Spending by Category
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <svg ref={ref} />
          <Stack spacing={1} sx={{ mt: 2 }}>
            {categoryData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: color(item.label), borderRadius: '50%' }} />
                <Typography variant="body2">{item.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SpendingByCategoryD3Chart;
