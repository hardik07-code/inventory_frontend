import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      
      {/* top bar for phone */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              <Menu size={24} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="text.primary" fontWeight="bold">
              StockUI
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: { xs: 7, md: 0 },
          width: { xs: '100%', md: `calc(100% - 260px)` },
          maxWidth: 1600,
          mx: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
