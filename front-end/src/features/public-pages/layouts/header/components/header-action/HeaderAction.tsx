import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import Swal from 'sweetalert2';
import * as navStyles from './HeaderAction.styles';
import { logout } from '@/features/auth/slices/authSlice';
import loginApi from '@/api/loginApi';

const HeaderAction = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRouterLogin = () => {
    navigate('/login');
  };

  const handleRouterDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate('/login');
      Swal.fire({
        title: 'Đăng xuất thành công!',
        text: 'Bạn đã đăng xuất khỏi hệ thống.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {});
    } catch (error) {
      Swal.fire({
        title: 'Đăng xuất thất bại',
        text: 'Vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'Thử lại',
      });
    }
  };

  return (
    <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
      <Grid className="button-action">
        {!user ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '44px' }}
            onClick={handleRouterLogin}
          >
            Bắt đầu
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '44px' }}
            onClick={handleRouterDashboard}
          >
            Bắt đầu học
          </Button>
        )}
      </Grid>

      {user && (
        <Grid>
          <Box>
            <Tooltip title="Thông tin cá nhân">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon
                  sx={{ color: '#0071f9', fontSize: '48px' }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Grid>
                <MenuItem sx={{ minWidth: 300 }}>
                  <Tooltip title="Xem chi tiết thông tin cá nhân">
                    <NavLink
                      to="/profile"
                      style={{
                        ...navStyles.navLinkStyle,
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <AccountCircleIcon
                        sx={{ color: '#0071f9', fontSize: '48px' }}
                      />
                      <Grid>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {user.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>
                          {user.email}
                        </Typography>
                      </Grid>
                    </NavLink>
                  </Tooltip>
                </MenuItem>

                <MenuItem sx={{ borderTop: '1px solid #6b7280' }}>
                  <NavLink
                    to="#"
                    style={{ ...navStyles.navLinkStyle, fontSize: '0.875rem' }}
                  >
                    Trao đổi về bài chấm chữa
                  </NavLink>
                </MenuItem>
                <MenuItem
                  sx={{
                    fontSize: '0.875rem',
                    borderBottom: '1px solid #6b7280',
                  }}
                >
                  <NavLink to="#" style={{ ...navStyles.navLinkStyle }}>
                    Cài đặt
                  </NavLink>
                </MenuItem>
                <MenuItem
                  sx={{ fontSize: '0.875rem', color: '#e20d2c' }}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </MenuItem>
              </Grid>
            </Menu>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default HeaderAction;
