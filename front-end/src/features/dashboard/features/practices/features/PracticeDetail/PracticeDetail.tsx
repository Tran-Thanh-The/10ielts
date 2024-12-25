import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Breadcrumbs, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {
  selectDoExerciseForm,
  setAppLoading,
  setDoExerciseForm,
} from '@/stores/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE } from '@/utils/constants/constants';
import {
  deletePractice,
  deleteQuestion,
  getPracticeExerciseById,
  submitExercice,
} from '@/api/api';
import { toast } from 'react-toastify';
import { EPracticeType } from '@/types/enum/practice.enum';
import PracticeWriting from '@/features/dashboard/features/practices/components/PracticeWriting/PracticeWriting';
import PracticeSpeaking from '@/features/dashboard/features/practices/components/PracticeSpeaking/PracticeSpeaking';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import CreatePracticeModal from '@/features/dashboard/features/practices/components/CreatePracticeModal/CreatePracticeModal';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import QuestionFormModal from '@/features/dashboard/components/quesion/question-form/QuestionForm';
import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import Swal from 'sweetalert2';
import { LessonTypes } from '@/types/enum/LessonType';
import ViewHistory from '@/features/dashboard/components/view-history/ViewHistory';

export default function PracticeDetail() {
  const { idPractice } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exerciseForm = useSelector(selectDoExerciseForm);
  const isStudentDashboard = useSelector(selectIsStudentDashboard);
  const [countDown, setCountDown] = React.useState(30 * 60);
  const [practiceDetail, setPracticeDetail] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [openQuestionForm, setOpenQuestionForm] = React.useState(false);
  const [doing, setDoing] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);

  useEffect(() => {
    fetchPracticeDetail();
  }, [reload]);

  useEffect(() => {
    if (
      practiceDetail?.practiceType === EPracticeType.LISTENING ||
      practiceDetail?.practiceType === EPracticeType.READING
    ) {
      dispatch(setDoExerciseForm(practiceDetail?.questions));
    } else if (
      practiceDetail?.practiceType === EPracticeType.WRITING ||
      practiceDetail?.practiceType === EPracticeType.SPEAKING
    ) {
      dispatch(
        setDoExerciseForm({
          audioAnswer: undefined,
          startedAt: new Date().toISOString(),
          totalScore: 0,
          practice_id: practiceDetail?.id,
          writingAnswer: '',
        }),
      );
    }

    return () => {
      dispatch(setDoExerciseForm(null));
    };
  }, [practiceDetail?.id, reload]);

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

  const handleDeletePractice = () => {
    deletePractice(idPractice).then(() => {
      toast.success('Practice deleted successfully');
      navigate('/dashboard/practices');
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (questionId) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
        showDenyButton: true,
        confirmButtonText: `Xóa`,
        denyButtonText: `Hủy`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteQuestion(questionId);
          setReload((prev) => !prev);
        }
      });
    }
  };

  const handleSubmit = () => {
    switch (practiceDetail?.practiceType) {
      case EPracticeType.LISTENING:
      case EPracticeType.READING:
        const correctQuestions = exerciseForm.reduce(
          (acc: number, item: any) => {
            const correctAnswer =
              item.questionType === 'INPUT'
                ? item.answers[0].content
                : item.answers.find((answer: any) => answer.isCorrect)?.id;
            return item.userAnswer === correctAnswer ? acc + 1 : acc;
          },
          0,
        );

        const score = Math.round(
          (correctQuestions / exerciseForm.length) * 100,
        );

        submitExercice({
          practice_id: idPractice,
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
            setDoing(false);
            setReload((prev) => !prev);
          });
        });
        break;
      case EPracticeType.WRITING:
        submitExercice({
          practice_id: idPractice,
          totalScore: 0,
          startedAt: new Date().toISOString(),
          answers: [],
          writingAnswer: exerciseForm.writingAnswer,
        }).then((res) => {
          setDoing(false);
          setReload((prev) => !prev);
          Swal.fire({
            icon: 'success',
            title: 'Nộp bài thành công',
            text: `Bạn đã nộp bài viết, Hãy chờ giáo viên kiểm tra`,
          });
        });
        break;
      case EPracticeType.SPEAKING:
        submitExercice(
          {
            practice_id: idPractice,
            totalScore: 0,
            startedAt: new Date().toISOString(),
            answers: [],
            audioAnswer: exerciseForm.audioAnswer,
          },
          {
            'Content-Type': 'multipart/form-data',
          },
        ).then((res) => {
          setDoing(false);
          setReload((prev) => !prev);
          Swal.fire({
            icon: 'success',
            title: 'Nộp bài thành công',
            text: `Bạn đã nộp bài nói, Hãy chờ giáo viên kiểm tra`,
          });
        });
        break;
      default:
        break;
    }
  };

  const handleViewHistory = () => {
    setOpenHistory(true);
  };

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb">
        <Breadcrumb
          component="a"
          href="#"
          label="Luyện tập"
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
        <FeatureHeader
          title={practiceDetail?.title}
          description={practiceDetail?.description}
        >
          <RoleBasedComponent allowedRoles={[ROLE.USER]}>
            {doing ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <Button variant="outlined" size="small">
                  {Math.floor(countDown / 60)}:{countDown % 60}
                </Button>

                <Button variant="contained" onClick={handleSubmit} size="small">
                  Nộp bài
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  onClick={handleViewHistory}
                >
                  Lịch sử nộp bài
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDoing(true);
                    setCountDown(30 * 60);
                  }}
                  size="small"
                >
                  Làm bài
                </Button>
              </Box>
            )}
          </RoleBasedComponent>

          <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpen(true)}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeletePractice}
                size="small"
              >
                Xóa
              </Button>
            </Box>
          </RoleBasedComponent>
        </FeatureHeader>

        <Box
          sx={{
            filter: !doing ? 'blur(5px)' : 'none',
            pointerEvents: !doing ? 'none' : 'auto',
          }}
        >
          {practiceDetail?.practiceType === EPracticeType.READING ||
          practiceDetail?.practiceType === EPracticeType.LISTENING ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginTop: '20px',
              }}
            >
              <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    sx={{
                      width: '160px',
                    }}
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenQuestionForm(true)}
                  >
                    Tạo câu hỏi
                  </Button>
                </Box>
              </RoleBasedComponent>

              {openQuestionForm && (
                <QuestionFormModal
                  open={openQuestionForm}
                  onClose={setOpenQuestionForm}
                  onOk={() => {
                    setReload((prev) => !prev);
                    setOpenQuestionForm(false);
                  }}
                ></QuestionFormModal>
              )}
              <Box>
                {practiceDetail?.questions?.map(
                  (question: any, index: number) => (
                    <QuestionDetail
                      key={question.id}
                      question={question}
                      index={index}
                      readOnly={!isStudentDashboard}
                      onDelete={() => handleDeleteQuestion(question.id)}
                      onEdit={() => {}}
                    ></QuestionDetail>
                  ),
                )}
              </Box>
            </Box>
          ) : practiceDetail?.practiceType === EPracticeType.WRITING ? (
            <PracticeWriting data={practiceDetail} />
          ) : (
            <PracticeSpeaking data={practiceDetail} />
          )}
        </Box>

        <CreatePracticeModal
          open={open}
          onClose={setOpen}
          onOk={() => {
            setReload(!reload);
          }}
          data={practiceDetail}
        />

        {openHistory ? (
          <ViewHistory
            open={openHistory}
            onClose={() => setOpenHistory(false)}
            data={practiceDetail}
            onOk={() => setOpenHistory(false)}
            lessonView={false}
          />
        ) : null}
      </Box>
    </FeatureLayout>
  );
}
