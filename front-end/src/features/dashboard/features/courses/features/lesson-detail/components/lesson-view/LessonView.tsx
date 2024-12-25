import {
  getLessonDetailsById,
  getLessonDetailsByIdV2,
  submitExercice,
  updateUserCouse,
} from '@/api/api';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectDoExerciseForm, setAppLoading } from '@/stores/slices/appSlice';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE, ROLES } from '@/utils/constants/constants';
import DoLesson from '@/features/dashboard/features/courses/features/lesson-detail/components/lesson-view/components/DoLesson/DoLesson';
import CreateUpdateLesson from '@/features/dashboard/features/courses/components/create-update-lesson/CreateUpdateLesson';
import CreateUpdateLessonForm from '@/features/dashboard/features/courses/components/create-update-lesson/components/CreateUpdateLessonForm/CreateUpdateLessonForm';
import { LessonTypes } from '@/types/enum/LessonType';
import Swal from 'sweetalert2';
import ViewHistory from '@/features/dashboard/components/view-history/ViewHistory';

export default function LessonView() {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const exerciseForm = useSelector(selectDoExerciseForm);
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [openHistory, setOpenHistory] = useState(false);

  useEffect(() => {
    if (
      user.role.name !== ROLE.USER ||
      !lesson?.lessonType ||
      lesson.lessonType == LessonTypes.Exercise
    )
      return;
    const timeout = setTimeout(() => {
      updateUserCouse({
        isCompleted: true,
        user_id: user.id + '',
        lesson_id: selectedLessonId as string,
      });
    }, 1000 * 60);
    return () => {
      clearTimeout(timeout);
    };
  }, [lesson?.lessonType]);

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

  const handleSubmit = () => {
    // console.log('exerciseForm', exerciseForm);
    const correctQuestions = exerciseForm.reduce((acc: number, item: any) => {
      const correctAnswer =
        item.questionType === 'INPUT'
          ? item.answers[0].content
          : item.answers.find((answer: any) => answer.isCorrect)?.id;
      return item.userAnswer === correctAnswer ? acc + 1 : acc;
    }, 0);

    const score = Math.round((correctQuestions / exerciseForm.length) * 100);

    submitExercice({
      lesson_id: selectedLessonId,
      totalScore: score,
      startedAt: new Date().toISOString(),
      answers: exerciseForm.map((item: any) => ({
        questionId: item.id,
        answerPick: item.userAnswer,
      })),
    }).then((res) => {
      Swal.fire({
        icon: 'success',
        title: 'Nộp bài thành công',
        text: `Bạn đã đạt được ${score} điểm`,
      }).then(() => {
        updateUserCouse({
          isCompleted: true,
          user_id: user.id + '',
          lesson_id: selectedLessonId as string,
        })
        const index = course?.lessons.findIndex(
          (item: any) => item.id === selectedLessonId,
        );
        if (index !== -1) {
          const nextLesson = course?.lessons[index + 1];
          if (nextLesson) {
            navigate(`/dashboard/courses/${idCourse}/lesson/${nextLesson.id}`);
          }
        }
      });
    });
  };

  const handleViewHistory = () => {
    setOpenHistory(true);
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

          <RoleBasedComponent allowedRoles={[ROLE.USER]}>
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {lesson?.lessonType === LessonTypes.Exercise ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={handleViewHistory}
                  >
                    Lịch sử nộp bài
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSubmit}
                  >
                    Nộp bài
                  </Button>
                </>
              ) : null}
            </Box>
          </RoleBasedComponent>
        </>
      </FeatureHeader>

      {viewMode === 'VIEW' ? (
        <DoLesson lesson={lesson} course={course}></DoLesson>
      ) : (
        <CreateUpdateLessonForm />
      )}

      {openHistory ? (
        <ViewHistory
          open={openHistory}
          onClose={() => setOpenHistory(false)}
          data={lesson}
          onOk={() => setOpenHistory(false)}
          lessonView={true}
        />
      ) : null}
    </FeatureLayout>
  );
}
