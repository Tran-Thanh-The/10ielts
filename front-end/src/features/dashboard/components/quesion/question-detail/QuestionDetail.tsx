import RoleBasedComponent from '@/components/RoleBasedComponent';
import {
  selectDoExerciseForm,
  setDoExerciseForm,
} from '@/stores/slices/appSlice';
import { ROLE } from '@/utils/constants/constants';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function QuestionDetail({
  question,
  index,
  readOnly,
  onDelete,
  onEdit,
  userAnswer,
}: any) {
  const dispatch = useDispatch();
  const doExerciseForm = useSelector(selectDoExerciseForm);

  const handleChangeInputAnswer = (e: any) => {
    const updateForm = doExerciseForm.map((item: any) => {
      if (item.id === question.id) {
        return {
          ...item,
          userAnswer: e.target.value,
        };
      }
      return item;
    });

    dispatch(setDoExerciseForm(updateForm));
  };

  const handleChangeRadioAnswer = (e: any) => {
    const updateForm = doExerciseForm.map((item: any) => {
      if (item.id === question.id) {
        return {
          ...item,
          userAnswer: e.target.value,
        };
      }
      return item;
    });

    dispatch(setDoExerciseForm(updateForm));
  };

  return (
    <Box sx={{ padding: '12px 0' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          Câu hỏi {index + 1}: {question.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px', minWidth: '200px' }}>
          <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            {onEdit && (
              <Button variant="outlined" size="small">
                Chỉnh sửa
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={onDelete}
              >
                Xóa
              </Button>
            )}
          </RoleBasedComponent>
        </Box>
      </Box>
      {question.content && (
        <Typography variant="body1">{question.content}</Typography>
      )}
      {question.file && question.fileType === 'AUDIO' && (
        <Box>
          <audio src={question?.file?.path ?? "http://localhost:3002/api/v1/files/QA-01.mp3"} controls />{' '}
        </Box>
      )}

      {question.file && question.fileType === 'IMAGE' && (
        <Box>
          <img
            width={400}
            height="auto"
            src={question?.file?.path ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkeMrDaQuVKvwExVpOp3wCbugxjzFfkSPYHg&s"}
          />{' '}
        </Box>
      )}

      {question.questionType === 'INPUT' ? (
        <Box>
          <TextField
            fullWidth
            label="Nhập câu trả lời"
            variant="outlined"
            disabled={readOnly}
            onChange={handleChangeInputAnswer}
          />
        </Box>
      ) : (
        <FormControl
          sx={{
            width: '100%',
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                flexDirection: 'column',
                '&:has(img)': {
                  flexDirection: 'row',
                  gap: '24px',
                },
              }}
            >
              {question.answers?.map((option, index) => (
                <Box
                  key={option.id}
                  sx={
                    option.file?.path
                      ? {
                          display: 'flex',
                          gap: '12px',
                          // alignItems: 'center',
                          flexDirection: 'column',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '12px',
                          width: '48%',
                        }
                      : {}
                  }
                >
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={`${String.fromCharCode(65 + index)}. ${option.content}`}
                    defaultChecked={readOnly ? option.isCorrect : false}
                    // checked={option.isCorrect}
                    disabled={readOnly}
                    onChange={handleChangeRadioAnswer}
                    sx={{
                      background:
                        readOnly && userAnswer
                          ? option.isCorrect
                            ? 'green'
                            : userAnswer === option.id
                              ? 'red'
                              : 'unset'
                          : 'unset',
                    }}
                    {...(userAnswer ? {checked: userAnswer === option.id} : {})}
                  />
                  {option.file?.path && (
                    <img src={option.file.path} width={200} height="auto" />
                  )}
                </Box>
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
}
