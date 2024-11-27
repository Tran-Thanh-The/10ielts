import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Breadcrumbs, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { setAppLoading } from '@/stores/slices/appSlice';
import { useDispatch } from 'react-redux';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';

export default function PracticeDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [countDown, setCountDown] = React.useState(30 * 60);

  useEffect(() => {
    dispatch(setAppLoading(true));
    setTimeout(() => {
      dispatch(setAppLoading(false));
    }, 600);

    // const interval = setInterval(() => {
    //   if (countDown <= 0) {
    //     clearInterval(interval);
    //     return;
    //   }
    //   setCountDown((prev) => prev - 1);
    // }, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown <= 0) {
        clearInterval(interval);
        return;
      }
      setCountDown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countDown]);

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb">
        <Breadcrumb
          component="a"
          href="#"
          label="Khóa học"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/practices')}
        />
        <Breadcrumb label={'Đề số 1'} component="a" href="#" />
      </Breadcrumbs>
      <Box
        sx={{
          paddingTop: '12px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button
            variant='outlined'
          >
            {Math.floor(countDown / 60)}:{countDown % 60}
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/dashboard/practices')}
          >
            Nộp bài
          </Button>
        </Box>

        <QuestionList />
      </Box>
    </FeatureLayout>
  );
}
