/**
 * UI components adapted from Material UI Free Templates.
 * Reference: https://mui.com/store/#free-templates
 * Minor design and logic changes applied.
 */

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../components/shared-theme/AppTheme';
import MainGrid from '../components/MainGrid';
import MainGridTable from '../components/MainGridTable';

export default function TransactionsPage(props) {
  return (
    <AppTheme {...props} >
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu selected={2}/>
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGridTable />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
