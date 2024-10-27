import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Box, Link } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useLocation, useNavigate } from 'react-router-dom';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import PaymentIcon from '@mui/icons-material/Payment';
import GroupsIcon from '@mui/icons-material/Groups';

const DASHBOARD_SIDEBAR = [
  {
    title: 'Nhắn tin',
    icon: <AllInboxIcon />,
    href: '/dashboard/chat',
  },
  {
    title: 'Khóa học',
    icon: <MenuBookIcon />,
    href: '/dashboard/courses',
  },
  {
    title: 'Luyện tập',
    icon: <SchoolIcon />,
    href: '/dashboard/practices',
  },
  {
    title: 'Hóa đơn',
    icon: <PaymentIcon />,
    href: '/dashboard/payments',
  },
  {
    title: 'Quản lý nhân viên',
    icon: <GroupsIcon />,
    href: '/dashboard/user-management',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const router = useLocation();

  return (
    <Box
      sx={{
        borderRight: '1px solid #e0e0e0',
        padding: '16px',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
    >
      {/* <Divider /> */}
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          margin: 0,
          gap: '4px',
          minWidth: "196px",
        }}
      >
        {DASHBOARD_SIDEBAR.map((item) => (
          <ListItem
            sx={{
              '& .MuiButtonBase-root': {
                backgroundColor: router.pathname.includes(item.href)
                  ? '#ebf5ff'
                  : 'transparent',
                borderRadius: '12px !important',
                overflow: 'hidden',
                padding: '14px 16px',
                '&: hover': {
                  borderRadius: '12px',
                  overflow: 'hidden',
                },

                '& .MuiListItemIcon-root': {
                  minWidth: '36px',
                },
              },
            }}
            key={item.title}
            disablePadding
          >
            <ListItemButton onClick={() => navigate(item.href)}>
              <ListItemIcon
                sx={{
                  '& svg': {
                    color: router.pathname.includes(item.href)
                      ? '#0071f9'
                      : '#4b5563',
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  '& span': {
                    fontSize: '14px',
                    fontWeight: '700',
                    color: router.pathname.includes(item.href)
                      ? '#0071f9'
                      : '#4b5563',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
