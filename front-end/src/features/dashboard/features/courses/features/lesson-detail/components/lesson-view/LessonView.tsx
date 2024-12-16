import { getLessonDetailsById, getLessonDetailsByIdV2 } from '@/api/api';
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
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE, ROLES } from '@/utils/constants/constants';
import DoLesson from '@/features/dashboard/features/courses/features/lesson-detail/components/lesson-view/components/DoLesson/DoLesson';
import CreateUpdateLesson from '@/features/dashboard/features/courses/components/create-update-lesson/CreateUpdateLesson';
import CreateUpdateLessonForm from '@/features/dashboard/features/courses/components/create-update-lesson/components/CreateUpdateLessonForm/CreateUpdateLessonForm';

export default function LessonView() {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'VIEW' | 'EDIT'>('VIEW');

  useEffect(() => {
    handleFetchData();
  }, [selectedLessonId, viewMode]);

  const handleFetchData = async () => {
    dispatch(setAppLoading(true));
    const res1 = await courseApi.getCourseDetailsById(idCourse as string);
    setCourse(res1.data);
    const res2 = await getLessonDetailsByIdV2(selectedLessonId as string);
    setLesson(res2.data);
    dispatch(setAppLoading(false));
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

      <FeatureHeader
        title={`${viewMode === 'EDIT' ? 'Chỉnh sửa ' : ''}${lesson?.title}`}
      >
        <>
          <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {viewMode === 'VIEW' ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setViewMode('EDIT')}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setViewMode('VIEW')}
                >
                  Quay về
                </Button>
              )}
              <Button variant="outlined" size="small" color="error">
                Xóa
              </Button>
            </Box>
          </RoleBasedComponent>
        </>
      </FeatureHeader>

      {viewMode === 'VIEW' ? (
        <DoLesson lesson={lesson} course={course}></DoLesson>
      ) : (
        <CreateUpdateLessonForm />
      )}
    </FeatureLayout>
  );
}
