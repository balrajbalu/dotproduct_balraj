import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import { D3BarChart } from './charts/D3BarChart';

export default function MonthlyOverviewChart({ series, data }) {
  const theme = useTheme();
  const colorPalette = [
    (theme.vars || theme).palette.success.main,
    (theme.vars || theme).palette.error.main,
    (theme.vars || theme).palette.info.main,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%', height: 380 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Monthly Financial Overview
        </Typography>

        <Typography variant="h4" component="p">
          ₹{(
            series.reduce((sum, s) => sum + (s.data?.[s.data.length - 1] || 0), 0) / 100000
          ).toFixed(2)}L
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          Income, Expenses & Budget over the last 6 months
        </Typography>

        <D3BarChart series={series} data={data} />
      </CardContent>
    </Card>
  );
}
