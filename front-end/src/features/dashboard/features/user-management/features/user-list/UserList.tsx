import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import UserListTab from '@/features/dashboard/features/user-management/features/user-list/components/user-list-tab/UserListTab';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: '12px 0' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function UserList() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <FeatureLayout>
      <FeatureHeader title="Quản lý người dùng" />

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              borderTop: 'unset',
            }}
          >
            <Tab label="Học sinh" {...a11yProps(0)} />
            <Tab label="Nhân viên" {...a11yProps(1)} />
          </Tabs>
          <UserFilter />
        </Box>
        <CustomTabPanel value={value} index={0}>
          <UserListTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <UserListTab />
        </CustomTabPanel>
      </Box>
    </FeatureLayout>
  );
}

export default UserList;
