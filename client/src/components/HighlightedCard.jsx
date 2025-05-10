import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ height: '100%' }}>
  <CardContent>
    <InsightsRoundedIcon />
    <Typography
      component="h2"
      variant="subtitle2"
      gutterBottom
      sx={{ fontWeight: '600' }}
    >
      Track Your Spending
    </Typography>
    <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
      Gain insights into your income, expenses, and savings to take control of your financial goals.
    </Typography>
  </CardContent>
</Card>

  );
}
