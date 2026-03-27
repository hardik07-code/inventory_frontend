import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, useTheme, useMediaQuery, AppBar, Toolbar } from '@mui/material';
import { LayoutDashboard, Package, History, Menu, FileText, LogOut, Building2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
  { text: 'Inventory', icon: <Package size={22} />, path: '/inventory' },
  { text: 'Suppliers', icon: <Building2 size={22} />, path: '/suppliers' },
  { text: 'Transactions', icon: <History size={22} />, path: '/transactions' },
  { text: 'Reports', icon: <FileText size={22} />, path: '/reports' },
];

export default function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', color: 'white', p: 1, borderRadius: 2, display: 'flex', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
          <Package size={24} />
        </Box>
        <Typography variant="h5" fontWeight="900" letterSpacing="-0.02em" color="text.primary">
          StockUI
        </Typography>
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 3,
                  mb: 0.5,
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.100' : 'rgba(0,0,0,0.04)',
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem' 
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              logout();
              navigate('/login');
            }}
            sx={{ 
              borderRadius: 3, 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'error.50', color: 'error.main' } 
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogOut size={22} />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // basic mobile fix
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: 3 },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
