import courseApi from '@/api/courseApi';
import lessonApi from '@/api/lessonApi';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import CreateCourseModal from '@/features/dashboard/features/courses/features/course-list/components/create-course-modal/CreateCourseModal';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { LessonTypes } from '@/types/enum/LessonType';
import { CourseResponse } from '@/types/interface/Course';
import { LESSONS_PER_PAGE, ROLE } from '@/utils/constants/constants';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import LessonCard from '../../components/lesson-card/LessonCard';
import { setAppLoading } from '@/stores/slices/appSlice';
import { useDispatch } from 'react-redux';

const MOCK_LESSONS = [
  {
    id: '6d157dd9-950a-4b77-a9a4-398da18c2c04',
    title: 'Lesson 1: Intro to React',
    lessonType: LessonTypes.Video,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
  {
    id: '02',
    title: 'Lesson 2: JSX and Components',
    lessonType: LessonTypes.Docs,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
  {
    id: '03',
    title: 'Lesson 3: State and Props',
    lessonType: LessonTypes.Video,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
  {
    id: '04',
    title: 'Lesson 4: React Lifecycle',
    lessonType: LessonTypes.Exercise,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
  {
    id: '05',
    title: 'Lesson 5: Event Handling',
    lessonType: LessonTypes.Docs,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
  {
    id: '06',
    title: 'Lesson 6: Hooks in React',
    lessonType: LessonTypes.Exercise,
    sections: 0,
    totalSections: 1,
    stars: 0,
    totalStars: 3,
  },
];

export default function CourseDetail() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState<CourseResponse | null>(
    {} as CourseResponse,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { idCourse } = useParams();
  const [openCourseForm, setOpenCourseForm] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!idCourse) {
      return;
    }
    dispatch(setAppLoading(true));
    courseApi.getCourseById(idCourse).then((response) => {
      setCourse({
        ...response.data,
        lessons: MOCK_LESSONS,
      });
      dispatch(setAppLoading(false));
    });
  }, [idCourse, reload]);

  const triggerReload = () => {
    setReload(!reload);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    lessonId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedLessonId(lessonId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLessonId(null);
  };

  const handleEdit = () => {
    if (selectedLessonId && idCourse) {
      console.log('Edit lesson ID:', selectedLessonId);
      navigate(
        `/dashboard/courses/${idCourse}/edit-lesson/${selectedLessonId}`,
      );
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedLessonId) {
      console.log('Delete lesson ID:', selectedLessonId);
      await lessonApi.deleteLesson(selectedLessonId);
    }
    handleMenuClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setCurrentPage(1);
  };

  const handleAddLesson = () => {
    navigate(`/dashboard/courses/${idCourse}/create-lesson`);
  };

  const handRouterLessonDetail = (lessonId: string) => {
    navigate(`/dashboard/courses/${idCourse}/lesson/${lessonId}`);
  };

  const getFilteredLessons = () => {
    try {
      switch (tabIndex) {
        case 1:
          return course.lessons.filter(
            (lesson) => lesson.lessonType === 'Video',
          );
        case 2:
          return course.lessons.filter(
            (lesson) => lesson.lessonType === 'Docs',
          );
        case 3:
          return course.lessons.filter(
            (lesson) => lesson.lessonType === 'Exercise',
          );
        default:
          return course.lessons;
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      return [];
    }
  };

  const filteredLessons = getFilteredLessons();

  const paginatedFilteredLessons = filteredLessons?.slice(
    (currentPage - 1) * LESSONS_PER_PAGE,
    currentPage * LESSONS_PER_PAGE,
  );

  const totalFilteredPages = Math.ceil(
    filteredLessons?.length / LESSONS_PER_PAGE,
  );

  const handleUpdateCourse = () => {
    setOpenCourseForm(true);
  };

  const handlePayment = () => {
    navigate(`/payment?id=${idCourse}&type=course`);
  };

  const handleDeleteCourse = () => {
    if (idCourse) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa khóa học này?',
        showDenyButton: true,
        confirmButtonText: `Xóa`,
        denyButtonText: `Hủy`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setAppLoading(true));
          await courseApi.deleteCourse(idCourse);
          navigate('/dashboard/courses');
        }
      });
    }
  };

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb">
        <Breadcrumb
          component="a"
          href="#"
          label="Khóa học"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/courses')}
        />
        <Breadcrumb label={course?.name} component="a" href="#" />
      </Breadcrumbs>

      {course?.id && (
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
                  <Typography variant="h4">
                    {course.name}{' '}
                    <Chip label="Đã xuất bản khóa học" color="success"></Chip>
                    {/* <Chip label='Chưa xuất bản khóa học'></Chip> */}
                  </Typography>
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
                    alt={course.name}
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
                          Giá khóa học:{' '}
                          {course.price === 0 ? 'FREE' : course.price + ' VND'}
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body1">
                          Danh mục: {course.category.name}
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body1">
                          Tổng bài học: 20
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
                      onClick={handlePayment}
                    >
                      Đăng ký khóa học
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {new Date(course.createdAt).toLocaleDateString()}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {new Date(course.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'flex-end',
                padding: 2,
              }}
            >
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={handleDeleteCourse}
              >
                Xuất bản khóa học
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDeleteCourse}
              >
                Xóa khóa học
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleUpdateCourse}
              >
                Sửa khóa học
              </Button>
            </Box>
          </Card>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Typography variant="h5">Danh sách bài học</Typography>

            <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
              <IconButton
                color="primary"
                sx={{
                  bgcolor: '#f3f7ff',
                }}
                onClick={handleAddLesson}
              >
                <AddIcon />
              </IconButton>
            </RoleBasedComponent>
          </Box>

          <Box sx={{ width: '100%', marginBottom: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Tất cả bài học" />
              <Tab label="Bài học Video" />
              <Tab label="Bài học Docs" />
              <Tab label="Exercises" />
            </Tabs>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              {tabIndex === 0 && 'Danh sách tất cả bài học'}
              {tabIndex === 1 && 'Danh sách bài học Video'}
              {tabIndex === 2 && 'Danh sách bài học Docs'}
              {tabIndex === 3 && 'Danh sách Exercises'}
            </Typography>
            {paginatedFilteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onMenuOpen={handleMenuOpen}
                handRouterLessonDetail={handRouterLessonDetail}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
              mb: 2,
            }}
          >
            <Pagination
              count={totalFilteredPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
      )}
      <CreateCourseModal
        data={course}
        open={openCourseForm}
        onClose={setOpenCourseForm}
        onOk={triggerReload}
      />
    </FeatureLayout>
  );
}
