import { Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeTypeMap = {
  READING: 'Luyện đọc',
  LISTENING: 'Luyện nghe',
  WRITING: 'Luyện viết',
  SPEAKING: 'Luyện nói',
};

const PracticeDifficultyMap = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
};

export default function PracticeCard({ title, data }: any) {
  const naigate = useNavigate();

  const handleNavigateToPracticeDetail = () => {
    naigate('/dashboard/practices/' + data.id);
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        padding: '16px',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '30%',
        cursor: 'pointer',
      }}
      onClick={handleNavigateToPracticeDetail}
    >
      <Box
        sx={{
          background: '#f5f5f5',
          padding: 1,
          borderRadius: 4,
        }}
      >
        <img
          src="https://app.prepedu.com/imgs/test-practice/ic-book.svg"
          alt=""
        />
      </Box>
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">
          {PracticeTypeMap[data?.practiceType]} - {PracticeDifficultyMap[data?.difficulty]}
        </Typography>
      </Box>
    </Box>
  );
}
