import axiosInstance from '@/core/intercepter/Intercepter';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import ViewHistory from '@/features/dashboard/components/view-history/ViewHistory';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading, setDoExerciseForm } from '@/stores/slices/appSlice';
import { RootState } from '@/stores/store';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Box, Breadcrumbs, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function PracticeAI() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countDown, setCountDown] = React.useState(30 * 60);
  const [practiceDetail, setPracticeDetail] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [openQuestionForm, setOpenQuestionForm] = React.useState(false);
  const [doing, setDoing] = React.useState(false);
  const [openHistory, setOpenHistory] = React.useState(false);
  const [resetForm, setResetForm] = React.useState(false);
  const [generate, setGenerate] = React.useState(false);
  // const [questions, setQuestions] = React.useState([]);
  const questions = useSelector(
    (state: RootState) => state.appState.doExerciseForm,
  );

  useEffect(() => {
    dispatch(setAppLoading(true));
    axios.get('http://localhost:3003/generate-practice').then((response) => {
      console.log('response', response);
      const formattedData = response.data.map((item: any) => {
        return {
          id: new Date().getTime().toString() + Math.random(),
          title: item.question,
          time: 0,
          questionType: 'CHOICE',
          answers: item.options.map(
            (option: { isCorrect: boolean; text: string }) => ({
              id: new Date().getTime().toString() + Math.random(),
              content: option.text,
              answerType: 'CHOICE',
              status: 'ACTIVE',
              isCorrect: option.isCorrect,
            }),
          ),
        };
      });
      // setQuestions(formattedData);
      dispatch(setDoExerciseForm(formattedData));
      dispatch(setAppLoading(false));
    });

    // axiosInstance.get('ai/generate-practice').then((response) => {

    // });
  }, [generate]);

  const handleSubmit = () => {
    const correctQuestions = questions.reduce((acc: number, item: any) => {
      const correctAnswer = item.answers.find(
        (answer: any) => answer.isCorrect,
      )?.id;
      return item.userAnswer === correctAnswer ? acc + 1 : acc;
    }, 0);
    const score = Math.round((correctQuestions / questions.length) * 100);

    Swal.fire({
      icon: 'success',
      title: 'Nộp bài thành công',
      text: `Bạn đã đạt được ${score} điểm`,
    }).then(() => {
      setDoing(false);
      setGenerate((prev) => !prev);
    });
    // dispatch(setAppLoading(true));
    // setResetForm((prev) => !prev);
    // switch (practiceDetail?.practiceType) {
    //   case EPracticeType.LISTENING:
    //   case EPracticeType.READING:
    //     const correctQuestions = exerciseForm.reduce(
    //       (acc: number, item: any) => {
    //         const correctAnswer =
    //           item.questionType === 'INPUT'
    //             ? item.answers[0].content
    //             : item.answers.find((answer: any) => answer.isCorrect)?.id;
    //         return item.userAnswer === correctAnswer ? acc + 1 : acc;
    //       },
    //       0,
    //     );
    //     const score = Math.round(
    //       (correctQuestions / exerciseForm.length) * 100,
    //     );
    //     submitExercice({
    //       practice_id: idPractice,
    //       totalScore: score,
    //       startedAt: new Date().toISOString(),
    //       answers: exerciseForm.map((item: any) => ({
    //         questionId: item.id,
    //         answerPick: item.userAnswer,
    //       })),
    //     }).then((res) => {
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Nộp bài thành công',
    //         text: `Bạn đã đạt được ${score} điểm`,
    //       }).then(() => {
    //         setDoing(false);
    //         setReload((prev) => !prev);
    //       });
    //     });
    //     break;
    //   default:
    //     break;
    // }
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
        <Breadcrumb label={'Luyện tập với AI'} component="a" href="#" />
      </Breadcrumbs>

      <Box
        sx={{
          paddingTop: '12px',
        }}
      >
        <FeatureHeader title={'Luyện tập với AI'}>
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
              onClick={() => {
                setGenerate((prev) => !prev);
              }}
            >
              Tạo bài với AI
            </Button>
            <Button variant="contained" onClick={handleSubmit} size="small">
              Nộp bài
            </Button>
          </Box>
        </FeatureHeader>

        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            <Box>
              {questions?.map((question: any, index: number) => (
                <QuestionDetail
                  key={question.id}
                  question={question}
                  index={index}
                  onDelete={() => {}}
                  onEdit={() => {}}
                ></QuestionDetail>
              ))}
            </Box>
          </Box>
        </Box>

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
