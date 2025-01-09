import { getPracticeExercises } from '@/api/api';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import CreatePracticeModal from '@/features/dashboard/features/practices/components/CreatePracticeModal/CreatePracticeModal';
import PracticeCard from '@/features/dashboard/features/practices/components/PracticeCard/PracticeCard';
import PracticeFilter from '@/features/dashboard/features/practices/components/PracticeFilter/PracticeFilter';
import PracticeGroup from '@/features/dashboard/features/practices/components/PracticeGroup/PracticeGroup';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { EPracticeFilter } from '@/types/enum/practice.enum';
import { ROLE } from '@/utils/constants/constants';
import { Box, Chip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Practices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isStudentDashboard = useSelector(selectIsStudentDashboard);
  const [filter, setFilter] = React.useState(EPracticeFilter.ALL);
  const [open, setOpen] = React.useState(false);
  const [practices, setPractices] = React.useState([]);

  useEffect(() => {
    fetchPractices();
  }, [filter]);

  const fetchPractices = async () => {
    dispatch(setAppLoading(true));
    getPracticeExercises().then((response) => {
      setPractices(
        response.data.data.filter((pratice) => {
          if (filter === EPracticeFilter.ALL) return true;
          return pratice.practiceType === filter;
        }),
      );
      dispatch(setAppLoading(false));
    });
  };

  return (
    <FeatureLayout>
      <Box>
        <RoleBasedComponent allowedRoles={[ROLE.USER]}>
          <PracticeFilter value={filter} onChange={setFilter} />
        </RoleBasedComponent>

        <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <UserFilter
              buttonLabel="Tạo bài luyện tập"
              onButtonClick={() => setOpen(true)}
            />
          </Box>
        </RoleBasedComponent>

        <Box sx={{ marginTop: '20px' }}>
          {isStudentDashboard ? (
            <Box>
              <Typography variant="h6">Bài luyện tập với AI</Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '24px',
                  padding: '16px 0px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    border: '1px solid #e0e0e0',
                    padding: '16px 24px 16px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('/dashboard/practices/ai');
                  }}
                >
                  <Box>
                    <img
                      width={60}
                      src="https://api.prep.vn/images/skills/test_practice/reading.png"
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6">Luyện tập đoc</Typography>
                    <Typography variant="body1">
                      <Chip label="Đang hoạt động" color="success" />
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 24px 16px 8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'default',
                  }}
                >
                  <Box>
                    <img
                      width={60}
                      src="https://api.prep.vn/images/skills/test_practice/speaking.png"
                    />
                  </Box>
                  <Box>
                    <Typography variant="h6">Phòng speaking ảo</Typography>
                    <Typography variant="body1">
                      <Chip label="Coming soon" />
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null}
          <Box>
            <Typography variant="h6">Danh sách bộ đề</Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 0px',
              }}
            >
              {practices.map((practice) => (
                <PracticeCard
                  key={practice.id}
                  title={practice.title}
                  data={practice}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <CreatePracticeModal
        open={open}
        onClose={setOpen}
        onOk={() => {}}
        data={[]}
      />
    </FeatureLayout>
  );
}
