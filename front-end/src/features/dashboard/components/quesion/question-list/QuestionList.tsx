import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import { Box } from '@mui/material';

export default function QuestionList({ questions, readOnly, answers }: any) {
  return (
    <Box>
      {questions?.map((question, index) => (
        <QuestionDetail
          key={question.id}
          index={index}
          question={question}
          readOnly={readOnly}
          userAnswer={answers?.find((item) => item.questionId === question.id)?.answerPick}
        />
      ))}
    </Box>
  );
}
