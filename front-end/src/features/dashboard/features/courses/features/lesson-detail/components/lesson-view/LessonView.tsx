import { getLessonDetailsById } from '@/api/api';
import courseApi from '@/api/courseApi';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { setAppLoading } from '@/stores/slices/appSlice';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';

export default function LessonView() {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    handleFetchData();
  }, [selectedLessonId]);

  const handleFetchData = async () => {
    dispatch(setAppLoading(true));
    const res1 = await courseApi.getCourseDetailsById(idCourse as string);
    setCourse(res1.data);
    const res2 = await getLessonDetailsById(selectedLessonId as string);
    setLesson(res2.data);
    dispatch(setAppLoading(false));
  };

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
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: '24px' }}>
        <Breadcrumb
          component="a"
          href="#"
          label="Khóa học"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/courses')}
        />
        <Breadcrumb
          label={course?.title}
          component="a"
          onClick={() => navigate(`/dashboard/courses/${idCourse}`)}
        />
        <Breadcrumb label={'Bài học'} component="a" href="#" />
      </Breadcrumbs>

      <FeatureHeader title={lesson?.title} />

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
          // <Box dangerouslySetInnerHTML={{ __html: lesson?.content }} />
          <QuestionList></QuestionList>
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

      <Box sx={{ padding: "12px 0" }}>
        <Typography variant='h6'>Mô tả bài học</Typography>
        <Typography>{lesson?.content}</Typography>
      </Box>

      <Box sx={{ padding: "12px 0" }}>
        <Typography variant='h6'>Đánh giá</Typography>
        <Typography>comming soom</Typography>
      </Box>
    </FeatureLayout>
  );
}
