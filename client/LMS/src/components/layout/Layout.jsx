import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery, Button } from '@mui/material';
import { Menu as MenuIcon, Dashboard, School, Assignment, Grade, Forum, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Tooltip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Courses', icon: <School />, path: '/courses' },
  { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
  { text: 'Grades', icon: <Grade />, path: '/grades' },
  { text: 'Forum', icon: <Forum />, path: '/forum' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser, isAuthenticated } = useAuth();

  const userInitial = currentUser?.name?.[0]?.toUpperCase() ?? currentUser?.email?.[0]?.toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            sx={{
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'primary.light' : 'primary.50',
              },
              borderRadius: 1,
              mx: 1,
              mb: 1,
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // If user is not logged in, render children without navigation
  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {children}
      </Box>
    );
  }

  // Render full layout with navigation for authenticated users
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="text.primary" sx={{ flexGrow: 1 }}>
            Learning Management System
          </Typography>
          <Tooltip title={currentUser?.name ?? 'User'}>
            <Avatar
              sx={{
                bgcolor: 'transparent',
                border: '2px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                width: 40,
                height: 40,
                mr: 2,
              }}
            >
              {userInitial}
            </Avatar>
          </Tooltip>
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ textTransform: 'none' }}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: 'none',
              background: 'linear-gradient(180deg, rgba(249,115,22,0.15) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,1) 100%)',
              backdropFilter: 'blur(18px)',
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              boxShadow: '15px 0 35px rgba(249, 115, 22, 0.12)',
              padding: '24px 12px',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;