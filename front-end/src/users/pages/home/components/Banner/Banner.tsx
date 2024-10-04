import graduationImage from '@/assets/banner-image/graduation.svg';
import hskImage from '@/assets/banner-image/hsk_image.svg';
import schoolImage from '@/assets/banner-image/school.svg';
import talkImage from '@/assets/banner-image/talk_image.svg';
import * as styles from '@/users/pages/home/components/Banner/Banner.styles';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LearningFlatform from './components/learning-flatform/LearningFlatform';

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const courses = [
    {
      title: 'IELTS',
      description: 'Lộ trình học hiệu quả',
      icon: <Box
      component="img"
      sx={{
        height: 'auto',
        width: 80,
      }}
      alt="school_icon"
      src={schoolImage}
    />,
    bgColor: 'transparent', 
    },
    {
      title: 'TOEIC',
      description: 'Lộ trình luyện thi cấp tốc',
      icon: <Box
      component="img"
      sx={{
        height: 'auto',
        width: 80,
      }}
      alt="graduation_icon"
      src={graduationImage}
    />,
    bgColor: 'transparent', 
    },
    {
      title: 'HSK',
      description: 'Lộ trình học và ôn thi hiệu quả',
      icon: <Box
      component="img"
      sx={{
        height: 'auto',
        width: 36,
      }}
      alt="hsk_icon"
      src={hskImage}
    />,
    bgColor: '#dcffd5', 
    },
    {
      title: 'Talk',
      description: 'Luyện giao tiếp Tiếng Anh dễ dàng',
      icon: <Box
      component="img"
      sx={{
        height: 'auto',
        width: 36,
      }}
      alt="header-logo"
      src={talkImage}
    />,
    bgColor: '#e6edff', 
    },
  ];

  return (
    <Box sx={styles.containerBanner}>
       <Container disableGutters maxWidth={false} sx ={ styles.mainBanner }>
          <Container maxWidth="xl" >
            <Grid
              container
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              spacing={3}
            >
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={styles.textTitle}
                >
                  <Box component="span" fontWeight="bold" color="text.primary">
                    Nền Tảng
                  </Box>
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  color="#1479f4"
                  sx={styles.textTitle}
                >
                  Học & Luyện Thi
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{...styles.textTitle,  marginBottom: '28px'}}
                >
                  <Box component="span" fontWeight="bold" color="text.primary">
                    Thông Minh
                  </Box>
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="https://imagedelivery.net/mwNXYp7cvX8XZ2BpBdLgrQ/d9c14d23-1e94-4af8-2f81-59e4f4657000/public"
                  alt="Student"
                  sx={{
                    width: isMobile ? '50%' : '60%',
                    height: 'auto',
                    maxWidth: 320,
                  }}
                />
              </Grid>
            </Grid>
          </Container>
       </Container>
      <Box sx={{ ...styles.flatformWrapper }}>
          <Typography variant="body1" fontWeight={700} sx={styles.flatformTitle}>
            Chọn mục tiêu của bạn:
          </Typography>
          <Grid container spacing={3} sx={styles.rowFlatForm}>
            {courses.map((course, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3}} key={index}>
                <LearningFlatform
                  bgColor={course.bgColor}
                  icon={course.icon}
                  title={course.title}
                  description={course.description}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
    </Box>
  );
};

export default Banner;