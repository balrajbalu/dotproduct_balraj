import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Adjust path as per your route config
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Typography variant="h3" gutterBottom color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Sorry, the page you’re looking for doesn’t exist - This Site is implemented for Assessment Purpose and only required pages are developed <br/>if full integration needed contact - baludeveloper06@gmail.com.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}
