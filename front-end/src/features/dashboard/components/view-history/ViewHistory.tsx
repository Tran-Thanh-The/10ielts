import { getAnswerHistories } from '@/api/api';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import { RootState } from '@/stores/store';
import { EPracticeType } from '@/types/enum/practice.enum';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ViewHistory({
  open,
  onClose,
  onOk,
  data = null,
  lessonView = false,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [answerHistories, setAnswerHistories] = React.useState([]);
  const [selectedAnswerHistory, setSelectedAnswerHistory] = React.useState<any>(
    {},
  );

  useEffect(() => {
    getAnswerHistories({
      userId: user.id,
      practiceId: lessonView ? undefined : data?.id,
      lessonId: lessonView ? data?.id : undefined,
    }).then((res) => {
      const histories = res.data.data;
      setAnswerHistories(histories);
    });
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          width: 800,
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
        <Typography id="modal-title" variant="h6" component="h2">
          Lịch sử nộp bài
        </Typography>

        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '180px',
              paddingRight: '12px',
              borderRight: '1px solid #e0e0e0',
              gap: '8px',
            }}
          >
            {answerHistories.map((item: any, index) => (
              <Box
                key={item.id}
                sx={{
                  border:
                    item.id === selectedAnswerHistory?.id
                      ? '1px solid #0071f9'
                      : '1px solid #e0e0e0',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  backgroundColor:
                    item.id === selectedAnswerHistory?.id ? '#f3f7ff' : 'unset',
                  borderRadius: '12px',
                }}
                onClick={() => setSelectedAnswerHistory(item)}
              >
                <Typography variant="body1">{`Lần ${index + 1}`}</Typography>
                <Typography variant="body1">
                  {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              flex: 1,
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6">Chi tiết</Typography>
              <Typography variant="h6" color="success">{`Điểm: ${
                selectedAnswerHistory?.practice?.practiceType ===
                  EPracticeType.WRITING ||
                selectedAnswerHistory?.practice?.practiceType ===
                  EPracticeType.SPEAKING
                  ? (selectedAnswerHistory?.teacherScore ??
                    'Chờ giáo viên chấm')
                  : (selectedAnswerHistory?.totalScore ?? 0)
              }`}</Typography>
            </Box>

            <Box
              sx={{
                overflowY: 'auto',
              }}
            >
              {selectedAnswerHistory?.id ? (
                <>
                  {lessonView ||
                  selectedAnswerHistory?.practice?.practiceType ===
                    EPracticeType.READING ||
                  selectedAnswerHistory?.practice?.practiceType ===
                    EPracticeType.LISTENING ? (
                    <QuestionList
                      questions={data?.questions}
                      readOnly
                      answers={selectedAnswerHistory?.answers}
                    />
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Nội dung bài làm
                      </Typography>
                      {selectedAnswerHistory?.practice?.practiceType ===
                      EPracticeType.WRITING ? (
                        <Box
                          sx={{
                            p: 2, // padding
                            border: '1px solid #ccc', // khung bao quanh
                            borderRadius: '8px',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: selectedAnswerHistory?.writingAnswer,
                          }}
                        ></Box>
                      ) : (
                        <Box>
                          <audio
                            src={selectedAnswerHistory?.audioAnswer?.path}
                            controls
                          />
                        </Box>
                      )}
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Nhận xét từ giáo viên
                      </Typography>

                      <Box
                        sx={{
                          p: 2, // padding
                          border: '1px solid #ccc', // khung bao quanh
                          borderRadius: '8px',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedAnswerHistory?.teacherFeedback
                            ? selectedAnswerHistory?.teacherFeedback
                            : 'Chưa có nhận xét',
                        }}
                      ></Box>
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography>Vui lòng chọn một</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            sx={{ padding: '6px 24px' }}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
