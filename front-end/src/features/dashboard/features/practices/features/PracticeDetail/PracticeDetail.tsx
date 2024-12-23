import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { setAppLoading } from '@/stores/slices/appSlice';
import { useDispatch } from 'react-redux';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE } from '@/utils/constants/constants';
import { getPracticeExerciseById } from '@/api/api';
import { toast } from 'react-toastify';
import { EPracticeType } from '@/types/enum/practice.enum';
import PracticeWriting from '@/features/dashboard/features/practices/components/PracticeWriting/PracticeWriting';
import PracticeSpeaking from '@/features/dashboard/features/practices/components/PracticeSpeaking/PracticeSpeaking';

export default function PracticeDetail() {
  const { idPractice } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countDown, setCountDown] = React.useState(30 * 60);
  const [practiceDetail, setPracticeDetail] = React.useState(null);

  useEffect(() => {
    fetchPracticeDetail();
  }, []);

  const fetchPracticeDetail = async () => {
    dispatch(setAppLoading(true));
    try {
      const response = await getPracticeExerciseById(idPractice);
      setPracticeDetail(response?.data);
    } catch (error) {
      toast.error('Failed to fetch practice detail');
    } finally {
      dispatch(setAppLoading(false));
    }
  };

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
        <Breadcrumb label={practiceDetail?.title} component="a" href="#" />
      </Breadcrumbs>
      <Box
        sx={{
          paddingTop: '12px',
        }}
      >
        <RoleBasedComponent allowedRoles={[ROLE.USER]}>
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
          >
            <Button variant="outlined">
              {Math.floor(countDown / 60)}:{countDown % 60}
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/practices')}
            >
              Nộp bài
            </Button>
          </Box>
        </RoleBasedComponent>

        <Box>
          <Typography variant="h6">{practiceDetail?.title}</Typography>
          <Typography variant="body1">{practiceDetail?.description}</Typography>
        </Box>

        {practiceDetail?.practiceType === EPracticeType.READING ||
        practiceDetail?.practiceType === EPracticeType.LISTENING ? (
          <QuestionList questions={practiceDetail?.questions} />
        ) : practiceDetail?.practiceType === EPracticeType.WRITING ? (
          <PracticeWriting data={practiceDetail} />
        ) : (
          <PracticeSpeaking data={practiceDetail} />
        )}

        {/* <QuestionList /> */}
      </Box>
    </FeatureLayout>
  );
}
