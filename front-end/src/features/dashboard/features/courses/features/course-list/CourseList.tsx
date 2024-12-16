import courseApi from '@/api/courseApi';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import CourseCard from '@/features/dashboard/features/courses/features/course-list/components/course-card/CourseCard';
import CourseFilter from '@/features/dashboard/features/courses/features/course-list/components/course-filter/CourseFilter';
import CreateCourseModal from '@/features/dashboard/features/courses/features/course-list/components/create-course-modal/CreateCourseModal';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { RootState } from '@/stores/store';
import { ROLE } from '@/utils/constants/constants';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';

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
  const { courseType } = useParams();
  const [searchParams] = useSearchParams();
  const isStudentDashboard = useSelector(selectIsStudentDashboard);
  const user = useSelector((state: RootState) => state.auth.user);
  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [reload, setReload] = React.useState(false);
  const [filter, setFilter] = React.useState<{
    courseType?: string;
  }>({});

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      courseType: searchParams.get('courseType'),
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, [reload, filter.courseType]);

  const triggerReload = () => {
    setReload(!reload);
  };

  const fetchCourses = debounce(async () => {
    try {
      dispatch(setAppLoading(true));
      const response = await courseApi.getCourses({
        params: isStudentDashboard
          ? {
              // userId: user?.id,
              // isMyCourse: filter.courseType === '0' ? false : true,
            }
          : {},
      });
      setCourses(response.data.data);
      dispatch(setAppLoading(false));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  }, 200);

  const handleCreateCourse = () => {
    setOpen(true);
  };

  const handleEditCourse = (id: string) => {
    setSelectedCourse(courses.find((course) => course.id === id) ?? null);
    setOpen(true);
  };

  return (
    <FeatureLayout>
      <RoleBasedComponent allowedRoles={[ROLE.USER]}>
        <FeatureHeader
          title="Khóa học"
          description="Các khóa học bạn đang sở hữu đã được chia theo từng cấp trình độ, tương ứng với mỗi chặng mục tiêu. Hãy chọn trình độ mà bạn muốn bắt đầu nhé."
        />
      </RoleBasedComponent>
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
          <CourseFilter refreshPage={setReload} />
          <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
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
          </RoleBasedComponent>
        </Box>

        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Danh sách khóa học
        </Typography>

        {courses.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 2,
              padding: 4,
              border: '1px solid #f0f0f0',
              borderRadius: '12px',
              minHeight: '360px',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Không có khóa học nào.
            </Typography>
          </Box>
        )}
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
