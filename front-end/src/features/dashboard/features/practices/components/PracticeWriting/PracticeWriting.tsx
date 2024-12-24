import { Box, Button, Typography } from '@mui/material';
import Quill from 'quill';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function PracticeWriting({ data }) {
  const [content, setContent] = useState('');
  const [countDown, setCountDown] = React.useState(60 * 15);

  const handleChange = (value) => {
    setContent(value);
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

  return (
    <Box>
      <Typography variant="h6">Chủ đề: {data?.content}</Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '0px',
          marginTop: '20px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1">Nhập câu trả lời của bạn</Typography>
          <Button variant="text" sx={{ color: 'black' }}>
            Thời gian: 00:{Math.floor(countDown / 60)}:{countDown % 60}
          </Button>
        </Box>

        <ReactQuill
          value={content}
          onChange={handleChange}
          style={{ minHeight: '300px' }}
        />
      </Box>
    </Box>
  );
}
