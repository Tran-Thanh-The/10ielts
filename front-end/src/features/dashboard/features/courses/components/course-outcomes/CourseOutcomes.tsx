import { getAnswerHistories } from '@/api/api';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

export default function CourseOutcomes({ open, onClose, courseId }: any) {
  const [answerHistories, setAnswerHistories] = React.useState<any[]>([]);

  useEffect(() => {
    if (courseId) {
      getAnswerHistories({
        courseId: courseId,
      }).then((res) => {
        setAnswerHistories(res.data.data);
      });
    }
  }, [courseId]);

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
          Kết quả học tập
        </Typography>

        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">Tổng quan</Typography>

          <Box sx={{ padding: '2px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                border: '1px solid #e0e0e0',
                padding: '12px',
                borderRadius: '12px',
              }}
            >
              <Box
                sx={{
                  borderRight: '1px solid #e0e0e0',
                  flex: 1,
                }}
              >
                <Typography variant="body1">
                  Số bài học đã hoàn thành: {answerHistories?.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography variant="body1">
                  Điểm trung bình:{' '}
                  {Math.round(
                    answerHistories?.reduce(
                      (acc, item) => acc + parseFloat(item.totalScore),
                      0,
                    ) / answerHistories?.length,
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="h6">Lịch sử làm bài học</Typography>
          {answerHistories?.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" sx={{ fontWeight: '600' }}>
                Lần {index + 1}:
              </Typography>
              <Typography variant="body1">
                Bài học: {item.lesson.title}
              </Typography>
              <Typography variant="body1">
                Điểm số: {item.totalScore}
              </Typography>
              <Typography variant="body1">
                Thời gian hoàn thành:{' '}
                {dayjs(item.completedAt).format('DD/MM/YYYY HH:mm')}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose(false);
            }}
            sx={{ padding: '6px 24px' }}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
