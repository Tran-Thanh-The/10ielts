import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, Grid } from '@mui/material';
import { debounce } from 'lodash';

import courseApi from '@/api/courseApi';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import CourseCard from '@/features/dashboard/features/courses/features/course-list/components/course-card/CourseCard';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { RootState } from '@/stores/store';
import { ROLE } from '@/utils/constants/constants';
import { Course, CourseParams } from '@/types/interface/Course';
import CourseFilter from './components/course-filter/CourseFilter';
import CreateCourseModal from './components/create-course-modal/CreateCourseModal';

export default function CourseList() {
  const dispatch = useDispatch();
  const { courseType } = useParams();
  const isStudentDashboard = useSelector(selectIsStudentDashboard);
  const user = useSelector((state: RootState) => state.auth.user);

  const [open, setOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null,
  );
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [reload, setReload] = React.useState(false);
  const [params, setParams] = React.useState<any>({
    paginationOptions: {
      page: 1,
      limit: 10,
    },
    orderBy: 'created_at:DESC',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchCourses();
  }, [params, reload]);

  const fetchCourses = debounce(async () => {
    try {
      dispatch(setAppLoading(true));

      const response = await courseApi.getCourses({
        userId: isStudentDashboard ? user?.id : undefined,
        invoiceId: params.invoiceId,
        categoryId: params.categoryId,
        search: params.search,
        isMyCourse: isStudentDashboard ? params.isMyCourse ?? true : undefined,
        status: params.status,
        page: params.paginationOptions.page,
        limit: params.paginationOptions.limit,
        orderBy: params.orderBy,
      });

      setCourses(response.data.data);
      dispatch(setAppLoading(false));
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      dispatch(setAppLoading(false));
    }
  }, 200);

  const handleCreateCourse = () => setOpen(true);
  const handleEditCourse = (id: string) => {
    setSelectedCourse(courses.find((course) => course.id === id) ?? null);
    setOpen(true);
  };

  const triggerReload = () => setReload(!reload);

  return (
    <FeatureLayout>
      <RoleBasedComponent allowedRoles={[ROLE.USER]}>
        <FeatureHeader
          title="Khóa học"
          description="Các khóa học bạn đang sở hữu đã được chia theo từng cấp trình độ."
        />
      </RoleBasedComponent>

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
          }}
        >
          <CourseFilter
            refreshPage={setReload}
            onFilterChange={(newParams) => {
              setParams((prev) => ({
                ...prev,
                ...newParams,
              }));
            }}
          />
          <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <Button variant="contained" onClick={handleCreateCourse}>
              Tạo khóa học
            </Button>
          </RoleBasedComponent>
        </Box>

        <Typography variant="h6" mb={5}>
          Danh sách khóa học
        </Typography>

        {courses.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              mt: 4,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Không có khóa học nào.
            </Typography>
          </Box>
        )}

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <CourseCard
                id={course.id}
                title={course.name}
                description={course.description}
                price={course.price}
                createdAt={course.createAt}
                photo={course?.photo?.path}
                totalLesson={course.totalLesson}
                completedLesson={course.completedLesson}
                isMyCourse={course.isMyCourse}
                onDeleted={triggerReload}
                onEdit={handleEditCourse}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {open && (
        <CreateCourseModal
          open={open}
          data={selectedCourse}
          onClose={(value: boolean) => {
            setOpen(value);
            setSelectedCourse(null);
          }}
          onOk={triggerReload}
        />
      )}
    </FeatureLayout>
  );
}
