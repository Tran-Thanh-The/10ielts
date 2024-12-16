import courseApi from '@/api/courseApi';
import CreateUpdateLesson from '@/features/dashboard/features/courses/components/create-update-lesson/CreateUpdateLesson';
import LessonView from '@/features/dashboard/features/courses/features/lesson-detail/components/lesson-view/LessonView';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import ArticleIcon from '@mui/icons-material/Article';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const defaultLessonList = [
  {
    title: 'Khái niệm kỹ thuật cần biết',
    lessons: [
      { id: null, title: 'Giới thiệu khóa học' },
      { id: '1', title: 'Cài đặt môi trường' },
      { id: '2', title: 'Cài đặt Visual Studio Code' },
    ],
    duration: ['11:35', '10:34', '01:00'],
  },
  {
    title: 'Môi trường, con người IT',
    lessons: [
      { id: null, title: 'Giới thiệu khóa học' },
      { id: '1', title: 'Cài đặt môi trường' },
      { id: '2', title: 'Cài đặt Visual Studio Code' },
    ],
    duration: ['15:00', '20:00', '30:00'],
  },
  {
    title: 'Phương pháp, định hướng',
    lessons: [
      { id: null, title: 'Giới thiệu khóa học' },
      { id: '1', title: 'Cài đặt môi trường' },
      { id: '2', title: 'Cài đặt Visual Studio Code' },
    ],
    duration: ['12:00', '20:00'],
  },
  {
    title: 'Hoàn thành khóa học',
    lessons: [
      { id: null, title: 'Giới thiệu khóa học' },
      { id: '1', title: 'Cài đặt môi trường' },
      { id: '2', title: 'Cài đặt Visual Studio Code' },
    ],
    duration: ['13:00', '18:00'],
  },
];

const LessonDetail = () => {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  // State quản lý trạng thái mở/đóng của từng section
  const [openSection, setOpenSection] = React.useState([
    true,
    false,
    false,
    false,
  ]);
  const [course, setCourse] = React.useState<any>(null);
  const [lessonList, setLessonList] = React.useState<any>(defaultLessonList);

  useEffect(() => {
    courseApi.getCourseDetailsById(idCourse as string).then((res) => {
      setCourse(res.data);
      setLessonList(
        res.data.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          type: lesson.lessonType,
          content: lesson.content,
          time: dayjs(lesson.createdAt).format('HH:mm'),
        })),
      );
    });
  }, []);

  const handleSectionToggle = (index) => {
    const newOpenSection = [...openSection];
    newOpenSection[index] = !newOpenSection[index];
    setOpenSection(newOpenSection);
  };

  const handleChangeLesson = (lessonId: string) => {
    navigate(`/dashboard/courses/${idCourse}/lesson/${lessonId}`);
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {/* <CreateUpdateLesson></CreateUpdateLesson> */}
        <LessonView></LessonView>
      </Grid>

      <Grid
        item
        xs={12}
        md={3}
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '-2px 0px 8px rgba(0, 0, 0, 0.1)',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              padding: '16px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Nội dung khóa học
            </Typography>
          </Grid>
          <Divider sx={{ width: '100%' }} />

          <Box
            sx={{
              width: '100%',
              padding: '16px 0',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 128px)',
            }}
          >
            {lessonList.map((lesson, index) => (
              <Box
                key={lesson.id}
                sx={{
                  display: 'flex',
                  gap: '8px',
                  borderBottom: '1px solid #e0e0e0',
                  width: '100%',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: selectedLessonId === lesson.id ? '#f3f7ff' : '#ffffff',
                }}
                onClick={() => handleChangeLesson(lesson.id)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '50px',
                      height: '50px',
                      backgroundColor: selectedLessonId === lesson.id ? '#f3f7ff' : '#ffffff',
                      border: `1px solid ${selectedLessonId === lesson.id ? '#0071f9' : '#e0e0e0'}`,
                      borderRadius: '4px',
                      textAlign: 'center',
                      padding: '10px',
                      color: selectedLessonId === lesson.id ? '#0071f9' : '#3d3d3d',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {index + 1}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '16px',
                      cursor: 'pointer',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      color: selectedLessonId === lesson.id ? '#0071f9' : '#000'
                    }}
                  >
                    {lesson.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#9e9e9e',
                      fontSize: '14px',
                      alignItems: 'center',
                      display: 'flex',
                      gap: '4px',
                    }}
                  >
                    {lesson.type === 'VIDEO' ? (
                      <SlowMotionVideoIcon
                        sx={{
                          width: '18px',
                        }}
                      />
                    ) : lesson.type === 'DOCS' ? (
                      <ArticleIcon
                        sx={{
                          width: '18px',
                        }}
                      />
                    ) : (
                      <DriveFileRenameOutlineIcon
                        sx={{
                          width: '18px',
                        }}
                      />
                    )}

                    {lesson.type === 'VIDEO'
                      ? lesson.time
                      : lesson.type === 'DOCS'
                        ? 'Tài liệu'
                        : 'Bài tập'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          {/* <List component="nav" sx={{ width: '100%' }}>
            {lessonList.map((section, index) => (
              <React.Fragment key={index}>
                <ListItemButton onClick={() => handleSectionToggle(index)}>
                  <ListItemText primary={section.title} />
                  {openSection[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSection[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <ListItem
                        key={lessonIndex}
                        onClick={() => handleChangeLesson(lesson.id)}
                      >
                        <ListItemText
                          primary={lesson.title}
                          secondary={section.duration?.[lessonIndex] ?? '10:22'}
                          sx={{
                            cursor: 'pointer',
                            paddingLeft: '16px',
                            '& .MuiListItemText-primary': { fontSize: '14px' },
                            '& .MuiListItemText-secondary': {
                              fontSize: '12px',
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
                <Divider />
              </React.Fragment>
            ))}
          </List> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LessonDetail;
