/**
 * UI components adapted from Material UI Free Templates.
 * Reference: https://mui.com/store/#free-templates
 * Minor design and logic changes applied.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { getBudgets, createBudget } from '../services/budgetService';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import { useAuth } from '../context/AuthContext';
import { checkUserRole } from '../services/authService';
import { useNavigate } from 'react-router-dom';
export default function MainGridBudget() {
  const currentDate = new Date();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { handleToast } = useAuth();
  const navigate = useNavigate();
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await getBudgets();
      const { data, result, message } = res;
      if (result === 1) {
        setBudgets(data);
      }
      setLoading(false);
    } catch (error) {
      console.log('error', error.message);
      setLoading(false);
    }
  };
  const checkRole = async () => {
    const res = await checkUserRole();
    const { result, message } = res;
    if (result !== 1) {
      handleToast('You dont have Access to this page', 'error');
      navigate('/dashboard');
    }
    return true
  };
  useEffect(() => {
    const initialLoad = async () => {
      await checkRole();
      fetchBudgets();
    }
    initialLoad();
  }, []);

  useEffect(() => {
    const futureMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    setMonths(futureMonths);

    const futureYears = Array.from({ length: 5 }, (_, index) => currentYear + index);
    setYears(futureYears);
  }, [currentMonth, currentYear]);

  const handleOpenBudgetDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseBudgetDialog = () => {
    setDialogOpen(false);
  };

  const handleAdd = async () => {
    try {
      const res = await createBudget({ month: Number(month), year: Number(year), amount: Number(amount) });
      const { result, message } = res;
      if (result === 1) {
        handleCloseBudgetDialog();
        handleToast(message, 'success')
        fetchBudgets();
      }
    } catch (error) {
      console.error('Failed to add budget:', error);
      handleToast(error.response?.data?.message || 'Failed', "error");
    }
  };

  const handleMonthChange = (e) => {
    const selectedMonth = Number(e.target.value);
    setMonth(selectedMonth);

    if (selectedMonth < currentMonth) {
      setYear(currentYear);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, p: 2 }}>

      <Typography variant="p" sx={{ mb: 3 }}>Budgets created for future dates will be displayed accordingly.</Typography>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Monthly Budget
      </Typography>

      {loading ? <Box sx={{ width: '100%' }}><LinearProgress /></Box> :
        budgets?.length > 0 ?
          budgets
            .sort((a, b) => {
              if (b.year === a.year) return b.month - a.month;
              return b.year - a.year;
            })
            .map((budget, index) => {
              const {
                month,
                year,
                budget: budgetAmount,
                spent,
                remaining,
                overBudget,
                percentageSpent,
              } = budget;

              const monthLabel = new Date(year, month - 1).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              });

              return (
                <Card sx={{ mb: 3, p: 2 }} key={`${month}-${year}`}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1">{monthLabel}</Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">Budget Amount </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h6" color="primary">
                            ₹{budgetAmount.toLocaleString()}
                          </Typography>
                          {/* <IconButton size="small" onClick={handleOpenBudgetDialog}>
                            <EditIcon fontSize="small" />
                          </IconButton> */}
                        </Stack>
                      </Stack>

                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentageSpent}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#eee',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: overBudget ? '#d32f2f' : '#2e7d32',
                            },
                          }}
                        />
                      </Box>

                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            Spent: ₹{spent.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="body2" color="textSecondary">
                            Remaining: ₹{remaining.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              );
            }) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                px: 2,
                border: '1px dashed #ccc',
                borderRadius: 2,
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Budget Records Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You haven't added any budgets yet. Click the button below to set your monthly budget.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleOpenBudgetDialog}
              >
                Set Monthly Budget
              </Button>
            </Box>
          )}

      <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 3 }}>
        <Button variant="outlined" onClick={handleOpenBudgetDialog}>
          Set Monthly Budget
        </Button>
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseBudgetDialog}>
        <DialogTitle>Set Monthly Budget</DialogTitle>
        <DialogContent>
          <FormLabel>Month</FormLabel>
          <TextField
            select
            fullWidth
            margin="dense"
            value={month}
            onChange={handleMonthChange}
          >
            {months.map((m) => (
              <MenuItem key={m}
                value={m}
                disabled={m < currentMonth && year === currentYear} >{monthNames[m - 1]} </MenuItem>
            ))}
          </TextField>
          <FormLabel>Year</FormLabel>
          <TextField
            select
            fullWidth
            margin="dense"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </TextField>
          <FormLabel>Amount</FormLabel>
          <TextField
            type="number"
            fullWidth
            margin="dense"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBudgetDialog}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
