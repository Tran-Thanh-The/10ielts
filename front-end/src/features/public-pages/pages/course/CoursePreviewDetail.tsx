import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const course = {
  id: 'd4b07e9a-dce0-481e-a0a4-60093857e249',
  title: 'Vượt chướng ngại vật TOEIC',
  price: '15000.00',
  description: 'Khóa vượt chướng ngại vật TOEIC',
  photo: {
    id: 'db06c2dc-cb8f-44bf-865f-ced52e7487df',
    path: 'https://lh3.googleusercontent.com/d/1o975wvJxnjx5DmmuaRgGa4vDV_clFXy4',
    __entity: 'FileEntity',
  },
  category: {
    id: 'cadc9dfa-12a9-4565-b157-d92049c821e2',
    name: 'Toeic',
    createdAt: '2025-01-06T16:23:37.261Z',
    updatedAt: '2025-01-06T16:23:37.261Z',
    __entity: 'CategoryEntity',
  },
  createdAt: '2025-01-08T15:56:22.685Z',
  status: 'ACTIVE',
  totalLesson: 3,
  completedLesson: 0,
  lessons: [
    {
      id: '7f7502b2-f0f7-4afa-a9ed-0c2d6d84d97d',
      title: 'Bài học 1',
      content: '',
      lessonType: 'VIDEO',
      stars: '0.00',
      totalStars: 3,
      isSequence: false,
      status: 'ACTIVE',
      createdAt: '2025-01-08T15:57:42.169Z',
      updatedAt: '2025-01-08T15:57:42.169Z',
      position: null,
      questions: [],
      isCompleted: false,
    },
    {
      id: '54f789e0-63ed-425f-90c5-2ec0fa0a0bab',
      title: 'Tài liệu',
      content: 'Tài liệu bổ sung',
      lessonType: 'DOCS',
      stars: '0.00',
      totalStars: 3,
      isSequence: false,
      status: 'ACTIVE',
      createdAt: '2025-01-08T15:59:56.576Z',
      updatedAt: '2025-01-08T15:59:56.576Z',
      position: null,
      questions: [],
      isCompleted: false,
    },
    {
      id: '04dfb3d2-d693-49d0-841d-2735b272d3a8',
      title: 'Bài tập củng cố kiến thức',
      content: '',
      lessonType: 'EXERCISE',
      stars: '0.00',
      totalStars: 3,
      isSequence: false,
      status: 'ACTIVE',
      createdAt: '2025-01-08T16:01:13.854Z',
      updatedAt: '2025-01-08T16:02:45.636Z',
      position: null,
      questions: [],
      isCompleted: false,
    },
  ],
  isMyCourse: false,
};

export default function CoursePreviewDetail() {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: '30px 60px' }}>
      <Box sx={{ paddingTop: '24px' }}>
        <Card
          sx={{
            marginBottom: 3,
            boxShadow:
              'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            padding: '8px 12px',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', gap: '32px' }}>
              <Box flex={6}>
                <Typography variant="h4">{course.title} </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="justify"
                  sx={{
                    marginBottom: 2,
                    whiteSpace: 'pre-line',
                    marginTop: 2,
                  }}
                >
                  {course.description}
                </Typography>
              </Box>
              <Box flex={4}>
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '12px',
                  }}
                  image={course?.photo?.path}
                  alt={course.title}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 2,
                  }}
                >
                  <Typography variant="h6">Thông tin khóa học</Typography>
                  <ul style={{ margin: 0 }}>
                    <li>
                      <Typography variant="body1">
                        Giá khóa học: {course.price + ' VND'}
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        Danh mục: {course.category.name}
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        Tổng bài học: {course.lessons.length}
                      </Typography>
                    </li>
                  </ul>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '12px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      navigate("/login")
                    }}
                  >
                    Đăng ký khóa học
                  </Button>
                </Box>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Ngày tạo: {new Date(course.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
