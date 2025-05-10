import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatCard from './StatCard';
import HighlightedCard from './HighlightedCard';
import MonthlyOverviewChart from './MonthlyOverviewChart';
import SpendingByCategoryChart from './SpendingByCategoryChart';
import { getSummary, getOverview, getCategory } from '../services/summaryService';
import { useEffect, useState } from 'react';

export default function MainGrid() {
  const [data, setData] = useState([]);
  const [labels, setLabelss] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getSummary();

      const { data, result, labels } = res;
      if (result === 1) {
        setData(data)
        setLabelss(labels)
      }
    } catch (error) {
      console.log('error', error.message);
    } finally {
      setLoading(false);
    }
  };
  const [overview, setOverview] = useState([]);
  const [series, setSeries] = useState([]);
  const fetchOverView = async () => {
    setLoading(true);
    try {
      const res = await getOverview();

      const { data, result, series } = res;
      if (result === 1) {
        setOverview(data);
        setSeries(series)
      }
    } catch (error) {
      console.log('error', error.message);
    } finally {
      setLoading(false);
    }
  };
  const [category, setCategory] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await getCategory();

      const { data, result, totalSpent } = res;
      if (result === 1) {
        setCategory(data);
        setTotalSpent(totalSpent);
      }
    } catch (error) {
      console.log('error', error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSummary();
    fetchOverView();
    fetchCategory();
  }, [])

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview 
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data?.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} labels={labels} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyOverviewChart data={overview} series={series} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SpendingByCategoryChart categoryData={category} totalSpent={totalSpent} />
        </Grid>
      </Grid>
    </Box>
  );
}
