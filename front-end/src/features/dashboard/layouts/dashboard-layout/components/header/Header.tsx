import logo from '@/assets/logo.svg';
import HeaderAction from '@/features/public-pages/layouts/header/components/header-action/HeaderAction';
import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = () => {
    navigate('/');
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
              cursor: 'pointer', // Thêm hiệu ứng chỉ tay khi hover
            }}
            alt="header-logo"
            src={logo}
            onClick={handleLogoClick} // Điều hướng khi click
          />
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
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
