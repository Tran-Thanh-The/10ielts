import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  ClickAwayListener,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as navStyles from './HeaderNavigation.styles';
import MobileMenu from './HeaderNavigationMobile';

const HeaderNavigation = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [menuState, setMenuState] = useState({
    courses: false,
    blog: false,
    news: false,
  });

  const location = useLocation();
  const menuRefs = {
    courses: useRef(null),
    blog: useRef(null),
    news: useRef(null),
  };

  const routes = [
    {
      key: 'home',
      label: 'Trang chủ',
      path: '/',
      order: 1,
    },
    {
      key: 'courses',
      label: 'Khóa học',
      path: '/courses',
      // items: [
      //   { path: '/course1', label: 'Học Toeic' },
      //   { path: '/course2', label: 'Học Ielts' },
      // ],
      order: 2,
    },
    {
      key: 'inputTest',
      label: 'Kiểm tra đầu vào',
      path: '/test',
      order: 3,
    },
    {
      key: 'blog',
      label: 'Blog',
      items: [
        { path: '/blog1', label: 'Bài viết số 1' },
        { path: '/blog2', label: 'Bài viết số 2' },
      ],
      order: 4,
    },
    {
      key: 'news',
      label: 'Tin tức',
      items: [
        { path: '/news1', label: 'Tin số 1' },
        { path: '/news2', label: 'Tin số 2' },
      ],
      order: 5,
    },
  ].sort((a, b) => a.order - b.order);

  // Toggle submenu state
  const handleMenuToggle = (menu, state) => {
    setMenuState((prev) => ({ ...prev, [menu]: state }));
  };

  const isActive = (menu) => {
    return menu.items ? menu.items.some((route) => location.pathname.startsWith(route.path)) : location.pathname === menu.path;
  };

  const handleOpenNavMenu = () => setOpenDrawer(true);
  const handleCloseNavMenu = () => setOpenDrawer(false);

  const renderMenu = (menu) => (
    <Popper
      open={menuState[menu.key]}
      anchorEl={menuRefs[menu.key].current}
      placement="bottom-start"
      style={{ zIndex: 9999 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, -4],
          },
        },
      ]}
    >
      <ClickAwayListener onClickAway={() => handleMenuToggle(menu.key, false)}>
        <Paper
          onMouseEnter={() => handleMenuToggle(menu.key, true)}
          onMouseLeave={() => handleMenuToggle(menu.key, false)}
          sx={{ boxShadow: 3 }}
        >
          {menu.items && menu.items.map(({ path, label }) => (
            <MenuItem
              key={path}
              component={NavLink}
              to={path}
              onClick={() => handleMenuToggle(menu.key, false)}
              sx={{ ...navStyles.menuItemStyle }}
            >
              {label}
            </MenuItem>
          ))}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );

  return (
    <Box sx={navStyles.containerStyles}>

      {/* Mobile Menu Icon */}
      <IconButton onClick={handleOpenNavMenu} sx={{ display: { xs: 'flex', alignItems:'center', md: 'none', padding: '8px 14px' } }}>
        <MenuIcon sx={{ padding: 0, fontSize: '1.5rem' }} />
      </IconButton>

      {/* Mobile Drawer */}
      <MobileMenu
        openDrawer={openDrawer}
        handleCloseNavMenu={handleCloseNavMenu}
        routes={routes}
      />

      {/* Desktop Menu */}
      <Box sx={navStyles.desktopMenuStyles}>
        {routes.map((menu) => (
          <Box
            key={menu.key}
            ref={menuRefs[menu.key]}
            onMouseEnter={() => handleMenuToggle(menu.key, true)}
            onMouseLeave={() => handleMenuToggle(menu.key, false)}
            sx={{ ...navStyles.boxStyle, cursor: 'pointer'}}
          >
            {menu.items ? (
              <>
                <Typography sx={{ ...navStyles.textStyle, ...(isActive(menu) ? navStyles.activeStyle : {}) }} variant="body2">
                  {menu.label} <ArrowDropDownIcon sx={navStyles.arrowDownIconStyle} />
                </Typography>
                {renderMenu(menu)}
              </>
            ) : (
              <NavLink to={menu.path} style={navStyles.navLinkStyle}>
                {({ isActive }) => (
                  <Box>
                    <Typography sx={{ ...navStyles.textStyle, ...(isActive ? navStyles.activeStyle : {}) }} variant="body2">
                      {menu.label}
                    </Typography>
                  </Box>
                )}
              </NavLink>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HeaderNavigation;
