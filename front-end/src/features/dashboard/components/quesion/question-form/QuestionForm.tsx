import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { CheckBox } from '@mui/icons-material';
import { createQuestion, createQuestionAnswer } from '@/api/api';
import { useDispatch } from 'react-redux';
import { setAppLoading } from '@/stores/slices/appSlice';

export default function QuestionFormModal({
  question = null,
  open,
  onClose,
  onOk,
}: any) {
  const dispatch = useDispatch();
  const { selectedLessonId, idPractice } = useParams();

  const [form, setForm] = React.useState<{
    id?: string;
    fileType: string | null;
    file: any;
    title: string;
    questionType: string;
    time: number;
    content: string;
    explain?: string;
    lesson_id?: string;
    category_id?: string;
    practice_id?: string;
    anwerForInput?: string;
    answers: {
      id?: string;
      file: any;
      content: string;
      answerType: string; // INPUT, CHOICE
      isCorrect: boolean;
    }[];
  }>({
    fileType: null, // AUDIO, IMAGE
    file: null,
    title: '',
    questionType: 'CHOICE', // INPUT, CHOICE
    time: 0,
    content: '',
    explain: '',
    category_id: null,
    practice_id: idPractice,
    lesson_id: selectedLessonId,
    answers: [],
    id: question?.id,
    anwerForInput: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      dispatch(setAppLoading(true));
      const questionPayload = {
        title: form.title,
        content: form.content,
        time: form.time,
        explain: form.explain,
        questionType: form.questionType,
        file: form.file ?? undefined,
        fileType: form.fileType ?? undefined,
        lesson_id: form.lesson_id,
        practice_id: form.practice_id,
      };
      const question = await createQuestion(questionPayload);

      const answersPayload = form.answers.map((answer) => ({
        content: answer.content,
        isCorrect: answer.isCorrect,
        file: answer.file,
        answerType: answer.answerType,
      }));

      if (form.questionType === 'INPUT') {
        await createQuestionAnswer(question.data.id, {
          content: form.anwerForInput,
          isCorrect: true,
          answerType: 'INPUT',
        });
      } else {
        await Promise.all(
          answersPayload.map((answer) =>
            createQuestionAnswer(question.data.id, answer),
          ),
        );
      }

      onOk();
      onClose(false);
      dispatch(setAppLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setAppLoading(false));
    }
  };

  const handleAddAnswer = () => {
    setForm((prevState) => ({
      ...prevState,
      answers: [
        ...prevState.answers,
        {
          id: new Date().getTime().toString(),
          file: null,
          content: '',
          isCorrect: !prevState.answers.length,
          answerType: question?.questionType || 'CHOICE',
        },
      ],
    }));
  };

  const handleUpdateFormAnswer = (index, key, value) => {
    setForm((prevState) => ({
      ...prevState,
      answers: prevState.answers.map((answer, i) =>
        i === index ? { ...answer, [key]: value } : answer,
      ),
    }));
  };

  const handleRemoveAnswer = (index) => {
    setForm((prevState) => ({
      ...prevState,
      answers: prevState.answers.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          padding: '24px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {question?.id ? 'Cập nhập câu hỏi' : 'Tạo câu hỏi'}
          </Typography>
          <Box
            sx={{
              cursor: 'pointer',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                color: 'red',
              },
            }}
          >
            <CloseIcon onClick={() => onClose(false)} />
          </Box>
        </Box>
        <Divider />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: '16px 0',
            paddingRight: '24px',
          }}
        >
          <Typography variant="h6" component="h2">
            Thông tin câu hỏi
          </Typography>
          <Box>
            <TextField
              label="Tiêu đề"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>

          <Box>
            <TextField
              label="Nội dung"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            <Select
              label="Giải thích"
              name="questionType"
              value={form.questionType}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="CHOICE">Chọn đáp án</MenuItem>
              <MenuItem value="INPUT">Điền đáp án</MenuItem>
            </Select>

            <TextField
              label="Thời gian (s)"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              type="number"
              fullWidth
            />
          </Box>

          <Box>
            <Box
              sx={{
                minHeight: '120px',
                width: '100%',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <input
                id="file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setForm((prevState) => ({
                      ...prevState,
                      file: file,
                      fileType: file.type.split('/')[0].toUpperCase(),
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                accept="image/*, audio/*"
              />
              {form.fileType === 'IMAGE' ? (
                <img
                  src={
                    form.file && typeof form.file === 'string'
                      ? form.file
                      : URL.createObjectURL(form.file)
                  }
                  alt="preview"
                  style={{ width: '500px', height: 'auto' }}
                />
              ) : form.fileType === 'AUDIO' ? (
                <audio controls>
                  <source
                    src={
                      form.file && typeof form.file === 'string'
                        ? form.file
                        : URL.createObjectURL(form.file)
                    }
                    type="audio/mpeg"
                  />
                </audio>
              ) : null}
            </Box>
          </Box>

          <Box>
            <TextField
              label="Giải thích"
              name="explain"
              value={form.explain}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" component="h2">
              Thông tin câu trả lời
            </Typography>
            {form.questionType === 'CHOICE' ? (
              <Button size="small" variant="outlined" onClick={handleAddAnswer}>
                Thêm câu trả lời
              </Button>
            ) : null}
          </Box>
          {form.questionType === 'CHOICE' ? (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {form.answers.map((answer, index) => (
                <Box
                  key={answer.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    padding: '16px',
                    width: '48%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" component="h2">
                      Câu trả lời {index + 1}
                    </Typography>

                    <Box
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          color: 'red',
                        },
                      }}
                    >
                      <CloseIcon
                        onClick={() => handleRemoveAnswer(index)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answer.isCorrect}
                        onChange={(e) => {
                          const isChecked = form.answers[index].isCorrect;
                          if (isChecked && !e.target.checked) {
                            e.preventDefault();
                            e.stopPropagation();
                          } else {
                            setForm((prevState) => ({
                              ...prevState,
                              answers: prevState.answers.map((a, i) =>
                                i === index
                                  ? { ...a, isCorrect: e.target.checked }
                                  : { ...a, isCorrect: false },
                              ),
                            }));
                          }
                        }}
                      />
                    }
                    label="Đán án đúng"
                  />

                  <TextField
                    label={`Câu trả lời`}
                    name="content"
                    value={answer.content}
                    onChange={(e) => {
                      handleUpdateFormAnswer(index, 'content', e.target.value);
                    }}
                    required
                    fullWidth
                  />

                  <Box>
                    <Box
                      sx={{
                        minHeight: '120px',
                        width: '100%',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <input
                        id={answer.id}
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            handleUpdateFormAnswer(index, 'file', file);
                          };
                          reader.readAsDataURL(file);
                        }}
                        accept="image/*"
                      />
                      {answer.file ? (
                        <img
                          src={
                            answer.file && typeof answer.file === 'string'
                              ? answer.file
                              : URL.createObjectURL(answer.file)
                          }
                          alt="preview"
                          style={{ width: '500px', height: 'auto' }}
                        />
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box>
              <TextField
                label="Câu trả lời"
                name="anwerForInput"
                value={form.anwerForInput}
                onChange={handleChange}
                required
                fullWidth
              />
            </Box>
          )}
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            sx={{ padding: '6px 24px' }}
            size="small"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" size="small">
            Lưu câu hỏi
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
