import PracticeCard from '@/features/dashboard/features/practices/components/PracticeCard/PracticeCard';
import { Box, Typography } from '@mui/material';
import React from 'react';

export default function PracticeGroup() {
  return (
    <Box
      sx={{
        padding: '16px 8px',
        border: '1px solid #e0e0e0',
        borderRadius: 4,
        marginTop: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          padding: '24px',
        }}
      >
        <Box>
          <img
            width={200}
            height={'auto'}
            src="https://storage.googleapis.com/prep-storage-service/test-set/avatar/t2503wuS615wsfZqq27Hnc2Tk1ZWqiD2ISdbIrUm.png"
            alt="practice"
          />
        </Box>
        <Box>
          <Typography variant="h6">TOEIC - Bộ đề ĐỘC QUYỀN của PREP</Typography>
          <Typography variant="body1" sx={{ textAlign: 'justify' }}>
            Bộ đề độc quyền tại Prep : Bộ 2000 câu hỏi sát với format đề thi
            thật mới nhất Prep tự hào giới thiệu bộ đề thi IELTS độc quyền với
            10 đề được biên soạn công phu, bám sát định dạng đề thi chuẩn. Với
            kinh nghiệm và sự am hiểu sâu sắc về kỳ thi TOEIC, đội ngũ giáo viên
            và chuyên gia của Prep đã tổng hợp và phát triển bộ đề, đảm bảo tính
            cập nhật và sát với xu hướng ra đề mới nhất. Bộ đề được sắp xếp hợp
            lý, với độ khó tương đương đề thi thật, giúp học viên tiếp cận và
            làm chủ dần các dạng bài tập, đồng thời đi kèm giải thích chi tiết
            đáp án để phân tích kĩ lưỡng các dạng bẫy thường gặp trong đề thi
            TOEIC. Thông qua chinh phục bộ đề, học viên sẽ tự tin hơn khi bước
            vào phòng thi thật với mọi mức độ khó của câu hỏi.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 16px',
        }}
      >
        <PracticeCard title="Đề số 1" />
        <PracticeCard title="Đề số 2" />
        <PracticeCard title="Đề số 3" />
        <PracticeCard title="Đề số 4" />
        <PracticeCard title="Đề số 5" />
        <PracticeCard title="Đề số 6" />
      </Box>
    </Box>
  );
}
