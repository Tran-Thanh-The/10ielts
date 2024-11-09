import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

export default function QuestionDetail({ question, index }) {
  return (
    <Box sx={{ padding: '12px 0' }}>
      <Typography variant="h6">
        Câu hỏi {index + 1}: {question.title}
      </Typography>
      {question.content && (
        <Typography variant="body1">{question.content}</Typography>
      )}
      {question.file && question.fileType === 'AUDIO' && (
        <Box>
          <audio src="E:\Downloads\QA-01.mp3" controls />{' '}
        </Box>
      )}

      {question.file && question.fileType === 'IMAGE' && (
        <Box>
          <img
            width={400}
            height="auto"
            src="https://vatlydaicuong.com/wp-content/uploads/2021/09/vat-bi-keo-len-mat-phang-nghieng.png"
          />{' '}
        </Box>
      )}

      {question.type === 'INPUT' ? (
        <Box>
          <TextField fullWidth label="Nhập câu trả lời" variant="outlined" />
        </Box>
      ) : (
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            {question.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.content}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
}
