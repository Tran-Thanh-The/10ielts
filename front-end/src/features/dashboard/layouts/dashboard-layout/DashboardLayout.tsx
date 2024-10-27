import Header from '@/features/dashboard/layouts/dashboard-layout/components/header/Header';
import Sidebar from '@/features/dashboard/layouts/dashboard-layout/components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const isLessonDetailPage = /\/dashboard\/courses\/[^/]+\/lesson\/[^/]+/.test(
    location.pathname,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          paddingTop: '64px',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {!isLessonDetailPage && <Sidebar />}
        <Box flex={1}>{children || <Outlet />}</Box>
      </Box>
    </Box>
  );
}
