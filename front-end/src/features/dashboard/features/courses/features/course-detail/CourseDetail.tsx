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
    handleFetchCourse();
  }, [idCourse, reload]);

  const handleFetchCourse = async () => {
    if (!idCourse) {
      return;
    }
    dispatch(setAppLoading(true));
    const courseResponse = await courseApi.getCourseById(idCourse);
    const courseDetailsResponse =
      await courseApi.getCourseDetailsById(idCourse);
    setCourse({
      ...courseResponse.data,
      lessons: courseDetailsResponse.data.lessons,
    });
    dispatch(setAppLoading(false));
  };

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
            (lesson) => lesson.lessonType === LessonTypes.Video,
          );
        case 2:
          return course.lessons.filter(
            (lesson) => lesson.lessonType === LessonTypes.Docs,
          );
        case 3:
          return course.lessons.filter(
            (lesson) => lesson.lessonType === LessonTypes.Exercise,
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

  const handleEditCourse = () => {
    if (idCourse) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xuất bản khóa học này?',
        showDenyButton: true,
        confirmButtonText: `Xuất bản`,
        denyButtonText: `Hủy`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            dispatch(setAppLoading(true));
            await courseApi.updateCourse(idCourse, { status: 'ACTIVE' });
            Swal.fire('Thành công!', 'Khóa học đã được xuất bản.', 'success');
          } catch (error) {
            console.error('Lỗi khi cập nhật khóa học:', error);
            Swal.fire(
              'Thất bại',
              'Không thể xuất bản khóa học. Vui lòng thử lại.',
              'error',
            );
          } finally {
            dispatch(setAppLoading(false));
          }
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
                    {course?.status == 'ACTIVE' && (
                      <Chip label="Đã xuất bản khóa học" color="success"></Chip>
                    )}
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
                          {course.price === 0 || String(course.price) == '0.00'
                            ? 'Miễn phí'
                            : course.price + ' VND'}
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

                  <RoleBasedComponent allowedRoles={[ROLE.USER]}>
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
                  </RoleBasedComponent>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {new Date(course.createdAt).toLocaleDateString()}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {new Date(course.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'flex-end',
                  padding: 2,
                }}
              >
                {course?.status != 'ACTIVE' && (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={handleEditCourse}
                  >
                    Xuất bản khóa học
                  </Button>
                )}
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
            </RoleBasedComponent>
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
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              {paginatedFilteredLessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  index={index}
                  lesson={lesson}
                  onMenuOpen={handleMenuOpen}
                  handRouterLessonDetail={handRouterLessonDetail}
                />
              ))}
            </Box>
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

      {openCourseForm && (
        <CreateCourseModal
          data={course}
          open={openCourseForm}
          onClose={setOpenCourseForm}
          onOk={triggerReload}
        />
      )}
    </FeatureLayout>
  );
}
