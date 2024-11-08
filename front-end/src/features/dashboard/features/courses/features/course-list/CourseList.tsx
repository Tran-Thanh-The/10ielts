import courseApi from '@/api/courseApi';
import CourseCard from '@/features/dashboard/features/courses/features/course-list/components/course-card/CourseCard';
import CourseFilter from '@/features/dashboard/features/courses/features/course-list/components/course-filter/CourseFilter';
import CreateCourseModal from '@/features/dashboard/features/courses/features/course-list/components/create-course-modal/CreateCourseModal';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  createAt: Date | string;
  totalLesson: number;
  completedLesson: number;
  isMyCourse: boolean;
  photo: {
    id: string;
    path: string;
  };
}

export default function CourseList() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    fetchCourses();
  }, [reload]);

  const triggerReload = () => {
    setReload(!reload);
  };

  const fetchCourses = async () => {
    try {
      dispatch(setAppLoading(true));
      const response = await courseApi.getCourses();
      setCourses(response.data.data);
      dispatch(setAppLoading(false));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreateCourse = () => {
    setOpen(true);
  };

  const handleEditCourse = (id: string) => {
    setSelectedCourse(courses.find((course) => course.id === id) ?? null);
    setOpen(true);
  };

  return (
    <FeatureLayout>
      <FeatureHeader
        title="Khóa học"
        description="Các khóa học bạn đang sở hữu đã được chia theo từng cấp trình độ, tương ứng với mỗi chặng mục tiêu. Hãy chọn trình độ mà bạn muốn bắt đầu nhé."
      />
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
            gap: '32px',
          }}
        >
          <CourseFilter />
          <Button
            variant="contained"
            onClick={handleCreateCourse}
            sx={{
              width: 'unset',
              padding: '12px 16px !important',
              borderRadius: '12px',
            }}
          >
            Tạo khóa học
          </Button>
        </Box>

        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Danh sách khóa học
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(courses ?? []).map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.name}
              description={course.description}
              price={course.price}
              createdAt={course.createAt}
              photo={course?.photo?.path}
              totalLesson={14}
              completedLesson={4}
              isMyCourse={false}
              onDeleted={triggerReload}
              onEdit={handleEditCourse}
            />
          ))}
        </Box>
      </Box>

      <CreateCourseModal
        open={open}
        data={selectedCourse}
        onClose={(value: boolean) => {
          setOpen(value);
          setSelectedCourse(null);
        }}
        onOk={triggerReload}
      />
    </FeatureLayout>
  );
}
