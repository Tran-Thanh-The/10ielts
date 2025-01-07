import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import UserListTab from '@/features/dashboard/features/user-management/features/user-list/components/user-list-tab/UserListTab';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box } from '@mui/material';

function StaffMagagement() {
  return (
    <FeatureLayout>
      <FeatureHeader title="Quản lý nhân viên">
        <UserFilter buttonLabel='Tạo nhân viên' />
      </FeatureHeader>

      <Box sx={{ width: '100%' }}>
        <UserListTab userList={false} />
      </Box>
    </FeatureLayout>
  );
}

export default StaffMagagement;
