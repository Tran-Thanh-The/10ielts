import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Typography } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import HearingIcon from '@mui/icons-material/Hearing';
import HeadsetIcon from '@mui/icons-material/Headset';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MicIcon from '@mui/icons-material/Mic';
import { useEffect, useState } from 'react';
import { getAchievements } from '@/api/api';
import { useDispatch } from 'react-redux';
import { setAppLoading } from '@/stores/slices/appSlice';

export default function Achievements() {
  const dispatch = useDispatch();
  const [achievements, setAchievements] = useState({
    courseAchievements: {
      countCoursesBought: 2,
      totalLearnedLessons: 4,
      totalQuestionsDone: 5,
      averageScore: 56.25,
    },
    practiceAchievements: {
      totalPracticeExercises: 2,
      reading: {
        totalQuestionsDone: 0,
        averageScore: 0,
      },
      writing: {
        totalQuestionsDone: 4,
        averageScore: 3,
      },
      listening: {
        totalQuestionsDone: 0,
        averageScore: 0,
      },
      speaking: {
        totalQuestionsDone: 2,
        averageScore: 1,
      },
    },
  });

  useEffect(() => {
    dispatch(setAppLoading(true));
    getAchievements().then((response) => {
      dispatch(setAppLoading(false));
      setAchievements(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <FeatureLayout>
      <FeatureHeader title="Thành tích" />

      <Box
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <Box>
          <Typography variant="h6">Tổng quan</Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '20px',
              marginTop: '12px',
            }}
          >
            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <ImportContactsIcon />
                Reading
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số câu hỏi đã làm:{' '}
                    {
                      achievements.practiceAchievements.reading
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.reading.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <HeadsetIcon />
                Listening
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số câu hỏi đã làm:{' '}
                    {
                      achievements.practiceAchievements.listening
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.listening.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <DriveFileRenameOutlineIcon />
                Writing
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số câu hỏi đã làm:{' '}
                    {
                      achievements.practiceAchievements.writing
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.writing.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <MicIcon />
                Speaking
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số câu hỏi đã làm:{' '}
                    {
                      achievements.practiceAchievements.speaking
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.speaking.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6">Khóa học</Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '20px',
              marginTop: '12px',
            }}
          >
            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                Tổng số khóa học đã mua
              </Typography>
              <Box>
                <Typography align="center" variant="h1">
                  {achievements.courseAchievements.countCoursesBought}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                Số bài học đã học
              </Typography>
              <Box>
                <Typography align="center" variant="h1">
                  {achievements.courseAchievements.totalLearnedLessons}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                Số câu hỏi đã làm
              </Typography>
              <Box>
                <Typography align="center" variant="h1">
                  {achievements.courseAchievements.totalQuestionsDone}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                Điểm trung bình các bài tập
              </Typography>
              <Box>
                <Typography align="center" variant="h1">
                  {achievements.courseAchievements.averageScore}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6">Luyện tập</Typography>

          <Box
            sx={{
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #d3d3d3',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: 'flex',
                gap: '10px',
              }}
            >
              Tổng số bài luyên tập đã làm
            </Typography>
            <Box>
              <Typography align="center" variant="h1">
                {achievements.practiceAchievements.totalPracticeExercises}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '20px',
              marginTop: '12px',
            }}
          >
            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <ImportContactsIcon />
                Reading
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số bài đã làm:{' '}
                    {
                      achievements.practiceAchievements.reading
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.reading.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <HeadsetIcon />
                Listening
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số bài đã làm:{' '}
                    {
                      achievements.practiceAchievements.listening
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.listening.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <DriveFileRenameOutlineIcon />
                Writing
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số bài đã làm:{' '}
                    {
                      achievements.practiceAchievements.writing
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.writing.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #d3d3d3',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <MicIcon />
                Speaking
              </Typography>
              <Box>
                <ul>
                  <li>
                    Tổng số bài đã làm:{' '}
                    {
                      achievements.practiceAchievements.speaking
                        .totalQuestionsDone
                    }
                  </li>
                  <li>
                    Điểm số trung bình:{' '}
                    {achievements.practiceAchievements.speaking.averageScore}
                  </li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
