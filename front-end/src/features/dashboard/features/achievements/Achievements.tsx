import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { Box, Typography } from '@mui/material';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import HearingIcon from '@mui/icons-material/Hearing';
import HeadsetIcon from '@mui/icons-material/Headset';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MicIcon from '@mui/icons-material/Mic';

export default function Achievements() {
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
                  <li>Tổng số câu hỏi đã làm: 563</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số câu hỏi đã làm: 563</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số câu hỏi đã làm: 563</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số câu hỏi đã làm: 563</li>
                  <li>Điểm số trung bình: 67</li>
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
                  12
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
                  134
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
                  647
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
                  67
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
                23
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
                  <li>Tổng số bài đã làm: 8</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số bài đã làm: 8</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số bài đã làm: 8</li>
                  <li>Điểm số trung bình: 67</li>
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
                  <li>Tổng số bài đã làm: 8</li>
                  <li>Điểm số trung bình: 67</li>
                </ul>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
