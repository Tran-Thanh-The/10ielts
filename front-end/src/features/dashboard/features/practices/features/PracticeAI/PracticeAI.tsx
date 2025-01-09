import axiosInstance from '@/core/intercepter/Intercepter';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import ViewAnswer from '@/features/dashboard/features/practices/features/PracticeAI/ViewAnswer';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading, setDoExerciseForm } from '@/stores/slices/appSlice';
import { RootState } from '@/stores/store';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Box, Breadcrumbs, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function PracticeAI() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openHistory, setOpenHistory] = React.useState(false);
  const [generate, setGenerate] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const questions = useSelector(
    (state: RootState) => state.appState.doExerciseForm,
  );

  useEffect(() => {
    dispatch(setAppLoading(true));
    axiosInstance.get('https://lingomate-backend.onrender.com/api/v1/ai/generate-practice').then((response) => {
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
      dispatch(setDoExerciseForm(formattedData));
      dispatch(setAppLoading(false));
    });
  }, [generate]);

  const handleSubmit = () => {
    const correctQuestions = questions.reduce((acc: number, item: any) => {
      const correctAnswer = item.answers.find(
        (answer: any) => answer.isCorrect,
      )?.id;
      return item.userAnswer === correctAnswer ? acc + 1 : acc;
    }, 0);
    const score = Math.round((correctQuestions / questions.length) * 100);
    setScore(score);
    handleViewHistory();
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
          <ViewAnswer
            open={openHistory}
            onClose={() => setOpenHistory(false)}
            onOk={() => setOpenHistory(false)}
            questions={questions}
            answers={questions.map((item: any) => ({
              ...item,
              questionId: item.id,
              answerPick: item.userAnswer,
            }))}
            score={score}
          />
        ) : null}
      </Box>
    </FeatureLayout>
  );
}
