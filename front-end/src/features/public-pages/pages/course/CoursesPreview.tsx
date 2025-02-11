import CourseCard from '@/features/dashboard/features/courses/features/course-list/components/course-card/CourseCard';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const mockData = [
  {
    id: '1848c1d1-aa06-458d-abb6-fe014bded3f0',
    title: 'Khóa A',
    price: '0.00',
    description: '123',
    photo: {
      id: 'd505d036-7345-40d0-8316-d92e5408bba2',
      path: 'https://lh3.googleusercontent.com/d/1swYhj34vWS9qdNVxbqrbI8bpdVAdp5Xb',
      __entity: 'FileEntity',
    },
    category: {
      id: '8077cd67-8f1d-4519-a453-fe20005cdf4e',
      name: 'HSG - C3',
      createdAt: '2025-01-07T16:37:17.349Z',
      updatedAt: '2025-01-07T16:37:17.349Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-08T15:02:56.472Z',
    status: 'IN_ACTIVE',
    totalLesson: 3,
    completedLesson: 0,
    lessons: [
      {
        id: 'a0a3852a-ca85-4254-8f04-ed75445dbaa9',
        title: 'L',
        content: '123',
        lessonType: 'VIDEO',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:03:24.062Z',
        updatedAt: '2025-01-08T15:03:24.062Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: '451e6ad1-6b5c-4a79-9086-eff4be82a96c',
        title: 'A1',
        content: '123',
        lessonType: 'DOCS',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:04:33.072Z',
        updatedAt: '2025-01-08T15:04:33.072Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: 'f52272c2-7692-4819-818f-aa2c0ac95a90',
        title: 'BT!',
        content: '1',
        lessonType: 'EXERCISE',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:04:55.011Z',
        updatedAt: '2025-01-08T15:04:55.011Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
    ],
    isMyCourse: false,
  },
  {
    id: '388e59bd-d1d4-4012-a07f-0abade619fa9',
    title: 'Ielts 9.0',
    price: '10000.00',
    description: 'Ielts 9.0',
    photo: {
      id: 'bb05f0ef-1d7a-45ac-9aad-e6584cf30adf',
      path: 'https://lh3.googleusercontent.com/d/1uj7eRgm33Uio0vrbkX80HhwjpAP1S_AF',
      __entity: 'FileEntity',
    },
    category: {
      id: 'bbb135c7-0df4-409a-8766-31709455c3cc',
      name: 'IELTS',
      createdAt: '2025-01-08T07:20:50.842Z',
      updatedAt: '2025-01-08T07:20:50.842Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-08T07:21:24.592Z',
    status: 'IN_ACTIVE',
    totalLesson: 0,
    completedLesson: 0,
    lessons: [],
    isMyCourse: false,
  },
  {
    id: '868fa499-c2d5-407f-9f47-3a1fa1118028',
    title: 'Khóa học cho người mất gốc',
    price: '100000.00',
    description: 'Khóa học Toeic lấy gốc',
    photo: {
      id: '1c6d246a-17f9-4a9b-a5c3-987cf3e3a89e',
      path: 'https://lh3.googleusercontent.com/d/1t-VBJhJf8mHjIYJf9NLKXDzcHZWYVSS3',
      __entity: 'FileEntity',
    },
    category: {
      id: 'cadc9dfa-12a9-4565-b157-d92049c821e2',
      name: 'Toeic',
      createdAt: '2025-01-06T16:23:37.261Z',
      updatedAt: '2025-01-06T16:23:37.261Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-07T15:56:51.318Z',
    status: 'IN_ACTIVE',
    totalLesson: 2,
    completedLesson: 0,
    lessons: [
      {
        id: 'b9830c45-90c9-43b7-a0e5-e275032e1ea8',
        title: 'Bài 1',
        content: 'Bài giảng số 1',
        lessonType: 'VIDEO',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-07T16:51:31.122Z',
        updatedAt: '2025-01-07T16:51:31.122Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: '9ecba417-b217-4fb1-8193-b7f19cde6f94',
        title: 'Bài 2',
        content: 'Tài liệu tham khảo',
        lessonType: 'DOCS',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-07T16:58:15.089Z',
        updatedAt: '2025-01-07T16:58:15.089Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
    ],
    isMyCourse: false,
  },
  {
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
  },
  {
    id: 'ecb62b35-0fc9-491a-9b11-3f368e8baa8b',
    title: 'Khóa học lấy lại gốc cho người bắt đầu học',
    price: '0.00',
    description:
      'Bạn có thể cung cấp thêm chi tiết về khóa học, chẳng hạn như:\r\nĐối tượng mục tiêu: Học sinh, sinh viên, người đi làm, hay người muốn du học?\r\nMục tiêu của khóa học: Học giao tiếp, luyện thi TOEIC/IELTS, viết luận, hay cải thiện kỹ năng nghe?\r\nThời lượng: Khóa học kéo dài bao lâu?\r\nHình thức học: Trực tuyến, trực tiếp tại trung tâm, hay kết hợp cả hai?\r\nĐiểm đặc biệt: Có phương pháp học mới lạ, giảng viên giàu kinh nghiệm, hay hỗ trợ cá nhân hóa?',
    photo: {
      id: 'cabaeb09-d983-474a-b00f-06d1e38aca4f',
      path: 'https://lh3.googleusercontent.com/d/1b3aUYvzrfwNZM6VdW-EvdoSTrYEYeQXn',
      __entity: 'FileEntity',
    },
    category: {
      id: 'cadc9dfa-12a9-4565-b157-d92049c821e2',
      name: 'Toeic',
      createdAt: '2025-01-06T16:23:37.261Z',
      updatedAt: '2025-01-06T16:23:37.261Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-07T17:00:19.881Z',
    status: 'ACTIVE',
    totalLesson: 3,
    completedLesson: 0,
    lessons: [
      {
        id: 'acc30394-c533-4582-b7a3-8ad45fbb7901',
        title: 'Bài giảng đầu tiên',
        content: 'Giới thiệu tổng quan khóa học',
        lessonType: 'VIDEO',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T16:20:13.384Z',
        updatedAt: '2025-01-08T16:20:13.384Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: '9ef9f577-a312-4464-9b7a-24ddbe8518a5',
        title: 'Tài liệu tham khảo',
        content: 'Tài liệu tham khảo',
        lessonType: 'DOCS',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T16:21:50.414Z',
        updatedAt: '2025-01-08T16:21:50.414Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: 'ea25d0d4-fbbc-446e-88c6-6d64753c2eb5',
        title: 'Bài tập cuối khóa',
        content: 'Bài tập cuối khóa',
        lessonType: 'EXERCISE',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T16:22:25.096Z',
        updatedAt: '2025-01-08T16:22:25.096Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
    ],
    isMyCourse: false,
  },
  {
    id: 'f39964f9-5655-4872-b874-08356e2685a1',
    title: 'TOEIC 900+',
    price: '2000.00',
    description: 'TOEIC 900+',
    photo: {
      id: '08def348-e04d-4955-aa14-4351ab5240c1',
      path: 'https://lh3.googleusercontent.com/d/1-PUHvOKtUz5l7yCv6ji_GvgwwcRfABSl',
      __entity: 'FileEntity',
    },
    category: {
      id: 'cadc9dfa-12a9-4565-b157-d92049c821e2',
      name: 'Toeic',
      createdAt: '2025-01-06T16:23:37.261Z',
      updatedAt: '2025-01-06T16:23:37.261Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-06T17:55:56.413Z',
    status: 'ACTIVE',
    totalLesson: 0,
    completedLesson: 0,
    lessons: [],
    isMyCourse: false,
  },
  {
    id: 'fdf51077-a4ea-4b3a-aa45-f3dd5640b2fe',
    title: 'TOEIC online',
    price: '10000.00',
    description: 'Khóa học TOEIC online',
    photo: {
      id: 'd5965364-395a-4a6b-9e4b-1e7a4b2b61ca',
      path: 'https://lh3.googleusercontent.com/d/1vMRR1QDYF9CbtQOzRyLf2sjFvvq-Yyk4',
      __entity: 'FileEntity',
    },
    category: {
      id: 'cadc9dfa-12a9-4565-b157-d92049c821e2',
      name: 'Toeic',
      createdAt: '2025-01-06T16:23:37.261Z',
      updatedAt: '2025-01-06T16:23:37.261Z',
      __entity: 'CategoryEntity',
    },
    createdAt: '2025-01-08T15:23:16.458Z',
    status: 'ACTIVE',
    totalLesson: 3,
    completedLesson: 0,
    lessons: [
      {
        id: 'd1cff702-cd8a-4782-b1b8-371a170fffbf',
        title: 'Bài học số 1',
        content: 'Bài học số 1',
        lessonType: 'VIDEO',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:28:00.027Z',
        updatedAt: '2025-01-08T15:28:00.027Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: 'b757b3bb-35bb-41da-b6b1-9826efc42b03',
        title: 'Bài tham khảo',
        content: 'Tài liệu tham khảo',
        lessonType: 'DOCS',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:31:10.957Z',
        updatedAt: '2025-01-08T15:31:10.957Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
      {
        id: '069dfbf1-5ce8-42b2-b1c3-1750dd9cbee0',
        title: 'Bài tập1',
        content: '',
        lessonType: 'EXERCISE',
        stars: '0.00',
        totalStars: 3,
        isSequence: false,
        status: 'ACTIVE',
        createdAt: '2025-01-08T15:32:21.797Z',
        updatedAt: '2025-01-08T15:32:21.797Z',
        position: null,
        questions: [],
        isCompleted: false,
      },
    ],
    isMyCourse: false,
  },
];

export default function CoursesPreview() {
  return (
    <Box sx={{ padding: '30px 80px' }}>
      <Typography variant="h6" mb={5}> Danh sách khóa học </Typography>
      <Grid container spacing={4}>
        {mockData.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
            <CourseCard
              id={course.id}
              title={course.title}
              description={course.description}
              price={course.price as unknown as number}
              createdAt={course.createdAt as unknown as string}
              photo={course?.photo?.path}
              totalLesson={course.totalLesson}
              completedLesson={course.completedLesson}
              isMyCourse={false}
              onDeleted={() => {}}
              onEdit={() => {}}
              preview={true}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
