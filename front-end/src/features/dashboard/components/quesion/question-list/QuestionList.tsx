import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import { Box } from '@mui/material';
import React from 'react';

const questionList = [
  {
    id: 1,
    title: 'Read the reading below carefully, and then complete it with the best option A, B, C or D given below:',
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
    title: 'Một vật dao động điều hòa với biên độ 4 cm và chu kì 2 s. Quãng đường vật đi được trong 4 s là:',
    content: '',
    answer: 'Answer 1',
    type: 'CHOICE',
    options: [
      {
        id: 1,
        content: 'A. 64 cm',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B. 16 cm',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C. 32 cm',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D. 8 cm',
        isAnswer: false,
      },
    ],
  },
  {
    id: 1,
    title: 'Read the reading below carefully, and then complete it with the best option A, B, C or D given below:',
    content: 'Voluntary work helps foster independence and imparts the ability to deal with different situations, often simulaneously, thus teaching people how to (1)____ their way through different systems. It therefore brings people into touch with the real worls; and, hence, equips them for the future. Initially, young adults in their late teens might not seem to have the expertise or knowledge to impart to others that say a teacher or an agriculturalist or a nurse would have, (2)____ they do have many skills that can help others. And in the absence of any particular talent, their energy and enthusiasm can be harnessed for the benefit (3) ____ their fellow human beings, and ultimately themselves. From all this, the gain to any community no matter how many voluntees are involved is (4)_____ Employers will generally look favorably on people (5)_____ have shown an ability to work as part of a team. It demonstrates a willingness to learn and an independent spirit, which would be desirable qualities in any employee.',
    answer: 'Answer 1',
    type: 'INPUT',
    options: [],
  },
  {
    id: 2,
    title: 'Về mặt động lực học chất điểm,gia tốc của một vật phụ thuộc vào những yếu tố nào sau đây?',
    content: '',
    answer: 'Answer 2',
    type: 'CHOICE',
    fileType: 'IMAGE',
    file: "https://vatlydaicuong.com/wp-content/uploads/2021/09/vat-bi-keo-len-mat-phang-nghieng.png",
    options: [
      {
        id: 1,
        content: 'A. Lực tác dụng lên vật và khối lượng của vật.',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'B. Kích thước và khối lượng của vật.',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'C. Lực tác dụng lên vật và kích thước của vật.',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'D. Kích thước và trọng lượng của vật.',
        isAnswer: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Nghe đoạn hội thoại sau và trả lời câu hỏi:',
    content: '',
    file: 'E:DownloadsQA-01.mp3',
    fileType: 'AUDIO',
    answer: 'Answer 2',
    type: 'CHOICE',
    options: [
      {
        id: 1,
        content: 'Option 1',
        isAnswer: true,
      },
      {
        id: 2,
        content: 'Option 2',
        isAnswer: false,
      },
      {
        id: 3,
        content: 'Option 3',
        isAnswer: false,
      },
      {
        id: 4,
        content: 'Option 4',
        isAnswer: false,
      },
    ],
  },
];

export default function QuestionList() {
  return (
    <Box>
      {questionList.map((question, index) => (
        <QuestionDetail key={question.id} index={index} question={question} />
      ))}
    </Box>
  );
}
