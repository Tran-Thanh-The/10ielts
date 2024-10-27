import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '@/assets/logo.svg';
import HeaderAction from '@/features/public-pages/layouts/header/components/header-action/HeaderAction';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: '#fff',
        borderBottom: '2px solid #e5e7eb',
        boxShadow: 'none',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ background: '#fff', borderBottom: '2px solid e5e7eb' }}
      >
        <Toolbar disableGutters sx={{ background: '#fff' }}>
          <Box
            component="img"
            sx={{
              height: 'auto',
              width: 120,
              paddingLeft: '8px',
            }}
            alt="header-logo"
            src={logo}
          />
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              flexGrow: 0,
              '& > div': {
                marginTop: 0, 
              },
              '& .button-action': {
                display: 'none',
              },
            }}
          >
            <HeaderAction />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
