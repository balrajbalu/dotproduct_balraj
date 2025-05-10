import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    FormLabel,
    Grid,
} from '@mui/material';
import { getCategories, createCategory } from '../services/categoryService';
import CustomizedDataGrid from './CustomizedDataGrid';
import { useAuth } from '../context/AuthContext';
const sampleCategories = [
    { id: 1, name: 'Salary', type: 'income', description: 'Monthly job income' },
    { id: 2, name: 'Groceries', type: 'expense', description: 'Food & household' },
    { id: 3, name: 'Freelancing', type: 'income', description: 'Side project work' },
];
const columns = [
    { field: 'name', headerName: 'Category Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 0.5 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
];

export default function MainGridCategories() {
    const [open, setOpen] = useState(false);
    const [categoryType, setCategoryType] = useState('income');
    const [formValues, setFormValues] = useState({ name: '', type: 'income', description: '' });
    const [rows, setRows] = useState([]);
    const { handleToast } = useAuth();
    const [columns, setColumns] = useState([
        { field: 'name', headerName: 'Name', flex: 1, },
        {
            field: 'type',
            headerName: 'Type',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
        }
    ]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const res = await getCategories({
                page,
                limit,
                name,
                type
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

    useEffect(() => {
        fetchCategory();
    }, [page, limit, name, type]);
    const handleOpen = () => {
        setFormValues({ name: '', type: categoryType, description: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await createCategory(formValues);
            const { result, message } = res;
            if (result === 1) {
                handleToast(message, 'success');
                setOpen();
                fetchCategory();
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            handleToast(error.response?.data?.message || 'Failed', "error");
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Manage Categories
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                    select
                    // label="Category Type"
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    size="small"
                    sx={{ width: 200 }}
                >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </TextField>

                <Button variant="contained" onClick={handleOpen}>
                    Add New Category
                </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                    <FormLabel htmlFor="name">Filter by Name</FormLabel>
                    <TextField
                        fullWidth
                        required
                        id="name"
                        name="name"
                        placeholder="e.g. Freelancing, Groceries"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FormLabel htmlFor="name">Filter by Type</FormLabel>
                    <TextField
                        fullWidth
                        select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        size="small"
                    >
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </TextField>
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
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormLabel htmlFor="name">Category Name</FormLabel>
                            <TextField
                                fullWidth
                                required
                                id="name"
                                name="name"
                                placeholder="e.g. Freelancing, Groceries"
                                value={formValues.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormLabel htmlFor="type">Type</FormLabel>
                            <TextField
                                fullWidth
                                select
                                id="type"
                                name="type"
                                value={formValues.type}
                                onChange={handleChange}
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <TextField
                                fullWidth
                                rows={3}
                                id="description"
                                name="description"
                                // placeholder="Optional description"
                                value={formValues.description}
                                onChange={handleChange}
                            />
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
