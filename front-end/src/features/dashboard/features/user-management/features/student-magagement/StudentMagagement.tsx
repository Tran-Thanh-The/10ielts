import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import UserListTab from '@/features/dashboard/features/user-management/features/user-list/components/user-list-tab/UserListTab';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box } from '@mui/material';

function StudentMagagement() {
  return (
    <FeatureLayout>
      <FeatureHeader title="Quản lý học sinh">
        <UserFilter />
      </FeatureHeader>

      <Box sx={{ width: '100%' }}>
        <UserListTab userList={true} />
      </Box>
    </FeatureLayout>
  );
}

export default StudentMagagement;
