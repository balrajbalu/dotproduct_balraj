import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from './CustomizedDataGrid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import { useState } from 'react';
import { getTransaction, createTransaction } from '../services/transactionService';
import { getCategoriesList } from '../services/categoryService';
import { useEffect, useRef } from 'react';
import Chip from '@mui/material/Chip';
import { useAuth } from '../context/AuthContext';

function renderStatus(type) {
    const colors = {
        income: 'success',
        expense: 'error',
    };

    return <Chip label={type} color={colors[type]} size="small" />;
}
export default function MainGrid() {
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState('income');
    const { handleToast } = useAuth();
    const [formValues, setFormValues] = React.useState({
        date: '',
        category: '',
        description: '',
        amount: '',
        account: '',
        entryType: ''
    });
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        {
            field: 'date',
            headerName: 'Date',
            flex: 1.5,
            minWidth: 200,
            valueFormatter: (params) => {
                const date = new Date(params);
                return date.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            }
        },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.value),
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'account',
            headerName: 'Account',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 150,
        },
    ]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [categories, setCategories] = useState([]);
    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await getTransaction({
                page,
                limit,
                startDate,
                endDate,
                minAmount,
                maxAmount,
            });

            const { data, result, message, pagination } = res;
            if (result === 1) {
                setRows(data);
                setTotalRows(pagination.total);
            }
        } catch (error) {
            console.log('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const [initialLoad, setInitialLoad] = useState(true);
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (initialLoad) {
            fetchTransactions();
            setInitialLoad(false);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            fetchTransactions();
        }, 500);

        return () => clearTimeout(debounceTimer.current);
    }, [startDate, endDate, minAmount, maxAmount, page, limit]);
    const fetchCategory = async () => {
        try {
            const res = await getCategoriesList();
            const { data, result } = res;
            if (result === 1) {
                setCategories(data);
            }
        } catch (error) {
            console.log('error', error.message);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);
    const handleOpen = (entryType) => {
        setType(entryType);
        setFormValues({ date: '', category: '', description: '', amount: '', account: '', entryType: entryType });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    // const handleSubmit = () => {
    //     console.log(type.toUpperCase(), formValues);
    //     setOpen(false);
    // };
    const handleSubmit = async () => {
        try {
            const res = await createTransaction(formValues);
            const { result, message  } = res;
            if (result === 1) {
                setOpen();
                fetchTransactions();
                handleToast(message || 'Success', "success");
            }
        } catch (error) {
            console.error('Failed to add budget:', error);
            handleToast(error.response?.data?.message || 'Login failed', "error");
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Add Income / Expense
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => handleOpen('income')}
                >
                    Add Income
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleOpen('expense')}
                >
                    Add Expense
                </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <FormLabel>Start Date</FormLabel>
                    <TextField
                        fullWidth
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FormLabel>End Date</FormLabel>
                    <TextField
                        fullWidth
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FormLabel>Min Amount</FormLabel>
                    <TextField
                        fullWidth
                        type="number"
                        value={minAmount || ''}
                        onChange={(e) => setMinAmount(e.target.value)}
                        size="small"
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FormLabel>Max Amount</FormLabel>
                    <TextField
                        fullWidth
                        id="max-amount"
                        type="number"
                        value={maxAmount || ''}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        size="small"
                    />
                </Box>
            </Stack>

            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >

                <Grid size={{ xs: 12, md: 12 }}>
                    <CustomizedDataGrid
                        rows={rows}
                        columns={columns}
                        page={page}
                        pageSize={limit}
                        onPageChange={(newPage) => setPage(newPage)}
                        onPageSizeChange={(newSize) => {
                            setLimit(newSize);
                            setPage(1);
                        }}
                        loading={loading}
                        totalRows={totalRows}
                    />
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{`Add ${type === 'income' ? 'Income' : 'Expense'}`}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="date">Date</FormLabel>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formValues.date}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="entryType">Type</FormLabel>
                                <TextField
                                    fullWidth
                                    select
                                    id="entryType"
                                    name="entryType"
                                    value={formValues.entryType}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </TextField>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="category">Category</FormLabel>
                                <TextField
                                    fullWidth
                                    select
                                    id="category"
                                    name="category"
                                    value={formValues.category}
                                    onChange={handleChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    placeholder="E.g., July Rent or Client Payment"
                                    value={formValues.description}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="amount">Amount</FormLabel>
                                <TextField
                                    fullWidth
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={formValues.amount}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box sx={{ minWidth: 250, mb: 2 }}>
                                <FormLabel htmlFor="account">Account</FormLabel>
                                <TextField
                                    fullWidth
                                    id="account"
                                    name="account"
                                    placeholder="E.g., Bank, Cash, UPI"
                                    value={formValues.account}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
