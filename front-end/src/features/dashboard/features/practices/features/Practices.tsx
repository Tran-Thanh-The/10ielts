import PracticeFilter from '@/features/dashboard/features/practices/components/PracticeFilter/PracticeFilter';
import PracticeGroup from '@/features/dashboard/features/practices/components/PracticeGroup/PracticeGroup';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { EPracticeFilter } from '@/types/enum/practice.enum';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Practices() {
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState(EPracticeFilter.ALL);

  useEffect(() => {
    dispatch(setAppLoading(true));
    setTimeout(() => {
      dispatch(setAppLoading(false));
    }, 600);
  }, [filter]);

  return (
    <FeatureLayout>
      <Box>
        <PracticeFilter value={filter} onChange={setFilter} />

        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Danh sách bộ đề</Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <PracticeGroup />
            <PracticeGroup />
            <PracticeGroup />
            <PracticeGroup />
          </Box>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
