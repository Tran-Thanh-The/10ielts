import AllInboxIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/Category';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupsIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import * as React from 'react';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';

enum EAppPath {
  CHAT = '/dashboard/chat',
  COURSES = '/dashboard/courses',
  COURSES_LIST = '/dashboard/courses/list',
  COURSES_CATEGORY = '/dashboard/courses/category',
  PRACTICES = '/dashboard/practices',
  PRACTICES_LIST = '/dashboard/practices/list',
  PRACTICES_CATEGORY = '/dashboard/practices/category',
  PAYMENTS = '/dashboard/payments',
  INSIGHTS = '/dashboard/insights',
  MAGAGER = '/dashboard/user-management',
  MANAGE_STUDENT = '/dashboard/user-management/student',
  MANAGE_STAFF = '/dashboard/user-management/staff',
  MANAGE_ROLE = '/dashboard/user-management/role',
}

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('location.pathname', location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar>
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0)
                return {
                  fontSize: '14px',
                  fontWeight: 700,
                  color: active ? '#0071f9' : '#4b5563',
                  backgroundColor: active ? '#ebf5ff' : undefined,
                };

              if (level === 1)
                return {
                  fontSize: '14px',
                  fontWeight: 700,
                  color: active ? '#0071f9' : '#4b5563',
                  backgroundColor: active ? '#ebf5ff' : undefined,
                };
            },
          }}
        >
          <MenuItem
            icon={<AllInboxIcon />}
            active={location.pathname.startsWith(EAppPath.CHAT)}
            onClick={() => navigate(EAppPath.CHAT)}
          >
            Tin nhắn
          </MenuItem>
          <SubMenu
            defaultOpen={location.pathname.startsWith(EAppPath.COURSES)}
            label="Khóa học"
            icon={<MenuBookIcon />}
            active={location.pathname.startsWith(EAppPath.COURSES)}
          >
            <MenuItem
              icon={<FormatListBulletedIcon />}
              active={location.pathname.startsWith(EAppPath.COURSES_LIST)}
              onClick={() => navigate(EAppPath.COURSES_LIST)}
            >
              Danh sách khóa học
            </MenuItem>
            <MenuItem
              icon={<CategoryIcon />}
              active={location.pathname.startsWith(EAppPath.COURSES_CATEGORY)}
              onClick={() => navigate(EAppPath.COURSES_CATEGORY)}
            >
              Danh mục
            </MenuItem>
          </SubMenu>
          <SubMenu
            defaultOpen={location.pathname.startsWith(EAppPath.PRACTICES)}
            label="Luyện tập"
            icon={<SchoolIcon />}
            active={location.pathname.startsWith(EAppPath.PRACTICES)}
          >
            <MenuItem
              icon={<FormatListBulletedIcon />}
              active={location.pathname.startsWith(EAppPath.PRACTICES_LIST)}
              onClick={() => navigate(EAppPath.PRACTICES_LIST)}
            >
              Danh sách luyện tập
            </MenuItem>
            <MenuItem
              icon={<CategoryIcon />}
              active={location.pathname.startsWith(EAppPath.PRACTICES_CATEGORY)}
              onClick={() => navigate(EAppPath.PRACTICES_CATEGORY)}
            >
              Quản lý nộp bài
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<PaymentIcon />}
            active={location.pathname.startsWith(EAppPath.PAYMENTS)}
            onClick={() => navigate(EAppPath.PAYMENTS)}
          >
            Hóa đơn
          </MenuItem>
          <MenuItem
            icon={<InsightsIcon />}
            active={location.pathname.startsWith(EAppPath.INSIGHTS)}
            onClick={() => navigate(EAppPath.INSIGHTS)}
          >
            Thống kê
          </MenuItem>
          <SubMenu
            defaultOpen={location.pathname.startsWith(EAppPath.MAGAGER)}
            label="Quản lý người dùng"
            icon={<GroupsIcon />}
            active={location.pathname.startsWith(EAppPath.MAGAGER)}
          >
            <MenuItem
              icon={<PersonIcon />}
              active={location.pathname.startsWith(EAppPath.MANAGE_STUDENT)}
              onClick={() => navigate(EAppPath.MANAGE_STUDENT)}
            >
              Quản lý học sinh
            </MenuItem>
            <MenuItem
              icon={<ManageAccountsIcon />}
              active={location.pathname.startsWith(EAppPath.MANAGE_STAFF)}
              onClick={() => navigate(EAppPath.MANAGE_STAFF)}
            >
              Quản lý nhân viên
            </MenuItem>
            <MenuItem
              icon={<FingerprintIcon />}
              active={location.pathname.startsWith(EAppPath.MANAGE_ROLE)}
              onClick={() => navigate(EAppPath.MANAGE_ROLE)}
            >
              Quản lý quản lý role
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
}
