import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import { Box } from '@mui/material';
import React from 'react';

const questionList = [
  {
    id: 1,
    title:
      'Read the reading below carefully, and then complete it with the best option A, B, C or D given below:',
    content: 'Choose the word which is stressed differently from the rest.',
    answer: 'Answer 1',
    type: 'CHOICE',
    options: [
      {
        id: 1,
        content: 'A. hospital',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B. mischievous',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C. supportive',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D. special',
        isAnswer: false,
      },
    ],
  },

  {
    id: 66,
    title:
      'Put ________ bag on ________ table, then give me ________ apple and ________ bar of chocolate.',
    content: '',
    answer: 'Answer 1',
    type: 'CHOICE',
    options: [
      {
        id: 1,
        content: 'A.  a … the … an … the',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B.  the … the … an … a',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C.  a … a … the … the',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D.  the … the … a … a',
        isAnswer: false,
      },
    ],
  },
  {
    id: 1,
    title:
      'Read the reading below carefully, and then complete it with the best option A, B, C or D given below:',
    content:
      'Voluntary work helps foster independence and imparts the ability to deal with different situations, often simulaneously, thus teaching people how to (1)____ their way through different systems. It therefore brings people into touch with the real worls; and, hence, equips them for the future. Initially, young adults in their late teens might not seem to have the expertise or knowledge to impart to others that say a teacher or an agriculturalist or a nurse would have, (2)____ they do have many skills that can help others. And in the absence of any particular talent, their energy and enthusiasm can be harnessed for the benefit (3) ____ their fellow human beings, and ultimately themselves. From all this, the gain to any community no matter how many voluntees are involved is (4)_____ Employers will generally look favorably on people (5)_____ have shown an ability to work as part of a team. It demonstrates a willingness to learn and an independent spirit, which would be desirable qualities in any employee.',
    answer: 'Answer 1',
    type: 'INPUT',
    options: [],
  },
  {
    id: 2,
    title: 'What are they doing?',
    content: '',
    answer: 'Answer 2',
    type: 'CHOICE',
    fileType: 'IMAGE',
    file: 'https://vatlydaicuong.com/wp-content/uploads/2021/09/vat-bi-keo-len-mat-phang-nghieng.png',
    options: [
      {
        id: 1,
        content: 'A. Talking',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B. Playing tenis',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C. Fishing',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D. Sleeping',
        isAnswer: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Listen to the following conversation and answer the questions:',
    content: '',
    file: './QA-01.mp3',
    fileType: 'AUDIO',
    answer: 'Answer 2',
    type: 'CHOICE',
    options: [
      {
        id: 1,
        content: 'A. Talking',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B. Playing tenis',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C. Fishing',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D. Sleeping',
        isAnswer: false,
      },
    ],
  },
];

export default function QuestionList({ questions, readOnly }: any) {
  return (
    <Box>
      {questions?.map((question, index) => (
        <QuestionDetail key={question.id} index={index} question={question} readOnly={readOnly} />
      ))}
    </Box>
  );
}
