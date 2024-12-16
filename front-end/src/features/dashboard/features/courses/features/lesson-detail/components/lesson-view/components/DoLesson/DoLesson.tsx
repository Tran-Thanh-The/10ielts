import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import { useSelector } from 'react-redux';

export default function DoLesson({ lesson, course }: any) {
  const { idCourse, selectedLessonId } = useParams();
  const isStudentDashboard = useSelector(selectIsStudentDashboard);
  const navigate = useNavigate();

  const handleNextLesson = () => {
    const index = course?.lessons.findIndex(
      (item: any) => item.id === selectedLessonId,
    );
    if (index !== -1) {
      const nextLesson = course?.lessons[index + 1];
      if (nextLesson) {
        navigate(`/dashboard/courses/${idCourse}/lesson/${nextLesson.id}`);
      }
    }
  };

  const handleBackLesson = () => {
    const index = course?.lessons.findIndex(
      (item: any) => item.id === selectedLessonId,
    );
    if (index !== -1) {
      const backLesson = course?.lessons[index - 1];
      if (backLesson) {
        navigate(`/dashboard/courses/${idCourse}/lesson/${backLesson.id}`);
      }
    }
  };
  return (
    <>
      <Box>
        {lesson?.lessonType === 'VIDEO' ? (
          <video
            width="100%"
            height="auto"
            src={
              lesson?.file?.path ??
              'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4'
            }
            controls
          />
        ) : lesson?.lessonType === 'DOCS' ? (
          <iframe
            src={lesson?.file?.path ?? 'https://pdfobject.com/pdf/sample.pdf'}
            width="100%"
            height="600px"
          />
        ) : (
          <QuestionList questions={lesson?.questions} readOnly={!isStudentDashboard}></QuestionList>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '24px',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackLesson}
        >
          Bài học trước
        </Button>

        <Button
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNextLesson}
        >
          Bài học tiếp theo
        </Button>
      </Box>

      <Box sx={{ padding: '12px 0' }}>
        <Typography variant="h6">Mô tả bài học</Typography>
        <Typography>{lesson?.content}</Typography>
      </Box>

      <Box sx={{ padding: '12px 0' }}>
        <Typography variant="h6">Đánh giá</Typography>
        <Typography>comming soom</Typography>
      </Box>
    </>
  );
}
