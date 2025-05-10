import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import SpendingByCategoryD3Chart from './charts/SpendingByCategoryD3Chart';



const StyledText = styled('text')(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <>
      <StyledText x={left + width / 2} y={primaryY} style={{ fontSize: 20, fontWeight: 600 }}>
        {primaryText}
      </StyledText>
      <StyledText x={left + width / 2} y={secondaryY} style={{ fontSize: 14 }}>
        {secondaryText}
      </StyledText>
    </>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

const pieColors = [
  'hsl(220, 20%, 65%)',
  'hsl(220, 20%, 42%)',
  'hsl(220, 20%, 35%)',
  'hsl(220, 20%, 28%)',
  'hsl(220, 20%, 20%)',
];

export default function SpendingByCategoryChart({ categoryData, totalSpent }) {
  return (
    <SpendingByCategoryD3Chart categoryData={categoryData} totalSpent={totalSpent} />
  );
}
