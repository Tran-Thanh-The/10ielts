import { getAnswerHistories, updateAnswerHistory } from '@/api/api';
import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import { RootState } from '@/stores/store';
import { EPracticeType } from '@/types/enum/practice.enum';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/assets/ai-loading.gif';
import { baseUrl } from '@/core/intercepter/Intercepter';

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
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    getAnswerHistories({
      userId: user.id,
      practiceId: lessonView ? undefined : data?.id,
      lessonId: lessonView ? data?.id : undefined,
    }).then((res) => {
      const histories = res.data.data.reverse();
      setAnswerHistories(histories);
    });
  }, [reload]);

  const handleGenerateFeedback = async () => {
    try {
      const extractContent = (s: string) => {
        var span = document.createElement('span');
        span.innerHTML = s;
        return span.textContent || span.innerText;
      };
      const authDataString = localStorage.getItem('auth');
      const authData = authDataString ? JSON.parse(authDataString) : null;
      let token = authData?.token;
      setLoading(true);
      axios
        .post(
          baseUrl + '/ai/evaluate-writing',
          {
            topic:
              selectedAnswerHistory?.practice?.content ??
              'In 15 minutes, write an article with a topic: Describe your favorite childhood memory',
            writingAssignmentSubmission: extractContent(
              selectedAnswerHistory?.writingAnswer ??
                "When I was young, I very like to went to my grandmother house in countryside. Every summer holiday, my parent took me there and I playing with many friend. The air was fresh and we catching fish in small river behind house. Grandmother always cook delicious foods for me likes sweet soup and spring roll.\nOne day, me and friends decided exploring the old temple near village. We walking through bamboo forest and see many interesting thing. Although my grandmother tell us don't go there alone, but we very exciting about adventure. Finally, we finding beautiful temple and take lot of picture.\nThat memory still make me happy when think about it. I missing my childhood time very much.",
            ),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log(res);
          setSelectedAnswerHistory({
            ...selectedAnswerHistory,
            aiReview: res.data,
          });
          updateAnswerHistory(selectedAnswerHistory.id, {
            aiReview: res.data,
          }).then(() => {
            setReload(!reload);
            setLoading(false);
          });
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
              overflowY: 'auto',
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

                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Chấm điểm từ AI
                      </Typography>

                      {selectedAnswerHistory?.aiReview ? (
                        <Box
                          sx={{
                            p: 2, // padding
                            border: '1px solid #ccc', // khung bao quanh
                            borderRadius: '8px',
                          }}
                        >
                          <Box>
                            <Typography>
                              Điểm từ AI:{' '}
                              {selectedAnswerHistory?.aiReview?.score ?? 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                whiteSpace: 'pre-line',
                              }}
                            >
                              Nhân xét từ AI:{'\n'}
                              {selectedAnswerHistory?.aiReview?.feedback
                                ? selectedAnswerHistory?.aiReview?.feedback
                                : 'Chưa có điểm'}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleGenerateFeedback}
                          startIcon={
                            loading ? (
                              <img
                                width={24}
                                height={24}
                                src={Loading}
                                alt=""
                              />
                            ) : null
                          }
                          disabled={loading}
                        >
                          Lấy nhận xét từ AI
                        </Button>
                      )}
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
