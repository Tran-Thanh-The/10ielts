import courseApi from '@/api/courseApi';
import CreateUpdateLesson from '@/features/dashboard/features/courses/components/create-update-lesson/CreateUpdateLesson';
import LessonView from '@/features/dashboard/features/courses/features/lesson-detail/components/lesson-view/LessonView';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
        defaultLessonList.map((section) => ({
          ...section,
          lessons: res.data.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
          })),
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
          backgroundColor: '#f9f9f9',
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

          <List component="nav" sx={{ width: '100%' }}>
            {lessonList.map((section, index) => (
              <React.Fragment key={index}>
                <ListItemButton onClick={() => handleSectionToggle(index)}>
                  <ListItemText primary={section.title} />
                  {openSection[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSection[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <ListItem key={lessonIndex} onClick={() => handleChangeLesson(lesson.id)}>
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
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LessonDetail;
